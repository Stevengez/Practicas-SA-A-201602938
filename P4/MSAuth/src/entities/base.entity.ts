import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity<Optional = never> {
    
    [OptionalProps]?: 'creado_en' | Optional

    @PrimaryKey()
    id!: number

    @Property()
    creado_en = new Date()
}