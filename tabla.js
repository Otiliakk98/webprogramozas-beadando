document.addEventListener('DOMContentLoaded', function() {
    // Kezdeti adatok
    let data = [
        { id: 1, name: "Kovács János", email: "kovacs.janos07@gmail.com", age: 32 },
        { id: 2, name: "Nagy Eszter", email: "eszterken@gmail.com", age: 28 },
        { id: 3, name: "Tóth Béla", email: "t.bela@gmail.com", age: 45 },
        { id: 4, name: "Kiss Zsófia", email: "kisszs@gmail.com", age: 38}
    ];
    let editId = null;
    let sortColumn = 'name';
    let sortDirection = 'asc';

    // DOM elemek
    const tableBody = document.querySelector('#dataTable tbody');
    const dataForm = document.querySelector('#dataForm');
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const resetBtn = document.querySelector('#resetBtn');
    const cancelBtn = document.querySelector('#cancelBtn');

    // Táblázat frissítése
    function renderTable(items = data) {
        tableBody.innerHTML = '';
        
        // Rendezés
        const sortedItems = [...items].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        sortedItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.age}</td>
                <td>
                    <button class="edit-btn" data-id="${item.id}">Szerkeszt</button>
                    <button class="delete-btn" data-id="${item.id}">Töröl</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Eseményfigyelők hozzáadása
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteItem);
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editItem);
        });
    }

    // Új elem hozzáadása vagy szerkesztése
    dataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const age = parseInt(document.querySelector('#age').value);
        const id = document.querySelector('#editId').value;
        
        // Validáció
        if (!name || !email || isNaN(age)) {
            alert('Minden mező kitöltése kötelező!');
            return;
        }
        if (age < 18 || age > 99) {
            alert('Életkor 18 és 99 között legyen!');
            return;
        }

        if (id) {
            // Szerkesztés
            const index = data.findIndex(item => item.id === parseInt(id));
            data[index] = { id: parseInt(id), name, email, age };
            editId = null;
            document.querySelector('#editId').value = '';
            cancelBtn.style.display = 'none';
        } else {
            // Új elem
            const newItem = {
                id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
                name,
                email,
                age
            };
            data.push(newItem);
        }
        
        renderTable();
        dataForm.reset();
    });

    // Törlés
    function deleteItem(e) {
        if (confirm('Biztosan törölni szeretné ezt az elemet?')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            data = data.filter(item => item.id !== id);
            renderTable();
        }
    }

    // Szerkesztés
    function editItem(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const item = data.find(item => item.id === id);
        
        document.querySelector('#name').value = item.name;
        document.querySelector('#email').value = item.email;
        document.querySelector('#age').value = item.age;
        document.querySelector('#editId').value = item.id;
        editId = item.id;
        cancelBtn.style.display = 'inline-block';
        
        // Görgetés az űrlaphoz
        dataForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Keresés
    function searchItems() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderTable();
            return;
        }
        
        const filtered = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.email.toLowerCase().includes(searchTerm) ||
            item.age.toString().includes(searchTerm)
        );
        renderTable(filtered);
    }

    // Rendezés
    document.querySelectorAll('th[data-column]').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            
            // Rendezés irányának váltása
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            
            // Frissíti a nyilat a fejlécben
            document.querySelectorAll('th[data-column]').forEach(header => {
                header.innerHTML = header.innerHTML.replace(/ ↑| ↓/, '');
                if (header.getAttribute('data-column') === sortColumn) {
                    header.innerHTML += sortDirection === 'asc' ? ' ↑' : ' ↓';
                }
            });
            
            renderTable();
        });
    });

    // Eseményfigyelők
    searchBtn.addEventListener('click', searchItems);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchItems();
    });
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderTable();
    });
    cancelBtn.addEventListener('click', () => {
        dataForm.reset();
        editId = null;
        document.querySelector('#editId').value = '';
        cancelBtn.style.display = 'none';
    });

    // Kezdeti renderelés
    renderTable();
});

