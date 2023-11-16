"use strict";

import * as dialogo from "/js/componentes/dialogo.mjs";
import * as paginadorAbecedario from "/js/componentes/paginadorAbecedario.mjs";
import * as ventanaModal from "/js/componentes/ventanaModal.mjs";

// Páginas
import * as frmEditarPelicula from "/paginas/peliculas/editar.mjs";

// Servicios
import * as peliculas from "/js/servicios/peliculas.mjs";

export { init };

const plantilla = {
    '<>': 'tr',
    'html': [
        { '<>': 'th', 'scope': 'row', 'html': '${id}' },
        { '<>': 'td', 'html': '${titulo}' },
        { '<>': 'td', 'html': '${genero}' },
        { '<>': 'td', 'html': '${ano}' },
        { '<>': 'td', 'html': '${director}' },
        { '<>': 'td', 'html': '${descripcion}' },
        { '<>': 'td', 'html': '${precio}' },
        { '<>': 'td', 'html': '${descuento}' },
        { '<>': 'td', 'html': '<button name="btEditar" class="btn btn-info bi bi-pencil-fill" value="${id}"></button>' },
        { '<>': 'td', 'html': '<button name="btEliminar" class="btn btn-danger bi bi-trash-fill" value="${id}"></button>' }
    ]
};
/**
 * Filtro de búsqueda
 */
let filtroBusqueda = '';

let tablaPeliculas = null;

function init() {
    // Genera el paginador
    paginadorAbecedario.generarPaginador();

    // Escucha del evento de cambio de letra en el paginador
    document.getElementById('paginador').addEventListener('click', function(event) {
        if (event.target.tagName === 'A' && event.target.hasAttribute('data-letra')) { 
            cargarPeliculasPorLetra(event.target.getAttribute('data-letra'));
        }
    });

    // Carga inicial de las películas por orden alfabético
    cargarPeliculasAlfabeticamente();

  // MODIFICADO Inicializa los eventos
  $('#btBuscarSelect').on("click", () => cargarPeliculasSelect());
  $('#btOrdenar').on("click", () => ordenarPeliculas());
  $('#btOrdenarDesc').on("click", () => ordenarPeliculasDesc());
  $("#btAlfabeticamenteAsc").on("click", () => cargarPeliculasAlfabeticamente());
  $("#btAlfabeticamenteDesc").on("click", () => cargarPeliculasAlfabeticamenteDesc());
  $("#btOrdenarEstrenos").on("click", () => cargarEstrenos());
  $("#btOrdenarClasicos").on("click", () => cargarClasicos());
  $("#btBuscar").on("click", onBuscarClick);
  $("#btAnadir").on("click", onAnadirClick);
  $('#tablaPeliculas').on('click', '[name=btEliminar]', onEliminarClick);
  $('#tablaPeliculas').on('click', '[name=btEditar]', onEditarClick); // MODIFICADO
}

function mostrarPeliculas(peliculas) {
    tablaPeliculas = peliculas;
    $("#tablaPeliculas").empty();
    $("#tablaPeliculas").json2html(peliculas, plantilla);
}

//------------------------------------------------------------------------------------------
// Gestores de eventos
//------------------------------------------------------------------------------------------
/** 
 * Gestiona el evento click en botón buscar.
 */
function onBuscarClick(evento) {
    // Obtengo la cadena de texto en el campo
    const iFiltro = document.getElementById("iFiltro");
    filtroBusqueda = iFiltro.value;

    // Muestra todos las peliculas
    cargarPeliculas();
}

/**
 * Gestiona el evento click en botón añadir
 * 
 * @param {*} evento 
 */
function onAnadirClick(evento) {
    crearPelicula();    
  }


  function onEliminarClick(evento) {
    
    // Obtengo el botón sobre el que se hecho click
    const boton = evento.target;
    
    // Obtengo el identificador del contacto a eliminar
    const id = boton.value;

    // Solicito confirmación del usuario
    dialogo.mostrarPreguntaSiNo(
      "¿Está seguro de que desea eliminar la película seleccionada?", 
      () => {
        peliculas.borrarPelicula(id, 
          () => {
            $(evento.target).closest('tr').remove();
            for(let n = 1,fin = false;n < tablaPeliculas.length && ! fin;n++) {
                if(tablaPeliculas[n].id == id) {
                  tablaPeliculas.splice(n, n); // método para eliminar elementos de un array
                  fin = true;
                }
              }
          }, 
          () => {
            console.error("Error borrando la película");
          }
        );
      }
    );
}

