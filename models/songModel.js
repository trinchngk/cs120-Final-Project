import mongoose from "mongoose";

const songSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: true
    },
    album: {
      type: String,
      required: true
    },
    published: {
      type: Number,
      required: true
    },    
    genre: {
      type: String,
      required: true
    },    
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    cover: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

export const Song = mongoose.model('Song', songSchema)