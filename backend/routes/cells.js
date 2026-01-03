//cells.js
const express = require('express');
const router = express.Router();
const Cell = require('../models/Cell');

router.get('/', async (req, res) => {
    try {
        const cells = await Cell.find({});
        res.json(cells);
    } catch {
        res.status(500).json({ error: 'Erro ao buscar células' });
    }
});

router.post('/:id/click', async (req, res) => {
    const { user } = req.body;
    const cellId = req.params.id;

    if (!user) return res.status(400).json({ error: 'Nome do usuário é obrigatório' });

    try {
        const cell = await Cell.findOneAndUpdate(
            { id: cellId, clicks: { $lt: 2 } },
            { $push: { names: user }, $inc: { clicks: 1 } },
            { new: true }
        );

        if (!cell) {
            return res.status(400).json({ error: 'Cell already full' });
        }

        res.json(cell);
    } catch {
        res.status(500).json({ error: 'Erro ao atualizar célula' });
    }
});

router.post('/reset', async (req, res) => {
    try {
        await Cell.updateMany({}, { $set: { names: [], clicks: 0 } });
        res.json({ message: 'Tabela resetada com sucesso' });
    } catch {
        res.status(500).json({ error: 'Erro ao resetar tabela' });
    }
});

module.exports = router;
