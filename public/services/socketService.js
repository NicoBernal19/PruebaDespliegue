import { io } from 'socket.io-client';

// Conectar al servidor de WebSockets
const socket = io('http://localhost:4000', {
    withCredentials: true, // Envía credenciales (cookies, headers)
    transports: ['websocket', 'polling'] // Métodos de transporte
});

// Escuchar eventos de WebSocket
socket.on('torre-colocada', (data) => {
    console.log('Torre colocada:', data);
    // Aquí puedes llamar a una función de Phaser para actualizar el mapa
});

// Función para colocar una torre
export function colocarTorre(x, y, tipo) {
    socket.emit('colocar-torre', { x, y, tipo });
}

// Función para usar la API REST
export function colocarTorreREST(x, y, tipo) {
    fetch('http://localhost:3000/colocar-torre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, tipo })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Torre colocada correctamente (REST)');
            } else {
                console.error('Error colocando torre:', data.error);
            }
        });
}