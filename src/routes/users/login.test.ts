import { expect, it } from 'vitest'
import request from 'supertest'
import { server } from '../../server.ts'
import makeUser from '../../tests/factories/make-user.ts'

it('logins successfully', async () => {
    await server.ready()

    const { user, passwordBeforeHash } = await makeUser()

    const response = await request(server.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send({
            email: user.email,
            password: passwordBeforeHash,
        })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
        message: 'ok'
    })
})