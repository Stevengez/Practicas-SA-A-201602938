import { initORM } from "./db/index.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Usuario } from "./entities/usuario.entity.js";
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
        try { db.orm.schema.createSchema() }catch(e){}
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
    `

    const resolvers = {
        Query: {
            usuarios: async (parent:any, args: any, { token, em }: ServerContext, info:GraphQLResolveInfo) => {
                const selection = info.fieldNodes[0].selectionSet?.selections
                return await em.getRepository(Usuario)
                    .findAll({
                        //@ts-ignore // name does exists
                        populate: selection?.map((s) => s.name.value ??[] ),
                        where: {...args}
                    })
            }
        },
        Mutation: {
            addUser: async () => null,
            followUser: async () => ({ success: true }),
            unfollowUser: async () => ({ success: true })
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
