////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

var express = require('express')
var app = express();
var http = require('http');
var path = require('path')
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

/*  - serial port - */
var SerialPort = require('serialport')

const parsers = SerialPort.parsers

const parser = new parsers.Readline({
	delimiter: '\r\n'
})

var port = new SerialPort('/dev/cu.usbmodem1411', {
	baudRate: 9600,
	dataBits: 8,
	parity: 'none',
	stopBits:1,
	flowControl: false
})

/*-------------------------------------------------------*/

/* - socket.io - */
var server = http.createServer(app);

var io = require('socket.io').listen(server);

port.pipe(parser)

io.sockets.on('connection', function (socket) {
	console.log("socket io connected")
	socket.on('autoplay', function (data) {
		console.log(data.answer);
		setTimeout(function(){

			if( data.answer == 'correct' ){
				currentLevel +=1
			} else {
				if(currentLevel > 4)
					currentLevel -= 1
			}

			soundsCombination=[]
			var numbersGeneratedOnServer = systemGenerator()
			io.emit("START", numbersGeneratedOnServer)
			io.emit('level', currentLevel)
			sendNumbersToBoard(numbersGeneratedOnServer)
		},1500)

	});
});

port.on('open', function(data){
	console.log('NodeJS is listening to port');
})

// ** sending data to front end

var soundsCombination = []

function randomNumber(){
	var x = Math.floor((Math.random() * 4));
	// console.log("x => ", x); //[0,1,2,3]
	return x
}

var currentLevel = 4
function systemGenerator(){
	var serverNumberTrack = []
	// this controls level
	for (var i=0; i < currentLevel; i++){
		var soundNumber = randomNumber() //[0,1,2,3]
		// console.log("soundNumber => ",soundNumber)
		serverNumberTrack.push(soundNumber)
	}
	return serverNumberTrack
}

function delay(time) {
	var d1 = new Date();
	var d2 = new Date();
	while (d2.valueOf() < d1.valueOf() + time) {
		d2 = new Date();
	}
}

function sendNumbersToBoard(numbers) {
	for(i in numbers){
		console.log("i >>> ", numbers[i])
		switch( numbers[i] )
		{
			case 0:
				port.write("1");
				// delay(500)
				break;
			case 1:
				port.write("2");
				// delay(500)
				break;
			case 2:
				port.write("3");
				// delay(500)
				break;
			case 3:
				port.write("4");
				// delay(500)
				break;
		}
	}
}
parser.on('data', function(data){
	console.log('Received data from port:', data)
	// io.emit('data', data)

	switch (data){
		case 'START':
			// soundsCombination=[]
            currentLevel = 4
			var numbersGeneratedOnServer = systemGenerator()
			io.emit("START", numbersGeneratedOnServer)
			io.emit("level", currentLevel)
			sendNumbersToBoard(numbersGeneratedOnServer)
			break;
		case 'ENTER':
			// soundsCombination=[]
			console.log("soundsCombination => ",soundsCombination)
			io.emit('ANSWER', soundsCombination)
			break;
		case '0':
			io.emit('SOUND0')
			console.log("data from button0 =>",data)
			soundsCombination.push(0)
			break;
		case '1':
			io.emit('SOUND1')
			soundsCombination.push(1)
			break;
		case '2':
			io.emit('SOUND2')
			soundsCombination.push(2)
			break;
		case '3':
			io.emit('SOUND3')
			soundsCombination.push(3)
			break;
	}

})


/* -------------------------------------------------------*/

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

require('./routes/index.js')(app)


server.listen(8080, function(){
	console.log("Listening on 8080")
});

module.exports = app

//////////////////////////////////////////
//////////////////////////////////////////
