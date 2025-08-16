import { expect, it } from 'vitest'
import request from 'supertest'
import { server } from '../../server.ts'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

it('gets course info by ID', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('manager')
    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

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

    const { token } = await makeAuthenticatedUser('manager')

    const response = await request(server.server)
        .get('/courses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', token)

    expect(response.statusCode).toBe(404)
})