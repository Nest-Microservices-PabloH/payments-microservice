import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dtos/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) { }


  // @Post('create-payment-session')
  @MessagePattern({ cmd: 'create.payment.session' })
  createPaymentSession(
    @Payload() paymentSessionDto: PaymentSessionDto
  ) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful'
    }
  }
  @Get('cancel')
  cancel() {
    return {
      ok: true,
      message: 'Payment cancelled'
    }
  }

  @Post('webhook')
  async stripeWebhook(
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.paymentsService.stripeWebhook(req, res)
  }
}
