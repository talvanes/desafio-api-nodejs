import { fakerPT_BR as faker } from "@faker-js/faker"
import { db } from "./client.ts"
import { coursesTable, enrollmentsTable, usersTable } from "./schema.ts"
import {hash} from "argon2"

async function seed() {
    const passwordHash = await hash('123456')

    const [insertedUsers, insertedCourses] = await Promise.all([
        db.insert(usersTable).values([
            { 
                name: faker.person.fullName(), 
                email: faker.internet.email(), 
                password: passwordHash,
                role: 'student',
            },
            { 
                name: faker.person.fullName(), 
                email: faker.internet.email(), 
                password: passwordHash,
                role: 'student',
            },
            { 
                name: faker.person.fullName(), 
                email: faker.internet.email(), 
                password: passwordHash,
                role: 'student',
            },
        ]).returning(),
        db.insert(coursesTable).values([
            { title: faker.lorem.words(4) },
            { title: faker.lorem.words(4) },
        ]).returning()
    ])

    await db.insert(enrollmentsTable).values([
        { courseId: insertedCourses[0].id, userId: insertedUsers[0].id },
        { courseId: insertedCourses[0].id, userId: insertedUsers[1].id },
        { courseId: insertedCourses[1].id, userId: insertedUsers[2].id },
    ])
}

seed()