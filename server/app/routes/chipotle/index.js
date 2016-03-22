'use strict';
const router = require('express').Router();
const phone = require('phone');
const http = require('http');
const curl = require('curlrequest')

module.exports = router;

router.post('/', function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  let phoneNumber = req.body.phone;
  phoneNumber = phone(phoneNumber);
  if (!phoneNumber.length) {
    res.status(500).send({error: 'Invalid phone number!'});
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
      data: '{"f":"'+fName+'","l":"'+lName+'","m":"'+phoneNumber+'","s":"true","z":"10065"}'
    }


    curl.request(options, function (err, response) {
      console.log(err, response)
      if(err){
      	res.status(500).send(err)
      	return;
      } else {
      	res.status(200).send();
      }
    });
  }
})