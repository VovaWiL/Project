const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Раздаем статические файлы (клиентскую часть) из текущей папки
app.use(express.static(__dirname));

// Список всех подключенных игроков
let players = {};

io.on('connection', (socket) => {
    console.log(`Игрок подключился: ${socket.id}`);

    // Создаем нового игрока со стандартными параметрами
    players[socket.id] = {
        x: Math.random() * 600 + 100,
        y: Math.random() * 300 + 100,
        width: 35,
        height: 45,
        color: '#ffffff',
        isPainted: false
    };

    // Передаем новому игроку текущий список всех игроков
    socket.emit('currentPlayers', players);

    // Оповещаем остальных о новом игроке
    socket.broadcast.emit('newPlayer', { id: socket.id, player: players[socket.id] });

    // Слушаем движения игрока
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].color = movementData.color;
            players[socket.id].isPainted = movementData.isPainted;

            // Рассылаем обновленные данные всем остальным
            socket.broadcast.emit('playerMoved', { id: socket.id, player: players[socket.id] });
        }
    });

    // Когда игрок отключается
    socket.on('disconnect', () => {
        console.log(`Игрок отключился: ${socket.id}`);
        delete players[socket.id];
        // Оповещаем всех, что игрок вышел
        io.emit('disconnectPlayer', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен! Открой в браузере: http://localhost:${PORT}`);
});
