//cells.js

const express = require('express');
const router = express.Router();
const Cell = require('../models/Cell');

router.get('/', async (req, res) => {
    try {
        const cells = await Cell.find({});
        res.json(cells);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar células' });
    }
});

router.post('/:id/click', async (req, res) => {
    const { user } = req.body;
    const cellId = req.params.id;

    if (!user) return res.status(400).json({ error: 'Nome do usuário é obrigatório' });

    try {
        const cell = await Cell.findOne({ id: cellId });
        if (!cell) return res.status(404).json({ error: 'Cell not found' });

        if (cell.clicks >= 2) {
            return res.status(400).json({ error: 'Cell already full' });
        }

        cell.names.push(user);
        cell.clicks += 1;
        await cell.save();

        res.json(cell);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar célula' });
    }
});

module.exports = router;
