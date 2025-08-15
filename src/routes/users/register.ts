import z from "zod";
import { coursesTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

// User registration
const registerRoute: FastifyPluginAsyncZod = async (server) => {
    server.post("/users", {
        schema: {
            tags: ['auth'],
            summary: 'User registration',
            description: 'This creates a new user account',
            body: z.object({
                name: z.string(),
                email: z.email(),
                password: z.string(),
                role: z.enum(['student', 'manager']).default('student'),
            }),
            response: {
                201: z.object({ userId: z.uuid() }).describe("User registered successfully!")
            }
        },
    }, async (request, reply) => {
        
    });
}

export default registerRoute
