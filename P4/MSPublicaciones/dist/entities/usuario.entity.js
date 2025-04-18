var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity.js";
let Usuario = class Usuario extends BaseEntity {
    nombre;
    username;
    email;
    password;
    seguidores = new Collection(this);
    seguidos = new Collection(this);
};
__decorate([
    Property()
], Usuario.prototype, "nombre", void 0);
__decorate([
    Property()
], Usuario.prototype, "username", void 0);
__decorate([
    Property()
], Usuario.prototype, "email", void 0);
__decorate([
    Property({ hidden: true, lazy: true })
], Usuario.prototype, "password", void 0);
__decorate([
    ManyToMany({ mappedBy: 'seguidos', owner: true })
], Usuario.prototype, "seguidores", void 0);
__decorate([
    ManyToMany({ mappedBy: 'seguidores' })
], Usuario.prototype, "seguidos", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
export { Usuario };
