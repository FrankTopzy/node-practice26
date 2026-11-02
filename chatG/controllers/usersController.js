import users from '../model/users.json' with { type: "json" };

const Users = {
  users: [...users],
  setUsers(data) {
    this.users = data;
  }
};

export const getAllUsers = (req, res) => {
  res.json(Users.users);
}

export const createNewUser = (req, res) => {
  const { name, email } = req.body ?? {};

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
  const UID = Math.max(
    0,
    ...Users.users.map(user => user.id)
  ) + 1;

  // 3. Create the new user
  const newUser = {
    id: UID,
    name: name.trim(),
    email: email.trim()
  };

  // 4. Add it to users without mutating the existing array
  Users.setUsers([...Users.users, newUser]);

  // 5. Return the new user with status 201
  return res.status(201).json(newUser);
}

export const updateUser = (req, res) => {
  const id = Number(req.params.id);
   const { name, email } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0 ) {
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

  const foundUser = Users.users.find(user => user.id === id);

  if (!foundUser) return res.status(404).json({"message": "user not found"});

  const updatedUser = {...foundUser, name: name.trim(), email: email.trim()};

  Users.setUsers(
    Users.users.map(user => (user.id === id ? updatedUser : user))
  );

  return res.status(200).json(updatedUser);
}

export const deleteUser = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 ) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  const foundUser = Users.users.find(
    user => user.id === id
  );

  if (!foundUser) return res.status(404).json({"message": "user not found"});

  const filteredUsers = Users.users.filter(
    user => user.id !== id
  );

  Users.setUsers([...filteredUsers]);

  return res.status(204).end();
}

export const getUser = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  const user = Users.users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.json(user);
}