  /*
   * Controlador
   */
  var Controlador = function (modelo) {
    this.modelo = modelo;
  };

  Controlador.prototype = {
    agregarPregunta: function (pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
    },

    borrarPregunta: function (id) {
      this.modelo.borrarPregunta(id);
    },

    borrarTodo: function () {
      this.modelo.borrarTodo();
    },

    editarPregunta: function (id, nuevoTextoPregunta) {
      if (nuevoTextoPregunta) {
        this.modelo.editarPregunta(id, nuevoTextoPregunta);
      }
    },

    agregarVotos: function (nombrePregunta, respuestaSeleccionada) {
      this.modelo.agregarVotos(nombrePregunta, respuestaSeleccionada);
    }
  };