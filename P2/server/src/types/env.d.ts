import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            EXP_TIME: number;
            REFRESH_WINDOW: number;
        };
    }
}
