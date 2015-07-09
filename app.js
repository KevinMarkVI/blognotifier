var http = require("http");
var cheerio = require("cheerio");
var fs = require('fs');
var nodemailer = require('nodemailer');


var download = function(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
};


var url = "http://blog.azcardinals.com/author/darrenurban/";


var writeFile = function(links) {
  fs.writeFile('message.txt', links, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
};


var parseData = function(data) {
  var results = [];
      tempTitles = [];
  titles = [];
  var links = [];
  var $ = cheerio.load(data);

  $(".post h2 a").each(function(i, e) {
    results.push(e);
  });

  for (var j = 0; j< results.length; j++) {
    links.push(results[j].attribs.href);
    tempTitles.push(results[j].attribs.title);
  }

  for (var k = 0; k < tempTitles.length; k++){
    titles.push(tempTitles[k].slice(18));
  }
  readFileUrl(function(data) {
    decider(links, data);
  });
};

var sendEmail = function(links) {
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'azcardsruleforeversuckitsea@gmail.com',
          pass: 'bestemailever'
      }
  });
  var mailOptions = {
      from: 'Red Bird Nation <azcardsruleforeversuckitsea@gmail.com>', // sender address
      to: 'kevinmarkvi@yahoo.com', 
      subject: 'There is a new blog post!', 
      text: 'TEST', // plaintext body
      html: '<b>' + links[0] + '</b>' // html body
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){ 
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  });
};


var readFileUrl = function(callback) {
  fs.readFile('message.txt', "utf-8", function (err, data) {
    if (err) throw err;
    callback(data);
  });
};

var compareUrl = function(links, data) { 
  if (links[0] === data.slice(0, links[0].length)) {
    return true;
  } else {
    return false;
  }
};
var decider = function (links, data) {
  if (compareUrl(links, data)) {
    console.log("True: THE URLS MATCHED");
    return;
  } else {
    console.log("False: YOU SHOULD SEND AN EMAIL");
    sendEmail(links);
    writeFile(links);
  }
};

download(url, function(data) {parseData(data);});






























