/*
Esse serviço requisita ao servidor MQTT a limpeza do seu histórico de resultados.
O serviço aciona o método de limpeza do histórico implementado dentro do servidor.
*/
const inventoryController = require('../../service-inventory/controllers/inventory-controller');
const mqttServer = require('../mqtt-server');

// Função principal do serviço
function historyCleanup() {
  // Chama o método clearResults definido no arquivo mqtt-server.js
  mqttServer.clearResults();
}

// Adiciona o serviço ao repositório local
inventoryController.addService({
  name: "mqtt-history-cleanup",
  description: "Serviço para limpar todo o histórico de resultados do MQTT",
  endpoint: "/mqtt/history-cleanup",
  handler: "historyCleanup"
});

// Exporta as funções do serviço
module.exports = {
  historyCleanup
};