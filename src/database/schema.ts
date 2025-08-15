import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['student', 'manager'])

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    role: userRole().notNull().default('student'),
})

export const coursesTable = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
})

export const enrollmentsTable = pgTable('enrollments', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => usersTable.id),
    courseId: uuid().notNull().references(() => coursesTable.id),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
    uniqueIndex().on(table.userId, table.courseId)
])