const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Almacenamiento de salas activas
const rooms = {};

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Crear una sala
    socket.on('createRoom', () => {
        // Generar código de sala único
        let roomCode;
        do {
            roomCode = generateRoomCode();
        } while (rooms[roomCode]);

        // Crear la sala
        rooms[roomCode] = {
            id: roomCode,
            players: [{ id: socket.id, ready: true }],
            status: 'waiting'
        };

        // Guardar referencia a la sala en el socket para fácil limpieza
        socket.roomCode = roomCode;

        // Unir al jugador a la sala (socket.io)
        socket.join(roomCode);

        // Enviar confirmación al creador
        socket.emit('roomCreated', { roomCode, playerId: socket.id });

        console.log(`Sala creada: ${roomCode}`);
    });

    // Unirse a una sala
    socket.on('joinRoom', ({ roomCode }) => {
        // Verificación existente
        if (!rooms[roomCode]) {
            socket.emit('joinError', { message: 'La sala no existe' });
            return;
        }

        if (rooms[roomCode].players.length >= 2) {
            socket.emit('joinError', { message: 'La sala está llena' });
            return;
        }

        // Añadir jugador a la sala
        rooms[roomCode].players.push({ id: socket.id, ready: true });

        // Guardar referencia a la sala en el socket para fácil limpieza
        socket.roomCode = roomCode;

        // Unir al jugador a la sala (socket.io)
        socket.join(roomCode);

        // Asegurar que ambos jugadores están marcados como listos
        rooms[roomCode].players.forEach(player => {
            player.ready = true;
        });

        // Notificar a todos en la sala con los datos actualizados
        io.to(roomCode).emit('playerJoined', {
            roomCode,
            players: rooms[roomCode].players
        });

        console.log(`Jugador unido a sala: ${roomCode}`);

        // NUEVO: Si ahora hay 2 jugadores, iniciar el juego automáticamente después de un breve retraso
        if (rooms[roomCode].players.length === 2) {
            // Esperar un momento para que la interfaz se actualice en el cliente
            setTimeout(() => {
                rooms[roomCode].status = 'playing';
                io.to(roomCode).emit('gameStarted', { roomCode });
                console.log(`Juego iniciado automáticamente en sala: ${roomCode}`);
            }, 3000); // 3 segundos de retraso
        }
    });

    // Iniciar juego
    socket.on('startGame', ({ roomCode }) => {
        if (rooms[roomCode] && rooms[roomCode].players.length === 2) {
            rooms[roomCode].status = 'playing';
            io.to(roomCode).emit('gameStarted', { roomCode });
        }
    });

    // Sincronizar estado del juego
    socket.on('gameState', ({ roomCode, state }) => {
        // Transmitir estado a todos excepto el emisor
        socket.to(roomCode).emit('gameState', state);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        const roomCode = socket.roomCode;
        console.log(`Cliente desconectado: ${socket.id}, sala: ${roomCode}`);

        if (roomCode && rooms[roomCode]) {
            // Encontrar y eliminar el jugador desconectado
            const playerIndex = rooms[roomCode].players.findIndex(p => p.id === socket.id);

            if (playerIndex !== -1) {
                // Obtener información del jugador que se desconecta
                const disconnectedPlayer = rooms[roomCode].players[playerIndex];

                // Eliminar jugador de la sala
                rooms[roomCode].players.splice(playerIndex, 1);

                // CAMBIO: Notificar a los jugadores restantes con más detalles
                io.to(roomCode).emit('playerLeft', {
                    playerId: socket.id,
                    playerIndex: playerIndex // 0 para jugador 1, 1 para jugador 2
                });

                console.log(`Jugador ${socket.id} eliminado de sala ${roomCode}`);

                // Si no quedan jugadores, eliminar la sala
                if (rooms[roomCode].players.length === 0) {
                    delete rooms[roomCode];
                    console.log(`Sala eliminada: ${roomCode}`);
                }
            }
        }
    });
});

// Función para limpiar jugadores desconectados de una sala
function cleanDisconnectedPlayers(roomCode) {
    if (!rooms[roomCode]) return;

    // Conservar solo jugadores con conexiones activas
    rooms[roomCode].players = rooms[roomCode].players.filter(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        return playerSocket && playerSocket.connected;
    });
}

// Limpiar periódicamente todas las salas (mantenimiento)
setInterval(() => {
    for (const roomCode in rooms) {
        cleanDisconnectedPlayers(roomCode);

        // Eliminar salas vacías
        if (rooms[roomCode].players.length === 0) {
            delete rooms[roomCode];
            console.log(`Sala vacía eliminada: ${roomCode}`);
        }
    }
}, 10000); // Cada 10 segundos

function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor socket.io ejecutándose en http://localhost:${PORT}`);
});