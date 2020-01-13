/*
 * Vista usuario
 */
var VistaUsuario = function (modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntaAgregada.suscribir(function () {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaBorrada.suscribir(function () {
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
  });

  this.modelo.preguntaEditada.suscribir(function () {
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
  });

  this.modelo.todoBorrado.suscribir(function () {
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
  });

  this.modelo.preguntaVotada.suscribir(function () {
    contexto.reconstruirGrafico();
  });
};

VistaUsuario.prototype = {
  // Muestra la lista por pantalla y agrega el manejo del botón agregar //
  inicializar: function () {
    this.reconstruirLista();
    var elementos = this.elementos;
    var contexto = this;

    elementos.botonAgregar.click(function () {
      contexto.agregarVotos();
    });

    this.reconstruirGrafico();
  },

  // Reconstrucción de los graficos de torta //
  reconstruirGrafico: function () {
    var contexto = this;
    // Obtiene las preguntas del local storage //
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function (clave) {
      var listaParaGrafico = [
        [clave.textoPregunta, 'Cantidad']
      ];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach(function (elemento) {
        listaParaGrafico.push([elemento.textoRespuesta, elemento.cantidad]);
      });
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    });
  },

  reconstruirLista: function () {
    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    var preguntas = this.modelo.preguntas;

    preguntas.forEach(function (clave) {
      var nuevoItem = $('<div/>', { // Se construye un <div> donde se va a mostrar el nombre de la pregunta y sus respuestas //
        text: clave.textoPregunta,
        value: clave.textoPregunta,
        id: clave.id
      });
      listaPreguntas.append(nuevoItem);

      var respuestas = clave.cantidadPorRespuesta;
      contexto.mostrarRespuestas(listaPreguntas, respuestas, clave);
    });
  },

  // Muestra respuestas //
  mostrarRespuestas: function (listaPreguntas, respuestas, clave) {
    respuestas.forEach(function (elemento) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: elemento.textoRespuesta,
        name: clave.id,
      }));
      listaPreguntas.append($("<label>", {
        for: elemento.textoRespuesta,
        text: elemento.textoRespuesta
      }));
    });
  },

  agregarVotos: function () {
    var contexto = this;
    if ($('#nombreUsuario').val()) { // Se chequea que el campo del nombre del votante no esté vacío // 
      $('#preguntas').find('div').each(function () {
        var nombrePregunta = $(this).attr('value');
        var id = $(this).attr('id');
        var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
        $('input[name=' + id + ']').prop('checked', false);
        contexto.controlador.agregarVotos(nombrePregunta, respuestaSeleccionada);
      });
    } else {
      alert('Debe ingresar el nombre del votante!');
      return;
    }
  },

  dibujarGrafico: function (nombre, respuestas) {
    var seVotoAlgunaVez = false;
    for (var i = 1; i < respuestas.length; ++i) {
      if (respuestas[i][1] > 0) {
        seVotoAlgunaVez = true;
      }
    }
    var contexto = this;
    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(respuestas);

      var options = {
        title: nombre,
        is3D: true,
      };
      var ubicacionGraficos = contexto.elementos.graficosDeTorta;
      var id = (nombre.replace(/\W/g, '')).split(' ').join('') + '_grafico';
      if ($('#' + id).length) {
        $('#' + id).remove();
      }
      var div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      var chart = new google.visualization.PieChart(div);
      if (seVotoAlgunaVez) {
        chart.draw(data, options);
      }
    }
  },
};