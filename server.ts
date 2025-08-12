import fastify from "fastify";
import { randomUUID } from "node:crypto";

const server = fastify();

const courses = [
  { id: "1", title: "Responsive Web Design (RWD) Course" },
  { id: "2", title: "Vanilla JS Course" },
  { id: "3", title: "React.js Course" },
];

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
server.get("/courses", (_, reply) => {
  return reply.send({ courses });
});

// Course details
server.get("/courses/:id", (request, reply) => {
  const { id } = request.params as Params;

  const course = courses.find((course) => course.id === id);
  if (course) {
    return reply.send({ course });
  }

  return reply.status(404).send();
});

// Create a new course
server.post("/courses", (request, reply) => {
  const courseId = randomUUID();
  const { title: courseTitle } = request.body as Body;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Course title is mandatory!" });
  }

  courses.push({
    id: courseId,
    title: courseTitle,
  });

  return reply.status(201).send({ courseId });
});

// Delete course

// Update course title

// Update course description

// Update course author

// Update course keywords


server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
