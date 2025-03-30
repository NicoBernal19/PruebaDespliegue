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

export function onNuevoEnemigo(callback) {
    socket.on('nuevo-enemigo', callback);
}

export function onEnemigoEliminado(callback) {
    socket.on('enemigo-eliminado', callback);
}

// Escuchar evento de nueva oleada
export function onNuevaOleada(callback) {
    socket.on('nueva-oleada', callback);
}

// Escuchar evento de oleada completada
export function onOleadaCompletada(callback) {
    socket.on('oleada-completada', callback);
}

export function onEnemigosRestantes(callback) {
    socket.on('enemigos-restantes', callback);
}

export function onTemporizadorOleada(callback) {
    socket.on('temporizador-oleada', callback);
}