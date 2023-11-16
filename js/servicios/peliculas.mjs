//-----------------------------------------------------------------------------------
// Servicio de películas
// Permite trabajar con el recurso películas.
//-----------------------------------------------------------------------------------
// Importa dependencias
import * as http from "/js/biblioteca/http.mjs";

// Exporta
export {
    getTodas,
    buscarPeliculas,
    borrarPelicula,
    getAlfabeticamente,
    getAlfabeticamenteDesc,
    getPorInicial,
    crearPelicula,
    actualizarPelicula,
    getEstrenos,
    getClasicos,
    ordenarPorCampo,
    ordenarPorCampoDesc,
    cargarBusquedaSelect
    };
    
    //-----------------------------------------------------------------------------------
    // Constantes
    //-----------------------------------------------------------------------------------
    /**
    
    Url para acceder al recurso
    */
    const URL_PELICULAS = `${URL_BASE}/peliculas`;
    //-----------------------------------------------------------------------------------
    // Implementación
    //-----------------------------------------------------------------------------------
    
    /**
    
    Descarga todas las películas.
    @param {*} onOk Función a llamar cuando se tengan los datos.
    @param {*} onError Función a llamar en caso de error.
    @param {*} pagina Número de página para paginación.
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getTodas(onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    // Llama a descargar todas las películas paginadas.
    http.get(URL_PELICULAS, onOk, onError, pagina, registrosPorPagina);
    }
    /**
     * Carga películas de acuerdo con un filtro de búsqueda y un criterio de ordenamiento.
     * 
     * @param {*} campoOrder El campo por el cual ordenar (p.ej., 'titulo', 'ano', 'director').
     * @param {*} filtroSelect El filtro de búsqueda.
     * @param {*} onOk Función callback en caso de éxito.
     * @param {*} onError Función callback en caso de error.
     * @param {*} pagina Número de página para paginación.
     * @param {*} registrosPorPagina Cantidad de registros por página.
     */
    function cargarBusquedaSelect(campoOrder, filtroSelect, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
        const url = `${URL_PELICULAS}?_sort=${campoOrder}&q=${filtroSelect}`;

        // Llama a descargar todas las películas con el filtro y orden aplicados.
        http.get(url, onOk, onError, pagina, registrosPorPagina);
    }

    /**
    
    Permite obtener las películas haciendo una búsqueda de texto.
    
    @param {*} filtro Filtro de búsqueda.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function buscarPeliculas(filtro, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?q=${filtro}`;
    
    // Llama a descargar todas las películas paginadas con el filtro aplicado.
    http.get(url, onOk, onError, pagina, registrosPorPagina);
    }
    
    /**
    
    Borra una película.
    @param {*} id Identificador de la película a borrar.
    @param {*} onOk Función callback en caso de éxito.
    @param {*} onError Función callback en caso de error.
    */
    function borrarPelicula(id, onOk = () => {}, onError = () => {}) {
    const url = `${URL_PELICULAS}/${id}`;
    http.del(url, onOk, onError);
    }
    /**
    
    Obtiene las películas ordenadas alfabéticamente.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getAlfabeticamente(onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?_sort=titulo&_order=asc`;
    
    // Llama a descargar todas las películas paginadas y ordenadas alfabéticamente.
    http.get(url, onOk, onError, pagina, registrosPorPagina);
    }
    /**
    
    Obtiene las películas ordenadas alfabéticamente de forma descendiente.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getAlfabeticamenteDesc(onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
        const url = `${URL_PELICULAS}?_sort=titulo&_order=desc`;
    
        // Llama a descargar todas las películas paginadas y ordenadas alfabéticamente de manera descendente.
        http.get(url, onOk, onError, pagina, registrosPorPagina);
    }
/**
 * Obtiene las películas ordenadas ascendentemente por un campo específico.
 * 
 * @param {*} campo El campo por el cual ordenar (p.ej., 'titulo', 'ano', 'director').
 * @param {*} onOk Función callback en caso de éxito.
 * @param {*} onError Función callback en caso de error.
 * @param {*} pagina Número de página para paginación.
 * @param {*} registrosPorPagina Cantidad de registros por página.
 */
function ordenarPorCampo(campo, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?_sort=${campo}&_order=asc`;

    http.get(url, onOk, onError, pagina, registrosPorPagina);
}
/**
 * Obtiene las películas ordenadas de forma desc por un campo específico.
 * 
 * @param {*} campo El campo por el cual ordenar (p.ej., 'titulo', 'ano', 'director').
 * @param {*} onOk Función callback en caso de éxito.
 * @param {*} onError Función callback en caso de error.
 * @param {*} pagina Número de página para paginación.
 * @param {*} registrosPorPagina Cantidad de registros por página.
 */
function ordenarPorCampoDesc(campo, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?_sort=${campo}&_order=desc`;

    http.get(url, onOk, onError, pagina, registrosPorPagina);
}
    /**
    
    Obtiene las películas ordenadas por año orden descendente (ESTRENOS).
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getEstrenos(onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
        const url = `${URL_PELICULAS}?_sort=ano&_order=desc`;
        
        // Llama a descargar todas las películas paginadas y ordenadas alfabéticamente.
        http.get(url, onOk, onError, pagina, registrosPorPagina);
        }
    /**
    
    Obtiene las películas ordenadas por año orden ascendente (CLÁSICOS).
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getClasicos(onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
        const url = `${URL_PELICULAS}?_sort=ano&_order=asc`;
        
        // Llama a descargar todas las películas paginadas y ordenadas alfabéticamente.
        http.get(url, onOk, onError, pagina, registrosPorPagina);
        }
    
    /**
    
    Obtiene las películas cuyo título comienza con una letra específica.
    
    @param {*} inicial La letra inicial por la que filtrar.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getPorInicial(inicial, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?titulo_like=^${inicial}`; // ^ este simbolito indica (todos los que empiezen por lo que sea)
    
    // Llama a descargar todas las películas que comienzan con una letra específica.
    http.get(url, onOk, onError, pagina, registrosPorPagina);
    }
    
    /**
    
    Crea una nueva película.
    
    @param {*} objeto Datos de la nueva película.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    */
    function crearPelicula(objeto, onOk = () => {}, onError = () => {}) {
    const url = URL_PELICULAS;
    
    // Crea una nueva película.
    http.post(url, objeto, onOk, onError);
    }

    function actualizarPelicula(objeto, onOk, onError) {

        // Monta la URL al recurso
        const url = `${URL_PELICULAS}/${objeto.id}`;
    
        // Crea un contacto
        http.put(url, objeto, onOk, onError);
    }
