import express from 'express';
import { Song } from '../models/songModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function auth(request, response, next) {
  const token = request.headers.authorization.split(' ')[1];
  if (!token) return response.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    response.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', auth, async (request, response) => {
  try {

    if (!request.body.title || !request.body.artist || !request.body.album || !request.body.published || !request.body.genre || !request.user.id) {
      return response.status(400).send('Request body is missing fields');
    }

    const newSong = {
      title: request.body.title,
      artist: request.body.artist,
      album: request.body.album,
      published: request.body.published,
      genre: request.body.genre,
      userId: request.user.id
    };

    const song = await Song.create(newSong);

    return response.status(201).send(song);

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for getting all songs from the database
router.get('/', auth, async (request, response) => {
  try {
    const songs = await Song.find({ userId: request.user.id });

    return response.status(200).json( {
      count: songs.length,
      data: songs
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send( { message: error.mesaage });
  }
});

//route for getting a song by ID 
//attach parameter in route using ":"
router.get('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const song = await Song.findOne({ _id: id, userId: request.user.id });

    if (!song) {
      return response.status(404).json({ message: 'Song not found' });
    }

    return response.status(200).json(song);
    
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for updating a book
//app.put() is used to update a resource
router.put('/:id', auth, async (request, response) => {
  try {
    if (!request.body.title || !request.body.artist || !request.body.album || !request.body.published || !request.body.genre || !request.user.id) {
      return response.status(400).send('Request body is missing fields');
    }

    const { id }  = request.params;
    const song = await Song.findOne({ _id: id, userId: request.user.id });

    if (!song) {
      return response.status(404).json({ message: 'Song not found' });
    }

    const result = await Song.findByIdAndUpdate(id, request.body);

    return response.status(200).send({ message: 'Song updated successfully', result});

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for deleting a song
router.delete('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const song = await Song.findOne({ _id: id, userId: request.user.id });

    if (!song) {
      return response.status(404).json({ message: 'Song not found' });
    }

    const result = await Song.findByIdAndDelete(id);

    return response.status(200).send({ message: 'Song deleted successfully'});
    
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;