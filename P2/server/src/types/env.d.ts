import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            EXP_TIME: number;
            REFRESH_WINDOW: number;
            SECRET_KEY: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASS: string;
            DB_NAME: string;
        };
    }
}
