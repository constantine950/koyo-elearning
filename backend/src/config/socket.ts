import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "../utils/token";

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.data.user.userId}`);

    // Join lesson room
    socket.on("join-lesson", (lessonId: string) => {
      socket.join(`lesson-${lessonId}`);
      console.log(`User ${socket.data.user.userId} joined lesson ${lessonId}`);

      // Emit active viewers count
      const room = io.sockets.adapter.rooms.get(`lesson-${lessonId}`);
      const viewerCount = room ? room.size : 0;
      io.to(`lesson-${lessonId}`).emit("viewer-count", viewerCount);
    });

    // Leave lesson room
    socket.on("leave-lesson", (lessonId: string) => {
      socket.leave(`lesson-${lessonId}`);
      console.log(`User ${socket.data.user.userId} left lesson ${lessonId}`);

      // Update viewer count
      const room = io.sockets.adapter.rooms.get(`lesson-${lessonId}`);
      const viewerCount = room ? room.size : 0;
      io.to(`lesson-${lessonId}`).emit("viewer-count", viewerCount);
    });

    // Track progress
    socket.on(
      "update-progress",
      (data: { lessonId: string; progress: number }) => {
        const { lessonId, progress } = data;

        // Broadcast to instructor
        socket.broadcast.to(`lesson-${lessonId}`).emit("progress-update", {
          userId: socket.data.user.userId,
          progress,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.data.user.userId}`);
    });
  });

  return io;
};
