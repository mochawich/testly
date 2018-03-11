# Testly - Kubernetes

## Requirements
* Kubernetes cluster
  * Check [how to create one on AWS using kops](https://github.com/kubernetes/kops/blob/master/docs/aws.md)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* Testly Docker images accessible from the cluster
* Postgres database accessible from the cluster

## Build Testly Docker Images

This builds both images `mochawich/testly-backend:1.0.0` and `mochawich/testly-frontend:1.0.0` locally.
It then pushes them to https://hub.docker.com/u/mochawich/.

```bash
REPO=mochawich BUILD_NUM=1.0.0 docker-compose build
docker-compose push
```

## Update Deployment Specs

These can be found in `*-deployment.yml` files located in this directory.

* Update `spec.containers.image` values so they match the `REPO` and `BUILD_NUM` used when building the pushed images. 
* Update `TY_DB_HOST` if necessary.
  * Check [testly.settings](../backend/testly/settings.py) for other environment variables.

## Create Services and Deployments

```bash
cd kubernetes
kubectl create \
    -f backend-service.yaml -f backend-deployment.yaml \
    -f frontend-service.yaml -f frontend-deployment.yaml \
    -f redis-service.yaml -f redis-deployment.yaml \
    -f worker-service.yaml -f worker-deployment.yaml
```

## Service Endpoints
```
kubectl describe service frontend | grep "LoadBalancer Ingress"
kubectl describe service backend | grep "LoadBalancer Ingress"
```

The returned hosts could be used to access the services directly or assigned to a custom domain's CNAME.

> For the backend service to work properly
> * its endpoint must be assigned to a domain's CNAME record
> * this record should be added to `ALLOWED_HOSTS` in [testly.settings](../backend/testly/settings.py).

