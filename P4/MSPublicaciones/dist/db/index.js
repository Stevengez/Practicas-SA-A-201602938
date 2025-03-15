import { MikroORM, } from "@mikro-orm/postgresql";
import config from "../mikro-orm.config.js";
import { Publicacion } from "../entities/publicacion.entity.js";
let cache;
export async function initORM(options) {
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
