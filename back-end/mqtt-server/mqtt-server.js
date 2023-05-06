const mosca = require('mosca');
const inventoryController = require('../service-inventory/controllers/inventory-controller');

// Mapeamento de tópicos para serviços
const topicMapping = {
  "teste": "hello-world"
  // Adicionar mais mapeamentos conforme o necessário
};

// Variável para armazenar os resultados das mensagens MQTT processadas
const mqqtResults = [];

// Configurações para a retenção de histórico
const maxResults = 50; // Manter no máximo 50 resultados

function start() {
  const mqttServer = new mosca.Server({
    port: 1833 //porta padrão para o MQTT
  });

  mqttServer.on('published', function(packet, client) {
    const message = packet.payload.toString();
    const topic = packet.topic;

    console.log(`Mensagem recebida no tópico ${topic}: ${message}`);

    // Checa se o topic possui um serviço mapeado para si
    if (topicMapping.hasOwnProperty(topic)) {
      const serviceName = topicMapping[topic];
      const service = inventoryController.getServiceByName(serviceName);

      if (service) {
        //Importa o serviço dinamicamente usando o require()
        const serviceModule = require(`../service-inventory/${serviceName}`);
        const serviceFunction = serviceModule[service.handler];

        if (typeof serviceFunction === 'function') {
          // Chama a função principal do serviço correspondente
          const result = serviceFunction(message);

          // Armazena o resulado no array mqttResults
          mqqtResults.push(result);

          // Executa a limpeza se o vetor exceder o limite máximo
          if (mqqtResults.length > maxResults) {
            openHistorySpace();
          }
        } else {
          console.log(`A funçao ${service.handler} no serviço ${serviceName} não foi encontrada`);
        }
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

// Método para manter o histórico dentro do limite de resultados
function openHistorySpace() {
  while (mqttResults.length > maxResults) {
    mqttResults.shift(); // Remove o primeiro elemento do vetor
  }
  console.log('Vetor de resultados limpo');
}

// Os seguinte métodos são chamados externamente por serviços:

// Método para retornar os resultados das mensagens MQTT processadas
function getResults() {
  return mqttResults;
}

// Método para limpar o histórico de resultados
function clearResults() {
  mqttResults = [];
  console.log('Histórico de resultados limpo');
}

// Exporta a função de inicialização do servidor
module.exports = {
  start
};