const express = require('express')
const say = require('say')
const open = require('open')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = process.env.port || 3000

app.use(express.static(__dirname + '/interface'))

io.on('connection', (socket) => {
	console.log('a user connected')
	socket.on('said', (transcript) => {
        console.log(transcript)
		processCommand(socket, transcript)
	})
})

const processCommand = (socket, transcript) => {
	const commands = require('./config.json').commands
	if (commands[transcript]) {
		// TODO: use object.keys + contains
		const cmd = commands[transcript]
		if (cmd.say && cmd.say != '') {
			socket.emit('speak', cmd.say)
        }
        
        if (cmd.broadcast && cmd.broadcast != '') {
			io.sockets.emit('speak', cmd.broadcast)
		}

		if (cmd.open && cmd.open != '') {
			socket.emit('open', cmd.open)
		}
	}
}

http.listen(port, () => {
	console.log(`listening on *:${port}`)
})
