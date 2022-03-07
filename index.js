const express = require('express');
const bodyparser = require("body-parser");

const fetch = require('node-fetch');
const { json } = require('body-parser');

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
const openGeocoder= require('node-open-geocoder');
app.locals.openGeocoder = require('node-open-geocoder');
app.locals.fetch = require('node-fetch');


app.set('view engine','ejs');

const path = __dirname + '/views/';
const port = 8090;

//route to main page
app.get('/', (req, res)=> { 
  res.render('home')
})

//route for date submission
app.post("/", function (req, res) {
 
  //receive date request from view
  date = req.body.date;
  time = req.body.time;
 
  //split into array
  const dateArr = date.split("-");
  const timeArr = time.split(":");

  //split the array into variable
  year = dateArr[0];
  month = parseInt(dateArr[1])-1;
  day = dateArr[2];

  hour = timeArr[0];
  minute = timeArr[1];

  //function for converting date and adding 10 minutes
  var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + (minutes*60000));
  }

  //converting variables into date format (UTC +0)
  a_date = new Date(Date.UTC(year, month, day, hour, minute, 0));

  //converting date into Unix timestamp
  var myEpoch = a_date.getTime()/1000;
  var myEpoch2 = Math.trunc(myEpoch)

  //initialize date array and Unix timestamp array
  const date_arr_add = [];
  const unix_epoch_arr = [];

  //conveting date in human readable format and push into date array
  date_arr_add.push(a_date.toUTCString());
  unix_epoch_arr.push(myEpoch2);

  
  for (let i = -10; i >=-60 ; i-=10) {
    //decrement of 10 minutes on date and convert to human readable format and push into date array
    c_date = add_minutes(a_date,i);
    date_arr_add.push(c_date.toUTCString());

    //convert date into Unix timestamp and push into Unix timestamp array
    var myEpoch = c_date.getTime()/1000;
    var myEpoch2 = Math.trunc(myEpoch)
    unix_epoch_arr.push(myEpoch2);
  }

  //reverse the postion for both array
  date_arr_add.reverse();
  unix_epoch_arr.reverse();

  for (let i = 10; i <=60 ; i+=10) {
    //increment of 10 minutes on date and convert to human readable format and push into date array
    b_date = add_minutes(a_date,i);
    date_arr_add.push(b_date.toUTCString());

    //convert date into Unix timestamp and push into Unix timestamp array
    var myEpoch = b_date.getTime()/1000;
    var myEpoch2 = Math.trunc(myEpoch)
    unix_epoch_arr.push(myEpoch2);
  }
 
//function for merging both array to be json format to show in view
const mapArrays = (date_arr_add, unix_epoch_arr) => {
   const res = [];
   for(let i = 0; i < date_arr_add.length; i++){
      res.push({
         date: date_arr_add[i],
         timestamp: unix_epoch_arr[i]
      });
   };
   return res;
};

//call the function to merge both array
table_arr = mapArrays(date_arr_add, unix_epoch_arr);

  //converting Unix epoch array to human readable and merge with ISS api url
  url = "https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+unix_epoch_arr.join();
  
  //send the output to home view
  res.render('home', {
    url,
    table_arr

  })

  //fetch the longitude,latitude from ISS api and using openGeocoder api to get the locatioon
  fetch(url)
  .then(res => res.json())
  .then(json => {

    i=0;
    while(i<json.length){
      id_cell = i.toString();

      openGeocoder()
      .reverse(json[i].longitude, json[i].latitude)
      .end((err, res) => {
 
        //output the location at console
        console.log(res);

    })

    i++;
    }

      //output the result from ISS api
      console.log(json);
})
 
});

app.listen(port, function () {
console.log('Nodejs Express Example App listening on port ' + port)
});