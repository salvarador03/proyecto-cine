
// Exportaciones del módulo
export {
    mostrarVentanaModal,
    ocultarVentanaModal
}

/**
 * Muestra una ventana modal con el título y contenido especificado
 * 
 * @param {*} titulo 
 * @param {*} función callback donde se renderiza el contanido. Recibe como argumento el ID del 
 *              elemento donde se va a renderizar el contenido. 
 * @param {*} onAceptar función callback
 */
function mostrarVentanaModal(titulo, renderizarCallback, onAceptar = () => {}) {

    // Inyecta el Código HTML en la página
    if(!$('#ventanaModal').length) {
        $('body').append(
            $('<div>').load(
        
                // URL de la plantilla
                URL_COMPONENTE_PLANTILLA("ventanaModal"),

                // Función callback que se invoca cuando finaliza la carga de la plantilla
                () => {
                    _mostrarVentanaModal();       
                }
            )
        );    
    } else {
        // Mostrar el mensaje
        _mostrarVentanaModal();
    }

    function _mostrarVentanaModal() {
        
        // Asigna el título
        $('#ventanaModal .modal-title').text(titulo);
        $('#ventanaModal .modal-git').empty();

        // Llama a la función callback para renderizar el contenido del formulario
        renderizarCallback("ventanaModalCuerpo");        

        // Configuramos el botón aceptar
        $('#ventanaModal [name=botonAceptar]').on('click', () => {

            // Llamar a la función
            onAceptar();
        });

        // Muestra la ventana modal
        $('#ventanaModal').modal('show');
    }    
}

/**
 * Esta función oculta la ventana modal. Debe ser invocada de forma explícita en estos momentos
 */
function ocultarVentanaModal() {
    // Desactivamos el gestor de evento
    $('#ventanaModal [name=botonAceptar]').off('click');
    
    // Oculta el cuadro de dialogo
    $('#ventanaModal').modal('hide');    
}