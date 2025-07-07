import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        console.log(process.env.EMAIL_HOST);
        console.log(process.env.EMAIL_USER);
        console.log(process.env.EMAIL_PASS);

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendOTP(email: string, otp: string, session: "forgot" | "signUp"): Promise<void> {

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification for ${session}</h2>
          <p>Your OTP verification code is:</p>
          <h1 style="color: #007bff; font-size: 32px; text-align: center; background: #f8f9fa; padding: 20px; border-radius: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
        };

        await this.transporter.sendMail(mailOptions);
    }
}