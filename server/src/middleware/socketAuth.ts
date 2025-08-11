// import User from "../models/User";
// import jwt from 'jsonwebtoken';

// export const authenticateSocket = async (socket, next) => {
//     try {
//         const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

//         if (!token) {
//             return next(new Error('Authentication token required'));
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select('-password');

//         if (!user) {
//             return next(new Error('User not found'));
//         }

//         if (user.isBanned) {
//             return next(new Error('User is banned'));
//         }

//         // Attach user to socket
//         socket.user = user;
//         socket.userId = user._id.toString();

//         next();
//     } catch (error) {
//         next(new Error('Invalid token'));
//     }
// };