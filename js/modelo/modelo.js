/*
 * Modelo
 */
var Modelo = function(){
  this.preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
  this.ultimoId = 0;

  // Inicialización de eventos //
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.todoBorrado = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntaVotada = new Evento(this);
};

Modelo.prototype = {
  obtenerUltimoId: function(){        // Se obtiene el id más grande asignado a una pregunta //
    var ultimoId = 0;
    for (let i = 0; i < this.preguntas.length; i++){
       if(this.preguntas[i].id > ultimoId){
         ultimoId = this.preguntas[i].id;
       }
    }
      return ultimoId;
  },

  agregarPregunta: function(nombre, respuestas) {       // Se agrega una pregunta dado un nombre y sus respuestas //
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function(id){
    this.preguntas = this.preguntas.filter(function(pregunta){
      return pregunta.id !== id;
    }); 
    this.guardar();
    this.preguntaBorrada.notificar();
  },

  borrarTodo: function(){
    this.preguntas = [];
    this.guardar();
    this.todoBorrado.notificar();
  },


  editarPregunta: function(id, nuevoTextoPregunta){
   var preguntaAEditar = this.preguntas.find(function(pregunta){
        return pregunta.id === id;
   });
   
   if(preguntaAEditar){
    preguntaAEditar.textoPregunta = nuevoTextoPregunta;
    this.guardar();
    this.preguntaEditada.notificar();
   }
  },

  agregarVotos: function(nombrePregunta, respuestaSeleccionada){
    this.preguntas.forEach(function(pregunta){
      if(pregunta.textoPregunta  === nombrePregunta){
        pregunta.cantidadPorRespuesta.forEach(function(respuesta){
          if(respuesta.textoRespuesta === respuestaSeleccionada){
            respuesta.cantidad +=1;
          }
        });
      }
    }); 
    this.guardar();
    this.preguntaVotada.notificar();
  },

  // Se guardan las preguntas //
  guardar: function(){
    localStorage.setItem('preguntas', JSON.stringify(modelo.preguntas));
  },
};