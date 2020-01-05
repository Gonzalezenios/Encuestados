/*
 * Vista administrador
 */
var VistaAdministrador = function (modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaBorrada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.respuestaAgregada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEditada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.todoBorrado.suscribir(function () {
    contexto.reconstruirLista();
  });
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function () {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function (pregunta) {
    let contexto = this;
    let nuevoItem;
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    nuevoItem = $('<li class="list-group-item"></li>');
    nuevoItem.attr('id', pregunta.id);
    nuevoItem.attr('texto', pregunta.textoPregunta);
    let interiorItem = $('.d-flex');
    let titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function (resp) {
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function () {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i = 0; i < preguntas.length; ++i) {
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function () {
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function () {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function () {
        //completar
        respuestas.push({ textoRespuesta: $(this).val(), cantidadRespuestas: 0 });
      });
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function () {
      const id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });

    e.borrarTodo.click(function () {
      contexto.controlador.borrarTodasPreguntas();
    });

    e.botonEditarPregunta.click(function () {
      const id = parseInt($('.list-group-item.active').attr('id'));
      const pregunta = contexto.modelo.buscarPregunta(id);
      contexto.limpiarFormulario();
      // Seteando valores en el formulario
      e.pregunta.attr('id', id);
      e.pregunta.val(pregunta.textoPregunta);
      const $template = $('#optionTemplate');
      pregunta.cantidadPorRespuesta.forEach((resp, index) => {
        if (index === 0) {
          const $primerInput = $('[name="option[]"]').first();
          $primerInput.val(resp.textoRespuesta);
          $primerInput.attr('id', "respuesta" + resp.cantRespuestas);
        } else {
          const $clone = $template
            .clone()
            .removeClass('hide')
            .attr('id', "respuesta" + resp.cantRespuestas)
            .insertBefore($template);
          const $option = $clone.find('[name="option[]"]');
          $option.val(resp.textoRespuesta);
          // agregado de nuevo campo al formulario
          $('#localStorageForm').formValidation('addField', $option);
        }
      });

      // Cambio el boton
      e.botonAgregarPregunta.addClass('hide');
      e.botonGuardarEditarPregunta.removeClass('hide');
    });

    e.botonGuardarEditarPregunta.click(function () {
      const nombre = e.pregunta.val();
      const idPregunta = parseInt(e.pregunta.attr('id'));
      const respuestas = [];

      $('[name="option[]"]:visible').each(function () {
        //completar
        respuestas.push({textoRespuesta: $(this).val(), cantidadRespuestas: 0 });
      });
      contexto.limpiarFormulario();
      contexto.controlador.editarPregunta(idPregunta, nombre, respuestas);
      // Cambio el boton
      e.botonAgregarPregunta.removeClass('hide');
      e.botonGuardarEditarPregunta.addClass('hide');
    });

  },

  limpiarFormulario: function () {
    $('.form-group.answer.has-feedback.has-success').remove();
    $('#localStorageForm').find('.botonAgregarRespuesta').removeAttr('disabled');
  }
};