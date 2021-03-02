var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

/* GET home page. */
router.get('/', async (req, res, next) => {
  // Hier komt de fetch
  let fetchResult;
    fetch('https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&locale=*')
    .then((response) => response.json)
    .then((json) => console.log(json))
    .catch((e) => console.error(e))

  res.render('index', { result: fetchResult });
});

module.exports = router;
