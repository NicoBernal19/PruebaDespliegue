import { io } from 'socket.io-client';

// Conectar al servidor de WebSockets
const socket = io('http://localhost:4000', {
    withCredentials: true, // Envía credenciales (cookies, headers)
    transports: ['websocket', 'polling'] // Métodos de transporte
});

// Función para colocar una torre
export function colocarTorre(x, y, tipo) {
    socket.emit('colocar-torre', { x, y, tipo });
}

// Escuchar el evento para actualizar torres
export function onTorreColocada(callback) {
    socket.on('torre-colocada', callback);
}

// Escuchar el evento para recibir el estado inicial de las torres
export function onTorresActualizadas(callback) {
    socket.on('torres-actualizadas', callback);
}

// Función para disparar un proyectil
export function dispararProyectil(x, y, targetId) {
    socket.emit('disparar-proyectil', { x, y, targetId });
}

// Escuchar el evento para recibir disparos de otros jugadores
export function onProyectilDisparado(callback) {
    socket.on('proyectil-disparado', callback);
}