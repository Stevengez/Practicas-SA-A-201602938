import { MikroORM, EntityManager, EntityRepository } from "@mikro-orm/core";
import { User } from "./model/user.entity.js";
import { Options } from "@mikro-orm/postgresql";

export interface Services {
    orm: MikroORM;
    em: EntityManager;
    user: EntityRepository<User>;
}

let cache: Services;

export const initORM = async (options?: Options): Promise<Services> => {

    if(cache){
        return cache;
    }

    const orm = await MikroORM.init(options);

    return cache = {
        orm,
        em: orm.em,
        user: orm.em.getRepository(User)
    }
}