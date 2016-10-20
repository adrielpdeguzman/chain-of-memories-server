const config = require('../config');
const moment = require('moment');
const sanitize = require('sanitize-html');
const Journal = require('../models/journal');

function computeVolume(publishDate) {
  if (moment(publishDate).isBefore(config.anniversaryDate)) {
    return 1;
  }

  return moment(publishDate).diff(moment(config.anniversaryDate), 'months') + 2;
}

function computeDay(publishDate) {
  const diffInDays = moment(publishDate).diff(moment(config.anniversaryDate), 'days');
  if (moment(publishDate).isSameOrAfter(config.anniversaryDate)) {
    return diffInDays + 1;
  }

  return diffInDays;
}

module.exports = {
  /**
   * Get all journals.
   */
  index(req, res, next) {
    Journal.find().exec((err, journals) => {
      if (err) {
        return next(err);
      }

      return res.json({ journals });
    });
  },

  /**
   * Create a new journal.
   */
  create(req, res, next) {
    const newJournal = new Journal();

    newJournal.user = sanitize(req.sub);
    newJournal.publishDate = sanitize(req.body.publishDate);
    newJournal.volume = computeVolume(sanitize(req.body.publishDate));
    newJournal.day = computeDay(sanitize(req.body.publishDate));
    newJournal.contents = sanitize(req.body.contents);
    newJournal.events = sanitize(req.body.events);

    newJournal.save((err, journal) => {
      if (err) {
        return next(err);
      }

      return res.status(201).json({ journal });
    });
  },

  /**
   * Read a single journal.
   */
  read(req, res, next) {
    Journal.findById(req.params.id).exec((err, journal) => {
      if (err || !journal) {
        return next(err);
      }

      return res.json({ journal });
    });
  },

  /**
   * Update a single journal.
   */
  update(req, res, next) {
    const payload = {
      contents: sanitize(req.body.contents),
      events: sanitize(req.body.events),
    };

    Journal.findByIdAndUpdate(req.params.id, payload, { new: true }).exec((err, journal) => {
      if (err || !journal) {
        return next(err);
      }

      if (journal.user.toString() !== req.sub) {
        return res.status(403).json({ message: 'Unauthorized action.' });
      }

      return res.json({ journal });
    });
  },

  /**
   * Delete a single journal.
   */
  delete(req, res, next) {
    Journal.findByIdAndRemove(req.params.id).exec((err, journal) => {
      if (err || !journal) {
        return next(err);
      }

      if (journal.user.toString() !== req.sub) {
        return res.status(403).json({ message: 'Unauthorized action.' });
      }

      return res.json({ journal });
    });
  },
};
