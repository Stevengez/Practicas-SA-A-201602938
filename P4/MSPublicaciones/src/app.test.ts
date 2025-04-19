import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { Publicacion } from "./entities/publicacion.entity.js";

describe("Controller Usuarios", () => {

    let mikroOrm:MikroORM;
    let em:EntityManager;
    let serviceRepo:EntityRepository<Publicacion>;

    beforeAll(async () => {

        mikroOrm = await MikroORM.init({
            driver: SqliteDriver,
            entities: [Publicacion],
            allowGlobalContext: true,
            dbName: ':memory:',
            metadataProvider: TsMorphMetadataProvider,
        })

        const schemaGenerator = mikroOrm.getSchemaGenerator()
        await schemaGenerator.createSchema()

        em = mikroOrm.em.fork()
        serviceRepo = em.getRepository(Publicacion)

    })

    afterAll(async () => {
        await mikroOrm.close()
    })

    it('Create new user', async () => {

        const newPost = serviceRepo.create({
            contenido: "Prueba de publicacion",
            usuario_id: 1
        })

        em.flush()
        
        
        expect(newPost).toBeDefined()
        expect(newPost).toBeInstanceOf(Publicacion)
        expect(newPost.contenido).toBe(newPost.contenido)
        expect(newPost.usuario_id).toBe(1)
    })
    
})