const Url = require('../models/urlM');
const shortid = require('shortid');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  const code = shortcode || shortid.generate();
  const expiry = new Date(Date.now() + validity * 60000); // validity in minutes

  const newUrl = new Url({ url, shortcode: code, expiry });
  await newUrl.save();

  res.status(201).json({
    shortLink: `https://hostname/port/${code}`,
    expiry: expiry.toISOString()
  });
};
