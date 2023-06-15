import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import jwt from '@fastify/jwt';
import {loginUserSchema, registerUserSchema, userInfoSchema} from "./schemas";
import {User} from "../../types";


const plugin: FastifyPluginAsyncTypebox = async function(app, _opts) {
    app.log.info("AUTH module loaded");

    const { db, sql } = app.platformatic;

    app.addHook("onRequest", async (request, reply) => {
        if (request.url !== '/auth/login' && request.url !== '/auth/register') {
            try {
                await request.jwtVerify()
            } catch (err) {
                reply.send(err)
            }
        }
    })

    app.post('/register', { schema: registerUserSchema }, async (req, reply) => {
        const result=  await db.query(sql`
            INSERT INTO users (email, password, role) VALUES (${req.body.email}, ${req.body.password}, 'user') RETURNING *
        `);

        reply.status(201).send(result[0]);
    })

    app.post('/login', { schema: loginUserSchema }, async (req, reply) => {
        const user: User[] = await db.query(sql`
            select * from users where email = ${req.body.email} and password = ${req.body.password}
        `);
        const token = app.jwt.sign({'X-PLATFORMATIC-USER-ID': user[0].id, 'X-PLATFORMATIC-ROLE': ['user']})

        reply.send({token})
    })

    app.get("/auth/info", { schema: userInfoSchema },  async (req, reply) => {
        const user = await db.query(sql`
            select * from users where id = ${req.user['X-PLATFORMATIC-USER-ID']}
        `);

        reply.send(user[0]);
    })
}

export default plugin;
