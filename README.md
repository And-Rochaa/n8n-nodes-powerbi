![Power BI Logo](https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-dcc0-61f7-b9c3-60887e232c88/raw?se=2025-05-09T19%3A08%3A26Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-08T21%3A01%3A16Z&ske=2025-05-09T21%3A01%3A16Z&sks=b&skv=2024-08-04&sig=SlrhWF2RQBVQ3N6vEPrLcXjnz7gy2I2Mag516PLgYX0%3D)

# n8n-nodes-powerbi

Este pacote contém nodes para o n8n que permitem integração completa com as APIs REST do Microsoft Power BI. Estes nodes possibilitam automação, integração e orquestração de fluxos de dados com o Power BI diretamente no n8n.

## Índice

- [Funcionalidades](#funcionalidades)
- [Recursos Disponíveis](#recursos-disponíveis)
- [Métodos de Autenticação](#métodos-de-autenticação)
- [Configurando o Aplicativo no Microsoft Entra ID (Azure AD)](#configurando-o-aplicativo-no-microsoft-entra-id-azure-ad)
- [Utilizando os Nodes](#utilizando-os-nodes)
- [Limitações e Solução de Problemas](#limitações-e-solução-de-problemas)
- [Recursos Adicionais](#recursos-adicionais)

## Funcionalidades

Este pacote oferece dois nodes principais:

### 1. Power BI

Node principal que utiliza autenticação OAuth2 com o Microsoft Entra ID (anteriormente Azure AD) e oferece funcionalidades completas de:

- Gerenciamento de relatórios, dashboards e datasets
- Administração de workspaces (grupos)
- Execução de consultas DAX
- Atualização de dados
- Exportação de relatórios

### 2. Power BI (Header Auth)

Node alternativo que permite autenticação via token Bearer passado diretamente como parâmetro. Útil para:

- Integração com outros flows que já possuem tokens de autenticação
- Implementação de fluxos personalizados de autenticação
- Testes e prototipagem rápida

Ambos os nodes podem ser usados como ferramentas de IA no n8n AI Assistant, permitindo automações baseadas em linguagem natural.

## Recursos Disponíveis

### Recursos de Administração
- **Obter Informações de Workspace**: Recupera detalhes completos sobre workspaces, incluindo esquema de datasets, expressões DAX, linhagem e fontes de dados
- **Obter Resultados de Scan**: Recupera resultados de escaneamento de workspace

### Recursos de Dashboard
- **Listar Dashboards**: Recupera todos os dashboards em um workspace
- **Obter Dashboard**: Recupera detalhes de um dashboard específico
- **Obter Blocos**: Recupera blocos (tiles) de um dashboard

### Recursos de Dataset
- **Listar Datasets**: Recupera todos os datasets em um workspace
- **Obter Dataset**: Recupera detalhes de um dataset específico
- **Atualizar Dataset**: Inicia uma operação de atualização de dataset
- **Obter Tabelas**: Lista todas as tabelas em um dataset
- **Adicionar Linhas**: Adiciona dados a uma tabela de um dataset
- **Executar Consultas DAX**: Realiza consultas em linguagem DAX em um dataset
- **Obter Histórico de Atualizações**: Recupera histórico de atualizações de um dataset

### Recursos de Grupo (Workspace)
- **Listar Grupos**: Recupera todos os workspaces acessíveis
- **Obter Grupo**: Recupera detalhes de um workspace específico
- **Obter Relatórios**: Lista relatórios em um workspace
- **Obter Dashboards**: Lista dashboards em um workspace
- **Obter Datasets**: Lista datasets em um workspace

### Recursos de Relatório
- **Listar Relatórios**: Recupera todos os relatórios em um workspace
- **Obter Relatório**: Recupera detalhes de um relatório específico
- **Obter Páginas**: Lista páginas em um relatório
- **Exportar para PDF**: Exporta um relatório para formato PDF

## Métodos de Autenticação

Este node suporta três métodos de autenticação:

1. **OAuth2**: Para aplicativos que atuam em nome de um usuário por meio de fluxo interativo.
2. **Service Principal**: Para aplicativos que atuam sem interação do usuário, ideal para automações agendadas.
3. **ROPC** (Resource Owner Password Credentials): Para automação com credenciais de usuário diretas.

### Renovação de Tokens

Este node utiliza o mecanismo padrão de renovação de tokens do n8n. Anteriormente, implementávamos um sistema personalizado para converter erros 403 em 401, mas isso foi removido pois o n8n agora captura os erros de autenticação de forma mais eficiente.

Para mais detalhes sobre o histórico e as mudanças, consulte a [documentação sobre renovação de tokens](./docs/TOKEN_REFRESH.md).

### Integração com Ferramentas de IA

Os nodes Power BI e Power BI (Header Auth) foram configurados como ferramentas de IA dentro do n8n, permitindo que:

1. Sejam facilmente acessados pelo assistente de IA do n8n
2. Possam ser usados em automações orientadas por linguagem natural
3. Apareçam na paleta de ferramentas de IA no editor de fluxos

Para mais detalhes sobre a implementação, consulte a [documentação sobre nodes usáveis como ferramentas de IA](./docs/USABLE_AS_TOOL.md).

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and pnpm. Minimum version Node 18. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  pnpm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `pnpm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `pnpm lint` to check for errors or `pnpm lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## Configurando o Aplicativo no Microsoft Entra ID (Azure AD)

Para utilizar o node Power BI com autenticação OAuth2, você precisa registrar um aplicativo no Microsoft Entra ID (anteriormente Azure AD). Siga os passos abaixo:

### 1. Registrar um Novo Aplicativo

1. Acesse o [Portal do Azure](https://portal.azure.com).
2. Navegue para **Microsoft Entra ID** > **Registros de aplicativos**.
3. Clique em **Novo registro**.
4. Forneça um nome para o aplicativo, por exemplo "n8n Power BI Integration".
5. Em **Tipos de conta compatíveis**, selecione **Contas apenas neste diretório organizacional**.
6. Na seção **URI de Redirecionamento**, selecione **Web** e insira: `https://your-n8n-domain/rest/oauth2-credential/callback`.
   - Em ambiente local de desenvolvimento, use: `http://localhost:5678/rest/oauth2-credential/callback`
7. Clique em **Registrar**.

### 2. Configurar as Permissões da API

1. No menu lateral do aplicativo registrado, clique em **Permissões de API**.
2. Clique em **Adicionar uma permissão**.
3. Selecione **Power BI Service**.
4. Você pode escolher entre **Permissões delegadas** (para OAuth2 e ROPC) ou **Permissões de aplicativo** (para Service Principal):
   
   **Para permissões delegadas (recomendado para a maioria dos casos):**
   - Dataset.Read.All
   - Dataset.ReadWrite.All
   - Report.Read.All
   - Report.ReadWrite.All
   - Dashboard.Read.All
   - Dashboard.ReadWrite.All
   - Workspace.Read.All
   - Workspace.ReadWrite.All
   - Content.Create
   - Tenant.Read.All (para funções administrativas)
   
   **Para permissões de aplicativo (Service Principal):**
   - Dashboard.Read.All
   - Report.Read.All
   - Dataset.Read.All
   - Workspace.Read.All
   - Tenant.Read.All

5. Clique em **Adicionar permissões**.
6. Se estiver usando Service Principal, você precisará solicitar que um administrador **Conceda consentimento do administrador para [seu diretório]**.

### 3. Criar o Segredo do Cliente (Client Secret)

1. No menu lateral, clique em **Certificados e segredos**.
2. Na seção **Segredos do cliente**, clique em **Novo segredo do cliente**.
3. Adicione uma descrição e selecione um período de expiração.
4. Clique em **Adicionar**.
5. **IMPORTANTE**: Copie imediatamente o valor do segredo gerado, pois ele não poderá ser visualizado novamente.

### 4. Obter os Valores de Configuração

Anote os seguintes valores que serão necessários para configurar o node no n8n:

- **Client ID**: Encontre em **Visão geral** > **ID do aplicativo (cliente)**
- **Client Secret**: O valor que você copiou ao criar o segredo do cliente
- **Tenant ID**: Encontre em **Visão geral** > **ID do diretório (tenant)**

## Utilizando os Nodes

### Power BI (OAuth2)

1. Adicione o node Power BI ao seu fluxo de trabalho.
2. Configure a credencial OAuth2:
   - **Client ID**: O ID do aplicativo registrado
   - **Client Secret**: O segredo do cliente gerado
   - **Scope**: Deixe em branco ou use `https://analysis.windows.net/powerbi/api/.default`
   - **Auth URI**: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
   - **Token URI**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
   - **Auth URL Query Parameters**: 
     ```json
     {
       "resource": "https://analysis.windows.net/powerbi/api"
     }
     ```
3. Selecione o recurso (dashboard, relatório, dataset, grupo) e a operação desejada.
4. Configure os parâmetros específicos da operação.

### Power BI (Header Auth)

1. Adicione o node Power BI Header Auth ao seu fluxo de trabalho.
2. Forneça um token de autenticação Bearer no formato:
   - Sem prefixo "Bearer": `eyJ0eXAiOiJKV...`
   - Ou com prefixo: `Bearer eyJ0eXAiOiJKV...`
3. Selecione o recurso e a operação desejada.
4. Configure os parâmetros específicos da operação.

## Limitações e Solução de Problemas

### Limitações da API do Power BI

- **Limites de taxa (Rate limits)**: A API do Power BI impõe limites de taxa que podem variar dependendo da sua licença e plano de assinatura. [Saiba mais](https://docs.microsoft.com/pt-br/power-bi/developer/embedded/embedded-capacity)
- **Permissões**: Muitas operações requerem permissões administrativas ou de proprietário no workspace
- **Algumas operações exigem licença Premium**: Certas operações como atualização programada ou consultas DAX em grandes volumes podem exigir capacidade Premium

### Problemas Comuns

1. **Erro 403 Forbidden**: 
   - Verifique se o usuário ou aplicativo tem as permissões adequadas no Power BI
   - Confirme se as permissões de API necessárias foram concedidas no Microsoft Entra ID
   - Verifique se houve consentimento administrativo para as permissões

2. **Erro 401 Unauthorized**:
   - O token pode ter expirado - verifique se suas credenciais são válidas
   - Verifique se o Client Secret ainda é válido (eles expiram conforme configurado)

3. **Erro ao atualizar datasets**:
   - Certifique-se de que o dataset permite atualizações via API
   - Verifique se as credenciais das fontes de dados estão atualizadas no dataset

## Recursos Adicionais

- [Documentação oficial da API REST do Power BI](https://docs.microsoft.com/pt-br/rest/api/power-bi/)
- [Centro de desenvolvedores do Power BI](https://powerbi.microsoft.com/pt-br/developers/)
- [Perguntas frequentes sobre APIs do Power BI](https://docs.microsoft.com/pt-br/power-bi/developer/embedded/embedded-faq)
- [Limitações conhecidas do Power BI](https://docs.microsoft.com/pt-br/power-bi/admin/service-admin-portal-about)
- [Documentação do n8n sobre Nodes Personalizados](https://docs.n8n.io/integrations/creating-nodes/)

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
