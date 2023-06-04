/** SERVIÇO DE LEITURA DE ARQUIVO DE LOGS
 * Esse serviço serve para retornar todos os registros salvos em um arquivo de logs.
 * Recebe como parâmetro apenas o endereço do arquivo a ser lido.
**/
const inventoryController = require('../controllers/inventory-controller');
const fs = require('fs');

// Função principal do serviço
// Recebe o endereço do arquivo de logs a ser lido
function getAllResults(logFilePath) {
  try {
    // Lê o conteúdo do arquivo de log e retorna como resultado
    const logContent = fs.readFileSync(logFilePath, 'utf8');
    return logContent;
  } catch (err) {
    console.log(`Erro ao ler o arquivo de log ${logFilePath}: ${err}`);
    return null;
  }
}

// Adiciona os serviços ao repositório
inventoryController.addService({
  name: "log-get-results",
  description: "Serviço para obter todos os registros salvos em um arquivo de log",
  endpoint: "/log/get-results",
  handler: getAllResults
});

// Exporta as funções dos serviços
module.exports = {
  getAllResults
};
