/*
Esse serviço requisita ao servidor MQTT os valores armazenados no histórico.
O serviço aciona o método implementado no servidor que retorna o vetor histórico.
*/
const inventoryController = require('../../service-inventory/controllers/inventory-controller');
const mqttServer = require('../mqtt-server');

// Função principal do serviço
function showHistory() {
  // Chama o método getResults implementado no mqtt-server.js
  // retornando todos os valores no histórico de resultados
  return mqttServer.getResults();
}

// Adiciona o serviço ao repositório local
inventoryController.addService({
  name: "mqtt-history",
  description: "Serviço para retornar todo o histórico de resultados do MQTT",
  endpoint: "/mqtt/history",
  handler: "showHistory"
});

// Exporta as funções do serviço
module.exports = {
  showHistory
};