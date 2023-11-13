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
    getPorInicial,
    crearPelicula,
    actualizarPelicula
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
    
    Obtiene las películas cuyo título comienza con una letra específica.
    
    @param {*} inicial La letra inicial por la que filtrar.
    
    @param {*} onOk Función callback en caso de éxito.
    
    @param {*} onError Función callback en caso de error.
    
    @param {*} pagina Número de página para paginación.
    
    @param {*} registrosPorPagina Cantidad de registros por página.
    */
    function getPorInicial(inicial, onOk, onError, pagina, registrosPorPagina = REGISTROS_POR_PAGINA) {
    const url = `${URL_PELICULAS}?titulo_like=^${inicial}`;
    
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
