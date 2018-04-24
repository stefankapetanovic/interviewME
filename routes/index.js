const express = require('express');
const router = express.Router();
const fs = require('fs');

let stream;
let streamHasEnded = false;

router.get('/', function(req, res, next) {
  res.render('static/index');
});

router.get('/interviewer', function(req, res, next) {
   res.render('interviewer'); 
});

router.get('/interviewee', function(req, res, next) {
   res.render('interviewee'); 
});

// TODO -- handle multiple streams; more elegantly handle chunks
router.post('/startStream', function(req, res, next) {
    if(fs.existsSync('./test.webm')){ fs.unlinkSync('./views/test.webm'); }
    stream = fs.createWriteStream('./views/test.webm');
    streamHasEnded = false;
    res.sendStatus(200);
});

router.post('/postChunk', function(req, res, next) {
   req.on('readable', function() {
      const payload = req.read();
      if(payload && stream && !streamHasEnded) stream.write(payload);
   });
   res.sendStatus(200);
});

router.post('/lastChunk', function(req, res, next) {    
    stream.end();
    streamHasEnded = true;
    res.sendStatus(200);
});

router.get('/interviewStream', function(req, res, next) {
    const src = fs.createReadStream('./views/test.webm');
    src.pipe(res);
});

module.exports = router;
