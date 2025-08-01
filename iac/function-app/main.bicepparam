using './main.bicep'

param appServicePlanName = 'asp-pri-001'
param location = 'eastus2'
param tags = {
  environment: 'dev'
  application: 'cellix'
}
param storageAccountName = 'cxadevstfunceastus2'
param maxOldSpaceSizeMB = 3072
param functionWorkerRuntime = 'node'
param linuxFxVersion = 'NODE|20' 
param functionExtensionVersion = '~4' 
param allowedOrigins = [] //Specify the frontend endpoints that can access the function app
param keyVaultName = 'corp-dev-kv'
param functionAppInstanceName = 'pri'
param applicationPrefix = 'cel'
param env = 'dev'
