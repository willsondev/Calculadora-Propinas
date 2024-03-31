document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del formulario y al div donde se mostrará el resumen
    var formulario = document.querySelector('#formulario form');
    var subtotalInput = document.getElementById('subtotal');
    var propinaInput = document.getElementById('propina');
    var totalDiv = document.getElementById('total');

    // Función para calcular la propina
    function calcularTotal(subtotal, porcentajePropina) {
        var propina = subtotal * (porcentajePropina / 100);
        var totalCuenta = subtotal + propina;
        return { propina: propina, totalCuenta: totalCuenta };
    }

    // Función para manejar el envío del formulario
    formulario.addEventListener('submit', function(event) {
        // Evitar que el formulario se envíe y recargue la página
        event.preventDefault();

        // Obtener los valores de subtotal y porcentaje de propina del formulario
        var subtotal = parseFloat(subtotalInput.value);
        var porcentajePropina = parseFloat(propinaInput.value);

        // Calcular la propina y el total de la cuenta
        var resultado = calcularTotal(subtotal, porcentajePropina);

        // Mostrar el resumen en el div correspondiente
        totalDiv.innerHTML ='Monto Subtotal: $' + subtotal + '<br>'  + 'Monto de la propina: $' + resultado.propina + '<br>' +
                             'Total de la cuenta (incluyendo propina): $' + resultado.totalCuenta;

         totalDiv.classList.add('font-bold','text-xl', 'text-black', 'text-center')
    });
});

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
    document.getElementById('formPropina').reset();

    // Limpiar el contenido del div de resumen
    document.getElementById('total').innerHTML = '';
}
