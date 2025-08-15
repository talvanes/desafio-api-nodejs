import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import createCourseRoute from "./routes/courses/create-course.ts";
import getCourseByIdRoute from "./routes/courses/get-course-by-id.ts";
import getCoursesRoute from "./routes/courses/get-courses.ts";
import scalarApiReference from "@scalar/fastify-api-reference";
import loginRoute from "./routes/users/login.ts";

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

if (process.env["NODE_ENV"] === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio Node.js API",
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform
  })

  server.register(scalarApiReference, {
    routePrefix: '/docs'
  })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(loginRoute)

server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCourseRoute)

// Delete course

// Update course title

// Update course description

// Update course author

// Update course keywords


export { server }
