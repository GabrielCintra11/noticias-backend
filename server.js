const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configurado para aceitar o front-end da Vercel e do Codespaces
const corsOptions = {
  origin: [
    "https://noticias-front-end.vercel.app",
    // Adicione abaixo a URL do seu Codespace na porta 8080 quando for testar localmente
    // "https://<seu-codespace>-8080.app.github.dev"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Banco de dados fictício
let noticias = [
  {
    id: 1,
    titulo: "CI/CD revoluciona o desenvolvimento",
    descricao: "Saiba como automação melhora a produtividade",
    categoria: "Tecnologia",
    data: "2024-01-15",
  },
  {
    id: 2,
    titulo: "Render lança novos recursos gratuitos",
    descricao: "Plano free agora inclui mais memória",
    categoria: "Plataformas",
    data: "2024-01-14",
  },
];

// GET: rota base
app.get("/", (req, res) => {
  res.json({
    message: "API de Notícias funcionando!",
    status: "online",
    versoes: ["/v1", "/noticias"],
  });
});

// GET: rota /v1 com mensagem e data/hora da chamada
app.get("/v1", (req, res) => {
  const agora = new Date();
  const chamadaEm = agora.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  res.json({
    message: "Api v1 respondendo no container docker...",
    chamada_em: chamadaEm,
  });
});

// GET: listar todas as notícias
app.get("/noticias", (req, res) => {
  res.json({
    mensagem: "Notícias carregadas",
    total: noticias.length,
    noticias: noticias,
  });
});

// GET: notícia por ID
app.get("/noticias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const noticia = noticias.find((n) => n.id === id);

  if (!noticia) {
    return res.status(404).json({ erro: "Notícia não encontrada" });
  }

  res.json(noticia);
});

// POST: criar nova notícia
app.post("/noticias", (req, res) => {
  const { titulo, descricao, categoria, data } = req.body;

  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e descrição são obrigatórios" });
  }

  const novaNoticia = {
    id: noticias.length + 1,
    titulo,
    descricao,
    categoria: categoria || "Geral",
    data: data || new Date().toISOString().split("T")[0],
  };

  noticias.push(novaNoticia);
  res.status(201).json(novaNoticia);
});

// DELETE: remover notícia
app.delete("/noticias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = noticias.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Notícia não encontrada" });
  }

  noticias.splice(index, 1);
  res.json({ mensagem: "Notícia removida com sucesso" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
