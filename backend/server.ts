import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { startServer } from "./src/index";
import { initializeSocket } from "./src/config/socket";

const PORT = process.env.PORT || 4000;

startServer().then((app) => {
  const httpServer = createServer(app);

  // Initialize Socket.io
  const io = initializeSocket(httpServer);

  // Make io accessible in the app
  app.set("io", io);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🔌 Socket.io initialized`);
  });
});
