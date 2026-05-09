const express = require("express");
const router = express.Router();
const db = require("../database");

//POST- Cadastrar usuário, já salva automaticamento no banco de dados, 
//tanto para professor quanto para aluno, dependendo do tipoUsuario selecionado
router.post("/", (req, res) => {
  try {
    const { nome, email, senha, cpf, tipoUsuario } = req.body;

    if (!nome || !email || !senha || !cpf || !tipoUsuario) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    if (tipoUsuario !== "professor" && tipoUsuario !== "aluno") {
      return res.status(400).json({ erro: "tipoUsuario deve ser professor ou aluno" });
    }

    const usuarioExiste = db
      .prepare("SELECT * FROM usuario WHERE email = ? OR cpf = ?")
      .get(email, cpf);

    if (usuarioExiste) {
      return res.status(400).json({ erro: "Email ou CPF já cadastrado" });
    }

    const resultado = db.prepare(`
      INSERT INTO usuario (nome, email, senha, cpf, tipoUsuario)
      VALUES (?, ?, ?, ?, ?)
    `).run(nome, email, senha, cpf, tipoUsuario);

    const id_usuario = resultado.lastInsertRowid;

    if (tipoUsuario === "professor") {
      db.prepare(`
        INSERT INTO professor (id_usuario, foto, biografia, saldoComissao, listaVideoAulas)
        VALUES (?, ?, ?, ?, ?)
      `).run(id_usuario, "", "", 0, "");
    }

    if (tipoUsuario === "aluno") {
      db.prepare(`
        INSERT INTO aluno (id_usuario, historicoCompras, formaPagamento)
        VALUES (?, ?, ?)
      `).run(id_usuario, "", "");
    }

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      id_usuario,
      tipoUsuario
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

module.exports = router;