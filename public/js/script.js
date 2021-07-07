$(document).ready(function () {


  
  $('#textInput').on('keypress', function (e) {

      if (e.which === 13) {
          var texto = $('#textInput').val();
          var x, i;
          x = document.querySelectorAll("p");
          for (i = 0; i < x.length; i++) {
            console.log(x[i].innerHTML);
          }
          if(x[x.length -1].innerHTML=="Bien, ¿cuál es tu opinión sobre el Summer Camp y/o sobre la recomendación que te hicimos?"){
            const opinion = texto;
            var carrera = x[x.length -2].innerHTML;
            //var grado = x[x.length -4].innerHTML;
            
            

            Translate(opinion, carrera);
            //getSentiment(opinion);
          }
          if (texto) {
              insertarMensajeUsuario(texto)
              $('#textInput').val('')
              scrollMessages()
              enviarMensajeAssistant({}, texto, sessionId)
          }
      }
  })
  
})


function mensajeInicial() {
  $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/getSession',
      success: function (data) {
          sessionId = data
          enviarMensajeAssistant({}, '', sessionId)
      }
  })
}

function enviarMensajeAssistant(context, text, sessionId) {
  var data = {
      context,
      text,
      sessionId
  }
  $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/message',
      success: function (data) {
          console.log(data);
          var message = data.text
          if(data.nombre != '' && data.grado!=''){
            nombre = data.nombre;
            grado = data.grado;
          }
          insertarMensajeBot(message)
      }
  })
}

function insertarMensajeUsuario(text) {
  var mensaje = `
  <div class="from-user">
    <div class="message-inner">
        <p>${text}</p>
    </div>
  </div>  
  `
  $('#chat').append(mensaje)
  scrollMessages()
}

function insertarMensajeBot(text) {
    var mensaje = `
    <div class="from-watson">
    <div class="message-inner">
        <p>${text}</p>
    </div>
    </div>
    `
  $('#chat').append(mensaje)
  scrollMessages()
}

function scrollMessages() {
  var div = $("#chat")
  div.scrollTop(div.prop('scrollHeight'))
}

function saveOpinion(nombre, grado , carrera, opinion, tonos, sentimiento, emocion){
  var data = {
    nombre,
    grado,
    carrera,
    opinion,
    tonos, 
    sentimiento,
    emocion
  }
  $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/add',
      success: function (data) {

      }
  })
}

function enviarTextoToneAnalizer(text, dato, carrera){
  var data ={
    text
  }
  $.ajax({
    type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/ToneAnalyzer',
      success: function (respt) { 
          saveOpinion(nombre, grado, carrera, dato, respt, sentiment, emotion)
      }
  })
}

function Translate(text, carrera){
  var data ={
    text
  }
  $.ajax({
    type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/Translator',
      success: function (respt) {
          getSentiment(respt);
          setTimeout(function(){ enviarTextoToneAnalizer(respt, text, carrera); }, 3000);
              
      }
  })
}

function getSentiment(text){
  var data ={
    text
  }
  $.ajax({
    type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/NaturalLanguage',
      success: function (respt) {
          sentiment = respt.sentiment.document;
          emotion = respt.emotion.document.emotion;
      }
  })
}