function onEditarClick(evento) {
    // En primer lugar necesita conocer el índice de que se trata
    const indice = $(evento.target).closest("tr").index();

    // Ahora obtengo el objeto
    const pelicula = tablaPeliculas[indice];

    // Edita la película
    editarPelicula(pelicula);
}

function ordenarPeliculas() {
    const campoOrder = document.getElementById('selectOrder').value;
    peliculas.ordenarPorCampo(
        campoOrder,
        peliculas => mostrarPeliculas(peliculas),
        error => mostrarMensaje("Error al ordenar las películas")
    );
}

function ordenarPeliculasDesc() {
    const campoOrder = document.getElementById('selectOrder').value;
    peliculas.ordenarPorCampoDesc(
        campoOrder,
        peliculas => mostrarPeliculas(peliculas),
        error => mostrarMensaje("Error al ordenar las películas")
    );
}

function cargarPeliculasSelect(numeroPagina = 1) {
    console.log("Cargar películas por búsqueda y por select");
    const campoOrder = document.getElementById('selectOrder').value;
    const iFiltroSelect = document.getElementById('iFiltroSelect').value;

    // Muestra las películas según el filtro de búsqueda y el criterio de ordenamiento.
    peliculas.cargarBusquedaSelect(
        campoOrder,
        iFiltroSelect,
        peliculas => mostrarPeliculas(peliculas),
        (error) => { console.error("Error al buscar las películas:", error); },
        numeroPagina
    );
}


function cargarClasicos() {
    peliculas.getClasicos(
        peliculas => mostrarPeliculas(peliculas),
        (error) => {
            mostrarMensaje("Error al cargar las películas")
        }
    )
}

function cargarEstrenos(numeroPagina = 1) {
    peliculas.getEstrenos(
        peliculas => mostrarPeliculas(peliculas),
        (error) => {
            mostrarMensaje("Error al cargar las películas");
        }
    )
}


function cargarPeliculasAlfabeticamente(numeroPagina = 1) {
    peliculas.getAlfabeticamente(
        peliculas => mostrarPeliculas(peliculas),
        (error) => {
            mostrarMensaje('Error al cargar las películas');
        },
        numeroPagina
    ); 
}

function cargarPeliculasAlfabeticamenteDesc(numeroPagina = 1) {
    peliculas.getAlfabeticamenteDesc(
        peliculas => mostrarPeliculas(peliculas),
        (error) => {
            mostrarMensaje('Error al cargar las películas en orden descendente');
        },
        numeroPagina
    ); 
}

function cargarPeliculasPorLetra(letra) {
    peliculas.getPorInicial(
        letra,
        peliculas => mostrarPeliculas(peliculas),
        error => {
            mostrarMensaje('Error al cargar las películas por letra ' + letra);
        }
    );
}

function refrescarPeliculas() {  
    console.log("Refrescar peliculas");
    cargarPeliculasAlfabeticamente();
}

/**
 * Carga las películas desde el servidor y las muestra en la interfaz.
 * 
 * @param {number} numeroPagina La página de resultados a cargar.
 */
function cargarPeliculas(numeroPagina = 1) {
    console.log("Cargar películas");

    if (filtroBusqueda.length == 0) {
        // Muestra todas las películas
        peliculas.getAlfabeticamente(
            peliculas => mostrarPeliculas(peliculas),
            (error) => { console.error("Error al cargar las películas:", error); },
            numeroPagina
        );
    } else {
        // Muestra las películas según el filtro de búsqueda
        peliculas.buscarPeliculas(
            filtroBusqueda,
            peliculas => mostrarPeliculas(peliculas),
            (error) => { console.error("Error al buscar las películas:", error); },
            numeroPagina
        );
    }
}


function onPeliculaModificada() {
    console.log("onPeliculaModificada");
    refrescarPeliculas();
    ventanaModal.ocultarVentanaModal();
}

function onPeliculaCreada() {
    console.log("onPeliculaCreada");
    refrescarPeliculas();
    ventanaModal.ocultarVentanaModal();
}

function crearPelicula() {
    ventanaModal.mostrarVentanaModal(
        "Añadir una película", 
        frmEditarPelicula.crearFormularioAltaPelicula(onPeliculaCreada),
        frmEditarPelicula.enviarFormulario
    );
}

function editarPelicula(pelicula) {
    ventanaModal.mostrarVentanaModal(
        "Editar una película", 
        frmEditarPelicula.crearFormularioModificacionPelicula(pelicula, onPeliculaModificada),
        frmEditarPelicula.enviarFormulario
    );
}


