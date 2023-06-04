const mosca = require('mosca');
const inventoryController = require('../service-inventory/controllers/inventory-controller');

const path = require('path');

// Mapeamento de tópicos para serviços
const topicMapping = {
  "teste": "hello-world"
  // Adicionar mais mapeamentos conforme o necessário
};

// Configurações para a retenção de histórico.
const logFilePath = path.join(__dirname, '../logs/mqtt-server-logs/mqtt-results.log'); // Caminho padrão para o arquivo de logs do servidor MQTT
const maxResults = 50; // Manter no máximo 50 resultados.

function start() {
  const mqttServer = new mosca.Server({
    port: 1833 //porta padrão para o MQTT
  });

  mqttServer.on('published', function(packet, client) {
    const message = packet.payload.toString();
    const topic = packet.topic;

    console.log(`Mensagem recebida no tópico ${topic}: ${message}`);

    // Checa se o tópico possui um serviço mapeado para si
    if (topicMapping.hasOwnProperty(topic)) {
      const serviceName = topicMapping[topic];
      const service = inventoryController.getServiceByName(serviceName);

      if (service) {
        // Chama a função principal do serviço correspondente
        const result = service.handler(message);

        // Salva o resultado no arquivo de logs
        inventoryController.getServiceByName('log-save-results').handler(logFilePath, result, maxResults);
      } else {
        console.log(`O serviço ${topicMapping[topic]} mapeado para o tópico ${topic} não foi encontrado`);
      }
    } else {
      console.log(`Nenhum serviço mapeado para o tópico: ${topic}`);
    }
  });

  // Publica mensagens MQTT
  mqttServer.on('ready', function() {
    console.log('Servidor MQTT iniciado');
  });
}

// Exporta a função de inicialização do servidor
module.exports = {
  start
};