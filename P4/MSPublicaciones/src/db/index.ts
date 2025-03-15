import {
    EntityManager,
    EntityRepository,
    MikroORM,
    Options,
} from "@mikro-orm/postgresql";
import config from "../mikro-orm.config.js";
import { Publicacion } from "../entities/publicacion.entity.js";

export interface Services {
    orm: MikroORM
    em: EntityManager
    usuario: EntityRepository<Publicacion>
}

let cache: Services

export async function initORM(options?: Options): Promise<Services> {
    if (cache) {
        return cache;
    }

    const orm = await MikroORM.init({
        ...config,
        ...options,
    });

    return (cache = {
        orm,
        em: orm.em,
        usuario: orm.em.getRepository(Publicacion)
    });
}