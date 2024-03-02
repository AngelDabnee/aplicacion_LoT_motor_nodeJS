const { SerialPort } = require('serialport');
const port = new SerialPort({ path: '/dev/cu.usbserial-1330', baudRate: 9600 });

console.log('Welcome a la PerroApp, presiona [q] en cualquier momento para salir y [w] para continuar');

const { emitKeypressEvents } = require('readline');
emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q') {
        console.log('Saliendo, te espero');
        port.close(); // Asegúrate de cerrar el puerto serial antes de salir
        process.exit();
    } else if (key.name === 'w') {
        console.log('Control de motor: [d] Derecha, [i] Izquierda, [p] Parar');
    } else {
        let command = '';
        switch (key.name) {
            case 'd':
                console.log('Motor girando a la derecha');
                command = 'd';
                break;
            case 'i':
                console.log('Motor girando a la izquierda');
                command = 'i';
                break;
            case 's':
                console.log('Motor parado');
                command = 's';
                break;
            default:
                console.log('Comando no reconocido (solo d,i,s)');
                return; // Evita enviar un comando si no es reconocido
        }
        if (port.isOpen && command) {
            port.write(command + '\n', function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('message written');
            }); // Envía el comando al Arduino
        }
    }
});

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
});