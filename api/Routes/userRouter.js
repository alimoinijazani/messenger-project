import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
const userRouter = express.Router();
userRouter.post('/register', (req, res) => {
  console.log(req.body);
  const { name, email, image } = req.body;
  // create a new User object
  const password = bcrypt.hashSync(req.body.password, 10);
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

//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

//endpoint for logging in of that particular user
userRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: 'Email and the password are required' });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return res.status(404).json({ message: 'User not found' });
      }

      //compare the provided passwords with the password in the database
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(404).json({ message: 'Invalid Password!' });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log('error in finding the user', error);
      res.status(500).json({ message: 'Internal server Error!' });
    });
});

userRouter.get('/:userId', (req, res) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log('Error retrieving users', err);
      res.status(500).json({ message: 'Error retrieving users' });
    });
});

export default userRouter;
