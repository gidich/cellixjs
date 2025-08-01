using './main.bicep'

param env = 'dev'
param storageAccountName = 'ahpstapp'
param location = 'eastus'
param skuName = 'Standard_LRS'
param kind = 'StorageV2'
param tags = {
  environment: env
  application: 'ahp'
}
