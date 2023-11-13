
import * as validaciones from '/js/servicios/validaciones.mjs';

export {
    inicializarFormulario
}

//-------------------------------------------------------------------------
// Inicialización
//-------------------------------------------------------------------------
// MOFIFICADO
/**
 * Inicializa el formulario pasado como argumento
 * 
 * @param {*} idFormulario Identificador del formulario
 * @param {*} onSubmit Acción a realizar para enviar el formulario. Se invoca en caso de que
 *                     se pasen las validaciones y esté todo ok.
 * @param {*} objeto   En caso de edición, este objeto contiene los datos a poner en los campos.
 */
function inicializarFormulario(idFormulario, onSubmit, objeto = null) { // MODIFICADO acepta el objeto

    // Obtengo el formulario
    const formulario = $('#'+idFormulario).get(0);

    // MODIFICADO
    // Guarda las funcions callback de las acciones
    formulario.onSubmitCallback = onSubmit;

    // Limpia los errores
    limpiarErrores(formulario);

    // MODIFICADO carga los datos en el formulario
    if(objeto) {
        inicializarCamposDesdeObjeto(formulario, objeto);
    } else {
        // Inicializa los campos.
        formulario.reset();
    }
    
    // Asigna los gestores de eventos
    // Submit al formulario
    $('#'+idFormulario).unbind('submit');
    $('#'+idFormulario).on('submit', onSubmitEventReceived);

    // Asigna evento para gestionar la salida de cada campo
    $(formulario).on('blur', '[validacion]', fValidarCampo);
}

//-------------------------------------------------------------------------
// Gestores de eventos
//-------------------------------------------------------------------------
// MODIFICADO
/**
 * Gestiona el evento submit del formulario
 * 
 * @param {} evento 
 */
function onSubmitEventReceived(evento) {

    // Obtengo el formulario
    const formulario = evento.target;

    // Evita que se envíe el formulario
    evento.preventDefault();

    // Llama a validar el formulario. Si el formulario estuviera ok, no se enviará.
    fValidarFormulario(formulario);
}

//-------------------------------------------------------------------------
// Funciones de utilidad
//-------------------------------------------------------------------------

/**
 * Recorre todos los campos en el formulario y pone los valores en el objeto resultante
 * utuilizando el campo name.
 */
function cargarAtributosDesdeFormulario(formulario, objeto) {
    $(formulario).find('[name]').each((i, e) => {
        objeto[e.name] = e.value;
    });
}

/**
 * MODIFICADO
 * Recibe un objeto como argumento y para cada uno de los atributos en el objeto
 * inicializa el campo cuyo atribyto name coincide con el nombre.
 * 
 * @param {*} formulario 
 * @param {*} objeto 
 */
function inicializarCamposDesdeObjeto(formulario, objeto) {

    // Recorro los nombres de los campos
    for(let campo in objeto) {
        
        // Obtengo el valor del campo
        const valor = objeto[campo];

        // Si existe en el formulario, asigno el valor
        // Podríamos tener que hacer un tratamiento diferente 
        // para diferentes tipos de campos de entrada o en caso 
        // de utilizar componentes raros de algún tipo.
        // Con esto cubrimos el tipo sencillo
        $(formulario).find(`[name=${campo}]`).val(valor);
    }

}


/**
 * Envía los datos del formulario
 * 
 * @param {*} formulario 
 */
function enviarFormulario(formulario) {
    
    // Prepara objeto para envío al servidor
    const objeto = {};
    
    // Carga en el objeto los valores de los campos en el form
    cargarAtributosDesdeFormulario(formulario, objeto);
    
    // Muestra el objeto que va a enviar al servidor
    console.log(objeto);

    // Enviar información al servidor
    // MODIFICADO
    formulario.onSubmitCallback(objeto);

    // TODO submit realizado o no realizado correctamente
    console.log("Datos guardados");
}


//---------------------------------------------------------------------------------
// Validación de formulario
//---------------------------------------------------------------------------------
/**
 * Lleva a cabo una valicación del formulario.
 * Soporta la realización de validaciones de servidor
 * 
 * @param {*} formulario Formulario a validar
 */
function fValidarFormulario(formulario) {

    (async function () {

        // Limpia los mensajes de error que pudiéramos tener
        limpiarErrores(formulario);

        // En primer lugar, comprueba si se cumplen las restricciones de formulario. Por ejemplo, 
        // si todos los campos requeridos están incluidos
        formulario.checkValidity(); 

        // Errores que han ocurrido. Se inicializa a cero
        let numeroErrores = 0;

        // Obtener todos los campos en el formulario que tienen validacion
        // Y validarlos. Utiliza para ello un selector CSS específico
        const elementos = formulario.querySelectorAll("[validacion]");
        for(const e of elementos) {
                
            // Valida un campo
            numeroErrores += await validarElemento(e);
        }

        // Si no hay errores, envía el formulario
        if(numeroErrores == 0) {                        
            // Si no usara AJAX, haría esto, pero al usar AJAX se hace necesario
            // hacer el envío de datos de otro modo
            // formulario.alta.value = '1';
            // formulario.submit();

            // Envía los datos del formulario
            enviarFormulario(formulario);
        } else {
            
            // Si hay errores, marca que se ha validado. De este modo se marcan 
            // los campos con errores. Esto lo hace            
            // añadiendo la clase indicando que ya se ha validado el formulario
            formulario.classList.add('was-validated');
        }
    })();
}


//---------------------------------------------------------------------------------
// Validación de campos
//---------------------------------------------------------------------------------

/**
 * Valida el campo sobre el que se ha producido el evento
 * 
 * @param {*} evento 
 */
function fValidarCampo(evento) {
    
    // Obtiene el elemento sobre el que se ha lanzado el evento y llama
    // a realizar la validación
    validarElemento(evento.target);
}

/**
 * Valida un campo recibido como argumento y muestra el error que corresponda
 * 
 * @param {*} e elemento html que contiene el dato a validar. Puede ser un input
 */
async function validarElemento(e) {
    
    let numeroErrores = 0;

    try {

        // Elimina el error 
        $(e).removeClass('is-invalid');

        // Validación que se aplicaría al campo
        const validacion = e.attributes['validacion'].value;

        if(validacion) {
            // Valor en el campo
            const valor = e.value;

            // Obtengo el nombre de la validación
            const funcionValidacion = eval(`validaciones.${validacion}`);

            // Invoca a la validación y obtiene el resultado
            await funcionValidacion(valor, e);
        }
    } catch(exception) {
         
        // Si no pasa la validación
         mostrarError(e, exception);
         numeroErrores++;
    }
   
    // Retorna el número de errores encontrados
    return numeroErrores;
}



//---------------------------------------------------------------------------------
// Funciones de utilidad relacionadas con el formulario y el GUI
//---------------------------------------------------------------------------------
/**
 * Limpia los errores del formulario
 * 
 * @param {} formulario la referencia al formulario a lumpiar
 */
function limpiarErrores(formulario) {
    
    // Marca que el formulario no se ha validado
    formulario.classList.remove('was-validated');

    // Marca todos los elementos como válidos
    formulario.querySelectorAll("input[validacion]").forEach((elemento) => {
        $(elemento).removeClass('is-invalid');
    });        
}


/**
 * Muestra un mensaje de error
 * 
 * @param {*} error 
 */
function mostrarError(elemento, error) {
    $(elemento).addClass('is-invalid');
    $('#'+elemento.id+' + .invalid-feedback').text(error);
}


