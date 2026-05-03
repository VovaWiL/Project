// --- Имитация состояния (State) ---
let state = {
    elements: [
        { id: '1', type: 'text', x: 150, y: 50, w: 300, h: 60, content: 'Привет из JS!', styles: { fontSize: 24, backgroundColor: 'transparent', color: '#000' } }
    ],
    selectedId: null,
    viewMode: 'edit', // edit, scripts, preview
    dragging: null
};

const canvas = document.getElementById('canvas');
const propFields = document.getElementById('prop-fields');

// --- Рендеринг элементов ---
function render() {
    canvas.innerHTML = '';
    
    state.elements.forEach(el => {
        const div = document.createElement('div');
        div.className = `element ${state.selectedId === el.id ? 'selected' : ''}`;
        div.style.left = el.x + 'px';
        div.style.top = el.y + 'px';
        div.style.width = el.w + 'px';
        div.style.height = el.h + 'px';
        div.style.backgroundColor = el.styles.backgroundColor;
        div.style.fontSize = el.styles.fontSize + 'px';
        div.style.color = el.styles.color;
        div.innerText = el.content;

        // Событие выбора и начала перетаскивания
        div.onmousedown = (e) => {
            if (state.viewMode !== 'edit') return;
            e.stopPropagation();
            state.selectedId = el.id;
            state.dragging = { id: el.id, startX: e.clientX - el.x, startY: e.clientY - el.y };
            updateProperties();
            render();
        };

        canvas.appendChild(div);
    });
}

// --- Перетаскивание (Drag & Drop) ---
window.onmousemove = (e) => {
    if (state.dragging) {
        const el = state.elements.find(item => item.id === state.dragging.id);
        el.x = e.clientX - state.dragging.startX;
        el.y = e.clientY - state.dragging.startY;
        render();
        updateProperties();
    }
};

window.onmouseup = () => {
    state.dragging = null;
};

// --- Обновление свойств в правой панели ---
function updateProperties() {
    const el = state.elements.find(item => item.id === state.selectedId);
    if (!el) {
        propFields.innerHTML = 'Выберите объект';
        return;
    }
    
    propFields.innerHTML = `
        <label>Текст</label>
        <input type="text" value="${el.content}" oninput="updateElementContent(this.value)">
        <label>Размер шрифта</label>
        <input type="range" min="10" max="100" value="${el.styles.fontSize}" oninput="updateFontSize(this.value)">
    `;
}

// Функции-хелперы для обновления данных (вместо setState)
window.updateElementContent = (val) => {
    const el = state.elements.find(item => item.id === state.selectedId);
    el.content = val;
    render();
};

window.updateFontSize = (val) => {
    const el = state.elements.find(item => item.id === state.selectedId);
    el.styles.fontSize = val;
    render();
};

// --- Инициализация ---
render();
