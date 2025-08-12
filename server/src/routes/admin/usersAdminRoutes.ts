// routes/admin/user.routes.ts

import { Router } from "express";
import { UsersAdminController } from "../../controllers/admin/usersAdminController";
import { UserAdminService } from "../../services/admin/userAdminService";
import { UserRepository } from "../../repositories/UserRepository";
import { authenticateToken, checkRole } from "../../middleware/auth";


const router = Router();
const userRepository = new UserRepository()
const userService = new UserAdminService(userRepository)
const usersController = new UsersAdminController(userService);


router.get("/users", authenticateToken, checkRole('admin'), usersController.getUsers.bind(usersController));
router.get("/user/:id", authenticateToken, checkRole('admin'), usersController.getUserById.bind(usersController));
router.post("/create", authenticateToken, checkRole('admin'), usersController.createUser.bind(usersController));
router.get("/edit/:id", authenticateToken, checkRole('admin'), usersController.editRequest.bind(usersController));
router.put("/update/:id", authenticateToken, checkRole('admin'), usersController.updateUser.bind(usersController));
router.patch("/user-ban/:id", authenticateToken, checkRole('admin'), usersController.banStatus.bind(usersController));
router.get("/users/stats", authenticateToken, checkRole('admin'), usersController.getUserStats.bind(usersController));


export default router;