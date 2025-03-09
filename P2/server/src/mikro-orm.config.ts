import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

const config: Options = {
    driver: PostgreSqlDriver,
    port: 5432,
    dbName: 'p2',
    user: 'postgres',
    password: 'postgres',
    entities: ['build/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    metadataProvider: TsMorphMetadataProvider,
    debug: true
}

export default config