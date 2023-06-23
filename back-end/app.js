const express = require('express');
const app = express();
const mqttServer = require('./mqtt-server/mqtt-server');
const inventoryController = require('./service-inventory/controllers/inventory-controller');

// Middleware para fazer o parsing do corpo das requisições como JSON
app.use(express.json());

// Carrega os serviços manualmente
const servicesToLoad = [
  require('./service-inventory/auth-services/auth-user'),
  require('./service-inventory/log-services/log-clear-results'),
  require('./service-inventory/log-services/log-get-results'),
  require('./service-inventory/log-services/log-open-space'),
  require('./service-inventory/log-services/log-save-results'),
  require('./service-inventory/template-services/hello-world')
];

// Configuração do servidor MQTT
mqttServer.start();

// Rota para a página de login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front-end/login.html');
});

//rota para a página inicial. É Feito a verificação se o usuário está logado
app.get('/menu', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
    res.sendFile(__dirname + '/front-end/menu.html');
  } else {
    res.status(401).send('Faça login antes de continuar.');
  }
});

// Rota para adicionar um serviço
app.post('/services', (req, res) => {
  const newService = req.body;
  inventoryController.addService(newService);
  res.send('Serviço adicionado com sucesso');
});

// Rota para listar todos os serviços
app.get('/services', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
  const services = inventoryController.getAllServices();
  res.send(services); 
  } else {
  res.status(401).send('Faça login antes de continuar.');
}
});

// Rota para exibir os resultados de processamento das mensagens MQTT. rota interna
app.get('/mqtt/history', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
  logFilePath = '../logs/mqtt-server-logs/mqtt-results.log';
  const result = inventoryController.getServiceByName('log-get-results').handler(logFilePath);
  res.send(result);
} else {
  res.status(401).send('Faça login antes de continuar.');
}
});

//rota para exibir os resultados do processamento das mensagens MQTT. rota para o cliente.
app.get('/mqtt/history-page', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
    res.sendFile(__dirname + '/front-end/view.html');
} else {
  res.status(401).send('Faça login antes de continuar.');
}
});

// Rota para limpar o histórico de resultados
app.get('/mqtt/history-cleanup', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
  logFilePath = '../logs/mqtt-server-logs/mqtt-results.log';
  const result = inventoryController.getServiceByName('log-clear-results').handler(logFilePath);
  res.send(result);
} else {
  res.status(401).send('Faça login antes de continuar.');
}
});

// Rota para acessar a página hello-world
app.get('/hello-world-page', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) {
  res.sendFile(__dirname + '/front-end/helloworld.html');
  } else {
  res.status(401).send('Faça login antes de continuar.');
}
});

//rota interna para proceesar o hello world
app.get('/hello-world', (req, res) => {
  const token = req.query.token;
  if (validarToken(token)) { 
  const service = inventoryController.getServiceByName('hello-world');
  const result = service.handler();
  res.send(result);
} else {
  res.status(401).send('Faça login antes de continuar.');
}
});

// Rota para autenticar o usuário
app.get('/auth/user', (req, res) => {
  const { username, password } = req.query;
  const service = inventoryController.getServiceByName('auth-user');
  const result = service.handler(username, password);
  res.send(result);
});

function validarToken(token) {
  const service = inventoryController.getServiceByName('auth-user');
  return service.validateToken(token);
}

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
