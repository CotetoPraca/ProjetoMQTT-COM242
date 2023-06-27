/** SERVIÇO DE ATUALIZAÇÃO DE LOGS LOCAL VIA HTTP
 * Este serviço solicita uma atualização do arquivo de logs local do ambiente Python.
 * A função principal recebe como parâmetro as informações do endereço de origem
 * dos dados em formato JSON (hostname, port e path).
 * Após o recebimento dos dados, o serviço retorna uma mensagem de confirmação
 * ao endereço de origem e atualiza o arquivo de logs local.
**/
const inventoryController = require('../controllers/inventory-controller');
const http = require('http');

// Função principal do serviço de solicitação de atualização dos logs
// Recebe as informações do sistema Python, a quantidade de logs a serem solicitados e a tag MQTT
function solicitarAtualizacaoLogs(sistemaPython, quantidadeLogs, tagMQTT) {
  const options = {
    hostname: sistemaPython.hostname,  // Endereço IP do servidor
    port: sistemaPython.port,          // Porta em que o servidor está ouvindo
    path: `${sistemaPython.path}/logs?quantidadeLogs=${quantidadeLogs}&tag=${tagMQTT}`,  // Caminho do endpoint no servidor
    method: 'GET',                     // Método HTTP a ser usado
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const logsAtualizados = JSON.parse(data);
      console.log('Logs atualizados: ', logsAtualizados);
      salvarLogsLinhaPorLinha(logsAtualizados);

      // Imprime uma mensagem de confirmação de recebimento no console
      console.log('Atualização dos logs recebida e processada com sucesso');
    });
  });

  req.on('error', (error) => {
    console.error('Erro ao solicitar a atualização dos logs: ', error);
  });

  req.end();
}

// Função para salvar os logs linha por linha (uso interno do serviço)
function salvarLogsLinhaPorLinha(logs) {
  const logFilePath = "../../logs/python-application-logs/python-application.log"; // Caminho padrão do arquivo de logs

  logs.forEach((log) => {
    const logLine = `${log.timestamp} - ${log.tagMQTT} - ${log.message}`;
    inventoryController.getServiceByName("log-save-results").handler(logFilePath, logLine);
  });
}

// Adiciona o serviço de solicitação de atualização dos logs ao repositório
inventoryController.addService({
  name: 'http-update-log-file',
  description: 'Serviço para solicitar a atualização dos logs do sistema Python',
  endpoint: '/http/update-log-file',
  handler: solicitarAtualizacaoLogs,
});

// Exporta as funções do serviço
module.exports = {
  solicitarAtualizacaoLogs,
};
