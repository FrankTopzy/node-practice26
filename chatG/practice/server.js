import { createServer } from "node:http";

const port = process.env.PORT ?? "3000";

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      message: "Hello from Node.js"
    }));

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    error: "Route not found"
  }));
});

server.listen(port, () => {
  console.log("Server running at http://localhost:3000");
});