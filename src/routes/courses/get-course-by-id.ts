import z from "zod";
import { coursesTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { eq } from "drizzle-orm";
import checkRequestJWT from "../hooks/check-request-jwt.ts";
import getAuthenticatedUserFromRequest from "../../utils/get-authenticated-user-from-request.ts";

// Get course by ID
const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get("/courses/:id", {
        preHandler: [
            checkRequestJWT,
        ],
        schema: {
            tags: ['courses'],
            summary: 'Gets course details by ID',
            description: 'This gives details on this course. In case there is no course with the given ID, it shows no record at all',
            params: z.object({
                id: z.uuid()
            }),
            response: {
                200: z.object({
                    course: z.object({
                        id: z.uuid(),
                        title: z.string(),
                        description: z.string().nullable(),
                    })
                }).describe('Course details displayed successfully!'),
                404: z.null().describe('Course not found!')
            }
        }
    }, async (request, reply) => {
        const user = getAuthenticatedUserFromRequest(request)

        const { id: courseId } = request.params

        const result = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.id, courseId))

        if (result.length > 0) {
            return reply.send({ course: result[0] });
        }

        return reply.status(404).send();
    });
}

export default getCourseByIdRoute

