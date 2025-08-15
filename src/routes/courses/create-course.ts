import z from "zod";
import { coursesTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

// Create a new course
const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post("/courses", {
        schema: {
            tags: ['courses'],
            summary: 'Creates a course',
            description: 'This creates a new course from the given title',
            body: z.object({
                title: z.string().min(5, 'Título precisa ter pelo menos 5 caracteres')
            }),
            response: {
                201: z.object({ courseId: z.uuid() }).describe("Course created successfully!")
            }
        },
    }, async (request, reply) => {
        const { title: courseTitle } = request.body

        const result = await db
            .insert(coursesTable)
            .values({ title: courseTitle })
            .returning()

        return reply.status(201).send({ courseId: result[0].id });
    });
}

export default createCourseRoute
