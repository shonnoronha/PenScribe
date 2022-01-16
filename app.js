const express = require('express');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const database = require('./config/database');
const { getUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// config
const app = express();
app.set('view engine', 'ejs');
dotenv.config();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static('public'));
app.use(cookieParser());

database.connect();

app.get('*', getUser);
app.use(blogRoutes);
app.use(authRoutes);

app.use((req, res)=>res.render('404'));
app.listen(process.env.PORT || 3000);