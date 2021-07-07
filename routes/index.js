var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (request, response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  response.render('index', { title: 'E Containers ZOHO API' });
});

module.exports = router;
