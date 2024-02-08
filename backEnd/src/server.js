const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importando o pacote CORS
const championRoutes = require('../src/routes/championRoutes.routes');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Middleware para análise do corpo da requisição
app.use(bodyParser.json());

// Middleware para permitir solicitações CORS
app.use(cors());

// Rotas
app.use(championRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});
