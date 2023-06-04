/** SERVIÇO DE LIMPEZA DE ARQUIVO DE LOGS
 * Esse serviço serve para limpar completamente um arquivo de logs.
 * Apenas os dados no arquivo são excluídos, deixando-o em branco.
**/
const inventoryController = require('../controllers/inventory-controller');
const fs = require('fs');

// Função principal do serviço
// Recebe endereço do arquivo de log a ser limpo
function clearAllResults(logFilePath) {
  try {
    // Limpa o conteúdo do arquivo de log
    fs.writeFileSync(logFilePath, '');
    console.log(`Arquivo de log ${logFilePath} limpo`);
  } catch (err) {
    console.log(`Erro ao limpar o arquivo de log ${logFilePath}: ${err}`);
  }
}

// Adiciona o serviço ao repositório
inventoryController.addService({
  name: "log-clear-results",
  description: "Serviço para limpar um arquivo de log",
  endpoint: "log/clear-results",
  handler: clearAllResults
});

// Exporta as funções dos serviços
module.exports = {
  clearAllResults
};
