import { fakerPT_BR as faker } from "@faker-js/faker"
import { db } from "./client.ts"
import { coursesTable, enrollmentsTable, usersTable } from "./schema.ts"

async function seed() {
    const [insertedUsers, insertedCourses] = await Promise.all([
        db.insert(usersTable).values([
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
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