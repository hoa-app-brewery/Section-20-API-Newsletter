
//const res = require("express/lib/response");
const express = require(`express`);
const https = require(`https`);
const port = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + `/public`));

app.get(`/`, function (request, response) {
  response.sendFile(__dirname + `/signup.html`);
});

app.post(`/`, function (req, res) {
  
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  let data = {
    members: [
      {
        email_address: email,
        status: `subscribed`,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }]
  };

  let jsonData = JSON.stringify(data);

  const dataCenter = `us14`;
  const audienceID = `02b3408da0`;
  const apiKey = `60cd3b9df6a1c9d635000ac1f4123be1-us14`;
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceID}`;
  const options = {
    method: `post`,
    auth: `hoado95:${apiKey}`
  };

  const request = https.request(url, options, function (response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + `/success.html`);
    } else {
      res.sendFile(__dirname + `/failure.html`);
    };

    response.on(`data`, function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post(`/failure`, function (req, res) {
  res.redirect(`/`);
});

app.post(`/success`, function (req, res) {
  res.redirect(`/`);
});


app.listen(3000 || process.env.PORT, function () {
  console.log(`Server is running on port: 3000!`);
});


// Mail Chimp API Key
// 60cd3b9df6a1c9d635000ac1f4123be1-us14

// Mail Chimp Audience ID
// 02b3408da0

// Mail Chimp API Endpoint
// https://<dc>.api.mailchimp.com/3.0/




