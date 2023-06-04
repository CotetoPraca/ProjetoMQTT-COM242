/** SERVIÇO DE LIBERAÇÂO DE ESPAÇO EM ARQUIVO DE LOGS
 * Esse serviço serve para garantir que a quantidade de logs em um arquivo não ultrapasse a quantidade definida.
 * Recebe como parâmetros o endereço do arquivo e a quantidade limitante (opcional, 0 por padrão).
 * Se o valor ultrapassar a quantidade limitante, a função deleta repetidamente a primeira linha do arquivo 
 * (o log mais antigo) até que atinja o tamanho máximo.
 * Se o valor limitante for 0 ou negativo significa que não há limitação, tornando a função desnecessária.
**/
const inventoryController = require('../controllers/inventory-controller');
const fs = require('fs');

// Função principal do serviço
// Recebe o endereço do arquivo de log e a quantidade máxima de logs permitida nele
// Se o valor de maxResults não for especificado ou for menor ou igual a 0, a função não é executada
function openLogSpace(logFilePath, maxResults = 0) {
  // Verifica se o valor de maxResults é um número inteiro.
  // Caso o valor não seja positivo, apenas ignora a função sem gerar erros.
  if (!Number.isInteger(maxResults)) {
    console.log(`Erro: maxResults deve ser um número inteiro. Tipo recebido: ${typeof maxResults}`);
    return;
  } else if (maxResults <= 0) {
    return;
  }

  // Lê o conteúdo atual do arquivo de log
  let data = fs.readFileSync(logFilePath, 'utf8');

  // Separa as linhas do arquivo em um array
  const lines = data.split('\n');

  // Remove repetidamente a primeira linha até que o tamanho máximo seja alcançado
  while (lines.length > maxResults) {
    lines.shift(); // Remove a primeira linha
  }
  
  // Atualiza a variável 'newData' com o conteúdo atualizado
  const newData = lines.join('\n');

  // Escreve o conteúdo atualizado de volta no arquivo de logs
  fs.writeFileSync(logFilePath, newData, 'utf8');

  console.log(`Espaço aberto no arquivo de log: ${logFilePath}`);
}

// Adiciona o serviço ao repositório
inventoryController.addService({
  name: "log-open-space",
  description: "Serviço para manter um arquivo de logs dentro do limite máximo de logs definido",
  endpoint: "/log/open-space",
  handler: openLogSpace
});

module.exports = {
  openLogSpace
};