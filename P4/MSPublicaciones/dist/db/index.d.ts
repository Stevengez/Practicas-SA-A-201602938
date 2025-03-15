import { EntityManager, EntityRepository, MikroORM, Options } from "@mikro-orm/postgresql";
import { Publicacion } from "../entities/publicacion.entity.js";
export interface Services {
    orm: MikroORM;
    em: EntityManager;
    usuario: EntityRepository<Publicacion>;
}
export declare function initORM(options?: Options): Promise<Services>;
