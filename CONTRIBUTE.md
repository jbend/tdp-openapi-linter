
## Docker Commands

### OpenAPI NX Nest project

```bash
docker image build -t jbend.azurecr.io/tdp-openapi-linter:latest .
```

```bash
docker run -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
```

```bash
docker run -d -p 3333:3333 jbend.azurecr.io/tdp-openapi-linter:latest
```

```bash
docker image push jbend.azurecr.io/tdp-openapi-linter:latest
```
