
## Docker Commands

### OpenAPI NX Nest project

Login into Azure CLI
```
az login
```

Login/Connect to container registry
```
az acr login --name jbend
az acr login --name crtdp
```

Build image
```bash
docker image build -t jbend.azurecr.io/tdp-openapi-linter:latest .
docker image build -t jbend.azurecr.io/tdp-openapi-linter:local -f dockerfiles/Dockerfile.local .
docker image build -t crtdp.azurecr.io/tdp-openapi-linter:0.0.4 -f dockerfiles/Dockerfile.prod .
docker image build -t crtdp.azurecr.io/tdp-openapi-linter:latest -f dockerfiles/Dockerfile.local .
docker image build -t crtdp.azurecr.io/tdp-openapi-linter:latest -f dockerfiles/Dockerfile.prod .
```

```bash
docker run -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
docker run -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:local
docker run -p 3333:3333 crtdp.azurecr.io/tdp-openapi-linter:0.0.4
docker run -p 3333:3333 crtdp.azurecr.io/tdp-openapi-linter:local
```


```bash
docker run -d -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
```

```bash
docker image push jbend.azurecr.io/tdp-openapi-linter:latest
docker image push jbend.azurecr.io/tdp-openapi-linter:latest
docker image push crtdp.azurecr.io/tdp-openapi-linter:latest
docker image push crtdp.azurecr.io/tdp-openapi-linter:0.0.1
```


## Setup App service from container

### Create Resource Group
```
$location = ""
$resourceGroup = ""
az group create -l $location -n $resourceGroup
```

### Create app service plan
```
$planName = ""
az appservice plan create -n $planName -g $resourceGroup -l $location --is-linux --sku S1
```

### Create App Service
--TODO: add container reference
https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create
--deployment-container-image-name
```
$appName = ""
az webapp create -n $appName -g $resourceGroup --plan $planName -i "scratch"
```

### Workaround if webapp create doesn't support specifying a container
```
$acrName = ""
$acrLoginServer = az acr show -n $acrName --query loginServer -o tsv
$acrUserName = az acr credential show -n $acrName --query username -o tsv
$acrPassword = az acr credential show -n $acrName --query password[0].value -o tsv
az webapp config container set -n $appName -g $resourceGroup -c "$acrLoginServer/samplewebapp:latest" -r "https://$acrLoginServer" -u $acrUserName -p $acrPassword
```

### Get webapp URL
```
az webapp show -n $appName -g $resourceGroup --query "defaultHostName" -o tsv
```

### Create deployment staging slot
```
az webapp deployment slot create -g $resourceGroup -n $appName -s staging --configuration-source $appName
```

### Get staging URL
```
az webapp show -n $appName -g $resourceGroup -s staging --query "defaultHostName" -o tsv
```

### Setup webapp staging deployment slot for DC
```
az webapp deployment container config -g $resourceGroup -n $appName -s staging --enable-cd true
```

### Get webhook URL for container registry
```
$cicdurl = az webapp deployment container show-cd-url -s staging -n $appName -g $resourceGroup --query CI_CD_URL -o tsv
```

### Create/setup webhook
```
$webHookName = ""
az acr webhook create --registry $acrName --name $webHookName --actions push --uri $cicdurl
```

### Push new version and test staging slot
```
docker push...
```

### Swap staging slot into production
```
az webapp deployment slot swap -g $resourceGroup -n $appName --slot staging --target-slot production
```

### Revert incase problem in production
This is a guess
```
az webapp deployment slot swap -g $resourceGroup -n $appName --slot production --target-slot staging
```

### Clean up resources
Delete reource group
Delete web hook
```
az group delete --name $resourceGroup --yes --no-wait
az acr webhook delete --registry $acrName --name $webHookName
```



