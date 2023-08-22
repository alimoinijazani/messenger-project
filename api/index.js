import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import Message from './models/message.js';
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/register', (req, res) => {
  console.log(req.body);
  const { name, email, password, image } = req.body;
  // create a new User object
  const newUser = new User({ name, email, password, image });

  // save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'User registered successfully' });
    })
    .catch((err) => {
      console.log('Error registering user', err);
      res.status(500).json({ message: 'Error registering the user!' });
    });
});

app.listen(8000, () => console.log('listen port 8000'));
