import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity.js";

@Entity()
export class Usuario extends BaseEntity {

    @Property()
    nombre!: string

    @Property()
    username!: string

    @Property()
    email!: string

    @Property({ hidden: true, lazy: true })
    password!: string

    @ManyToMany({ mappedBy: 'seguidos', owner: true })
    seguidores = new Collection<Usuario>(this)

    @ManyToMany({ mappedBy: 'seguidores' })
    seguidos = new Collection<Usuario>(this)
    
}