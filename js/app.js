"use strict";

// https://developer.mozilla.org/es/docs/Web/API/Window/localStorage

//----------------------------------------------------------------------------
// Constantes asociadas al GUI
//----------------------------------------------------------------------------
const APP_ROOT = "/";
const PAGINAS_ROOT = "paginas";
const SERVICIOS_ROOT = "js/servicios";
const COMPONENTES_ROOT = "js/componentes";

//----------------------------------------------------------------------------
// Constantes asociadas al BACKEND
//----------------------------------------------------------------------------
const LOGIN_RECURSO = `${URL_BASE}/login`;

//----------------------------------------------------------------------------
// Inicialización
//----------------------------------------------------------------------------
$(document).ready(() => {
    // No permite acceso a la página sin iniciar sesión
    actualizarEstadoSesionUI();
    protegerAcceso();
});

//----------------------------------------------------------------------------
// Funciones para calcular los nombres de los recursos
//----------------------------------------------------------------------------
function URL_PAGINA(nombre) {
    return `${PAGINAS_ROOT}/${nombre}.html`
}

function URL_SERVICIO(nombre) {
    return `${SERVICIOS_ROOT}/${nombre}.mjs`
}

function URL_COMPONENTE_JS(nombre) {
    return `${COMPONENTES_ROOT}/${nombre}.mjs`
}

function URL_COMPONENTE_PLANTILLA(nombre) {
    return `${COMPONENTES_ROOT}/${nombre}.html`
}

//----------------------------------------------------------------------------
// Control de sesión
//----------------------------------------------------------------------------
let jwtToken = localStorage.getItem('jwtToken'); // Recuperar token de localStorage, primera forma de inicializarlo https://developer.mozilla.org/es/docs/Web/API/Window/localStorage

function esSesionIniciada() {
    return jwtToken != null;
}

function iniciarSesion() {
    mostrarLogin();
}

function cerrarSesion() {
    localStorage.removeItem('jwtToken'); // Eliminar token de localStorage https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
    jwtToken = null;
    actualizarEstadoSesionUI(); // Actualizar estado del GUI

    // Muestra mensaje de cerrado de sesión con SweetAlert
    Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente',
        showConfirmButton: false,
        timer: 2000
    }).then(() =>{
        // Redirige a la página principal después del mensaje de SweetAlert
        appCargar("/");
    });
}

function protegerAcceso() {
    if (!esSesionIniciada()) {
        iniciarSesion();
    }
}

function actualizarEstadoSesionUI() {
    if (esSesionIniciada()) {
        // Muestra el boton cerrar sesión y oculta el de inicio de sesión
        $('#botonCerrarSesion').removeClass('d-none');
        $('#botonInicioSesion').addClass('d-none');
    } else {
        // Muestra el boton de inicio de sesión y oculta el de cerrar sesión
        $('#botonInicioSesion').removeClass('d-none');
        $('#botonCerrarSesion').addClass('d-none');
    }
}

function getAuthenticationHeader() {
    return `Bearer ${jwtToken}`;
}

//----------------------------------------------------------------------------
// Funciones de navegación por la aplicación
//----------------------------------------------------------------------------

function appCargar(nombre) {
    // Protege el acceso. Si no se ha iniciado sesión no se puede cargar página
    protegerAcceso();

    // Carga la página
    if (nombre == APP_ROOT) {
        $("#workspace").empty();
    } else {
        $("#workspace").load(URL_PAGINA(nombre), () => {
            // Actualiza el estado de la sesión y la UI después de cargar una página, para corregir error de tener que recargar la página para que se viese
            actualizarEstadoSesionUI();
        });
    }
}

//----------------------------------------------------------------------------
// Implementación de elementos del GUI globales.
//----------------------------------------------------------------------------

function mostrarLogin() {
    // Inicializa la ventana de login
    $('#loginBotonAceptar').off(); // Para asegurarse de que no haya eventos duplicados y solo funcione en caso de ser pulsado
    $('#loginBotonAceptar').on('click', onLoginBotonAceptarClick);

    // Muestra la ventana modal
    $('#loginModal').modal('show');
}

/**
 * Operación a realizar cuando se pincha en iniciar sesión
 */
function onLoginBotonAceptarClick(evento) {
    evento.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene los datos
    const email = $('#loginModal [name=email]').val();
    const password = $('#loginModal [name=password]').val();

    // Prepara el objeto para el login
    const parametros = {
        email: email,
        password: password
    };

    // Lanza un login
    fetch(
        LOGIN_RECURSO,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parametros) // convertir objeto en cadena de texto json
        }
    )
    .then(response => {
         // En caso de error 200 tenemos inicio de sesión correcto
        if(response.status == 200) {
            return response.json(); // Cambiado a json() para manejar la respuesta como JSON (return response.text();)
        } else {
            throw new Error("Email/Contraseña incorrecto");
        }
    })
    .then(datos => {

        // Datos en formato JSON
        // const datos = JSON.parse(texto); // No es necesario ya que uso response.json()  

        jwtToken = datos.accessToken;

        // Almacenar el token en localStorage
        localStorage.setItem('jwtToken', jwtToken); // Guardar token en localStorage https://developer.mozilla.org/es/docs/Web/API/Window/localStorage

        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            showConfirmButton: false,
            timer: 1000
        });
        actualizarEstadoSesionUI();
        appCargar("/");
        $('#loginModal').modal('hide');
    })
    .catch(error => {
        console.error(error);

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email/Contraseña incorrecto',
        });

        jwtToken = null;
    });      
}

