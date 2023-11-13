// ------------------------------------------------
// Funciones para crear cuadros de diálogo
// ------------------------------------------------

export { mostrarMensaje, mostrarPreguntaSiNo };

/**
 * Muestra un cuadro de dialogo con un mensaje
 * 
 * @param {*} mensaje 
 */
function mostrarMensaje(mensaje){
    if(!$('#modalMensaje').length) {
        $('body').append(
            $('<div>').load(
    
                // Url del dialogo
                URL_COMPONENTE_PLANTILLA("dialogo"),
    
                // Función callback que se invoca cuando finaliza la carga de la plantilla
                () => {
                    // Mostrar el mensaje
                    _mostrarMensaje(mensaje)
                }
            )
            // URL de la plantilla
        );
    } else {
        // Mostrar el mensaje
        _mostrarMensaje(mensaje);
    }
    function _mostrarMensaje(mensaje) {
        $('#titulo').text('!!Atención');
        $('#mensaje').text(mensaje);
        $('#modalMensaje').modal('show');
    }

}
/**
 * Muestra un cuadro de diálogo que pide confirmación para llevar a cabo una acción
 * 
 * @param {*} texto 
 * @param {*} onSi Callback a invocar en caso de que se pulse en el si
 */
function mostrarPreguntaSiNo(texto, onSi) {
    if (!$('#modalSiNo').length) {
      $('body').append(
        $('<div>').load(
          URL_COMPONENTE_PLANTILLA("dialogo"),
          () => _mostrarPreguntaSiNo(texto, onSi)
        )
      );
    } else {
      _mostrarPreguntaSiNo(texto, onSi);
    }
  
    function _mostrarPreguntaSiNo(texto, onSi) {
      $('#modalSiNo .modal-title').text('¡¡Atención!!');
      $('#modalSiNo .modal-body').text(texto);
  
      $('#modalSiNo [name=botonAceptar]').on("click", () => {
        onSi();
        $('#modalSiNo [name=botonAceptar]').off('click');
        $('#modalSiNo').modal("hide");
      });
  
      $('#modalSiNo').modal('show');
    }
  }