import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { usersTable } from "../../database/schema.ts";
import { hash } from "argon2";
import jwt from 'jsonwebtoken'

export async function makeUser(role?: 'student' | 'manager') {
    const plainPassword = faker.lorem.slug(5)

    const result = await db.insert(usersTable).values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(plainPassword),
        role,
    }).returning()

    return {
        user: result[0],
        passwordBeforeHash: plainPassword,
    }
}

export async function makeAuthenticatedUser(role: 'student' | 'manager') {
    const { user } = await makeUser(role)

    if (!process.env["JWT_SECRET"]) {
        throw new Error('JWT_SECRET is requred.')
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env['JWT_SECRET'])

    return { user, token }
}