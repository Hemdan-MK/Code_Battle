import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../types/interfaces/IAuthService';
import {
  loginSchema,
  signupSchema,
  otpVerificationSchema,
  resendOTPSchema,
  googleAuthSchema,
  githubAuthSchema,
  forgotPasswordSchema,
  newPasswordSchema,
  verifyResetPasswordSchema 
} from '../schemas/authSchemas';
import { string } from 'zod';
import axios from 'axios';

export class AuthController {
  constructor(private authService: IAuthService) { }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({ success: result.success, message: result.message, token: result.token, user: result.user, isAdmin: result.isAdmin });
    } catch (error) {
      next(error);
    }
  };

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const validatedData = signupSchema.parse(req.body);
      const result = await this.authService.signup(validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      
      const validatedData = otpVerificationSchema.parse(req.body);

      if (!validatedData.tempToken) {
        res.status(401).json({ success: false, message: 'Temp token required' });
        return;
      }

      const result = await this.authService.verifyOTP(validatedData);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({ success: result.success, message: result.message, token: result.token, user: result.user, isAdmin: result.isAdmin });
    } catch (error) {
      next(error);
    }
  };

  googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = googleAuthSchema.parse(req.body);

      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: validatedData.credential,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5173/auth/google/callback',
        grant_type: 'authorization_code',
      });

      const { access_token, id_token } = tokenResponse.data;

      const result = await this.authService.googleAuth({ access_token, id_token });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({ success: result.success, message: result.message, token: result.token, user: result.user, isAdmin: result.isAdmin });

      // res.cookie('refreshToken', result.refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production', // true in production
      //   maxAge: 7 * 24 * 60 * 60 * 1000 
      // })
    } catch (error) {
      next(error);
    }
  };

  githubAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = githubAuthSchema.parse(req.body);

      const result = await this.authService.githubAuth({ code: validatedData.code });
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({ success: result.success, message: result.message, token: result.token, user: result.user, isAdmin: result.isAdmin });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      const result = await this.authService.forgotPassword(validatedData);

      res.json(result);
    } catch (error) {
      next(error)
    }
  }

  verifyResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('req.body.otp:', req.body.otp);
      console.log('OTP length:', req.body.otp?.length);
      console.log('OTP value:', JSON.stringify(req.body.otp));

      const validatedData = verifyResetPasswordSchema.parse(req.body.otp);
      const result = await this.authService.verifyResetPassword(validatedData, req.body.tempToken);

      res.json(result);
    } catch (error) {
      next(error)
    }
  }

  resetNewPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = newPasswordSchema.parse(req.body);
      const result = await this.authService.resetNewPassword(validatedData.password, req.body.tempToken);
      res.json(result);
    } catch (error) {
      next(error)
    }
  }

  resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      
      const validatedData = resendOTPSchema.parse(req.body);

      const tempToken = validatedData.tempToken;

      if (!tempToken) {
        res.status(401).json({ success: false, message: 'Temp token required' });
        return;
      }

      const result = await this.authService.resendOTP(validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token not found' });
        return;
      }
      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
