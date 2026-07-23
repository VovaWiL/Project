<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meccha Chameleon Web Prototype</title>
    <style>
        body {
            margin: 0;
            background: #121212;
            color: #fff;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
        }
        canvas {
            border: 4px solid #333;
            background: #222;
            box-shadow: 0 0 25px rgba(0,0,0,0.7);
        }
        .ui-panel {
            margin-top: 15px;
            display: flex;
            gap: 20px;
            align-items: center;
            background: #1e1e1e;
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid #444;
        }
        .color-preview {
            width: 30px;
            height: 30px;
            border: 2px solid #fff;
            display: inline-block;
            vertical-align: middle;
            border-radius: 4px;
        }
        .instructions {
            margin-top: 8px;
            color: #888;
            font-size: 13px;
        }
    </style>
</head>
<body>

    <canvas id="gameCanvas" width="800" height="450"></canvas>
    
    <div class="ui-panel">
        <div>Твой цвет: <span id="currentColorBox" class="color-preview" style="background-color: #ff5555;"></span></div>
        <div>Цель: Встань на панель нужного цвета и нажми <b>E</b>, чтобы покраситься и слиться с окружением!</div>
    </div>
    
    <div class="instructions">
        Управление: W, A, S, D или Стрелки — бегать. Клавиша E — пипетка / покраситься под цвет под тобой.
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const colorBox = document.getElementById('currentColorBox');

        // Игрок (белый персонаж в оригинале, который себя красит)
        let player = {
            x: 100,
            y: 200,
            width: 35,
            height: 45,
            speed: 3.5,
            color: '#ffffff', // Изначально белый
            isPainted: false
        };

        // Элементы окружения (стены / зоны разного цвета, под которые надо маскироваться)
        let environment = [
            { x: 50, y: 50, width: 120, height: 120, color: '#e74c3c', name: 'Красная зона' },
            { x: 300, y: 50, width: 200, height: 100, color: '#2ecc71', name: 'Зеленая зона' },
            { x: 600, y: 80, width: 150, height: 150, color: '#3498db', name: 'Синяя зона' },
            { x: 150, y: 300, width: 180, height: 100, color: '#f1c40f', name: 'Желтая зона' },
            { x: 450, y: 280, width: 120, height: 120, color: '#9b59b6', name: 'Фиолетовая зона' }
        ];

        // Управление
        let keys = {};

        window.addEventListener('keydown', (e) => {
            keys[e.code] = true;

            // Нажатие E — «пипетка» (покрасить себя под объект под игроком)
            if (e.code === 'KeyE') {
                let sampledColor = '#ffffff';
                let standingOnPlatform = false;

                environment.forEach(env => {
                    if (
                        player.x + player.width > env.x &&
                        player.x < env.x + env.width &&
                        player.y + player.height > env.y &&
                        player.y < env.y + env.height
                    ) {
                        sampledColor = env.color;
                        standingOnPlatform = true;
                    }
                });

                if (standingOnPlatform) {
                    player.color = sampledColor;
                    player.isPainted = true;
                    colorBox.style.backgroundColor = player.color;
                } else {
                    // Если не на зоне — сброс в белый
                    player.color = '#ffffff';
                    player.isPainted = false;
                    colorBox.style.backgroundColor = player.color;
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });

        // Обновление логики
        function update() {
            let dx = 0;
            let dy = 0;

            if (keys['ArrowLeft'] || keys['KeyA']) dx = -player.speed;
            if (keys['ArrowRight'] || keys['KeyD']) dx = player.speed;
            if (keys['ArrowUp'] || keys['KeyW']) dy = -player.speed;
            if (keys['ArrowDown'] || keys['KeyS']) dy = player.speed;

            player.x += dx;
            player.y += dy;

            // Границы экрана
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
            if (player.y < 0) player.y = 0;
            if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
        }

        // Отрисовка
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Рисуем уровень (окружение)
            environment.forEach(env => {
                ctx.fillStyle = env.color;
                ctx.fillRect(env.x, env.y, env.width, env.height);
                
                // Текстурная сетка для красоты
                ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                ctx.lineWidth = 3;
                ctx.strokeRect(env.x, env.y, env.width, env.height);
            });

            // Рисуем игрока
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Обводка персонажа (если он замаскирован, обводка сливается, если нет — видна)
            ctx.strokeStyle = player.isPainted ? player.color : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(player.x, player.y, player.width, player.height);

            // Глаза хамелеона (чтобы персонаж выглядел забавно)
            ctx.fillStyle = '#fff';
            ctx.fillRect(player.x + 6, player.y + 8, 8, 8);
            ctx.fillRect(player.x + 20, player.y + 8, 8, 8);
            ctx.fillStyle = '#000';
            ctx.fillRect(player.x + 9, player.y + 11, 3, 3);
            ctx.fillRect(player.x + 23, player.y + 11, 3, 3);
        }

        // Игровой цикл
        function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
        }

        loop();
    </script>
</body>
</html>
