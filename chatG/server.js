import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
  {
    id: 1,
    name: "Frank",
    email: "frank@example.com"
  },
  {
    id: 2,
    name: "Ada",
    email: "ada@example.com"
  }
];

app.get("/", (req, res) => {
  res.json({ message: "Express API is running!" });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});