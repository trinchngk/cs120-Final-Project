import songsRoute from './routes/songsRoute.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const CORSAO = process.env.ALLOWED_ORIGINS


app.use(express.json());

app.use(
  cors({
    origin: CORSAO,
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  })
);

app.get('/', (req,res) => {
    console.log(req);
    return res.status(200).send("success!");
});

app.use('/api/songs', songsRoute);


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Successful connection to Mongo");
    } catch (error) {
        console.log(error);
    }
}

connect();

app.listen(PORT, () => console.log(`Server started on ${PORT}`));