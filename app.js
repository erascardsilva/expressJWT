const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const hostname = "127.0.0.1";
const jwt = require('jsonwebtoken');
const passSecr = "Erasmo 1234";

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send({
        message: "Testando JSON !!!"
    });
});

app.post('/login', (req, res, next) => {
    if (req.body.user === "Erasmo" && req.body.passw === "3727") {
        const id = 1;
        const token = jwt.sign({ id }, passSecr, {
            expiresIn: 150
        });
        return res.json({ auth: true, token: token });
    }
    res.status(500).json({ message: "Login Invalid" });
});

app.get('/ver', verificaToken, (req, res, next) => {
    console.log("Todos");
    res.json([{ id: 1, nome: "Erasmo" }]);
});

function verificaToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token extraído:', token);
    if (!token) return res.status(401).json({ auth: false, message: 'Sem Token !!' });

    jwt.verify(token, passSecr, function (err, decode) {
        if (err) return res.status(500).json({ auth: false, message: "Erro autentificação" });
        req.user = decode.id;
        next();
    });
};


app.listen(PORT, () => {
    console.log(`Estamos Online http://${hostname}:${PORT}`);
})
