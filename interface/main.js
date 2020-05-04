const socket = io.connect()
die = () => window.close()
window.addEventListener('beforeunload', () => socket.emit('die'))
const speechToText = window.SpeechRecognition || window.webkitSpeechRecognition
const speechApi = new speechToText()

speechApi.continuous = false
speechApi.interimResult = false
speechApi.onresult = (event) => {
	socket.emit('said', event.results[event.resultIndex][0].transcript)
}

function openInNewTab(url) {
	var win = window.open(url, '_blank')
	if(win) win.focus()
}

socket.on('open', (url) => {
	openInNewTab(url)
})

socket.on('speak', (text) => {
	// get all voices that browser offers
	var available_voices = window.speechSynthesis.getVoices()

	// this will hold an english voice
	var english_voice = ''

	// find voice by language locale "en-US"
	// if not then select the first voice
	for (var i = 0; i < available_voices.length; i++) {
		if (available_voices[i].lang === 'en-US') {
			english_voice = available_voices[i]
			break
		}
	}
	if (english_voice === '') english_voice = available_voices[0]

	let utter = new SpeechSynthesisUtterance(text)
	utter.rate = 1
	utter.pitch = 0.5
	utter.voice = english_voice
	// event after text has been spoken
	utter.onend = function() {
		console.log('Speech has finished')
	}

	window.speechSynthesis.speak(utter)
})

speechApi.onerror = (event) => {
	console.error(event.error)
}

speechApi.onend = () => {
	speechApi.start()
}
speechApi.start()
