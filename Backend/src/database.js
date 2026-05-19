const Database = require('better-sqlite3'); 
const db = new Database('database.db');

    //usuario
db.exec(`
        CREATE TABLE IF NOT EXISTS usuario(
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            senha TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            tipoUsuario TEXT NOT NULL CHECK(tipoUsuario IN ('professor', 'aluno'))
        )
    `);

    //professor
db.exec(`
        CREATE TABLE IF NOT EXISTS professor(
            id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            foto TEXT, 
            biografia TEXT,
            saldoComissao REAL DEFAULT 0,
            listaVideoAulas TEXT, 

            FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        )
    `);

    //aluno
db.exec(`
        CREATE TABLE IF NOT EXISTS aluno(
            id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            historicoCompras TEXT, 
            formaPagamento TEXT,

            FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        )
    `);

    //videoaula
db.exec(`
        CREATE TABLE IF NOT EXISTS videoaula(
            id_videoaula INTEGER PRIMARY KEY AUTOINCREMENT,
            id_professor INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            descricao TEXT,
            valor REAL NOT NULL,
            gratuito INTEGER NOT NULL CHECK (gratuito IN (0, 1)),
            totalVendas INTEGER DEFAULT 0,


            FOREIGN KEY (id_professor) REFERENCES professor(id_professor)
        )
    `);

    //pagamento
db.exec(`
        CREATE TABLE IF NOT EXISTS pagamento(
            id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
            id_aluno INTEGER NOT NULL,
            id_videoaula INTEGER NOT NULL,
            valor REAL NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('concluido', 'cancelado')),
            dataPagamento TEXT NOT NULL,

            FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno),
            FOREIGN KEY (id_videoaula) REFERENCES videoaula(id_videoaula)
        )
    `);

    //avaliação
db.exec(`
        CREATE TABLE IF NOT EXISTS avaliacao(
            id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
            id_aluno INTEGER NOT NULL,
            id_videoaula INTEGER NOT NULL,
            nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
            comentario TEXT,

            FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno),
            FOREIGN KEY (id_videoaula) REFERENCES videoaula(id_videoaula)
        )
    `);

module.exports = db;