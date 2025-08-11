// // services/chatService.js
// import Message from '../models/Message'; // You'll need to create this model
// import ChatRoom from '../models/ChatRoom'; // You'll need to create this model

// export const saveMessage = async (messageData) => {
//     try {
//         const message = new Message({
//             sender: messageData.sender,
//             roomId: messageData.roomId,
//             message: messageData.message,
//             messageType: messageData.messageType || 'text',
//             isPrivate: messageData.isPrivate || false,
//             timestamp: new Date()
//         });

//         const savedMessage = await message.save();
//         return await savedMessage.populate('sender', 'username email');
//     } catch (error) {
//         throw new Error('Failed to save message: ' + error.message);
//     }
// };

// export const getMessages = async (roomId, limit = 50, page = 1) => {
//     try {
//         const skip = (page - 1) * limit;

//         const messages = await Message.find({ roomId })
//             .populate('sender', 'username email')
//             .sort({ timestamp: -1 })
//             .limit(limit)
//             .skip(skip)
//             .lean();

//         return messages.reverse(); // Return in chronological order
//     } catch (error) {
//         throw new Error('Failed to get messages: ' + error.message);
//     }
// };

// export const getPrivateMessages = async (userId1, userId2, limit = 50, page = 1) => {
//     try {
//         const roomId = createPrivateRoomId(userId1, userId2);
//         return await getMessages(roomId, limit, page);
//     } catch (error) {
//         throw new Error('Failed to get private messages: ' + error.message);
//     }
// };

// export const createChatRoom = async (roomData) => {
//     try {
//         const room = new ChatRoom({
//             name: roomData.name,
//             description: roomData.description,
//             creator: roomData.creator,
//             members: roomData.members || [roomData.creator],
//             isPrivate: roomData.isPrivate || false,
//             settings: roomData.settings || {}
//         });

//         return await room.save();
//     } catch (error) {
//         throw new Error('Failed to create chat room: ' + error.message);
//     }
// };

// export const getChatRooms = async (userId) => {
//     try {
//         const rooms = await ChatRoom.find({
//             $or: [
//                 { isPrivate: false },
//                 { members: userId }
//             ]
//         }).populate('creator', 'username email').lean();

//         return rooms;
//     } catch (error) {
//         throw new Error('Failed to get chat rooms: ' + error.message);
//     }
// };

// export const joinChatRoom = async (roomId, userId) => {
//     try {
//         const room = await ChatRoom.findById(roomId);
//         if (!room) {
//             throw new Error('Room not found');
//         }

//         if (!room.members.includes(userId)) {
//             room.members.push(userId);
//             await room.save();
//         }

//         return room;
//     } catch (error) {
//         throw new Error('Failed to join chat room: ' + error.message);
//     }
// };

// export const leaveChatRoom = async (roomId, userId) => {
//     try {
//         const room = await ChatRoom.findById(roomId);
//         if (!room) {
//             throw new Error('Room not found');
//         }

//         room.members = room.members.filter(memberId => memberId.toString() !== userId);
//         await room.save();

//         return room;
//     } catch (error) {
//         throw new Error('Failed to leave chat room: ' + error.message);
//     }
// };

// const createPrivateRoomId = (userId1, userId2) => {
//     const ids = [userId1, userId2].sort();
//     return `private_${ids[0]}_${ids[1]}`;
// };