import { Collection } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity.js";
export declare class Usuario extends BaseEntity {
    nombre: string;
    username: string;
    email: string;
    password: string;
    seguidores: Collection<Usuario, object>;
    seguidos: Collection<Usuario, object>;
}
