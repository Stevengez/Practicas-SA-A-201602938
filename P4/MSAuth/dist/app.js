import { initORM } from "./db/index.js";
import { ApolloServer } from "@apollo/server";
import { Usuario } from "./entities/usuario.entity.js";
import { expressMiddleware } from "@apollo/server/express4";
import express from 'express';
import cors from 'cors';
export async function bootstrap(port = 3000, migrate = true) {
    const db = await initORM();
    const app = express();
    if (migrate) {
        // sync the schema
        // sync the schema
        const schemaGenerator = db.orm.getSchemaGenerator();
        const knex = db.orm.em.getConnection().getKnex();
        // Verificar si ya existen tablas en la base de datos
        const tables = await knex.raw(`SELECT tablename FROM pg_tables WHERE schemaname='public'`);
        if (tables.rows.length === 0) {
            await schemaGenerator.createSchema();
        }
        await db.orm.migrator.up();
    }
    const typeDefs = `#graphql
        type Usuario {
            id: Int
            nombre: String
            username: String
            email: String
            creado_en: String
            seguidores: [Usuario]
            seguidos: [Usuario]
        }

        type ActionResult {
            success: Boolean
        }

        type Query {
            usuarios(id: Int, email: String, username: String): [Usuario]
        }

        type Mutation {
            addUser(nombre: String!, username: String!, email: String!, password: String!): [Usuario],
            followUser(id: Int!): ActionResult,
            unfollowUser(id: Int!): ActionResult,
        }
    `;
    const resolvers = {
        Query: {
            usuarios: async (parent, args, { token, em }, info) => {
                const selection = info.fieldNodes[0].selectionSet?.selections;
                return await em.getRepository(Usuario)
                    .findAll({
                    //@ts-ignore // name does exists
                    populate: selection?.map((s) => s.name.value ?? []),
                    where: { ...args }
                });
            }
        },
        Mutation: {
            addUser: async () => null,
            followUser: async () => ({ success: true }),
            unfollowUser: async () => ({ success: true })
        }
    };
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true
    });
    await server.start();
    app.use('/graphql', cors(), express.json(), expressMiddleware(server));
    await new Promise(resolve => app.listen({ port }, resolve));
    app.get('/', (req, res) => {
        res.status(200).send('OK');
    });
    // const { url } = await startStandaloneServer(server, {
    //     context: async ({ req }) => ({
    //         token: req.headers.authorization,
    //         em: db.em.fork()
    //     }),
    //     listen: { port }
    // })
    return {
        url: `http://localhost:${port}/graphql`,
        server
    };
}
