  /*
   * Controlador
   */
  var Controlador = function (modelo) {
    this.modelo = modelo;
  };


  Controlador.prototype = {
    agregarPregunta: function (pregunta, respuestas) {
      if (typeof (pregunta) !== 'string' || pregunta.trim().length == 0) {
        alert('La pregunta no debe estar vacia!!');
        return;
      }
      if (respuestas && Array.isArray(respuestas) && respuestas.length > 0) {
        const repsFil = respuestas.filter(resp => resp.textoRespuesta.trim().length > 0);
        if (repsFil.length > 0) {
          this.modelo.agregarPregunta(pregunta, repsFil);
        } else {
          alert('La pregunta debe tener Respuesta!!');
        }

      } else {
        alert('La pregunta debe tener Respuesta!!');
      }
    },
    borrarPregunta: function (id) {
      this.modelo.borrarPregunta(Number(id));
    },
    borrarTodasPreguntas: function () {
      this.modelo.borrarTodasPreguntas();
    },
    editarPregunta: function (idPregunta, pregunta, respuestas) {
      if (typeof (pregunta) !== 'string' || pregunta.trim().length == 0) {
        alert('La pregunta no debe estar vacia');
        return;
      }
      this.modelo.editarPregunta(Number(idPregunta), pregunta, respuestas);
    },
    agregarVoto: function (idPregunta, textoRespuesta) {
      if (idPregunta && textoRespuesta) {
        this.modelo.sumarVotoRespuesta(Number(idPregunta), textoRespuesta);
      }
    }
  };