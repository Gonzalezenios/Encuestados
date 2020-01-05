/*
 * Modelo
 */
const storage = window.localStorage;

var Modelo = function () {
  const preguntas = storage.getItem('preguntas');
  this.preguntas = [];
  if (preguntas) {
    this.preguntas = JSON.parse(preguntas);
  }

  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.respuestaAgregada = new Evento(this);
  this.votoSumado = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.todoBorrado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function () {
    let max = 0;
    this.preguntas.forEach(function (preg) {
      if (preg.id > max) {
        max = preg.id;
      }
    });
    return max;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function (nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {
      'textoPregunta': nombre,
      'id': id,
      'cantidadPorRespuesta': respuestas
    };
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //Borra Pregunta
  borrarPregunta: function (id) {
    let pos = -1;
    this.preguntas.forEach(function (preg, i) {
      if (preg.id === id) {
        pos = i;
      }
    });
    if (pos >= 0) {
      this.preguntas.splice(pos, 1);
      this.guardar();
      this.preguntaBorrada.notificar();
    }
  },

  //Agrega respuesta
  agregarRespuesta: function (idPregunta, textoRespuesta) {
    const nuevaRespuesta = {
      'textoRespuesta': textoRespuesta,
      'cantidadRespuestas': 0
    };
    const pregunta = this.buscarPregunta(idPregunta);
    pregunta.cantidadPorRespuesta.push(nuevaRespuesta);
    this.guardar();
    this.respuestaAgregada.notificar();
  },

  //Suma voto
  sumarVotoRespuesta: function (idPregunta, textoRespuesta) {
    const respuesta = this.buscarRespuesta(idPregunta, textoRespuesta);
    respuesta.cantidadRespuestas += 1;
    this.guardar();
    this.votoSumado.notificar();
  },

  //Editar preguntas
  editarPregunta: function (idPregunta, nombre, respuestas) {
    const pregunta = this.buscarPregunta(idPregunta);
    pregunta.textoPregunta = nombre;
    pregunta.cantidadPorRespuesta = respuestas;
    this.guardar();
    this.preguntaEditada.notificar();
  },

  buscarPregunta: function (idPregunta) {
    const pregunta = this.preguntas.find(preg => preg.id === idPregunta);
    return pregunta;
  },
  buscarRespuesta: function (idPregunta, textoRespuesta) {
    const pregunta = this.buscarPregunta(idPregunta);
    const respuesta = pregunta.cantidadPorRespuesta.find(resp => resp.textoRespuesta === textoRespuesta);
    return respuesta;
  },

  //Borrar todo
  borrarTodasPreguntas: function () {
    this.preguntas = [];
    this.guardar();
    this.todoBorrado.notificar();
  },

  //se guardan las preguntas
  guardar: function () {
    storage.setItem('preguntas', JSON.stringify(this.preguntas));
  },
};