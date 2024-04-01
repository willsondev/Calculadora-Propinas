document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del formulario y al div donde se mostrará el resumen
    var formulario = document.querySelector('#formulario form');
    var subtotalInput = document.getElementById('subtotal');
    var propinaInput = document.getElementById('propina');
    var totalDiv = document.getElementById('total');

    // Llama a la función para cargar y mostrar los resúmenes diarios cuando se carga la página
    ResumenDiario();

    // Función para calcular la propina
    function calcularTotal(subtotal, porcentajePropina) {
        var propina = subtotal * (porcentajePropina / 100);
        var totalCuenta = subtotal + propina;
        return { propina: propina, totalCuenta: totalCuenta };
    }

    // Función para manejar el envío del formulario
    if (formulario && subtotalInput && propinaInput && totalDiv) {
        formulario.addEventListener('submit', function(event) {
            // Evitar que el formulario se envíe y recargue la página
            event.preventDefault();

            // Obtener los valores de subtotal y porcentaje de propina del formulario
            var subtotal = parseFloat(subtotalInput.value);
            var porcentajePropina = parseFloat(propinaInput.value);

            // Calcular la propina y el total de la cuenta
            var resultado = calcularTotal(subtotal, porcentajePropina);

            // Construir el resumen como una cadena de texto
            var resumenTexto = 'Monto Subtotal: $' + subtotal + '<br>' +
                'Monto de la propina: $' + resultado.propina + '<br>' +
                'Total de la cuenta (incluyendo propina): $' + resultado.totalCuenta;

            // Mostrar el resumen en el div correspondiente
            totalDiv.innerHTML = resumenTexto;
            totalDiv.classList.add('font-bold', 'text-xl', 'text-black', 'text-center');

            // Guardar el resumen en el localStorage
            guardarResumenDiario(resumenTexto);
        });
    }
});

// Función para guardar el resumen diario en el localStorage
function guardarResumenDiario(resumen) {
    var resumenesGuardados = JSON.parse(localStorage.getItem('resumenesDiarios')) || [];
    resumenesGuardados.push(resumen);
    localStorage.setItem('resumenesDiarios', JSON.stringify(resumenesGuardados));
    console.log("Resumen guardado:", resumen);
}

// Función para imprimir el resumen
function imprimirResumen() {
    // Obtener el contenido del div de resumen
    var contenido = document.getElementById('total').innerHTML;

    // Crear un iframe para imprimir
    var iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Escribir el contenido del resumen en el iframe
    var ventanaImpresion = iframe.contentWindow || iframe.contentDocument;
    ventanaImpresion.document.open();
    ventanaImpresion.document.write('<html><head><title>Resumen de Propina</title><link rel="stylesheet" type="text/css" href="print.css" media="print"></head><body>');
    ventanaImpresion.document.write('<h1 style="color: black;">Resumen de Cuenta</h1>');
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();

    // Imprimir el contenido del iframe
    ventanaImpresion.print();

    // Eliminar el iframe después de imprimir
    setTimeout(function() {
        document.body.removeChild(iframe);
    }, 1000); // Esperamos 1 segundo antes de eliminar el iframe
}

function reiniciarCalculo() {
    // Restablecer el valor del formulario
    var formPropina = document.getElementById('formPropina');
    if (formPropina) {
        formPropina.reset();
    }

    // Limpiar el contenido del div de resumen
    var total = document.getElementById('total');
    if (total) {
        total.innerHTML = '';
    }
}




function ResumenDiario() {
    // Obtener el elemento donde se mostrarán los resúmenes
    var resumenesContainer = document.getElementById('resumenesContainer');

    // Verificar si el contenedor existe
    if (resumenesContainer) {
        // Obtener la fecha actual en formato YYYY-MM-DD
        var fechaActual = new Date().toLocaleDateString();

        // Obtener la última fecha almacenada en el localStorage
        var ultimaFechaResumen = localStorage.getItem('ultimaFechaResumen');

        // Si la última fecha almacenada es diferente a la fecha actual, limpiar el resumen diario
        if (ultimaFechaResumen !== fechaActual) {
            localStorage.removeItem('resumenesDiarios'); // Limpiar resumenesDiarios en localStorage
            localStorage.setItem('ultimaFechaResumen', fechaActual); // Actualizar última fecha de resumen
        }

        // Limpiar el contenido existente del contenedor
        resumenesContainer.innerHTML = '';

        // Obtener los resúmenes diarios almacenados en localStorage
        var resumenesGuardados = JSON.parse(localStorage.getItem('resumenesDiarios')) || [];

        // Mostrar los resúmenes diarios en el contenedor
        resumenesGuardados.forEach(function (resumen, index) {
            var elementoResumen = document.createElement('div');
            elementoResumen.classList.add('bg-gray-100', 'rounded-lg',  'mb-2'); // Ajuste: Reduje el margen inferior

            var tituloResumen = document.createElement('h3');
            tituloResumen.classList.add('text-gray-700', 'font-bold', 'text-lg', 'mb-2');
            tituloResumen.textContent = "Resumen " + (index + 1) + ":";
            elementoResumen.appendChild(tituloResumen); // Añade el título al div

            // Divide el resumen por saltos de línea
            var lineasResumen = resumen.split('<br>');
            lineasResumen.forEach(function (linea, idx) {
                var lineaElemento = document.createElement('p'); // Usa <p> para cada línea
                lineaElemento.classList.add('text-gray-800', 'text-base');
                lineaElemento.innerHTML = linea; // Usa innerHTML para permitir el uso de <br>
                elementoResumen.appendChild(lineaElemento);
                if (idx < lineasResumen.length - 1) { // Agrega <br> después de cada línea, excepto la última
                    elementoResumen.appendChild(document.createElement('br'));
                }
            });

            resumenesContainer.appendChild(elementoResumen); // Añade el div al contenedor
        });
    }

    // Obtener referencia al botón de imprimir resumen
    var btnImprimirResumen = document.getElementById('btnImprimirResumen');

    // Agregar evento click al botón
    if (btnImprimirResumen) {
        btnImprimirResumen.addEventListener('click', function() {
            imprimirResumenDiario();
        });
    }

    // Obtener referencia al botón de descargar resumen
    var btnDescargarResumen = document.getElementById('btnDescargarResumen');

    // Agregar evento click al botón
    if (btnDescargarResumen) {
        btnDescargarResumen.addEventListener('click', function() {
            descargarResumenDiario();
        });
    }

    // Función para imprimir el resumen diario
    function imprimirResumenDiario() {
        var contenidoResumen = document.getElementById('resumenesContainer').innerHTML;
        var ventanaImpresion = window.open('', '_blank');
        setTimeout(function() {
            ventanaImpresion.document.write('<html><head><title>Resumen Diario</title></head><body>');
            ventanaImpresion.document.write(contenidoResumen);
            ventanaImpresion.document.write('</body></html>');
            ventanaImpresion.print();
            ventanaImpresion.close();
        }, 100);
    }
}


   
function descargarResumenDiario() {
    // Obtener el contenido del contenedor de resumen diario
    var contenidoResumen = document.getElementById('resumenesContainer');

    // Opciones de configuración para la conversión a PDF
    var options = {
        filename: 'resumen_diario.pdf', // Nombre del archivo PDF
        image: { type: 'jpeg', quality: 0.98 }, // Opciones de imagen
        html2canvas: { scale: 2 }, // Opciones de html2canvas
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } // Opciones de jsPDF
    };

    // Utilizar html2pdf para convertir el contenido en PDF y descargarlo
    html2pdf().from(contenidoResumen).set(options).save();
}

  

