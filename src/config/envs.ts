import 'dotenv/config';
import { z } from 'zod';

// Primero defines el schema
const envSchema = z.object({
    // NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_ENDPOINT_SECRET: z.string(),
    STRIPE_SUCCESS_URL: z.string().url(),
    STRIPE_CANCEL_URL: z.string().url(),
    NATS_SERVERS: z.string().transform((str) => str.split(',')),
})

// Luego haces el parsing:
const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
    console.error(error.flatten().fieldErrors);
    throw new Error('Config validation error.');
}

export const envs = {
    PORT: data.PORT,
    STRIPE_SECRET_KEY: data.STRIPE_SECRET_KEY,
    STRIPE_ENDPOINT_SECRET: data.STRIPE_ENDPOINT_SECRET,
    STRIPE_SUCCESS_URL: data.STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL: data.STRIPE_CANCEL_URL,
    NATS_SERVERS: data.NATS_SERVERS,
}