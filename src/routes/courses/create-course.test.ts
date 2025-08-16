import { expect, it } from 'vitest'
import request from 'supertest'
import { server } from '../../server.ts'
import { faker } from '@faker-js/faker'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

it('creates a new course successfully', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('manager')

    const response = await request(server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ title: faker.lorem.words(4) })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
        courseId: expect.any(String)
    })
})