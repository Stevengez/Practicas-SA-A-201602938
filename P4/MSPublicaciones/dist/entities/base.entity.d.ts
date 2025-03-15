import { OptionalProps } from "@mikro-orm/core";
export declare abstract class BaseEntity<Optional = never> {
    [OptionalProps]?: 'creado_en' | Optional;
    id: number;
    creado_en: Date;
}
