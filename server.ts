import fastify from "fastify";
import { db } from "./src/databases/client.ts";
import { coursesTable } from "./src/databases/schema.ts";
import { eq } from "drizzle-orm";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import createCourseRoute from "./src/routes/create-course.ts";
import getCourseByIdRoute from "./src/routes/get-course-by-id.ts";
import getCoursesRoute from "./src/routes/get-courses.ts";

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

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Desafio Node.js API",
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCourseRoute)

// Delete course

// Update course title

// Update course description

// Update course author

// Update course keywords


server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
