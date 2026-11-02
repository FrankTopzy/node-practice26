import express from 'express';
import { createNewUser, updateUser, deleteUser, getAllUsers, getUser } from '../controllers/usersController.js';


const router = express.Router();

router.route("/")
  .get(getAllUsers)
  .post(createNewUser);

router.route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);


export default router;