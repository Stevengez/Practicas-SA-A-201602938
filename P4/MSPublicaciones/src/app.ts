import { NotFoundError, RequestContext } from "@mikro-orm/core";
import { initORM } from "./db/index.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Publicacion } from "./entities/publicacion.entity.js";
import { EntityManager } from "@mikro-orm/postgresql";
import { GraphQLResolveInfo } from "graphql";

type ServerContext = {
    token: string|undefined,
    em: EntityManager
}

export async function bootstrap(port = 3000, migrate = true) {
    const db = await initORM();

    if (migrate) {
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
        type Publicacion {
            id: Int
            usuario_id: Int
            contenido: String
            creado_en: String
        }

        type ActionResult {
            success: Boolean
        }

        type Query {
            publicaciones(id: Int, usuario_id: Int): [Publicacion]
        }

        type Mutation {
            addPost(contenido: String!): Publicacion,
            deletePost(id: Int!): ActionResult,
            updatePost(id: Int!, contenido: String!): Publicacion
        }
    `
    
    const resolvers = {
        Query: {
            publicaciones: async (parent:any, args: any, { token, em }: ServerContext, info:GraphQLResolveInfo) => {
                const selection = info.fieldNodes[0].selectionSet?.selections
                return await em.getRepository(Publicacion)
                    .findAll({
                        //@ts-ignore // name does exists
                        populate: selection?.map((s) => s.name.value ??[] ),
                        where: {...args}
                    })
            }
        },
        Mutation: {
            addPost: async () => null,
            deletePost: async () => ({ success: true }),
            updatePost: async () => ({ success: true })
        }
    }

    const server = new ApolloServer<ServerContext>({
        typeDefs,
        resolvers,
        introspection: true
    })

    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => ({
            token: req.headers.authorization,
            em: db.em.fork()
        }),
        listen: { port }
    })

    return {
        url,
        server
    }
}
