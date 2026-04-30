# 🚀 Projeto Fullstack (React + Node.js)

Este projeto é uma aplicação fullstack com backend em Node.js usando Express e frontend em React utilizando Vite.

---

## 📦 Tecnologias utilizadas

* Backend:

  * Node.js
  * Express
* Frontend:

  * React
  * Vite
* Ferramentas:

  * ESLint

---

## ⚙️ Como rodar o projeto

### 🔧 Backend

1. Inicialize o projeto:

```bash
npm init -y
```

2. Instale as dependências:

```bash
npm install express
npm install eslint --save-dev
```

3. Execute o servidor:

```bash
node server.js
```

---

### 🎨 Frontend

1. Crie o projeto com Vite:

```bash
npm create vite@latest
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run dev
```

4. Acesse no navegador:

```
http://localhost:5173
```

---

## 📁 Estrutura sugerida

```
/projeto
  /backend
    server.js
  /frontend
    (projeto vite)
```

---

## 🧠 Observações

* O backend roda normalmente na porta 3000 (ou definida no server.js)
* O frontend roda na porta padrão do Vite (5173)
* Configure CORS no backend se necessário para comunicação entre frontend e backend

---

## 📌 Próximos passos

* Integrar frontend com backend via API
* Configurar variáveis de ambiente
* Adicionar banco de dados
* Melhorar organização do projeto

---
