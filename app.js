const exp=require('express');
const app=exp();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(exp.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
console.log("at root route");
res.render('home_copy.ejs');
});
app.get('/login',(req,res)=>{
console.log('On login route');
res.render('loginSignup_copy.ejs');
});





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



app.get('/purchaseHistory',(req,res)=>{
	
res.render('purchaseHistory.ejs');
});
app.listen(3000,()=>{
console.log('Server listening on port 3000');

});
