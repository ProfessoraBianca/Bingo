//script.js
const tableElement = document.querySelector('table');
const API_URL = 'https://bingo-backend-eycs.onrender.com'
const rows = document.querySelectorAll('tr');
rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, colIndex) => {
        cell.dataset.cell = `r${rowIndex + 1}c${colIndex + 1}`;
        cell.clickCount = 0;
    });
});

async function populateTable() {
    try {
        const res = await fetch(`${API_URL}/cells`);
        const cellsData = await res.json();

        cellsData.forEach(cellData => {
            const td = document.querySelector(`[data-cell="${cellData.id}"]`);
            if (!td) return;

            td.clickCount = cellData.clicks;

            cellData.names.forEach(name => {
                const p = document.createElement('p');
                p.classList.add('addContent');
                p.textContent = name;
                td.appendChild(p);
            });

            if (td.clickCount >= 2) td.classList.add('blocked');
        });
    } catch (err) {
        console.error('Erro ao popular tabela:', err);
    }
}

populateTable();

tableElement.addEventListener('click', async function(event) {
    const td = event.target.closest('td');
    if (!td || td.clickCount >= 2) return;
    const cellId = td.dataset.cell;

    const userName = prompt('Digite seu nome');
    if (!userName) return;

    try {
        const res = await fetch(`${API_URL}/cells/${cellId}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userName })
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            td.classList.add('blocked');
        } else {
            td.clickCount = data.clicks;

            const newPara = document.createElement('p');
            newPara.classList.add('addContent');
            newPara.textContent = userName;
            td.appendChild(newPara);

            if (td.clickCount >= 2) td.classList.add('blocked');
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
    }
});
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', async () => {
    if (!confirm('Deseja resetar o bingo?')) return;

    try {
        const res = await fetch(`${API_URL}/cells/reset`, {
            method: 'POST'
        });

        const data = await res.json();
        console.log(data);

        resetDOM();
    } catch (err) {
        console.error('Erro ao resetar:', err);
    }
});

function resetDOM() {
    document.querySelectorAll('td').forEach(td => {
        td.clickCount = 0;
        td.classList.remove('blocked');

        td.querySelectorAll('.addContent').forEach(p => p.remove());
    });
}


