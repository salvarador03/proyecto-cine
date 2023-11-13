export {generarPaginador};
// Función para generar el paginador
function generarPaginador() {
    let contenedor = document.getElementById('paginador');
    let abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let htmlPaginador = '<nav aria-label="paginadorPorLetras">' +
                        '<ul class="pagination justify-content-center">';

    for (let i = 0; i < abecedario.length; i++) {
      let letra = abecedario[i];
      htmlPaginador += '<li class="page-item"><a class="page-link letra" data-letra="' + letra + '" href="#">' + letra + '</a></li>';
    }

    htmlPaginador += '</ul></nav>';

    contenedor.innerHTML = htmlPaginador;
  }

  // Llamada a la función para que genere el paginador cuando se carga la página
  window.onload = generarPaginador;