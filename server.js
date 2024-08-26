const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const collectionRoutes = require('./routes/collection');
const itemRoutes = require('./routes/item');
const tagRoutes = require('./routes/tag');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');
const searchRoute = require('./routes/search');
const userAuthRoutes = require('./routes/user_auth');
const commentController = require('./controllers/commentController')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://collection-management-mr.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: 'https://collection-management-mr.vercel.app',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/userAuth', userAuthRoutes);
app.use('/api/userAuth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/search', searchRoute);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


io.on('connection', (socket) => {
  console.log("A user connected");

  socket.on('join-room', (itemId) => {
    socket.join(itemId);
    console.log(`User joined room for item ${itemId}`);
  });

  socket.on('action', async (itemId) => {
    try {
      const itemComments = await db.Comment.findAll({
        where: { itemId },
        include: [
          {
            model: db.User,
            attributes: ['id', 'username']
          },
        ]
      });
      console.log("Fetched comments:", itemComments);

      if (itemComments.length > 0) {
        io.to(itemId).emit('comments-updated', itemComments);
        console.log("Broadcasting comments to room:", itemId);
      } else {
        console.warn("No comments to broadcast for itemId:", itemId);
      }
    } catch (error) {
      console.error('Error fetching or broadcasting comments:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5000;
const socketPort = process.env.SOCKETPORT || 8080;

app.listen(port, () => {
  console.log("backend running on port : ", port)
})
server.listen(socketPort, () => {
  console.log("socket running on port:", socketPort);
});
