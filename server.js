const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const userAuthRoutes = require('./routes/user_auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const collectionRoutes = require('./routes/collection');
const itemRoutes = require('./routes/item');
const tagRoutes = require('./routes/tag');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');
const searchRoute = require('./routes/search');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/userAuth', userAuthRoutes);
app.use('/api/user', userRoutes);
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
