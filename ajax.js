//Lokális adatbázis kezdeti adatokkal
let localDatabase = [
    { id: "1", name: "Teszt Felhasználó", height: "180", weight: "75" },
    { id: "2", name: "Második Felhasználó", height: "165", weight: "60" }
];

//DOM elemek kiválasztása
const elements = {
    readButton: document.getElementById('readData'),
    dataContainer: document.getElementById('dataContainer'),
    statsContainer: document.getElementById('statsContainer'),
    createForm: document.getElementById('createForm'),
    updateForm: document.getElementById('updateForm'),
    deleteForm: document.getElementById('deleteForm'),
    getDataButton: document.getElementById('getDataForId'),
    createName: document.getElementById('createName'),
    createHeight: document.getElementById('createHeight'),
    createWeight: document.getElementById('createWeight'),
    updateId: document.getElementById('updateId'),
    updateName: document.getElementById('updateName'),
    updateHeight: document.getElementById('updateHeight'),
    updateWeight: document.getElementById('updateWeight'),
    deleteId: document.getElementById('deleteId')
};

//Eseményfigyelők beállítása
function initializeEventListeners() {
    elements.readButton.addEventListener('click', fetchData);
    elements.createForm.addEventListener('submit', handleCreate);
    elements.updateForm.addEventListener('submit', handleUpdate);
    elements.deleteForm.addEventListener('submit', handleDelete);
    elements.getDataButton.addEventListener('click', getDataForUpdate);
}

//Adatok lekérése és megjelenítése
function fetchData() {
    try {
        const response = {
            rowCount: localDatabase.length,
            maxNum: 100,
            list: [...localDatabase]
        };
        displayData(response.list);
        calculateStats(response.list);
    } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        showFeedback("Hiba történt az adatok betöltésekor", "error");
    }
}

//Adatok megjelenítése táblázatban
function displayData(data) {
    if (!data || !Array.isArray(data)) {
        elements.dataContainer.innerHTML = '<div class="no-data">Érvénytelen adatok</div>';
        return;
    }

    if (data.length === 0) {
        elements.dataContainer.innerHTML = '<div class="no-data">Nincsenek megjeleníthető adatok</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Név</th>
                    <th>Magasság</th>
                    <th>Súly</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(item => {
        html += `
            <tr>
                <td>${escapeHtml(item.id)}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.height)}</td>
                <td>${escapeHtml(item.weight)}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    elements.dataContainer.innerHTML = html;
}

//Statisztika számítás és megjelenítés
function calculateStats(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        elements.statsContainer.innerHTML = '<div class="no-data">Nincsenek statisztikai adatok</div>';
        return;
    }

    try {
        const heights = data.map(item => parseFloat(item.height) || 0);
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = heights.length > 0 ? sum / heights.length : 0;
        const max = heights.length > 0 ? Math.max(...heights) : 0;

        elements.statsContainer.innerHTML = `
            <div class="stats">
                <h3>Magasság statisztikák</h3>
                <p><strong>Összeg:</strong> ${sum.toFixed(2)}</p>
                <p><strong>Átlag:</strong> ${avg.toFixed(2)}</p>
                <p><strong>Legnagyobb:</strong> ${max.toFixed(2)}</p>
            </div>
        `;
    } catch (error) {
        console.error("Hiba a statisztika számításánál:", error);
        elements.statsContainer.innerHTML = '<div class="no-data">Hiba a statisztikák generálásánál</div>';
    }
}

//Űrlap validáció
function validateInputs(...inputs) {
    for (const input of inputs) {
        if (!input || !input.value || !input.value.trim()) {
            showFeedback('Minden mezőt ki kell tölteni!', 'error');
            return false;
        }
        if (input.value.length > 30) {
            showFeedback('A mezők maximum 30 karaktert tartalmazhatnak!', 'error');
            return false;
        }
    }
    return true;
}

//Visszajelzés megjelenítése
function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    
    const container = document.querySelector('.content');
    if (container) {
        container.appendChild(feedback);
    }
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 500);
    }, 3000);
}

//Új rekord létrehozása
function handleCreate(e) {
    e.preventDefault();
    
    if (!validateInputs(elements.createName, elements.createHeight, elements.createWeight)) {
        return;
    }

    try {
        const newId = generateNewId();
        const newItem = {
            id: newId,
            name: elements.createName.value.trim(),
            height: elements.createHeight.value.trim(),
            weight: elements.createWeight.value.trim()
        };
        
        localDatabase.push(newItem);
        showFeedback('Sikeres létrehozás!');
        fetchData();
        elements.createForm.reset();
    } catch (error) {
        console.error("Hiba a létrehozáskor:", error);
        showFeedback('Hiba történt a létrehozáskor', 'error');
    }
}

//Új ID generálása
function generateNewId() {
    if (localDatabase.length === 0) return "1";
    
    const maxId = Math.max(...localDatabase.map(item => {
        const num = parseInt(item.id);
        return isNaN(num) ? 0 : num;
    }));
    
    return (maxId + 1).toString();
}

//Rekord adatainak lekérése módosításhoz
function getDataForUpdate() {
    const id = elements.updateId.value.trim();
    if (!id) {
        showFeedback('Add meg a rekord ID-ját!', 'error');
        return;
    }

    const item = localDatabase.find(item => item.id === id);
    if (item) {
        elements.updateName.value = item.name;
        elements.updateHeight.value = item.height;
        elements.updateWeight.value = item.weight;
        showFeedback('Adatok betöltve a szerkesztéshez');
    } else {
        showFeedback('Nem található rekord ezzel az ID-vel!', 'error');
    }
}

//Rekord módosítása
function handleUpdate(e) {
    e.preventDefault();
    
    if (!validateInputs(elements.updateId, elements.updateName, elements.updateHeight, elements.updateWeight)) {
        return;
    }

    try {
        const id = elements.updateId.value.trim();
        const index = localDatabase.findIndex(item => item.id === id);
        
        if (index === -1) {
            showFeedback('Nem található rekord!', 'error');
            return;
        }
        
        localDatabase[index] = {
            id: id,
            name: elements.updateName.value.trim(),
            height: elements.updateHeight.value.trim(),
            weight: elements.updateWeight.value.trim()
        };
        
        showFeedback('Sikeres módosítás!');
        fetchData();
    } catch (error) {
        console.error("Hiba a módosításkor:", error);
        showFeedback('Hiba történt a módosításkor', 'error');
    }
}

//Rekord törlése
function handleDelete(e) {
    e.preventDefault();
    
    const id = elements.deleteId.value.trim();
    if (!id) {
        showFeedback('Add meg a rekord ID-ját!', 'error');
        return;
    }

    if (!confirm('Biztosan törölni szeretnéd ezt a rekordot?')) {
        return;
    }

    try {
        const initialLength = localDatabase.length;
        localDatabase = localDatabase.filter(item => item.id !== id);
        
        if (localDatabase.length < initialLength) {
            showFeedback('Sikeres törlés!');
            fetchData();
            elements.deleteForm.reset();
        } else {
            showFeedback('Nem található rekord!', 'error');
        }
    } catch (error) {
        console.error("Hiba a törléskor:", error);
        showFeedback('Hiba történt a törléskor', 'error');
    }
}

//HTML speciális karakterek kezelése
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//Oldal betöltésekor végrehajtandó műveletek
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    fetchData();
});