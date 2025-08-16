import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { coursesTable } from "../../database/schema.ts";

export async function makeCourse(title?: string) {
    const result = await db
        .insert(coursesTable)
        .values({
            title: title ?? faker.lorem.words(4)
        })
        .returning()

        return result[0]
}