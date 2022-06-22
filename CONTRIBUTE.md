
## Docker Commands

### OpenAPI NX Nest project

```
docker image build -t jbend.azurecr.io/tdp-openapi-linter:latest .
```

``` bash
docker run -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
```

```
docker run -d -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
```

```
docker image push jbend.azurecr.io/tdp-openapi-linter:latest
```
