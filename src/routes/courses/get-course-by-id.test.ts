import { expect, it } from 'vitest'
import request from 'supertest'
import { server } from '../../server.ts'
import makeCourse from '../../tests/factories/make-course.ts'

it('gets course info by ID', async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
        course: {
            id: course.id,
            title: expect.any(String),
            description: null,
        }
    })
})

it('returns 404 Not Found for non existing courses', async () => {
    await server.ready()

    const response = await request(server.server)
        .get('/courses/00000000-0000-0000-0000-000000000000')

    expect(response.statusCode).toBe(404)
})