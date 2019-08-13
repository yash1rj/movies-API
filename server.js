const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/my-quotes', (err, client) => {
	if(err) {
		return console.log(err);
	}
	
	var db = client.db('my-quotes');
	
	app.listen(3000, () => {
		console.log("Server started at port 3000...");
	});
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
app.get("/", (req, res) => {
	// res.send("Hello world!");
	res.sendFile(__dirname + '/index.html')
});
*/

app.get('/', (req, res) => {
	db.collection('quotes').find().toArray((err, results) => {
		if(err) {
			return console.log(err);
		}
		
		console.log(results)
		// send HTML file populated with quotes here
		res.render('index.ejs', {quotes: result});
	});
});

app.post('/quotes', (req, res) => {
	// console.log(req.body);
	db.collection('quotes').save(req.body, (err, result) => {
		if(err) {
			return console.log(err);
		}

		console.log('saved to database')
		res.redirect('/')
	});
});
