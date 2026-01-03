//script.js
const tableElement = document.querySelector('table');
const API_URL = 'https://bingo-backend-eycs.onrender.com';

const rows = document.querySelectorAll('tr');
rows.forEach((row, rowIndex) => {
    row.querySelectorAll('td').forEach((cell, colIndex) => {
        cell.dataset.cell = `r${rowIndex + 1}c${colIndex + 1}`;
        cell.clickCount = 0;
    });
});

async function populateTable() {
    const res = await fetch(`${API_URL}/cells`);
    const cellsData = await res.json();

    cellsData.forEach(cellData => {
        const td = document.querySelector(`[data-cell="${cellData.id}"]`);
        if (!td) return;

        td.clickCount = cellData.clicks;
        td.innerHTML = '';

        cellData.names.forEach(name => {
            const p = document.createElement('p');
            p.classList.add('addContent');
            p.textContent = name;
            td.appendChild(p);
        });

        if (td.clickCount >= 2) td.classList.add('blocked');
    });
}

populateTable();

tableElement.addEventListener('click', async event => {
    const td = event.target.closest('td');
    if (!td || td.clickCount >= 2 || td.classList.contains('pending')) return;

    const userName = prompt('Digite seu nome');
    if (!userName) return;

    td.classList.add('pending');
    td.clickCount += 1;

    const p = document.createElement('p');
    p.classList.add('addContent', 'pendingText');
    p.textContent = userName;
    td.appendChild(p);

    if (td.clickCount >= 2) td.classList.add('blocked');

    try {
        const res = await fetch(`${API_URL}/cells/${td.dataset.cell}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userName })
        });

        const data = await res.json();

        if (data.error) throw new Error();

        p.classList.remove('pendingText');
        td.clickCount = data.clicks;
    } catch {
        p.remove();
        td.clickCount -= 1;
        td.classList.remove('blocked');
    } finally {
        td.classList.remove('pending');
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



