import { BeforeCreate, BeforeUpdate, Entity, EventArgs, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './base.entity.js'
import { randomBytes, scryptSync } from 'crypto'
import { decryptString, encryptString } from '../../util/crypto.js'

@Entity()
export class User extends BaseEntity {

    @Property()
    name!: string

    @Property()
    @Unique()
    email!: string

    @Property({ hidden: true, lazy: true })
    password!: string

    static async hashValue(value:string, preSalt?:Buffer){
        const salt = preSalt ?? randomBytes(16)
        const passBfr = Buffer.from(value)
        const derivedKey = scryptSync(passBfr, salt, 64)

        return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
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
    async hashData(args: EventArgs<User>) {
        // hash only if the password was changed
        const { name, email, password} = args.changeSet?.payload ?? {};

        if(name){
            this.name = encryptString(name, process.env.SECRET_KEY!);
        }

        // if(email){
        //     this.email = encryptString(email, process.env.SECRET_KEY!);
        // }

        if (password) {
            this.password = await User.hashValue(password);
        }
    }

    decryptData(){

        const { password, ...user} = this

        return {
            ...user,
            name: decryptString(user.name, process.env.SECRET_KEY!),
            // email: this.email = encryptString(this.email, process.env.SECRET_KEY!),
        }        
    }
}