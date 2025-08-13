import fastify from "fastify";
import { db } from "./src/databases/client.ts";
import { coursesTable } from "./src/databases/schema.ts";
import { eq } from "drizzle-orm";

const server = fastify();

type Params = {
  id: string
}

type Body = {
  title: string
  // description
  // author
  // keywords
}

// List courses
server.get("/courses", async (_, reply) => {
  const result = await db.select({
    id: coursesTable.id,
    title: coursesTable.title,
  }).from(coursesTable)

  return reply.send({ courses: result });
});

// Course details
server.get("/courses/:id", async (request, reply) => {
  const { id: courseId } = request.params as Params;

  const result = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId))
  if (result.length > 0) {
    return reply.send({ course: result[0] });
  }

  return reply.status(404).send();
});

// Create a new course
server.post("/courses", async (request, reply) => {
  const { title: courseTitle } = request.body as Body;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Course title is mandatory!" });
  }

  const result = await db
    .insert(coursesTable)
    .values({title: courseTitle})
    .returning()

  return reply.status(201).send({ courseId: result[0].id });
});

// Delete course

// Update course title

// Update course description

// Update course author

// Update course keywords


server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
