import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { Usuario } from "./entities/usuario.entity.js";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { beforeAll, afterAll, describe, test, expect } from 'vitest'

describe("Controller Usuarios", () => {

    let mikroOrm:MikroORM;
    let em:EntityManager;
    let serviceRepo:EntityRepository<Usuario>;

    beforeAll(async () => {

        mikroOrm = await MikroORM.init({
            driver: SqliteDriver,
            entities: [Usuario],
            allowGlobalContext: true,
            dbName: ':memory:',
            metadataProvider: TsMorphMetadataProvider,
        })

        const schemaGenerator = mikroOrm.getSchemaGenerator()
        await schemaGenerator.createSchema()

        em = mikroOrm.em.fork()
        serviceRepo = em.getRepository(Usuario)

    })

    afterAll(async () => {
        await mikroOrm.close()
    })

    test('Create new user', async () => {

        const newUser = serviceRepo.create({
            nombre: "Steven",
            username: "stevengez",
            email: "steven.jsg@gmail.com",
            password: "1234567890"
        })

        em.flush()
        
        
        expect(newUser).toBeDefined()
        expect(newUser).toBeInstanceOf(Usuario)
        expect(newUser.nombre).toBe("Steven")
        expect(newUser.username).toBe("stevengez")
    })
    
})