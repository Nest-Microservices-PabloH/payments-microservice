import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { envs, NATS_SERVICE } from '../config';

import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';
@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY)
    private readonly logger = new Logger(PaymentsService.name)

    constructor(
        @Inject(NATS_SERVICE)
        private readonly client: ClientProxy
    ) { }


    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { currency, items, orderId } = paymentSessionDto

        const lineItems = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity
        }))

        const session = await this.stripe.checkout.sessions.create({
            // Poner el ID de mi orden
            payment_intent_data: {
                metadata: {
                    orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: envs.STRIPE_SUCCESS_URL,
            cancel_url: envs.STRIPE_CANCEL_URL,

        })

        // return session;
        return {
            cancelUrl: session.cancel_url,
            successUrl: session.success_url,
            sessionUrl: session.url
        }

    }

    async stripeWebhook(req: Request, res: Response) {

        const endpointSecret = envs.STRIPE_ENDPOINT_SECRET

        let event: Stripe.Event = req.body;

        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = req.headers['stripe-signature'];
            if (!signature) {
                return res.status(400).json({
                    message: 'No signature'
                });
            }
            try {
                event = this.stripe.webhooks.constructEvent(
                    req['rawBody'],
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return res.status(400).json({
                    message: 'Webhook signature verification failed'
                });
            }
        }

        switch (event.type) {
            case 'charge.succeeded':
                const charge = event.data.object as Stripe.Charge;
                const payload = {
                    stripePaymentId: charge.id,
                    orderId: charge.metadata.orderId,
                    receiptUrl: charge.receipt_url,
                }
                // this.logger.log({ payload })
                this.client.emit({ cmd: 'payment.succeeded' }, payload)
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return res.sendStatus(200);

    }

}
