const express = require('express');
const fs = require('fs');
const router = express.Router();

const streams = {};

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

router.post('/startStream', function(req, res, next) {
    const identifier = req.headers.streamidentifier;
    streams[identifier] = {};
    streams[identifier].stream = fs.createWriteStream('./recordings/' + identifier + '.webm');
    streams[identifier].ended = false;
    res.sendStatus(200);
});

router.post('/postChunk', function(req, res, next) {
   const identifier = req.headers.streamidentifier;
   req.on('readable', function() {
     const payload = req.read();
     const stream = streams[identifier] && streams[identifier].stream;
     const streamHasEnded = streams[identifier] && streams[identifier].ended;
     if(payload && stream && !streamHasEnded) stream.write(payload);
   });
   res.sendStatus(200);
});

router.post('/lastChunk', function(req, res, next) {
    const identifier = req.headers.streamidentifier;
    const stream = streams[identifier] && streams[identifier].stream;
    if (stream) {
        streams[identifier].ended = true;
        stream.end();
        delete streams[identifier];
    }
    res.sendStatus(200);
});

module.exports = router;
