// importação das bibliotecas
const express = require("express");
const db = require("./database");

// iniciação do servidor 
const app = express();
const PORT = 3000;

// middlewares
app.use(express.json());

// verificação de teste para ver se está ativo
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

// iniciação do servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
