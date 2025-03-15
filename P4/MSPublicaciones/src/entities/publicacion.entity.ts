import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity.js";

@Entity()
export class Publicacion extends BaseEntity {

    @Property()
    contenido!: string

    @Property()
    usuario_id!: number
    
}