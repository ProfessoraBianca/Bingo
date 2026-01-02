//initCells.js
const Cell = require('../models/Cell');

async function initCells() {
    const count = await Cell.countDocuments();
    if (count > 0) return;

    const cells = [];
    for (let r = 1; r <= 5; r++) {
        for (let c = 1; c <= 5; c++) {
            cells.push({ id: `r${r}c${c}`, names: [], clicks: 0 });
        }
    }

    await Cell.insertMany(cells);
    console.log('Células inicializadas no DB!');
}

module.exports = initCells;
