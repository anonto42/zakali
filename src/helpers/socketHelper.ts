import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

interface User {
  socketId: string;
  friendList: string[];
}

const users: Record<string, User> = {};

const connectedUsers = new Map<string, string>();

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    // Handle new user joining

    socket.on('join', (userId: string, friendList: string[]) => {
      users[userId] = { socketId: socket.id, friendList };
      logger.info(colors.green(`${userId} joined`));
      io.emit('userStatus', getOnlineUsers());
    });

    socket.on('startCall', (data: { from: string; to: string; offer: any }) => {
      const { from, to, offer } = data;

      if (users[to]) {
        io.to(users[to].socketId).emit('incomingCall', { from, offer });
        logger.info(colors.blue(`Incoming call from ${from} to ${to}`));
      } else {
        logger.info(colors.red(`${to} is not online`));
      }
    });

    socket.on('acceptCall', (data: { from: string; to: string; answer: any }) => {
      const { from, to, answer } = data;

      if (users[to]) {
        io.to(users[to].socketId).emit('callAccepted', { from, answer });
        logger.info(colors.green(`Call accepted from ${from} to ${to}`));
      }
    });

    //Need to work for the CallIng

    socket.on('connect_to_server', (userId: string) => {
      connectedUsers.set(userId, socket.id);
      logger.info(colors.green(`${userId} connected on socket: ${socket.id}`));
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = Object.keys(users).find(id => users[id].socketId === socket.id);
      if (userId) {
        delete users[userId];
        logger.info(colors.red(`${userId} disconnected`));
        io.emit('userStatus', getOnlineUsers());
      }
    });
  });
};

const getOnlineUsers = () => {
  return Object.keys(users).map(userId => ({
    userId,
    status: 'online',
  }));
};

export const socketHelper = { socket , connectedUsers};
