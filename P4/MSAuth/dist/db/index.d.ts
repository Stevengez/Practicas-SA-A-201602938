import { EntityManager, EntityRepository, MikroORM, Options } from "@mikro-orm/postgresql";
import { Usuario } from "../entities/usuario.entity.js";
export interface Services {
    orm: MikroORM;
    em: EntityManager;
    usuario: EntityRepository<Usuario>;
}
export declare function initORM(options?: Options): Promise<Services>;
