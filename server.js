import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância da aplicação Express.js
const app = express();

app.use(express.static("uploads"));

// Chama a função `routes` para configurar as rotas da aplicação.
// A função `routes` é importada de `postsRoutes.js`.
routes(app);

// Inicia o servidor na porta 3000 e imprime uma mensagem no console quando o servidor estiver ouvindo.
app.listen(3000, () => {
    console.log("Servidor escutando...");
});
