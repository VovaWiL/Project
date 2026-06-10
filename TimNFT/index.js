const items = [
    { name: "Обычный предмет", rarity: "common" },
    { name: "Редкий предмет", rarity: "rare" },
    { name: "Легендарка!", rarity: "legendary" }
];

document.getElementById('openBtn').addEventListener('click', () => {
    const count = parseInt(document.getElementById('caseCount').value);
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = ''; // Очищаем перед новым открытием

    for (let i = 0; i < count; i++) {
        const item = getRandomItem();
        const div = document.createElement('div');
        div.className = `item ${item.rarity}`;
        div.innerText = item.name;
        inventory.appendChild(div);
    }
});

function getRandomItem() {
    const rand = Math.random() * 100;
    if (rand < 70) return items[0]; // 70% шанс
    if (rand < 95) return items[1]; // 25% шанс
    return items[2];                // 5% шанс
}