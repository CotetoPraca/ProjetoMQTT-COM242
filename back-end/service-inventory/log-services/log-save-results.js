/** SERVIÇO DE REGISTRO DE LOGS EM ARQUIVO
 * Esse serviço serve para salvar os logs resultantes no arquivo solicitado.
 * Recebe como parâmetro o endereço do arquivo de destino e a informação a ser salva.
 * De forma opcional, também pode receber a quantidade máxima de logs desejados no arquivo.
 * A verificação e liberação de linhas no arquivo é tratado por outro serviço.
 * A informação é salva junto do seu timestamp de registro no final do arquivo.
**/
const inventoryController = require('./controllers/inventory-controller');
const fs = require('fs');

// Função principal do serviço
// Recebe endereço do arquivo de log e a mensagem a ser salvo nele
function saveResultToLog(logFilePath, data, maxResults = 0) {
  const logEntry = `${new Date().toISOString()}: ${data}\n`;

  // Adiciona o log ao arquivo de log usando o método appendFile
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.log(`Erro ao adicionar entrada de log ao arquivo ${logFilePath}: ${err}`);
    } else {
      console.log(`Entrada de log adicionada ao arquivo ${logFilePath}`);
      if (maxResults !== 0) {
        inventoryController.getServiceByName('log-open-space').handler(logFilePath, maxResults);
      }
    }
  });
}

// Adiciona o serviço ao repositório
inventoryController.addService({
  name: "log-save-results",
  description: "Serviço para salvar informações de registro em um arquivo de log específico",
  endpoint: "/log/save-results",
  handler: saveResultToLog
});

// Exporta as funções do serviço
module.exports = {
  saveResultToLog
};