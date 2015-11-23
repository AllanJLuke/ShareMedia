var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'stuff' });
});


/* GET home page. */
router.get('/*/*', function(req, res, next) {
  res.render('index', { title: 'stuff' });
});


/* GET home page. */
router.get('/*', function(req, res, next) {
  res.render('editor', { title: 'editor' });
});

module.exports = router;
