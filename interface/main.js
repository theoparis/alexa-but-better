const socket=io.connect(window.location.href)
die=()=>window.close()
window.addEventListener('beforeunload',()=>socket.emit('die'))
const speechToText=window.speechRecognition||window.webkitSpeechRecognition
const speechApi=new speechToText()
speechApi.continuous=false;
speechApi.interimResult=false;
speechApi.onresult=(event)=>{socket.emit('said',event.results[event.resultIndex][0].transcript)}
speechApi.onend=()=>{speechApi.start()}
speechApi.start()