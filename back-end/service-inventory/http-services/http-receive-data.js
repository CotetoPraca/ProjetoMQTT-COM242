/** SERVIÇO DE RECEBIMENTO DE DADOS POR HTTP
 * Este serviço recebe dados por HTTP de um ambiente de origem especificado.
 * A função principal recebe como parâmetro as informações do endereço de origem
 * dos dados em formato JSON com as informações: hostname, port, path.
 * Após o recebimento dos dados, o serviço retorna uma mensagem de confirmação
 * ao endereço de origem e retorna os dados recebidos a quem solicitou o serviço.
**/
const inventoryController = require('../controllers/inventory-controller');
const http = require('http');

// Função principal do serviço de recebimento de dados
// Recebe o endereço de origem para receber os dados por HTTP
function receberDadosPorHTTP(origem) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const dadosRecebidos = JSON.parse(body);

        console.log('Dados recebidos:', dadosRecebidos);

        // Retorna os dados recebidos como resposta
        const resposta = {
          dadosRecebidos: dadosRecebidos,
          mensagem: 'Dados recebidos com sucesso',
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(resposta));

        // Resolve a Promise com os dados recebidos
        resolve(dadosRecebidos);
      });
    });

    server.listen(origem.port, origem.hostname, () => {
      console.log(`Servidor de recebimento iniciado em ${origem.hostname}:${origem.port}`);
    });

    // Lida com possíveis erros no servidor
    server.on('error', (error) => {
      reject(error);
    });
  });
}

// Adiciona o serviço de recebimento de dados ao repositório
inventoryController.addService({
  name: 'http-receive-data',
  description: 'Serviço de recebimento de dados por HTTP de um endereço de origem especificado',
  endpoint: '/http-receive-data',
  handler: receberDadosPorHTTP,
});

// Exporta as funções do serviço
module.exports = {
  receberDadosPorHTTP,
};

/* Como chamar a função desse serviço:
*
* receberDadosPorHTTP(origem)
*   .then((dadosRecebidos) => {
*      // Faça algo com os dados recebidos
*      console.log('Dados recebidos:', dadosRecebidos);
*    })
*    .catch((error) => {
*      // Lida com possíveis erros
*      console.error('Erro:', error);
*    });
*/