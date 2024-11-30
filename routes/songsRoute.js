import express from 'express';
import { Song } from '../models/songModel.js';

const router = express.Router();

router.post('/', async (request, response) => {
  try {

    if (!request.body.title || !request.body.artist || !request.body.album || !request.body.published || !request.body.genre || !request.body.rating || !request.body.cover) {
      return response.status(400).send('Request body is missing fields');
    }

    const newSong = {
      title: request.body.title,
      artist: request.body.artist,
      album: request.body.album,
      published: request.body.published,
      genre: request.body.genre,
      rating: request.body.rating,
      cover: request.body.cover
    };

    const song = await Song.create(newSong);

    return response.status(201).send(song);

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for getting all songs from the database
router.get('/', async (request, response) => {
  try {
    const songs = await Song.find({});

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
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const song = await Song.findById(id);
    return response.status(200).json(song);
    
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for updating a book
//app.put() is used to update a resource
router.put('/:id', async (request, response) => {
  try {
    if (!request.body.title || !request.body.artist || !request.body.album || !request.body.published || !request.body.genre || !request.body.rating || !request.body.cover) {
      return response.status(400).send('Request body is missing fields');
    }

    const { id }  = request.params;
    const result = await Song.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Song not found' });
    }

    return response.status(200).send({ message: 'Song updated successfully' });

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//route for deleting a song
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Song.findByIdAndDelete(id);
    
    if (!result) {
      return response.status(404).json({ message: 'Song not found' });
    }

    return response.status(200).send({ message: 'Song deleted successfully' });
    
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;