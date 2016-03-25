'use strict';
const router = require('express').Router();
const phone = require('phone');
const http = require('http');
const curl = require('curlrequest')
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Promise = require('bluebird');

module.exports = router;
const promisifiedCurl = function (options) {
  return new Promise((resolve, reject) => {
    curl.request(options, function (err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response)
      }

    })
  });
}


router.post('/', function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  let phoneNumber = req.body.phone;
  phoneNumber = phone(phoneNumber);
  if (!phoneNumber.length) {
    res.status(500).send({ error: 'Invalid phone number!' });
    return;
  } else {
    phoneNumber = phoneNumber[0].slice(2);
    const options = {
      url: 'http://api.guachunter.com/guac-it-out/reg',
      headers: {
        'Origin': 'http://www.guachunter.com',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/48.0.2564.116 Chrome/48.0.2564.116 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'Referer': 'http://www.guachunter.com/',
        'Connection': 'keep-alive'
      },
      data: '{"f":"' + fName + '","l":"' + lName + '","m":"' + phoneNumber + '","s":"true","z":"10065"}'
    }
    User.create({ name: fName })
      .then(function (user) {
        return promisifiedCurl(options)
      }).then( response => {
        res.status(200).send();
      }).then( null, err => {
        res.status(500).send(err)
      })
  }
})