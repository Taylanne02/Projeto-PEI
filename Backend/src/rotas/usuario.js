const express = require("express");
const router = express.Router();
const db = require("../database");

// CADASTRAR USUÁRIO
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

    let id_professor = null;
    let id_aluno = null;

    if (tipoUsuario === "professor") {
      const professor = db.prepare(`
        INSERT INTO professor (id_usuario, foto, biografia, saldoComissao, listaVideoAulas)
        VALUES (?, ?, ?, ?, ?)
      `).run(id_usuario, "", "", 0, "");

      id_professor = professor.lastInsertRowid;
    }

    if (tipoUsuario === "aluno") {
      const aluno = db.prepare(`
        INSERT INTO aluno (id_usuario, historicoCompras, formaPagamento)
        VALUES (?, ?, ?)
      `).run(id_usuario, "", "");

      id_aluno = aluno.lastInsertRowid;
    }

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      id_usuario,
      id_professor,
      id_aluno,
      tipoUsuario
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// LOGIN DO USUÁRIO
router.post("/login", (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const usuario = db
      .prepare("SELECT * FROM usuario WHERE email = ? AND senha = ?")
      .get(email, senha);

    if (!usuario) {
      return res.status(404).json({ erro: "Email ou senha inválidos" });
    }

    let dadosPerfil = null;

    if (usuario.tipoUsuario === "professor") {
      dadosPerfil = db
        .prepare("SELECT * FROM professor WHERE id_usuario = ?")
        .get(usuario.id_usuario);
    }

    if (usuario.tipoUsuario === "aluno") {
      dadosPerfil = db
        .prepare("SELECT * FROM aluno WHERE id_usuario = ?")
        .get(usuario.id_usuario);
    }

    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        ...usuario,
        id_professor: dadosPerfil?.id_professor,
        id_aluno: dadosPerfil?.id_aluno,
      },
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

// EDITAR PERFIL DO USUÁRIO
router.put("/:id_usuario", (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nome, email, senha, cpf } = req.body;

    if (!nome || !email || !senha || !cpf) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const usuarioExiste = db
      .prepare("SELECT * FROM usuario WHERE id_usuario = ?")
      .get(id_usuario);

    if (!usuarioExiste) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const emailCpfExiste = db
      .prepare(`
        SELECT * FROM usuario
        WHERE (email = ? OR cpf = ?)
        AND id_usuario != ?
      `)
      .get(email, cpf, id_usuario);

    if (emailCpfExiste) {
      return res.status(400).json({ erro: "Email ou CPF já está sendo usado por outro usuário" });
    }

    const resultado = db.prepare(`
      UPDATE usuario
      SET nome = ?, email = ?, senha = ?, cpf = ?
      WHERE id_usuario = ?
    `).run(nome, email, senha, cpf, id_usuario);

    res.status(200).json({
      mensagem: "Perfil atualizado com sucesso!",
      linhasAlteradas: resultado.changes
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao editar perfil" });
  }
});

module.exports = router;