import { coursesTable } from "../databases/schema.ts";
import { db } from "../databases/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

// Get courses
const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get("/courses", {
        schema: {
            tags: ['courses'],
            summary: 'Lists courses',
            description: 'This gives a listing on all courses available',
            response: {
                200: z.object({
                    courses: z.array(z.object({
                        id: z.uuid(),
                        title: z.string(),
                    }))
                }).describe('Courses displayed successfully!')
            }
        },
    }, async (_, reply) => {
        const result = await db.select({
            id: coursesTable.id,
            title: coursesTable.title,
        }).from(coursesTable)

        return reply.send({ courses: result });
    });
}

export default getCoursesRoute

