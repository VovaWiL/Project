const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111112);

// Основная камера игрока (для нас)
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 10, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 25, 10);
scene.add(dirLight);

scene.add(new THREE.GridHelper(50, 50, 0x333334, 0x1c1c1e));

// Игрок (Красный шар)
const playerGroup = new THREE.Group();
const playerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 }));
playerGroup.add(playerMesh);
playerGroup.position.set(0, 0.6, -4); // Поставим перед ИИ
scene.add(playerGroup);

// Кубик Рубика
const rubikGroup = new THREE.Group();
const colors = [0xef4444, 0x3b82f6, 0x22c55e, 0xeab308, 0xffffff, 0xff781f];
const materials = colors.map(c => new THREE.MeshStandardMaterial({ color: c }));
const rubikMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), materials);
rubikGroup.add(rubikMesh);
rubikGroup.position.set(-3, 0.3, -2);
scene.add(rubikGroup);

// Фонарик
const flashlightGroup = new THREE.Group();
const flBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0x374151 }));
flBody.rotation.x = Math.PI / 2;
flashlightGroup.add(flBody);
flashlightGroup.position.set(3, 0.25, -2);
scene.add(flashlightGroup);

// --- ТЕЛО GEMINI С КАМЕРОЙ ВНУТРИ ГЛАЗ ---
const geminiGroup = new THREE.Group();
const aiBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), new THREE.MeshStandardMaterial({ color: 0x52525b }));
geminiGroup.add(aiBody);

// Текстура глаз
const eyeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.1);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
const eye1 = new THREE.Mesh(eyeGeo, eyeMat); eye1.position.set(0.25, 0.25, 0.56);
const eye2 = new THREE.Mesh(eyeGeo, eyeMat); eye2.position.set(-0.25, 0.25, 0.56);
geminiGroup.add(eye1, eye2);

// Руки робота
const rightShoulder = new THREE.Group(); rightShoulder.position.set(0.65, 0.2, 0);
const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7), new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
rightArm.position.y = -0.35; rightShoulder.add(rightArm); geminiGroup.add(rightShoulder);

const leftShoulder = new THREE.Group(); leftShoulder.position.set(-0.65, 0.2, 0);
const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7), new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
leftArm.position.y = -0.35; leftShoulder.add(leftArm); geminiGroup.add(leftShoulder);

geminiGroup.position.set(0, 0.55, 4);
scene.add(geminiGroup);

// Камера ИИ (Глаза Робота)
const aiEyeCamera = new THREE.PerspectiveCamera(70, 1, 0.1, 50);
aiEyeCamera.position.set(0, 0.25, 0.56); 
geminiGroup.add(aiEyeCamera);

// Скрытый буфер рендеринга глаз ИИ
const aiRenderTarget = new THREE.WebGLRenderTarget(256, 256);

// Управление игроком
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function movePlayer() {
    const speed = 0.12;
    if (keys['KeyW'] || keys['ArrowUp']) playerGroup.position.z -= speed;
    if (keys['KeyS'] || keys['ArrowDown']) playerGroup.position.z += speed;
    if (keys['KeyA'] || keys['ArrowLeft']) playerGroup.position.x -= speed;
    if (keys['KeyD'] || keys['ArrowRight']) playerGroup.position.x += speed;
}

let currentAnim = 'IDLE';
let animTime = 0;

function handleAiAutonomousAction(action) {
    animTime = 0;
    const moveStep = 1.5;
    
    let forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), geminiGroup.rotation.y).normalize();
    let rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), geminiGroup.rotation.y).normalize();

    if (['JUMP', 'WAVE_HAND', 'LOOK_AROUND'].includes(action)) {
        currentAnim = action;
        return;
    }

    if (action === 'FORWARD') {
        geminiGroup.position.addScaledVector(forwardDir, moveStep);
    } else if (action === 'BACKWARD') {
        geminiGroup.position.addScaledVector(forwardDir, -moveStep);
    } else if (action === 'LEFT') {
        geminiGroup.position.addScaledVector(rightDir, -moveStep);
    } else if (action === 'RIGHT') {
        geminiGroup.position.addScaledVector(rightDir, moveStep);
    }
}

function updateAnimations(time) {
    animTime += 0.04;

    if (currentAnim !== 'WAVE_HAND' && currentAnim !== 'LOOK_AROUND') {
        rightShoulder.rotation.set(0, 0, 0);
        leftShoulder.rotation.set(0, 0, 0);
    }

    if (currentAnim === 'JUMP') {
        geminiGroup.position.y = 0.55 + Math.abs(Math.sin(animTime * 4)) * 2.0;
        if (animTime > Math.PI / 2) { currentAnim = 'IDLE'; geminiGroup.position.y = 0.55; }
    } 
    else if (currentAnim === 'WAVE_HAND') {
        rightShoulder.rotation.x = -Math.PI - 0.2;
        rightShoulder.rotation.z = Math.sin(animTime * 8) * 0.6;
        if (animTime > 2.5) currentAnim = 'IDLE';
    }
    else if (currentAnim === 'LOOK_AROUND') {
        geminiGroup.rotation.y += Math.sin(animTime * 2) * 0.05;
        if (animTime > 3) currentAnim = 'IDLE';
    }
}

function animate(timestamp) {
    requestAnimationFrame(animate);
    movePlayer();
    updateAnimations(timestamp);
    controls.update();
    renderer.render(scene, camera);
}
animate();

const chatMessages = document.getElementById('chat-messages');

function appendMessage(text, sender, title = "Gemini") {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.innerHTML = `<strong>${title}:</strong> ${text}`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function thinkAutonomously() {
    const width = aiRenderTarget.width;
    const height = aiRenderTarget.height;
    const pixels = new Uint8Array(width * height * 4);

    renderer.setRenderTarget(aiRenderTarget);
    renderer.render(scene, aiEyeCamera);
    renderer.readRenderTargetPixels(aiRenderTarget, 0, 0, width, height, pixels);
    renderer.setRenderTarget(null); 

    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcIdx = (y * width + x) * 4;
            const destIdx = ((height - 1 - y) * width + x) * 4;
            imageData.data[destIdx] = pixels[srcIdx];
            imageData.data[destIdx+1] = pixels[srcIdx+1];
            imageData.data[destIdx+2] = pixels[srcIdx+2];
            imageData.data[destIdx+3] = pixels[srcIdx+3];
        }
    }
    ctx.putImageData(imageData, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

    try {
        const response = await fetch('/api/autonomous-brain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
        });
        const data = await response.json();
        
        if (data.reasoning) {
            appendMessage(data.reasoning, 'gemini', "Мысли ИИ");
        }
        if (data.action) {
            handleAiAutonomousAction(data.action);
        }
    } catch (e) {
        console.error("Ошибка автономного цикла", e);
    }
}

setInterval(thinkAutonomously, 4000);

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
