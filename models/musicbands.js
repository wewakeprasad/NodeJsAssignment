const mongoose = require('mongoose');

const musicBand = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

const MusicBand = mongoose.model('MusicBand', UserSchema);

module.exports = MusicBand;
