'use strict';
const router = require('express').Router();
const phone = require('phone');
const http = require('http');
const curl = require('curlrequest');
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
    res.status(400).send({ error: 'Invalid phone number!' });
    return;
  } else {
    phoneNumber = phoneNumber[0];
    const data = {
      firstName: fName,
      lastName: lName,
      phoneNumber: phoneNumber,
      optedIn: false,
      zip: "10017"
    }
    const options = {
      url: 'https://savorwavs.com/api/offer/request',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://savorwavs.com',
        'Pragma': 'no-cache',
        'Referer': 'https://savorwavs.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
        'Referer': 'https://savorwavs.com/buy-one-get-one'
      },
      data: JSON.stringify(data)
    }
    User.create({ name: fName })
    .then(() => {
      return promisifiedCurl(options)
    }).then( (response) => {
      if (response.error) {
        console.error(response.error)
        res.status(400).send({error: `Error message received: ${response.error.message}`})
      }
      res.status(200).send();
    }).then( null, err => {
      console.error('Error!')
      console.error(err)
      res.status(500).send({error: err})
    })
  }
})