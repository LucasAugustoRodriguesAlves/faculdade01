import express from "express";
import autenticar from "./seguranca/autenticar.js";
import session from "express-session";

const porta = 3000;
const localhost = "0.0.0.0";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "minhachavesecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.get("/login", (requisicao, resposta) => {
  resposta.redirect("/login.html");
});

app.post("/login", (requisicao, resposta) => {
  const usuario = requisicao.body.usuario;
  const senha = requisicao.body.senha;
  if (usuario === "admin" && senha === "admin") {
    requisicao.session.autenticado = true;
    resposta.redirect("/privado/menu.html");
  } else {
    resposta.redirect("/login.html");
  }
});

app.get("/logout", (requisicao, resposta) => {
  requisicao.session.destroy();
  resposta.redirect("/login.html");
});

// Applying autenticar middleware before serving static files in the "privado" folder
app.use("/privado", autenticar, express.static("./privado"));

// Serving static files in the "publico" folder without authentication
app.use(express.static("./publico"));

app.listen(porta, localhost, () => {
  console.log(`Servidor rodando em http://${localhost}:${porta}`);
});
