// routes/admin/user.routes.ts

import { Router } from "express";
import { UsersController } from "../../controllers/admin/usersAdminController";
import { UserService } from "../../services/admin/userAdminService";
import { UserRepository } from "../../repositories/UserRepository";


const router = Router();
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const usersController = new UsersController(userService);


router.get("/users", usersController.getUsers.bind(usersController));
router.get("/user/:id", usersController.getUserById.bind(usersController));
router.post("/create", usersController.createUser.bind(usersController));
router.get("/edit/:id", usersController.editRequest.bind(usersController));
router.put("/update/:id", usersController.updateUser.bind(usersController));
router.patch("/user-ban/:id", usersController.banStatus.bind(usersController));
router.get("/users/stats", usersController.getUserStats.bind(usersController));


export default router;