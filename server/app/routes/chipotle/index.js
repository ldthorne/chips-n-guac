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
    const data = {
      f: fName,
      l: lName,
      m: phoneNumber,
      s: "false",
      z: "10065"
    }
    const options = {
      url: 'https://api-proxy.chipotle.com/guacsmash/reg',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Host': 'api-proxy.chipotle.com',
        'Origin': 'https://cado-crusher.chipotle.com',
        'Pragma': 'no-cache',
        'Referer': 'https://cado-crusher.chipotle.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
        'Referer': 'http://www.guachunter.com/'
      },
      data: JSON.stringify(data)
    }
    User.create({ name: fName })
      .then(function (user) {
        console.log(options)
        return promisifiedCurl(options)
      }).then( response => {
        console.log(response);
        res.status(200).send();
      }).then( null, err => {
        console.log(err)
        res.status(500).send(err)
      })
  }
})