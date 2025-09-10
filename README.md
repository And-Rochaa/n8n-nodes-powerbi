![Power BI Logo](https://i.postimg.cc/3hntXFh3/Integra-o-n8n-e-Power-BI.png)

# n8n-nodes-powerbi

This package contains nodes for n8n that enable complete integration with Microsoft Power BI REST APIs. These nodes enable automation, integration, and orchestration of data flows with Power BI directly in n8n.

## About the Author

This Community Node was created and made freely available by **Anderson Rocha from Universo Automático** for the community and was designed to simplify and abstract all the complexity of using Power BI APIs.

### Social Media

- Linkedin: [https://www.linkedin.com/in/andersonsantosrocha](https://www.linkedin.com/in/andersonsantosrocha)
- YouTube: [https://www.youtube.com/@universoautomatico](https://www.youtube.com/@universoautomatico)
- Instagram: [https://www.instagram.com/universoautomatico/](https://www.instagram.com/universoautomatico/)
- N8N + Power BI Training: [https://n8npowerbi.com/](https://n8npowerbi.com/)

## Table of Contents

- [Features](#features)
- [Available Resources](#available-resources)
- [Authentication Methods](#authentication-methods)
- [Setting up the Application in Microsoft Entra ID (Azure AD)](#setting-up-the-application-in-microsoft-entra-id-azure-ad)
- [Using the Nodes](#using-the-nodes)
- [Limitations and Troubleshooting](#limitations-and-troubleshooting)
- [Additional Resources](#additional-resources)

## Features

This package offers a unified Power BI node with flexible authentication methods:

### Power BI Node

Comprehensive node that supports two authentication methods:

1. **OAuth2 Authentication**: Interactive authentication with Microsoft Entra ID (formerly Azure AD)
2. **Bearer Token Authentication**: Direct token authentication for API integrations

#### Available Features:
- Managing reports, dashboards, and datasets
- Workspace (groups) administration
- DAX query execution
- Data refresh operations
- Report export in multiple formats
- Gateway management
- Dataflow operations


## Available Resources


### Administration Resources
- **Get Workspace Information**: Retrieves complete details about workspaces, including dataset schema, DAX expressions, lineage, and data sources
- **Get Scan Results**: Retrieves workspace scan results

### Dashboard Resources
- **List Dashboards**: Retrieves all dashboards in a workspace
- **Get Dashboard**: Retrieves details of a specific dashboard
- **Get Tiles**: Retrieves tiles from a dashboard

### Dataset Resources
- **List Datasets**: Retrieves all datasets in a workspace
- **Get Dataset**: Retrieves details of a specific dataset
- **Refresh Dataset**: Initiates a dataset refresh operation
- **Get Tables**: Lists all tables in a dataset
- **Add Rows**: Adds data to a dataset table
- **Execute DAX Queries**: Performs DAX language queries on a dataset
- **Get Refresh History**: Retrieves dataset refresh history

### Dataflow Resources
- **List Dataflows**: Retrieves all dataflows in a workspace
- **Get Dataflow**: Exports the specified dataflow definition to JSON
- **Get Dataflow Data Sources**: Returns a list of data sources for the specified dataflow
- **Get Dataflow Transactions**: Returns a list of transactions for the specified dataflow
- **Refresh Dataflow**: Triggers a refresh for the specified dataflow

### Gateway Resources
- **List Gateways**: Returns a list of gateways for which the user is an administrator
- **Get Gateway**: Returns the specified gateway details
- **Get Datasource**: Returns the specified datasource from the specified gateway
- **Get Datasources**: Returns a list of datasources from the specified gateway
- **Get Datasource Status**: Checks the connectivity status of the specified datasource
- **Get Datasource Users**: Returns a list of users who have access to the specified datasource

### Group (Workspace) Resources
- **List Groups**: Retrieves all accessible workspaces
- **Get Group**: Retrieves details of a specific workspace
- **Get Reports**: Lists reports in a workspace
- **Get Dashboards**: Lists dashboards in a workspace
- **Get Datasets**: Lists datasets in a workspace

### Report Resources
- **List Reports**: Retrieves all reports in a workspace
- **Get Report**: Retrieves details of a specific report
- **Get Pages**: Lists pages in a report
- **Export File**: Exports a report in various formats

## Authentication Methods

This node supports two authentication methods:

### 1. OAuth2 Authentication
- **Use case**: Applications acting on behalf of a user through interactive authentication flow
- **Credential type**: Power BI OAuth2 API
- **Token management**: Automatic refresh when tokens expire

### 2. Bearer Token Authentication  
- **Use case**: Direct API integration with pre-obtained tokens
- **Credential type**: Power BI API
- **Token management**: Manual token management required

### Choosing Authentication Method

In the node configuration:
1. Select **Authentication** type (OAuth2 or Bearer Token)
2. The appropriate credential field will appear automatically
3. Configure the matching credential type


### AI Tools Integration

The Power BI node has been configured as an AI tool within n8n, allowing it to:

1. Be easily accessed by n8n's AI assistant
2. Be used in natural language-driven automations
3. Appear in the AI tools palette in the flow editor

## Setting up the Application in Microsoft Entra ID (Azure AD)

To use the Power BI node with OAuth2 authentication, you need to register an application in Microsoft Entra ID (formerly Azure AD). Follow the steps below:

### 1. Register a New Application

1. Access the [Azure Portal](https://portal.azure.com).
2. Navigate to **Microsoft Entra ID** > **App registrations**.
3. Click **New registration**.
4. Provide a name for the application, for example "n8n Power BI Integration".
5. In **Supported account types**, select **Accounts in this organizational directory only**.
6. In the **Redirect URI** section, select **Web** and enter: `https://your-n8n-domain/rest/oauth2-credential/callback`.
   - For local development environment, use: `http://localhost:5678/rest/oauth2-credential/callback`
7. Click **Register**.

### 2. Configure API Permissions

1. In the registered application's side menu, click **API permissions**.
2. Click **Add a permission**.
3. Select **Power BI Service**.
4. You can choose between **Delegated permissions** (for OAuth2) or **Application permissions** (for Service Principal):
   
   **For delegated permissions (recommended for most cases):**
   - Dataset.Read.All
   - Dataset.ReadWrite.All
   - Report.Read.All
   - Report.ReadWrite.All
   - Dashboard.Read.All
   - Dashboard.ReadWrite.All
   - Workspace.Read.All
   - Workspace.ReadWrite.All
   - Content.Create
   - Tenant.Read.All (for administrative functions)
   
   **For application permissions (Service Principal):**
   - Dashboard.Read.All
   - Report.Read.All
   - Dataset.Read.All
   - Workspace.Read.All
   - Tenant.Read.All

5. Click **Add permissions**.
6. If using Service Principal, you'll need to request an administrator to **Grant admin consent for [your directory]**.

### 3. Create the Client Secret

1. In the side menu, click **Certificates & secrets**.
2. In the **Client secrets** section, click **New client secret**.
3. Add a description and select an expiration period.
4. Click **Add**.
5. **IMPORTANT**: Immediately copy the generated secret value, as it cannot be viewed again.

### 4. Get Configuration Values

Note the following values that will be needed to configure the node in n8n:

- **Client ID**: Found in **Overview** > **Application (client) ID**
- **Client Secret**: The value you copied when creating the client secret
- **Tenant ID**: Found in **Overview** > **Directory (tenant) ID**

## Using the Node

### Power BI Node Configuration

1. Add the Power BI node to your workflow.
2. **Select Authentication Method**: Choose between OAuth2 or Bearer Token
3. **Configure Credentials**:

#### For OAuth2 Authentication:
1. Create a "Power BI OAuth2 API" credential with:
   - **Client ID**: The registered application ID
   - **Client Secret**: The generated client secret
   - **Scope**: Leave blank or use `https://analysis.windows.net/powerbi/api/.default`

#### For Bearer Token Authentication:
1. Create a "Power BI API" credential with:
   - **Bearer Token**: Your API access token

4. **Select Resource and Operation**: Choose the desired resource (dashboard, report, dataset, etc.) and operation
5. **Configure Parameters**: Set operation-specific parameters as needed


## Limitations and Troubleshooting

### Power BI API Limitations

- **Rate limits**: The Power BI API imposes rate limits that may vary depending on your license and subscription plan. [Learn more](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-capacity)
- **Permissions**: Many operations require administrative or owner permissions in the workspace
- **Some operations require Premium license**: Certain operations like programmatic refresh or DAX queries in large volumes may require Premium capacity


## Additional Resources

- [Official Power BI REST API Documentation](https://docs.microsoft.com/en-us/rest/api/power-bi/)
- [Power BI Developer Center](https://powerbi.microsoft.com/en-us/developers/)
- [Power BI API FAQ](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-faq)
- [Power BI Known Limitations](https://docs.microsoft.com/en-us/power-bi/admin/service-admin-portal-about)
- [n8n Custom Nodes Documentation](https://docs.n8n.io/integrations/creating-nodes/)

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
