import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const LocalStrategy = Strategy;
dotenv.config();

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongodb connect'))
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(cors());

app.listen(8000, () => console.log('listen port 4000'));
