const exp=require('express');

const uuid = require('uuid/v4');
var bodyParser = require('body-parser');
var session=require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser')
 

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'users',
  clearExpired: true //auto remove expired session tuples from db 
});

connection.connect();
var sessionStore = new MySQLStore({}/* session store options */, connection);
var user='fahad';
var pass='123456';
module.exports.connection=connection;
var UserPrototype=require("./controllers/user.js").UserPrototype;
const app=exp();

app.set('view engine', 'ejs');
app.use(exp.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	genid: (req) => {
    console.log('Creating session Id')
    return uuid(); // use UUIDs for session IDs
  },
	name:'Session-Cookie',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store:sessionStore,
  cookie: {secure: false,maxAge: 5*60*1000 }//session cookie expire after 5 mins
}));


app.get('/',(req,res)=>{
console.log("at root route");
res.render('home_copy.ejs');
});
app.get('/login',(req,res)=>{
console.log('On login route');
if(req.session.customer_id==undefined)
{console.log("On login page");
res.render('loginSignup_copy.ejs');
}
else
{console.log("signed in user on login page");
res.redirect('/');
}

});
app.get("/userProfile",(req,res)=>{
res.render("userProfile.ejs");
});
app.get("/purchaseHistory",(req,res)=>{
res.render("purchaseHistory.ejs");
});
//mybookings here
app.get("/airlineLogin",(req,res)=>{
res.render("airlineLogin.ejs");
});
app.get("/airlineSignup",(req,res)=>{
res.render("airlineSignup.ejs");
});

app.get("/addFlight",(req,res)=>{
res.render("addflight.ejs");
}); //Css or bootstrap
app.get("/cancelFlight",(req,res)=>{
res.render("cancelflight.ejs");
});
app.get("/delayFlight",(req,res)=>{
res.render("delayflight.ejs");
});
app.post('/login',(req,res)=>{
UserPrototype.exist(req.body.user).then((val)=>{
		UserPrototype.findUserDetails(req.body.user,req.body.pass).then((info)=>{
			req.session.customer_id=info.id;
			res.redirect('/');
		});
	}).catch((msg)=>{console.log(msg);
res.redirect('/');
	});
})



function Flight(flightNo,departure,arrival,duration,price){
	this.flightNo=flightNo;
	this.departure=departure;
	this.arrival=arrival;
	this.duration=duration;
	this.price=price;
}
var flightObj=new Flight('pk301','pakistan 1:30pm','Canada 3:30pm','6:00pm','Pkr100,0000');
var flightArr=[flightObj];
flightArr.push(flightObj);
flightArr.push(flightObj);
flightArr.push(flightObj);


app.get('/searchFlights',(req,res)=>{
	console.log(req.query.to);
res.render('test_search.ejs',{ssData:flightArr});
});

function flightReq(flightNumber,source,destination,startTime,stay){
	this.flightNo=flightNumber;
	this.source=source;
	this.destination=destination;
	this.startTime=startTime;
	this.stay=stay;
}
var flightReqObj=new flightReq('pk301','pakistan','israel','6:00pm','5');
var flightReqArr=[flightReqObj];
flightReqArr.push(flightReqObj);
flightReqArr.push(flightReqObj);
flightReqArr.push(flightReqObj);


app.get('/admin_type=req',(req,res)=>{
	
res.render('admin.ejs',{ssData:flightReqArr});
});


app.listen(3000,()=>{
console.log('Server listening on port 3000');

});
