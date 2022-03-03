const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const router = express.Router();
app.use(bodyparser.urlencoded({ extended: true }));

const path = __dirname + '/views/';
const port = 8090;

router.use(function (req,res,next) {
console.log('/' + req.method);
next();
});

router.get('/', function(req,res){
res.sendFile(path + 'home.html');
});


app.post("/details", function (req, res) {
 
  date = req.body.date;
  time = req.body.time;
  const dateArr = date.split("-");

  year = dateArr[0];
  month = dateArr[1];
  day = dateArr[2];

  var date = new Date(); // Your timezone!  
  var myEpoch = date.getTime()/1000;
  var myEpoch2 = Math.trunc(myEpoch)
  
  //res.send(myEpoch2+" ");
  res.send(time);

  //res.send(myDate);
//   res.send("Date: "+date.getDate()+
//           "/"+(date.getMonth()+1)+
//           "/"+date.getFullYear()+
//           " "+date.getHours()+
//           ":"+date.getMinutes()+
//           ":"+date.getSeconds());
 
});










app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
console.log('Nodejs Express Example App listening on port ' + port)
})