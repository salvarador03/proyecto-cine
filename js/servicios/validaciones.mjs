/**
 * Comprueba si un campo está vacío.
 * 
 * @param {string} v El valor a comprobar.
 * @returns {boolean} Verdadero si no está vacío, falso en caso contrario.
 */
function noEstaVacio(v) {
   return v.trim().length > 0;
}

/**
* Valida un título.
* 
* @param {string} v El valor del título a validar.
* @returns {boolean|string} Verdadero si el título es válido, o el mensaje de error.
*/
export function esTitulo(v) {
  return noEstaVacio(v) ? true : "El campo título está vacío";
}

/**
* Valida un género.
* 
* @param {string} v El valor del género a validar.
* @returns {boolean|string} Verdadero si el género es válido, o el mensaje de error.
*/
export function esGenero(v) {
  return noEstaVacio(v) ? true : "El campo género está vacío";
}

/**
* Valida un año.
* 
* @param {string} v El valor del año a validar.
* @returns {boolean|string} Verdadero si el año es válido, o el mensaje de error.
*/
export function esAno(v) {
  return noEstaVacio(v) ? true : "El campo año está vacío"; 
}

/**
* Valida el campo director.
* 
* @param {string} v El valor del director a validar.
* @returns {boolean|string} Verdadero si el director es válido, o el mensaje de error.
*/
export function esDirector(v) {
  return noEstaVacio(v) ? true : "El campo director está vacío";
}
/**
* Valida el campo descripcion.
* 
* @param {string} v El valor del descripcion a validar.
* @returns {boolean|string} Verdadero si la descripción es válida, o el mensaje de error.
*/
export function esDescripcion(v) {
  return noEstaVacio(v) ? true : "El campo descripción está vacío";
}
/**
* Valida el campo precio.
* 
* @param {string} v El valor del precio a validar.
* @returns {boolean|string} Verdadero si el precio es válido, o el mensaje de error.
*/
export function esPrecio(v) {
  return noEstaVacio(v) ? true : "El campo precio está vacío";
}
/**
* Valida el campo descuento.
* 
* @param {string} v El valor del descuento a validar.
* @returns {boolean|string} Verdadero si el descuento es válido, o el mensaje de error.
*/
export function esDescuento(v) {
  return noEstaVacio(v) ? true : "El campo descuento está vacío";
}

/**
* Valida que el nombre de la película no exista.
* 
* @param {string} v El título de la película a validar.
* @returns {boolean|string} Verdadero si el título no existe, o el mensaje de error.
*/
export async function tituloExiste(v) {
    
   // Busca una película por nombre.
   const respuesta = await fetch(
       `${URL_BASE}/peliculas?titulo=${v}`,
       {
           headers: {
               "Authorization": getAuthenticationHeader()
           }    
       }
   );

   // Crea un objeto a partir del JSON.
   const objeto = await respuesta.json();

   // Comprueba la longitud.
   if (objeto.length > 0) {
       return 'El título ya existe';
   }

   return true;
}

