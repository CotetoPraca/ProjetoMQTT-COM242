const express = require('express');
const app = express();
const mqttServer = require('./mqtt-server/mqtt-server');
const inventoryController = require('./service-inventory/controllers/inventory-controller');
const mqttHistoryService = require('./mqtt-server/mqtt-services/mqtt-history');
const mqttHistoryCleanupService = require('./mqtt-server/mqtt-services/mqtt-history-cleanup');
const helloWorldService = require('./service-inventory/hello-world');

// Middleware para fazer o parsing do corpo das requisições como JSON
app.use(express.json());

// Configuração do servidor MQTT
mqttServer.start();

// Rota para a página inicial
app.get('/', (req, res) => {
  res.send('Bem vindo ao inventário de serviços!');
});

// Rota para adicionar um serviço
app.post('/services', (req, res) => {
  const newService = req.body;
  inventoryController.addService(newService);
  res.send('Serviço adicionado com sucesso');
});

// Rota para listar todos os serviços
app.get('/services', (req, res) => {
  const services = inventoryController.getAllServices();
  res.send(services);
});

// Rota para exibir os resultados de processamento das mensagens MQTT
app.get('/mqtt/history', (req, res) => {
  mqttHistoryService.showHistory();
  res.send('Histórico de resultados do MQTT limpo com sucesso');
});

// Rota para limpar o histórico de resultados
app.get('/mqtt/history-cleanup', (req, res) => {
  mqttHistoryCleanupService.historyCleanup();
  res.send('Histórico de resultados do MQTT limpo com sucesso');
});

// Rota para chamar o serviço hello-world
app.get('/hello-world', (req, res) => {
  helloWorldService.helloWorld();
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});