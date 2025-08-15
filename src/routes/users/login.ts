import z from "zod";
import { usersTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { eq } from "drizzle-orm";
import { verify } from "argon2";
import jwt from "jsonwebtoken";


// User login
const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post("/sessions", {
        schema: {
            tags: ['auth'],
            summary: 'User login',
            description: 'This authenticates user to session with the given credentials (email & password)',
            body: z.object({
                email: z.email(),
                password: z.string(),
            }),
            response: {
                200: z.object({ token: z.jwt() }).describe("User authenticated successfully!"),
                400: z.object({ message: z.string() }).describe("Invalid credentials.")
            }
        },
    }, async (request, reply) => {
        const { email, password } = request.body

        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (result.length === 0) {
            return reply.status(400).send({ message: 'Credenciais inválidas.' })
        }

        const user = result[0]

        const doPasswordsMatch = await verify(user.password, password)
        if (!doPasswordsMatch) {
            return reply.status(400).send({ message: 'Credenciais inválidas.' })
        }

        if (!process.env["JWT_SECRET"]) {
            throw new Error("JWT_SECRET must be set.")
        }

        const token = jwt.sign({
            sub: user.id,
            role: user.role,
        }, process.env["JWT_SECRET"], {
            expiresIn: '1h'
        })

        return reply.status(200).send({ token })
    });
}

export default loginRoute
