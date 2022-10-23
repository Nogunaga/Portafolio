/*----------  INTRO ANIMATION  ----------*/

//self executing intro function: computer, circle and the other functions
(function() {

    //svg
    var $svgIntro = $('#svg-intro');

    //svg elements
    var $circle = $('#svg-intro-circle');
    var $computer = $('#svg-intro-computer');
    var $screen = $('#svg-intro-screen');
    var $code = $('#svg-intro-code');

    var tl = new TimelineMax({ delay: 0.5 });
    tl.fromTo($svgIntro, 1, { transformOrigin: '50% 50%', scale: 0.8 }, { opacity: 1, scale: 1, ease: Power4.easeOut, onComplete: animateIcons })
        .fromTo($circle, 1.2, { transformOrigin: '50% 50%', scale: 0.8 }, { opacity: 1, scale: 1, ease: Back.easeOut.config(4) }, '=-1')
        .fromTo($computer, 1, { y: '100%' }, { y: '0%', opacity: 1, ease: Power4.easeOut }, '=-0.5')
        .to($screen, 1, { opacity: 1, ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 1, points: 20, taper: "none", randomize: true, clamp: false }) }, '=-0.5')
        .to($code, 0.5, { opacity: 1, onComplete: loopUnderscore })


})();

//icons
function animateIcons() {

    //svg
    var $svgIntro = $('#svg-intro');

    //svg elements
    var $icons = $('.svg-intro-icon');
    var $icon1 = $('#svg-intro-icon1');
    var $icon2 = $('#svg-intro-icon2');
    var $icon3 = $('#svg-intro-icon3');
    var $icon4 = $('#svg-intro-icon4');
    var $icon5 = $('#svg-intro-icon5');
    var $icon6 = $('#svg-intro-icon6');
    var $shadow = $('#svg-intro-shadow');


    var tl = new TimelineMax();
    tl.fromTo($svgIntro, 2, { transformOrigin: '50% 50%', scale: 1 }, { scale: 1.1, ease: Sine.easeInOut })
        .to($svgIntro, 0.5, { scale: 1, ease: Bounce.easeOut, onComplete: animateLetters })
        .to($icon1, 2, { x: '400%', opacity: 0.5, ease: Power4.easeOut }, '=-0.3')
        .to($icon2, 1.5, { x: '200%', opacity: 0.7, ease: Power4.easeOut }, '=-2')
        .to($icon3, 1, { x: '100%', opacity: 0.9, ease: Power4.easeOut }, '=-2')
        .to($icon5, 2, { x: '-400%', opacity: 0.5, ease: Power4.easeOut }, '=-2')
        .to($icon6, 1.5, { x: '-200%', opacity: 0.7, ease: Power4.easeOut }, '=-2')
        .to($icon4, 1, { x: '-100%', opacity: 0.9, ease: Power4.easeOut }, '=-2')
        .to($shadow, 3, { opacity: 1 });

}

//letters
function animateLetters() {

    var $lead = $('.lead');
    var $video = $('#bg-video');

    TweenMax.to($lead, 1, { opacity: 1 });
    TweenMax.to($video, 3, { delay: 1, opacity: 0.2 });


    $('.xaviro').each(function(i) {
        var letter = $(this);

        setTimeout(function() {

            letter.removeClass('transparent');
        }, 100 * i);
    });

    $('.com').each(function(i) {
        var letter = $(this);

        setTimeout(function() {

            letter.addClass('transparent');
        }, 100 * i);
    });

}

//infinite underscore
function loopUnderscore() {

    var $underscore = $('#svg-intro-underscore');
    TweenMax.fromTo($underscore, 0.5, { opacity: 1 }, { delay: 0.5, opacity: 0, repeatDelay: 0.5, repeat: -1, yoyo: true, ease: SteppedEase.config(1) })

}

var fs = require('fs');
var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');


var sendgrid = require('sendgrid')(name, password);
//SENDGRID EMAIL



var srcApp = express();
var distApp = express();


function postRequest(req, res) {

    var textMessage = '<b>Name: </b>' + req.body.name + '<br>' + '<b>Email: </b>' + req.body.email + '<br>' + '<b>Phone: </b>' + req.body.phone + '<br>' + '<b>Message: </b>' + req.body.message + '<br>' + '<b>Date: </b>' + moment().format('MMMM Do YYYY, h:mm:ss a');


  

    console.log(email);

    sendgrid.send(email, function(err, json) {
        if (err) {
            return res.sendStatus(550);
            console.log(err);
        } else {
            return res.sendStatus(200);
            console.log('Success!');
            console.log(json);

        }


    });
    /* THIS WOULD SAVE MY MAIL IN A FILE ON THE COMPUTER BUT CHANGED TO SENDGRID
        //current time
        var now = moment().format();
        //changed the format of received data
        var receivedData = '{ "' + now + '" : ' + JSON.stringify(req.body, null, 4) + '\n},';

        //write file with requests
        fs.appendFile('contactform.json', receivedData, function(err) {

            if (err) {
                console.log(err);
            } else {
                console.log("Data has been added!");
            }
        });*/
};


// Serves source code
var server1 = srcApp.listen(4000, function() {

    srcApp.use(express.static(__dirname + '/'));

    srcApp.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    // POST method route
    srcApp.use(bodyParser.urlencoded({
        extended: true
    }));


    srcApp.post('/', function(req, res) {
        postRequest(req, res);

    });

    //404 not found
    srcApp.get('*', function(req, res) {
        res.sendFile(__dirname + '/404.html');
        console.log('Get request for ' + req.url + ' (src)');
    });

    var host = server1.address().address;
    var port = server1.address().port;
    console.log('Source code listening at http://%s:%s', host, port);
});

// Serves distribution code
var server2 = distApp.listen(8000, function() {

    distApp.use(express.static(__dirname + '/dist'));

    distApp.get('/', function(req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });

    // POST method route
    distApp.use(bodyParser.urlencoded({
        extended: true
    }));


    distApp.post('/', function(req, res) {
        postRequest(req, res);
    });


    //404 not found
    distApp.get('*', function(req, res) {
        res.sendFile(__dirname + '/dist/404.html');
        console.log('Get request for ' + req.url + ' (dist)');
    });

    var host = server2.address().address;
    var port = server2.address().port;
    console.log('Distribution code listening at http://%s:%s', host, port);
});