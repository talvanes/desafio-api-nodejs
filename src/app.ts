import { server } from "./server.ts";

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});