// importação das bibliotecas
const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const path = require("path");

// iniciação do servidor 
const app = express();
const PORT = 3000;

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// middlewares
app.use(cors({
  // Permite apenas o Vite em localhost:5173; para liberar todos, altere para origin: "*"
  origin: "http://localhost:5173",
}));
app.use(express.json());

//Rotas
app.use("/usuario", require("./src/rotas/usuario"));
app.use("/professor", require("./src/rotas/professor"));
app.use("/videoaula", require("./src/rotas/videoaula"));
app.use("/aluno", require("./src/rotas/aluno"));
app.use("/pagamento", require("./src/rotas/pagamento"));
app.use("/avaliacao", require("./src/rotas/avaliacao"));

// verificação de teste para ver se está ativo
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

// iniciação do servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
