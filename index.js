const express = require('express');
const bodyparser = require("body-parser");
const fetch = require('node-fetch');
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
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
  
  // res.render('home', {
  //   date_arr_add
 

  // })

  url = "https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+unix_epoch_arr.join();


  // (async () => {
  //   try {
  //     const res = await fetch(url);
  //     const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
  //     console.log('Status Code:', res.status);
  //     console.log('Date in Response header:', headerDate);
  
  //     const users = await res.json();
  //     for(user of users) {
  //       console.log(`Got user with id: ${user.footprint}, name: ${user.timestamp}`);
  //     }
  //   } catch (err) {
  //     console.log(err.message); //can be console.error
  //   }
  // })();
  
  //res.send(myDate);
//   res.send("Date: "+date.getDate()+
//           "/"+(date.getMonth()+1)+
//           "/"+date.getFullYear()+
//           " "+date.getHours()+
//           ":"+date.getMinutes()+
//           ":"+date.getSeconds());
 
});










// app.use(express.static(path));
// app.use('/', router);

app.listen(port, function () {
console.log('Nodejs Express Example App listening on port ' + port)
})