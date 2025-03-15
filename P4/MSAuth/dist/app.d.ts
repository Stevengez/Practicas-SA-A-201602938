import { ApolloServer } from "@apollo/server";
import { EntityManager } from "@mikro-orm/postgresql";
type ServerContext = {
    token: string | undefined;
    em: EntityManager;
};
export declare function bootstrap(port?: number, migrate?: boolean): Promise<{
    url: string;
    server: ApolloServer<ServerContext>;
}>;
export {};
