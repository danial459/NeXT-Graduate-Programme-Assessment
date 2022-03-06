const express = require('express');
const bodyparser = require("body-parser");

const fetch = require('node-fetch');
const { json } = require('body-parser');
//  const nodeGeocoder = require('node-geocoder');
// let options_map = {
//   provider: 'openstreetmap'
// };
 
// let geocoder = nodeGeocoder(options_map);
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
  //date_time = req.body.date+" "+req.body.time+" +0000";
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

  // // var date = new Date(); // Your timezone!  
  // // var myEpoch = date.getTime()/1000;
  // // var myEpoch2 = Math.trunc(myEpoch)
  // date = new Date(year, month, day, hour, minute);
  // date_GMT_08 = date.setHours(date.getHours() + 8)
  
  //res.send(myEpoch2+" ");
  //  res.send(date.getUTCHours()+" ");
  //res.send(date.getTimezoneOffset()+" ");
  //a = new Date("23 12 2012 10:00:00 GMT+08").toUTCString()
  //a = moment(date_time).format("YYYY-MM-DD HH:mm Z");

  a_date = new Date(Date.UTC(year, month, day, hour, minute, 0));
  //b_date = add_minutes(a_date,10);
  //b_date = a_date.setMinutes(a_date.getMinutes()+10);
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

  //console.log(unix_epoch_arr.join());

  // res.send(b_date.toUTCString());
 
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

// let i=0;
// while (i < lol.length) {
//   console.log(lol[i].date);;
//   i++;
// }
//console.log(lol.length);
// const openGeocoder = require('node-open-geocoder');

  url = "https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+unix_epoch_arr.join();
  
  res.render('home', {
    url,
    table_arr

  })

  

  // loc_res = [];
  // openGeocoder()
  // .reverse(-8.945406, 38.575078)
  // .end((err, res) => {
   
  //   console.log(res.place_id);
  //   //console.log(res);
  // })

  // console.log(loc_res);

//   const loc_arr = [];

//   fetch(url)
//   .then(res => res.json())
//   .then(json => {
//       //console.log("First user in the array:");
    
//       //console.log(loc_arr);
//       //console.log(json[0]);

// })


  // let options = {
  //   provider: 'openstreetmap'
  // };
   
  // let nodeGeocoder = require('node-geocoder');
  // let geoCoder = nodeGeocoder(options);


  // Reverse Geocode
    // geoCoder.reverse({lat: 38.66, lon: -78.43})
    // .then((res)=> {
      
    //   console.log(res);
    // })

  //   geoCoder.geocode('Luray Caverns')
  // .then((res)=> {
  //   console.log(res);
  // })
  // .catch((err)=> {
  //   console.log(err);
  // });
  
//   var NodeGeocoder = require('node-geocoder');

// var options = {
//   provider: 'openstreetmap',
//   httpAdapter: 'https', // Default
// // for Mapquest, OpenCage, Google Premier
//   formatter: 'json' // 'gpx', 'string', ...
// };

// var geocoder = NodeGeocoder(options);

// geocoder.reverse({lat:41.060116, lon:82.017032})

// .then((res)=> {
//   console.log(res);
// })
// .catch((err)=> {
//   console.log(err);
// });


//   (async () => {
//     try {
//       const res = await fetch(url);
//       //const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
  
//       const location_arr = [];

//       const users = await res.json();
//       for(user of users) {
//         //console.log(`Got user timestamp: ${user.timestamp}, latitude: ${user.latitude}, longitude:${user.longitude}`);
//         location_arr.push(user.longitude);
//         //console.log(location_arr);
 
//       }
//     } catch (err) {
//       console.log(err.message); //can be console.error
//     }
//   })();

//   console.log(location_arr);




  
  //res.send(myDate);
//   res.send("Date: "+date.getDate()+
//           "/"+(date.getMonth()+1)+
//           "/"+date.getFullYear()+
//           " "+date.getHours()+
//           ":"+date.getMinutes()+
//           ":"+date.getSeconds());
 
});










// app.use(express.static(path));
 //app.use('/', router);
// app.timeout = 0;



app.listen(port, function () {
console.log('Nodejs Express Example App listening on port ' + port)
});