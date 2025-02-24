import { RequestContext } from '@mikro-orm/postgresql'
import { initORM } from './database/index.js'
import fastify from 'fastify'
import config from './mikro-orm.config.js'
import { User } from './database/model/user.entity.js'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import env from '@fastify/env'

const envSchema = {
    type: 'object',
    required: ['EXP_TIME', 'REFRESH_WINDOW'],
    properties: {
        EXP_TIME: {
            type: 'number',
            default: 1000*60*3
        },
        REFRESH_WINDOW: {
            type: 'number',
            default: 1000*60*1
        }
    }
}

const envOptions = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true
}

export async function startApp(port: number){

    const db = await initORM(config)
    const app = fastify()

    await app.register(env, envOptions)
    
    await app.register(cors, {
        origin: 'http://localhost:5173',
        credentials: true
    })
    await app.register(fastifyCookie)
    await app.register(fastifyJwt, {
        secret: "thisismysecrethappy",
        sign: {
            expiresIn: app.config.EXP_TIME
        }
    })

    app.addHook('onRequest', (_req, _res, done) => {
        RequestContext.create(db.em, done)
    })

    app.addHook('onClose', async () => {
        await db.orm.close()
    })

    app.register(async (fastify) => {
        fastify.post('/register', async (req, reply) => {

            const { name, email, password } = req.body as any
    
            try {
                const user = db.user.create({
                    name,
                    email,
                    password
                })
        
                await db.em.flush()
    
                reply.setCookie('token', app.jwt.sign(user), {
                    maxAge: app.config.REFRESH_WINDOW,
                    path: '/'
                })
        
                return reply.send({
                    user: {
                        name, email, id: user.id 
                    }
                })
    
            }catch(e:any){
                return reply.send({
                    error: e.message
                })
            }
        })
    
        fastify.post('/validate', async (req, reply) => {
            
            const { token } = req.cookies
    
            if(!token){
                return { error: 'No token' }
            }
    
            try {
    
                const data = app.jwt.decode<any>(token)
                const { iat, exp, ...user } = data

                const currentTime = Math.floor(Date.now()/1000)
                const expirationTime = exp
    
                const secondsSinceExpire = currentTime - expirationTime
                if(secondsSinceExpire < 0){
                    return reply.send({
                        success: true,
                        data: user,
                        message: 'Token is still valid'
                    })
                }else if(secondsSinceExpire < 60*60*2){
    
                    
                    reply.setCookie('token', app.jwt.sign(user))
                }
    
                return reply.send({
                    success: true,
                    data: user,
                    message: "Token refreshed"
                })
                
    
            }catch(e:any){
                return reply.send({
                    success: false, error: e.message
                })
    
            }
        })
    
        fastify.post('/login', async (_req, reply) => {
    
            const { email, password } = _req.body as any
            const user = await db.user.findOne({ email }, { populate: ['password'] })
    
            if(!user){
                return { success: false, error: 'User not found' }
            }
    
            if(!User.verifyPassword(user.password, password))
                return { success: false, error: 'Invalid password' }
    
            reply.setCookie('token', app.jwt.sign(user), {
                maxAge: 60*60*24*7,
                path: '/'
            })
    
            console.log("User", user)
            
            return reply.send({ success: true, data: user })
        })

    })  

    const url = await app.listen({port});

    return { app, url }
}