import { coursesTable, enrollmentsTable } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { and, asc, count, eq, ilike, SQL } from "drizzle-orm";
import checkRequestJWT from "../hooks/check-request-jwt.ts";

const RESULTS_PER_PAGE = 5

// Get courses
const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get("/courses", {
        preHandler: [
            checkRequestJWT,
        ],
        schema: {
            tags: ['courses'],
            summary: 'Lists courses',
            description: 'This gives a listing on all courses available',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['id', 'title']).optional().default('id'),
                page: z.coerce.number().optional().default(1),
            }),
            response: {
                200: z.object({
                    courses: z.array(z.object({
                        id: z.uuid(),
                        title: z.string(),
                        enrollments: z.number(),
                    })),
                    total: z.number()
                }).describe('Courses displayed successfully!')
            }
        },
    }, async (request, reply) => {
        const { search, orderBy, page } = request.query

        const conditions: SQL[] = []
        if (search) {
            conditions.push(ilike(coursesTable.title, `%${search}%`))
        }

        const [result, total] = await Promise.all([
            db
                .select({
                    id: coursesTable.id,
                    title: coursesTable.title,
                    enrollments: count(enrollmentsTable.id),
                })
                .from(coursesTable)
                .leftJoin(enrollmentsTable, eq(enrollmentsTable.courseId, coursesTable.id))
                .where(and(...conditions))
                .offset((page - 1) * RESULTS_PER_PAGE)
                .limit(RESULTS_PER_PAGE)
                .orderBy(asc(coursesTable[orderBy]))
                .groupBy(coursesTable.id),
            db.$count(coursesTable, and(...conditions))
        ])

        return reply.send({ courses: result, total });
    });
}

export default getCoursesRoute

