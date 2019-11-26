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
  database : 'airlinems',
  clearExpired: true //auto remove expired session tuples from db 
});

connection.connect();
var sessionStore = new MySQLStore({}/* session store options */, connection);
var user='fahad';
var pass='123456';
module.exports.connection=connection;
var UserPrototype=require("./controllers/user.js").UserPrototype;
var airlinePrototype=require("./controllers/airline.js").airlinePrototype;
var adminPrototype=require("./controllers/admin.js").adminPrototype;

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
app.post("/addFlight",(req,res)=>{
	airlinePrototype.addFlightRequest(12345,'Karachi','Ontario','11/12/19 4:00pm').then((info)=>{
     console.log("Request for flight add made successfully");
     
	}).catch((msg)=>{

		console.log("Request for flight add Failed");
		console.log(msg);

	});
	res.redirect('/addflight');
//res.render("addflight.ejs");
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



function Flight(FLIGHT_int,SOURCE,DESTINATION,DEPARTURE_Date,price,AIRPLANE_ID){
	this.FLIGHT_int=FLIGHT_int;
	this.SOURCE=SOURCE;
	this.DESTINATION=DESTINATION;
	this.DEPARTURE_Date=DEPARTURE_Date;
	this.AIRPLANE_ID=AIRPLANE_ID;
	this.price=price;
}

app.get('/SearchFlights',(req,res)=>{
UserPrototype.searchFlights("islamabad","ontario","2019-11-20").then((result)=>{
	
	var flightArr_local=[];
	for (var i = 0; i < result.length; i++) {
	var flightObj_local=new Flight(result[i].FLIGHT_int,result[i].SOURCE,result[i].DESTINATION,result[i].DEPARTURE_Date,result[i].AIRPLANE_ID,
		result[i].price);
	flightArr_local.push(flightObj_local);
	}
	res.render('test_search.ejs',{ssData:flightArr_local});
console.log(result);
}).catch((error)=>{
	res.redirect('/');
	console.log(error);
});

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

app.get('/admin',(req,res)=>{
	
	//console.log(req.body.flightNo);
	res.render('admin.ejs');
	
});
	
function adminRequest(FLIGHT_NUMBER,FLIGHT_SOURCE,FLIGHT_DESTINATION,DEPARTURE_TIME)
{

this.FLIGHT_NUMBER=FLIGHT_NUMBER;

this.FLIGHT_SOURCE=FLIGHT_SOURCE;
this.FLIGHT_DESTINATION=FLIGHT_DESTINATION;
this.DEPARTURE_TIME=DEPARTURE_TIME;

}
var t1;
var adminRequests=[];
app.get('/admin_accept=:flightNo',(req,res)=>{
	console.log(req.params);
	
	adminPrototype.acceptRequests(req.params.flightNo).then((result)=>{
		//console.log("inside accept req");
		t1=result[0];

		var departTime=JSON.stringify(t1.DEPARTURE_TIME);
		departTime=departTime.substring(1,11);
		
		console.log(t1);
		var newdate=parseInt(departTime.substring(departTime.length-2,departTime.length))+1;
		
		departTime=departTime.substring(0,8)+newdate;
      console.log("departTie:"+departTime);
		adminPrototype.insertFlightTempClass(t1.FLIGHT_NUMBER,t1.FLIGHT_SOURCE,departTime).then((result)=>{
		    console.log("temp callsssssssssssssss"+result);
			/////
			adminPrototype.insertFlightTemp(t1.FLIGHT_NUMBER,t1.FLIGHT_CLASS,departTime,t1.No_Of_Seats,t1.price).then((result)=>{

				   ////
					 
				   adminPrototype.deletetemp(t1.FLIGHT_NUMBER,departTime).then((result)=>{
					
					adminPrototype.deletetemp1(t1.FLIGHT_NUMBER,departTime).then((result)=>{

				   
	      
						//	console.log(result);
							res.render('admin.ejs',{adminRequests:adminRequests});
						 }).catch((error)=>{
							 console.log("insetsssssssssssssssssssssssss failed");
							res.redirect('/');
						 });
				   
	      
				//	console.log(result);
				//res.render('admin.ejs',{adminRequests:adminRequests});
				 }).catch((error)=>{

					 console.log("inset failedkkkkkkkkkkkk");
					 console.log(error);
					res.redirect('/');
				 });
				   

				   //////////////////////////////////////////////////////////




	      
				console.log(result);
			//	res.render('admin.ejs',{adminRequests:adminRequests});
			 }).catch((error)=>{
				 console.log("inssssssssssssssssssssssssssssssssssssssssssssssssset failed");
				res.redirect('/');
			 });
			///


			// console.log(result);
			// res.render('admin.ejs',{adminRequests:adminRequests});
		 }).catch((error)=>{
			 console.log("inssssssssssssssssskkkkkkkkkkkkkt failed");
			 console.log(error);
			res.redirect('/');
		 });
		
		
	 }).catch((error)=>{
		 console.log(error);
		console.log("acceptt faileds");
		res.redirect('/');
	 });
	 
});//Flight Number	Source	Destination	Time	Stay
var Length;
app.get('/admin_type=req',(req,res)=>{
	
	adminPrototype.getRequests("sdf").then((result)=>{
	//	console.log(result);
     Length=result.length+1;
	for (let i = 0; i < result.length+1; i++) {
		
		adminRequests.pop();
	}
		for (let i = 0; i < result.length; i++) {
			var adminReqObj=new adminRequest(result[i].FLIGHT_NUMBER,result[i].FLIGHT_SOURCE,result[i].FLIGHT_DESTINATION,result[i].DEPARTURE_TIME)	;
			adminRequests.push(adminReqObj);
			
		}
		res.render('admin.ejs',{adminRequests:adminRequests});
			}).catch((error)=>{
				res.render('admin.ejs',{adminRequests:adminRequests});
			});

});
app.get('/backToAdmin',(req,res)=>{
	
	
		res.redirect('/admin_type=req');
			

});
var flightAdded=[];
function allFlight(FLIGHT_NUMBER,FLIGHT_CLASS,DEPARTURE_TIME,FLIGHT_SOURCE,FLIGHT_DESTINATION,No_Of_Seats)
{

this.FLIGHT_NUMBER=FLIGHT_NUMBER;
this.FLIGHT_CLASS=FLIGHT_CLASS;
this.DEPARTURE_TIME=DEPARTURE_TIME;
this.FLIGHT_SOURCE=FLIGHT_SOURCE;
this.FLIGHT_DESTINATION=FLIGHT_DESTINATION;
this.No_Of_Seats=No_Of_Seats;

}
var flightAdded=[];
app.get('/AdminFlightDataBase',(req,res)=>{
	
	adminPrototype.getAllFlights("sdf").then((result)=>{

		   for (let i = 0; i < result.length+1; i++) {
		
			flightAdded.pop();
		    }
			for (let i = 0; i < result.length; i++) {
				var flights=new allFlight(result[i].FLIGHT_NUMBER,result[i].FLIGHT_CLASS,result[i].DEPARTURE_TIME,result[i].FLIGHT_SOURCE,result[i].FLIGHT_DESTINATION,result[i].No_Of_Seats)	;
				flightAdded.push(flights);
				
			}
           

		console.log(result[0].FLIGHT_NUMBER);
		res.render('adminFlightDataBase.ejs',{flightAdded:flightAdded});
				}).catch((error)=>{
					console.log(error);

					res.render('adminFlightDataBase.ejs',{flightAdded:flightAdded});
				});
	

		

});
app.listen(3006,()=>{
console.log('Server listening on port 3006');

});
