import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { OTPRepository } from '../repositories/OTPRepository';
import { EmailService } from '../services/AuthServices/EmailService';
import { SMSService } from '../services/AuthServices/SMSService';
import { GoogleAuthService } from '../services/AuthServices/GoogleAuthService';
import { GitHubAuthService } from '../services/AuthServices/GitHubAuthService';

const router = Router();

// Initialize dependencies
const userRepository = new UserRepository();
const otpRepository = new OTPRepository();
const emailService = new EmailService();
const smsService = new SMSService();
const googleAuthService = new GoogleAuthService();
const githubAuthService = new GitHubAuthService();

const authService = new AuthService(
    userRepository,
    otpRepository,
    emailService,
    smsService,
    googleAuthService,
    githubAuthService
);

const authController = new AuthController(authService);

// Routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/otp-sign', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/google', authController.googleAuth);
router.post('/github', authController.githubAuth);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetPassword);
router.post('/reset-new-password', authController.resetNewPassword);
router.post('/resend-reset-code',authController.resendOTP)

router.post('/google', authController.googleAuth);
router.post('/github',authController.githubAuth);


export default router;