require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const initCells = require('./controllers/initCells');
const cellsRouter = require('./routes/cells');

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use('/cells', cellsRouter);

connectDB().then(() => initCells());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
