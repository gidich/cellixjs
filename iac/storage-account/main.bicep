//PARAMETERS
@allowed([
  'prd' //resource group is corp-prd-rg
  'uat' //resource group is corp-uat-rg
  'qa'  //resource group is corp-qa-rg
  'dev' //resource group is corp-dev-rg
  'cor' //resource group is corp-core-rg
  'trn' //resource group is corp-trn-rg
])
param env string
param storageAccountName string
param location string
param skuName string
param kind string
param tags object

// variables
var uniqueId = uniqueString(resourceGroup().id)
//var moduleNameSuffix = '-Module-${applicationPrefix}-${environment}-st-${instanceName}'


module storageAccount 'br/public:avm/res/storage/storage-account:0.20.0' = {
  name: 'storageAccount'
  params: {
    name: '${storageAccountName}${uniqueId}'
    location: location
    skuName: skuName
    kind: kind
    tags: tags
    supportsHttpsTrafficOnly: true 
    allowBlobPublicAccess: true
  }
}

