const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const journalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  publishDate: {
    type: Date,
    required: true,

    match: /^\d{4}-\d{2}-\d{2}$/,
  },

  volume: {
    type: Number,
    required: true,
  },

  day: {
    type: Number,
    required: true,
  },

  contents: {
    type: String,
    required: true,
  },

  events: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Journal', journalSchema);
