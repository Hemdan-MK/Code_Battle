import { Router } from "express";
import { ProfileController } from "../../controllers/user/profileController";
import { UserRepository } from "../../repositories/UserRepository";
import { ProfileService } from "../../services/user/profileService";

const router = Router()

const userRepository = new UserRepository();
const profileService = new ProfileService(userRepository)
const profileController = new ProfileController(profileService)


router.get('/profile',profileController.details)
router.post('/updateusername',profileController.updateUsername)
router.post('/updatepassword',profileController.updatePassword)
router.post('/add-password', profileController.addPassword)
router.get('/match-history', profileController.getMatchHistory)


export default router