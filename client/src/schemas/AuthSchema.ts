import { z } from 'zod';

// export const authSchema = z.object({
//   username: z.string()
//     .min(3, { message: 'Username must be at least 3 characters' })
//     .nonempty({ message: 'Username is required' }),

//   email: z.string()
//     .email({ message: 'Please enter a valid email' })
//     .nonempty({ message: 'Email is required' }),

//   phone: z.string()
//     .nonempty({ message: 'Phone number is required' })
//     .regex(/^[+]?[\d\s\-()]{10,}$/, { message: 'Please enter a valid phone number' }),

//   password: z.string()
//     .nonempty({ message: 'Password is required' })
//     .min(8, { message: 'Password must be at least 8 characters long' })
//     .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
//     .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
//     .regex(/[0-9]/, { message: 'Password must contain at least one number' })
//     .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
// });


export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(1, { message: "Name is required" }),
});
