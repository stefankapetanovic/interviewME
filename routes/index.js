const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('static/index');
});

router.get('/interviewer', function(req, res, next) {
    res.render('interviewer'); 
});

router.get('/interviewee', function(req, res, next) {
    res.render('interviewee'); 
});

router.get('/chatclient', function(req, res, next) {
    res.render('chatclient')
});

module.exports = router;
