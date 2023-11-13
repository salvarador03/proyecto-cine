
// Importa los servicios requeridos
import * as peliculas from "/js/servicios/peliculas.mjs";
import * as formulario from "/js/servicios/formulario.mjs";

// MODIFICADO
export {
    crearFormularioAltaPelicula,
    crearFormularioModificacionPelicula,
    enviarFormulario
}

// MODIFICADO
// FIXME Creando una clase o tratando el DOM de otra forma no necesitaríamos estas variables
// De todos modos no es problema, ya que solo podemos tener un cuadro de diálogo de peliculas al mismo tiempo.
// Objeto donde se va a guardar el objeto de la pelicula que se va a utilizar para 
// inicializar el formulario
let editando = false;
let pelicula = null;
let onAlta = null;
let onModificacion = null;

// MODIFICADO
/**
 * Crea e inicializa el formulario de alta de pelicula. 
 */
function crearFormularioAltaPelicula(onAltaCallback) {
    
    // Si vamos a dar de alta una pelicula, no necesitamos datos
    pelicula = null;
    onAlta = onAltaCallback;
    onModificacion = null;
    editando = false;

    // Retorna la función que se va a utilizar para renderizar el formulario
    return renderizarFormularioPelicula;
}

// MODIFICADO
function crearFormularioModificacionPelicula(peli, onModificacionCallback) {

    // Guarda los datos para inicializar los campos posteriormente
    pelicula = peli;
    onAlta = null;
    onModificacion = onModificacionCallback;
    editando = true;

    // Retorna la función que debe ser utilizada para renderizar el formulario
    return renderizarFormularioPelicula;
}


// MODIFICADO
/**
 * Renderiza el formulario pasado el ID
 */
function renderizarFormularioPelicula(id) {
    
    // Inyecta el Código HTML en la página
    if(!$('#frmPelicula').length) {
        $('#'+id).append(
            $('<div>').load(
        
                // URL de la plantilla
                URL_PAGINA("peliculas/editar"),
    
                // Función callback que se invoca cuando finaliza la carga de la plantilla
                () => {
                    inicializarFormulario();
                }
            )
        );    
    } else {
        inicializarFormulario();
    }
}

/** MODIFICADO
 * Inicializa el formulario
 */
function inicializarFormulario() {
    console.log('formulario cargado')

    // Inicializa el servicio que va a controlar el formulario formulario
    formulario.inicializarFormulario(
        'frmPelicula', 

        // Acción a realizar en caso de que se acepte el formulario
        // MODIFICADO
        (peliculaFormulario) => {

            // MODIFICADO
            // Notifica que se ha creado o modificado una nueva pelicula
            if(!editando) {
                // Crea la pelicula en la base de datos. Recibe el objeto a almacenar
                peliculas.crearPelicula(peliculaFormulario, () => {
                    
                    // RETO Notifica que se ha hecho un alta
                    onAlta(peliculaFormulario);
                }, () => {});
            } else {

                // Pone el identificador en la pelicula
                peliculaFormulario.id = pelicula.id;

                // Actualiza la pelicula
                peliculas.actualizarPelicula(peliculaFormulario, () => {

                    // RETO Notifica que se ha modificado la pelicula
                    onModificacion(peliculaFormulario);
                }, () => {});
            }
        },

        // MODIFICADO Pasa los datos de la pelicula. Para el caso de la edición
        pelicula
    );
}

/**
 * Hace un submit del formulario
 */
function enviarFormulario() {
    console.log('Enviando formulario')

    $('#frmPelicula').submit();
}