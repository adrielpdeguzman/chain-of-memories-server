const _ = require('lodash');
const config = require('../config');
const moment = require('moment');
const sanitize = require('sanitize-html');
const Journal = require('../models/journal');
require('moment-range');

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
    const indexQuery = Journal.find();

    if (req.query.volume) {
      indexQuery.where('volume').equals(req.query.volume);
    }

    if (req.query.search) {
      const q = new RegExp(sanitize(req.query.search), 'i');
      indexQuery.or([{ contents: { $regex: q } }, { events: { $regex: q } }]);
    }

    if (req.query.sort) {
      const fields = sanitize(req.query.sort).replace(/,/g, ' ');
      indexQuery.sort(fields);
    }

    indexQuery.exec((err, journals) => {
      if (err) {
        return next(err);
      }

      return res.json(journals);
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

      return res.status(201).json(journal);
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

      return res.json(journal);
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

      return res.json(journal);
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

      return res.json(journal);
    });
  },

  /**
   * Read a random journal entry.
   */
  getRandom(req, res, next) {
    Journal.aggregate([
      {
        $sample: { size: 1 },
      },
    ]).exec((err, journal) => {
      if (err) {
        return next();
      }

      return res.json(journal);
    });
  },

  /**
   * Get the volumes with start date.
   */
  getVolumes(req, res, next) {
    Journal.aggregate([
      {
        $group: {
          _id: '$volume',
          volume: { $max: '$volume' },
          publishDate: { $min: '$publishDate' },
        },
      },

      {
        $project: {
          _id: 0,
          publishDate: 1,
          volume: 1,
        },
      },

      {
        $sort: {
          volume: 1,
        },
      },
    ]).exec((err, volumes) => {
      if (err) {
        return next(err);
      }

      return res.json(volumes);
    });
  },

  /**
   * Get the dates without entries for the current user.
   */
  getDatesWithoutEntries(req, res, next) {
    const range = moment.range(moment(config.anniversaryDate), moment()).toArray('days');
    const formattedRange = range.map(date => date.format('YYYY-MM-DD'));
    const datesWithEntries = Journal.find({ user: req.sub }).select('publishDate -_id');

    datesWithEntries.then((dates) => {
      const formattedDates = _.map(dates, 'publishDate').map(date => moment(date).format('YYYY-MM-DD'));

      res.json(_.reverse(_.difference(formattedRange, formattedDates)));
    });
  },
};
