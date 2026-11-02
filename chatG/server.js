import express from "express";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import userRoute from './route/userRoute.js';
import projectRoot from './route/root.js';
import adminRoute from "./route/adminRoute.js";


const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use("/", projectRoot);

/*app.put("/users/:id", (req, res) => {
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
})*/


app.get("/test-error", (req, res, next) => {
  next(new Error("Something went wrong"));
});


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});