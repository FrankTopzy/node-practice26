import express from "express";
import { v4 as uuid } from "uuid";

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
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

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // 1. Validate name and email

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  // 2. Generate a unique ID
  const UID = Math.max(0, ...users.map(user => user.id)) + 1;

  // 3. Create the new user
  const user = {
    id: UID,
    name: name,
    email: email
  }

  // 4. Add it to users without mutating the existing array
  users = [...users, user];
  // 5. Return the new user with status 201

  return res.status(201).json(users);
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const matchingUser = users.find(user => user.id === id);

  if (!matchingUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // 4. Create the updated user
  const updatedUser = {
    ...matchingUser,
    name: name.trim(),
    email: email.trim()
  };

  users = users.map(user =>
    user.id === id ? updatedUser : user
  );

  return res.status(200).json(updatedUser);
})



app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  // 1. Validate the ID
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  // 2. Check whether the user exists
  const matchingUser = users.find(user => user.id === id);

  if (!matchingUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // 3. Remove the user immutably
  users = users.filter(user => user.id !== id);

  // 4. Confirm successful deletion
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});