require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const fanficRouter = require('./routers/fanficRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/fanfic', fanficRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://alena-zykava:s9jjJ8fX3Jtzp3a@cluster0.acaw2.mongodb.net/fanfiction?retryWrites=true&w=majority');
        app.listen(PORT, () => console.log(`server on port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start();
