import { BeforeCreate, BeforeUpdate, Entity, EventArgs, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './base.entity.js'
import { randomBytes, scryptSync } from 'crypto'

@Entity()
export class User extends BaseEntity {

    @Property()
    name!: string

    @Property()
    @Unique()
    email!: string

    @Property({ hidden: true, lazy: true })
    password!: string

    static async hashPassword(password:string){
        const salt = randomBytes(16)
        const passBfr = Buffer.from(password);
        const derivedKey = scryptSync(passBfr, salt, 64);

        return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
    }

    static verifyPassword(hashedPassword:string, password:string){
        const [salt, key] = hashedPassword.split(':');
        const passBfr = Buffer.from(password);
        const saltBfrr = Buffer.from(salt, 'hex');
        const derivedKey = scryptSync(passBfr, saltBfrr, 64) as Buffer;

        return key === derivedKey.toString('hex');
    }

    @BeforeCreate()
    @BeforeUpdate()
    async hashPassword(args: EventArgs<User>) {
        // hash only if the password was changed
        const password = args.changeSet?.payload.password;

        if (password) {
            this.password = await User.hashPassword(password);
        }
    }    
}