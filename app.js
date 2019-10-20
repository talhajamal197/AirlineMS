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

res.render('loginSignup_copy.ejs');
});
app.get('/searchFlights',(req,res)=>{
	console.log(req.query.to);
res.render('test_search.ejs');

});
app.listen(3000,()=>{
console.log('Server listening on port 3000');

});
