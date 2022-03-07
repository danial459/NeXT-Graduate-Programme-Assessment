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

app.get('/', (req, res)=> {
  res.render('home')
})

app.post("/", function (req, res) {
 
  date = req.body.date;
  time = req.body.time;
 
  const dateArr = date.split("-");
  const timeArr = time.split(":");

  year = dateArr[0];
  month = parseInt(dateArr[1])-1;
  day = dateArr[2];

  hour = timeArr[0];
  minute = timeArr[1];

  var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + (minutes*60000));
  }

  a_date = new Date(Date.UTC(year, month, day, hour, minute, 0));

  var myEpoch = a_date.getTime()/1000;
  var myEpoch2 = Math.trunc(myEpoch)

  const date_arr_add = [];
  const unix_epoch_arr = [];

  date_arr_add.push(a_date.toUTCString());
  unix_epoch_arr.push(myEpoch2);

  for (let i = -10; i >=-60 ; i-=10) {
    c_date = add_minutes(a_date,i);
    date_arr_add.push(c_date.toUTCString());

    var myEpoch = c_date.getTime()/1000;
    var myEpoch2 = Math.trunc(myEpoch)
    unix_epoch_arr.push(myEpoch2);
  }

  date_arr_add.reverse();
  unix_epoch_arr.reverse();

  for (let i = 10; i <=60 ; i+=10) {
    b_date = add_minutes(a_date,i);
    date_arr_add.push(b_date.toUTCString());

    var myEpoch = b_date.getTime()/1000;
    var myEpoch2 = Math.trunc(myEpoch)
    unix_epoch_arr.push(myEpoch2);
  }
 
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

table_arr = mapArrays(date_arr_add, unix_epoch_arr);

  url = "https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+unix_epoch_arr.join();
  
  res.render('home', {
    url,
    table_arr

  })

  fetch(url)
  .then(res => res.json())
  .then(json => {

    i=0;
    while(i<json.length){
      id_cell = i.toString();

      openGeocoder()
      .reverse(json[i].longitude, json[i].latitude)
      .end((err, res) => {
 
        console.log(res);

    })

    i++;
    }

      console.log(json);
})
 
});

app.listen(port, function () {
console.log('Nodejs Express Example App listening on port ' + port)
});