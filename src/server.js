const http = require("http");
const app = require("./app.js");
const { connectDB } = require("./db.js");
const { Server } = require("socket.io");
const { setupSocket } = require("./sockets/index.js");

const PORT = 3000;

async function startServer() {
  // 1. CONNECT DB
  await connectDB();

  // 2. CREATE HTTP SERVER
  const server = http.createServer(app);

  // 3. ATTACH WEBSOCKET
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  setupSocket(io);

  // 4. START LISTENING
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();