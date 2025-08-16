import { expect, it } from 'vitest'
import request from 'supertest'
import { server } from '../../server.ts'
import { faker } from '@faker-js/faker'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

it('displays courses succesfully', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('manager')

    const randomTitle = faker.lorem.words(4)
    await makeCourse(randomTitle)

    const response = await request(server.server)
        .get(`/courses?search=${randomTitle}`)
        .set('Authorization', token)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: randomTitle,
                enrollments: 0,
            }
        ]
    })
})