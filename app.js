const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/api/user', require('./routes/users'));
app.use('/api/header_content', require('./routes/header_content'));
app.use('/api/navbar', require('./routes/navbar'));
app.use('/api/slider', require('./routes/slider'));
app.use('/api/slider_control', require('./routes/slider_controls'));
app.use('/api/collection_files', require('./routes/collection_files'));

module.exports = app;