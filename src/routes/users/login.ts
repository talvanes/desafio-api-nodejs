import z from "zod";
import { coursesTable, usersTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { eq } from "drizzle-orm";
import { verify } from "argon2";

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
            // response: {
            //     201: z.object({ courseId: z.uuid() }).describe("Course created successfully!")
            // }
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

        return reply.status(200).send({ message: 'ok' })
    });
}

export default loginRoute
