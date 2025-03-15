var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity.js";
let Publicacion = class Publicacion extends BaseEntity {
    contenido;
    usuario_id;
};
__decorate([
    Property()
], Publicacion.prototype, "contenido", void 0);
__decorate([
    Property()
], Publicacion.prototype, "usuario_id", void 0);
Publicacion = __decorate([
    Entity()
], Publicacion);
export { Publicacion };
