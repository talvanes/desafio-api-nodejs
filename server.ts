import fastify from "fastify";
import { db } from "./src/databases/client.ts";
import { coursesTable } from "./src/databases/schema.ts";
import { eq } from "drizzle-orm";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

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
server.get("/courses/:id", {
  schema: {
    params: z.object({
      id: z.uuid()
    })
  }
}, async (request, reply) => {
  const { id: courseId } = request.params

  const result = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId))
    
  if (result.length > 0) {
    return reply.send({ course: result[0] });
  }

  return reply.status(404).send();
});

// Create a new course
server.post("/courses", {
  schema: {
    body: z.object({
      title: z.string().min(5, 'Título precisa ter pelo menos 5 caracteres')
    })
  }
}, async (request, reply) => {
  const { title: courseTitle } = request.body

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
