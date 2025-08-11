// // services/userActivityService.js
// import User from '../../models/User'; // Your existing User model
// import UserActivity from '../models/UserActivity'; // You'll need to create this model

// export const updateUserActivity = async (userId, isOnline) => {
//     try {
//         // Update user's last seen and online status
//         await User.findByIdAndUpdate(userId, {
//             lastSeen: new Date(),
//             isOnline: isOnline
//         });

//         // Create or update activity record
//         const activityData = {
//             userId: userId,
//             isOnline: isOnline,
//             timestamp: new Date()
//         };

//         const activity = new UserActivity(activityData);
//         await activity.save();

//         return activity;
//     } catch (error) {
//         console.error('Failed to update user activity:', error);
//         throw new Error('Failed to update user activity');
//     }
// };

// export const getUserActivity = async (userId) => {
//     try {
//         const user = await User.findById(userId).select('lastSeen isOnline username');
//         return user;
//     } catch (error) {
//         throw new Error('Failed to get user activity: ' + error.message);
//     }
// };

// export const getActiveUsers = async () => {
//     try {
//         const activeUsers = await User.find({
//             isOnline: true
//         }).select('username email lastSeen isOnline').lean();

//         return activeUsers;
//     } catch (error) {
//         throw new Error('Failed to get active users: ' + error.message);
//     }
// };

// export const getRecentlyActiveUsers = async (minutes = 30) => {
//     try {
//         const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

//         const recentUsers = await User.find({
//             lastSeen: { $gte: cutoffTime }
//         }).select('username email lastSeen isOnline').lean();

//         return recentUsers;
//     } catch (error) {
//         throw new Error('Failed to get recently active users: ' + error.message);
//     }
// };

// export const getUsersInRoom = async (roomId) => {
//     try {
//         // This would depend on how you track room membership
//         // For now, returning active users as placeholder
//         return await getActiveUsers();
//     } catch (error) {
//         throw new Error('Failed to get users in room: ' + error.message);
//     }
// };

// export const getUserActivityHistory = async (userId, limit = 100) => {
//     try {
//         const history = await UserActivity.find({ userId })
//             .sort({ timestamp: -1 })
//             .limit(limit)
//             .lean();

//         return history;
//     } catch (error) {
//         throw new Error('Failed to get user activity history: ' + error.message);
//     }
// };