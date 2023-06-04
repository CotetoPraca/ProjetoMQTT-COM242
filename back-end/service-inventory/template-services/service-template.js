/** TEMPLATE DE SERVIÇOS
 * Nota: Lembrar de apagar os outros comentários em bloco em uma aplicação real, eles servem apenas como guia.
 * 
 * Esse primeiro bloco de comentário deve ser substituído com uma descrição detalhada do serviço. Por exemplo:
 * Esse é um arquivo de referência, não possui funcionalidade prática. Serve apenas de guia.
**/
const inventoryController = require('./controllers/inventory-controller');

// Função principal do serviço
// Breve descrição dos parâmetros esperados e funcionalidade
function funcaoPrincipal() {
  /* Editar o conteúdo para condizer com a funcionalidade do serviço. Explicar linha a linha se necessário. */
  console.log("Esse serviço é só um template");
}

/** DETALHES DO JSON DOS SERVIÇOS:
 * As seguintes informações são passadas em JSON e devem ser preenchidas de forma breve e clara:
 * name:        String com o nome do serviço - manter igual o nome do arquivo (sem a extensão) para facilitar a busca
 * description: String com uma breve descrição do objetivo do serviço
 * endpoint:    String com o valor esperado do endereço de requisição do serviço - para serviços MQTT colocar '/mqtt/endpoint'
 * handler:     String com o nome da função principal do serviço
**/

// Adiciona o serviço ao repositório
inventoryController.addService({
  name: "service-template",
  description: "Sem função prática, apenas um template",
  endpoint: "/service-template",
  handler: funcaoPrincipal
});

// Exporta as funções do serviço
module.exports = {
  funcaoPrincipal
};