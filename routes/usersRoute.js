import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// create user
router.post('/signup', async (request, response) => {
    try {

        if (!request.body.email || !request.body.password) {
          return response.status(400).send('Request body is missing fields');
        }

        const existingUser = await User.findOne({ email: request.body.email });
    
        // check for duplicate email
        if (existingUser) {
            return response.status(400).send('User already exists, please enter a new email');
        } else {
            const newUser = {
                email: request.body.email,
                password: request.body.password,
            };

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
            newUser.password = hashedPassword;

            const user = await User.create(newUser);   
            
            const userResponse = {
                _id: user._id,
                email: user.email,
            };
        
            return response.status(201).send(userResponse);            
        }
    
      } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
      }
});

router.post('/login', async (request, response) => {
  try {

    if (!request.body.email || !request.body.password) {
      return response.status(400).send('Enter both your email and password');
    } else {
      const user = await User.findOne({ email: request.body.email });
  
      // check for existing user
      if (!user) {
          return response.status(400).send('User could not be found');
      } else {

        const correctPassword = await bcrypt.compare(request.body.password, user.password);
        if (correctPassword) {
            const token = jwt.sign({
                id: user._id,
                email: user.email
            },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const userResponse = {
                _id: user._id,
                email: user.email,
            };
        
            return response.status(200).json({
                token,
                userResponse
            });                       
        } else {
            return response.status(400).send('Incorrect password');
        }
  
      }            
    }

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;