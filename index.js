const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cors = require('cors');
const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://alena-zykava:s9jjJ8fX3Jtzp3a@cluster0.acaw2.mongodb.net/fanfiction?retryWrites=true&w=majority');
        app.listen(PORT, () => console.log(`server on port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start();
