// importação das bibliotecas
const express = require("express");
const cors = require("cors");
const db = require("./src/database");

// iniciação do servidor 
const app = express();
const PORT = 3000;

// middlewares
app.use(cors({
  // Permite apenas o Vite em localhost:5173; para liberar todos, altere para origin: "*"
  origin: "http://localhost:5173",
}));
app.use(express.json());

app.use("/usuario", require("./src/rotas/usuario"));

// verificação de teste para ver se está ativo
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

// iniciação do servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
