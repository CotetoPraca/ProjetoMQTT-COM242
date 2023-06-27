/** SERVIÇO DE ATUALIZAÇÃO DE LOGS LOCAL VIA HTTP
 * Este serviço solicita uma atualização do arquivo de logs local do ambiente Python.
 * A função principal recebe como parâmetro as informações do endereço de origem
 * dos dados em formato JSON (hostname, port e path).
 * Após o recebimento dos dados, o serviço retorna uma mensagem de confirmação
 * ao endereço de origem e atualiza o arquivo de logs local.
**/
const inventoryController = require('../controllers/inventory-controller');
const axios = require('axios');

// Função principal do serviço de solicitação de atualização dos logs
// Recebe as informações do sistema Python, a quantidade de logs a serem solicitados e a tag MQTT
async function solicitarAtualizacaoLogs(sistemaPython, quantidadeLogs, tagMQTT) {
  const url = `http://${sistemaPython.hostname}:${sistemaPython.port}`; // Constrói a URL com base nas informações do sistema Python
  const params = {
    quantidadeLogs: quantidadeLogs,
    tagMQTT: tagMQTT
  }; // Define os parâmetros da requisição

  try {
    const response = await axios.get(url, { params }); // Faz uma requisição GET utilizando o Axios, passando a URL e os parâmetros
    const logsAtualizados = response.data; // Obtém os dados da resposta
    console.log('Logs atualizados: ', logsAtualizados); // Exibe os logs atualizados
    salvarLogsLinhaPorLinha(logsAtualizados); // Chama a função para salvar os logs
    console.log('Atualização dos logs recebida e processada com sucesso'); // Exibe uma mensagem de confirmação
  } catch (error) {
    console.error('Erro ao solicitar a atualização dos logs: ', error); // Exibe o erro, caso ocorra algum problema na requisição
  }
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
