import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

const config: Options = {
    driver: PostgreSqlDriver,
    dbName: 'p2',
    host: 'localhost',
    user: 'postgres',
    password: 'postgres123',
    port: 5432,
    entities: ['build/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    metadataProvider: TsMorphMetadataProvider,
    debug: true
}

export default config