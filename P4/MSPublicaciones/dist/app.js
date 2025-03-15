import { initORM } from "./db/index.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Publicacion } from "./entities/publicacion.entity.js";
export async function bootstrap(port = 3001, migrate = true) {
    const db = await initORM();
    if (migrate) {
        // sync the schema
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
    `;
    const resolvers = {
        Query: {
            publicaciones: async (parent, args, { token, em }, info) => {
                const selection = info.fieldNodes[0].selectionSet?.selections;
                return await em.getRepository(Publicacion)
                    .findAll({
                    //@ts-ignore // name does exists
                    populate: selection?.map((s) => s.name.value ?? []),
                    where: { ...args }
                });
            }
        },
        Mutation: {
            addPost: async () => null,
            deletePost: async () => ({ success: true }),
            updatePost: async () => ({ success: true })
        }
    };
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true
    });
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => ({
            token: req.headers.authorization,
            em: db.em.fork()
        })
    });
    return {
        url,
        server
    };
}
