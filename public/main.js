$(document).ready(function(){
	// var socket = io()
	var socket = io.connect('http://localhost:8080');

	var audio1 = document.getElementById('audio1')
	var audio2= document.getElementById('audio2')
	var audio3 = document.getElementById('audio3')
	var audio4 = document.getElementById('audio4')
	var audio5 = document.getElementById('audio5')
	var audio6 = document.getElementById('audio6')
	var audios = [audio1, audio2, audio3, audio4]

	var systemSoundsNumberTrack = [] //[0,1,2,3]
	var systemSoudsTrack = []


	function customPlay(audio, callback) {
		var indexOfAudio = audios.indexOf(audio)
		// send back to board
		if(indexOfAudio != -1) {
			socket.emit('soundfromserver',indexOfAudio)
            audio.play()
            if(callback != null) {
                audio.onended = callback;
            }
		}
	}

	function queue_sounds(sounds){
		var index = 0;
		function recursive_play()
		{
			if(index+1 === sounds.length)
			{
				// console.log("last sound : ", sounds[index])
				customPlay(sounds[index],null);
			}
			else
			{
				// console.log("sound : ", sounds[index])
				if(sounds[index] !== 'undefined'){
					customPlay(sounds[index],function(){index++; recursive_play();});
				} else {
					return
				}

			}
		}

		recursive_play();
	}

	socket.on('START', function(serverNumberTrack){
		console.log("👻 serverNumberTrack : ", serverNumberTrack)
		// systemGenerator()
		// serverNumberTrack : [0,1,2,3]
		for (i in serverNumberTrack){
			var soudDom = audios[serverNumberTrack[i]]
			systemSoudsTrack.push(soudDom)
		}
		systemSoundsNumberTrack = serverNumberTrack
		queue_sounds(systemSoudsTrack)
	})

	socket.on('level', function(level){
		console.log("current level : ", level)
		document.getElementById('levelNumber').innerHTML = level
	})

	// socket.on('data', function(data){
	// 	console.log('data from server',data)
	// });

	socket.on('SOUND0', function(){
		audio1.play()
	})
	socket.on('SOUND1', function(){
		audio2.play()
	})
	socket.on('SOUND2', function(){
		audio3.play()
	})
	socket.on('SOUND3', function(){
		audio4.play()
	})

	socket.on('ANSWER', function(data){

		var integerUserAnswer = []
		console.log("answer array: ", data)
		for (i in data){
			integerUserAnswer.push(Number(data[i]))
		}

		console.log('answer from user => ',integerUserAnswer)
		console.log('order from system => ',systemSoundsNumberTrack)

		var isCorrectAnswer = _.isEqual(integerUserAnswer, systemSoundsNumberTrack)
		console.log("is user answer correct : ",isCorrectAnswer)

		//if right
		if(isCorrectAnswer) {
			// play correct sound
			audio5.play()
			systemSoundsNumberTrack = []
			systemSoudsTrack = []
			// stay in the same level
			// auto play
			socket.emit('autoplay', { answer: 'correct' });
		} else {
			// play wrong sound
			audio6.play()
			systemSoundsNumberTrack = []
			systemSoudsTrack = []
			// go to next level
			// auto play
			socket.emit('autoplay', { answer: 'wrong' });
		}
	});

    /* Sound Player UI */

	var audioArray = $( "audio" ).toArray()

	audioArray.forEach(function(audio) {

		audio.onplay = function() {
			var id = audio.id
			var audioDiv = document.getElementById(id+'Content')
			audioDiv.classList.toggle('show')
            setTimeout(function() {
				audioDiv.classList.toggle('show');
			},700)
		}

	})

})