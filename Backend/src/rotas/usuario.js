const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const upload = multer();

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

// EDITAR PARCIALMENTE O PERFIL DO USUÁRIO
router.patch("/:id_usuario", (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nome, email, cpf, senhaAtual, senhaNova } = req.body;

    if (!senhaAtual) {
      return res.status(400).json({
        erro: "Senha de confirmação é obrigatória"
      });
    }

    const usuario = db
      .prepare("SELECT * FROM usuario WHERE id_usuario = ?")
      .get(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    if (usuario.senha !== senhaAtual) {
      return res.status(400).json({
        erro: "Senha de confirmação inválida"
      });
    }

    const campos = [];
    const valores = [];

    if (nome) {
      campos.push("nome = ?");
      valores.push(nome);
    }

    if (email) {
      const emailExiste = db
        .prepare(`
          SELECT * FROM usuario
          WHERE email = ?
          AND id_usuario != ?
        `)
        .get(email, id_usuario);

      if (emailExiste) {
        return res.status(400).json({
          erro: "Email já cadastrado"
        });
      }

      campos.push("email = ?");
      valores.push(email);
    }

    if (cpf) {
      const cpfExiste = db
        .prepare(`
          SELECT * FROM usuario
          WHERE cpf = ?
          AND id_usuario != ?
        `)
        .get(cpf, id_usuario);

      if (cpfExiste) {
        return res.status(400).json({
          erro: "CPF já cadastrado"
        });
      }

      campos.push("cpf = ?");
      valores.push(cpf);
    }

    if (senhaNova) {
      campos.push("senha = ?");
      valores.push(senhaNova);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        erro: "Nenhum campo enviado para atualização"
      });
    }

    valores.push(id_usuario);

    const resultado = db.prepare(`
      UPDATE usuario
      SET ${campos.join(", ")}
      WHERE id_usuario = ?
    `).run(...valores);

    const usuarioAtualizado = db.prepare("SELECT * FROM usuario WHERE id_usuario = ?").get(id_usuario);

    res.status(200).json({
      mensagem: "Perfil atualizado com sucesso!",
      usuario: {
        id_usuario: usuarioAtualizado.id_usuario,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        cpf: usuarioAtualizado.cpf,
        tipoUsuario: usuarioAtualizado.tipoUsuario,
      },
      linhasAlteradas: resultado.changes
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({
      erro: "Erro ao atualizar perfil"
    });
  }
});

// DELETAR USUÁRIO
router.delete("/:id_usuario", (req, res) => {
  try {
    const { id_usuario } = req.params;

    const usuario = db
      .prepare("SELECT * FROM usuario WHERE id_usuario = ?")
      .get(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    if (usuario.tipoUsuario === "professor") {
      db.prepare(
        "DELETE FROM professor WHERE id_usuario = ?"
      ).run(id_usuario);
    }

    if (usuario.tipoUsuario === "aluno") {
      db.prepare(
        "DELETE FROM aluno WHERE id_usuario = ?"
      ).run(id_usuario);
    }

    const resultado = db.prepare(
      "DELETE FROM usuario WHERE id_usuario = ?"
    ).run(id_usuario);

    res.status(200).json({
      mensagem: "Usuário removido com sucesso!",
      linhasRemovidas: resultado.changes
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({
      erro: "Erro ao remover usuário"
    });
  }
});

module.exports = router;