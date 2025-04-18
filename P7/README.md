## Documentacion
### ¿Qué es Kubernetes?

Kubernetes es una plataforma de orquestación de contenedores de código abierto que automatiza la implementación, el escalado y la gestión de aplicaciones en contenedores. Fue desarrollado originalmente por Google y ahora es mantenido por la Cloud Native Computing Foundation (CNCF).

## ¿Cómo funciona un despliegue en Kubernetes?

Un despliegue en Kubernetes implica varios componentes clave que trabajan juntos para gestionar la aplicación. Los pasos básicos incluyen:

1. **Definición de la configuración**: Se definen archivos YAML o JSON que describen el estado deseado de la aplicación, incluyendo los contenedores, las imágenes, los recursos y las políticas.
2. **Aplicación de la configuración**: Se utiliza `kubectl apply` para aplicar la configuración al clúster de Kubernetes.
3. **Controlador de despliegue**: Kubernetes utiliza controladores para asegurarse de que el estado actual del clúster coincida con el estado deseado definido en la configuración.
4. **Gestión de pods**: Kubernetes crea y gestiona pods, que son las unidades básicas de ejecución que contienen uno o más contenedores.
5. **Escalado y actualización**: Kubernetes puede escalar automáticamente la aplicación y realizar actualizaciones sin tiempo de inactividad.

## ¿Qué es un Deployment?

Un Deployment en Kubernetes es un recurso que proporciona una forma declarativa de gestionar aplicaciones. Permite definir el estado deseado de la aplicación y Kubernetes se encarga de crear y mantener los pods necesarios para alcanzar ese estado. Los Deployments también permiten realizar actualizaciones y retrocesos de manera controlada.

## ¿Qué es un Service?

Un Service en Kubernetes es un recurso que define una política de acceso a un conjunto de pods. Proporciona una forma de exponer una aplicación en ejecución dentro del clúster, permitiendo el descubrimiento y el balanceo de carga. Los Services pueden ser de varios tipos, como ClusterIP, NodePort y LoadBalancer.

## Aplicar configuración de Kubernetes
Para aplicar la configuración de Kubernetes, se utiliza el comando `kubectl apply -f <archivo.yaml>`. Este comando aplica la configuración especificada en el archivo YAML al clúster de Kubernetes.

```sh
kubectl apply -f ms_auth_deploy.yaml -n p5
kubectl apply -f ms_reacts_deploy.yaml -n p5
kubectl apply -f ms_posts_deploy.yaml -n p5
kubectl apply -f ms_comms_deploy.yaml -n p5
kubectl apply -f gateway.yaml -n p5
```

## Archivos YAML de los despliegues

### ms_reacts_deploy.yaml
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db-reacts-stateful
spec:
  serviceName: "postgres"  # Nombre del servicio que maneja los pods de PostgreSQL
  replicas: 1  # Número de réplicas
  selector:
    matchLabels:
      app: db_reacts
  template:
    metadata:
      labels:
        app: db_reacts
    spec:
      containers:
      - name: postgres
        image: postgres:latest  # Imagen de PostgreSQL
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          value: "postgres123"
        - name: POSTGRES_DB
          value: "p4"
        - name: PGUSER
          value: "postgres"
        - name: PGDATA
          value: "/var/lib/postgresql/data/pgdata"
        volumeMounts:
        - name: postgres-data-reacts
          mountPath: /var/lib/postgresql/data  # Ruta donde PostgreSQL almacenará los datos
  volumeClaimTemplates:
  - metadata:
      name: postgres-data-reacts
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi # Tamaño del volumen persistente
---
apiVersion: v1
kind: Service
metadata:
  name: db-reacts-svc
spec:
  ports:
    - port: 5432
  clusterIP: None  # Esto es clave para los StatefulSets
  selector:
    app: db_reacts
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reacts-api-deployment
  labels:
    app: api-reacts
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-reacts
  template:
    metadata:
      labels:
        app: api-reacts
    spec:
      containers:
      - name: api-reacts
        image: stevengez/sap5-reacts:latest
        imagePullPolicy: Always
        resources:
          requests:
            memory: "128Mi"
            cpu: "80m"
          limits:
            memory: "128Mi"
            cpu: "300m"
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "db-reacts-svc"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres123"
        - name: DB_NAME
          value: "p4"
---
apiVersion: v1
kind: Service
metadata:
  name: api-reacts-svc
spec:
  selector:
    app: api-reacts
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: reacts-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: reacts-api-deployment
  minReplicas: 1
  maxReplicas: 2
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### ms_posts_deploy.yaml
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db-posts-stateful
spec:
  serviceName: "postgres"  # Nombre del servicio que maneja los pods de PostgreSQL
  replicas: 1  # Número de réplicas
  selector:
    matchLabels:
      app: db_posts
  template:
    metadata:
      labels:
        app: db_posts
    spec:
      containers:
      - name: postgres
        image: postgres:latest  # Imagen de PostgreSQL
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          value: "postgres123"
        - name: POSTGRES_DB
          value: "p5"
        - name: PGUSER
          value: "postgres"
        - name: PGDATA
          value: "/var/lib/postgresql/data/pgdata"
        volumeMounts:
        - name: postgres-data-posts
          mountPath: /var/lib/postgresql/data  # Ruta donde PostgreSQL almacenará los datos
  volumeClaimTemplates:
  - metadata:
      name: postgres-data-posts
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi # Tamaño del volumen persistente
---
apiVersion: v1
kind: Service
metadata:
  name: db-posts-svc
spec:
  ports:
    - port: 5432
  clusterIP: None  # Esto es clave para los StatefulSets
  selector:
    app: db_posts
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-api-deployment
  labels:
    app: api-posts
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-posts
  template:
    metadata:
      labels:
        app: api-posts
    spec:
      containers:
      - name: api-posts
        image: stevengez/sap5-posts:latest
        imagePullPolicy: Always
        resources:
          requests:
            memory: "128Mi"
            cpu: "80m"
          limits:
            memory: "180Mi"
            cpu: "350m"
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "db-posts-svc"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres123"
        - name: DB_NAME
          value: "p5"
---
apiVersion: v1
kind: Service
metadata:
  name: api-posts-svc
spec:
  selector:
    app: api-posts
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: posts-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: posts-api-deployment
  minReplicas: 1
  maxReplicas: 2
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### ms_comms_deploy.yaml
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db-comms-stateful
spec:
  serviceName: "postgres"  # Nombre del servicio que maneja los pods de PostgreSQL
  replicas: 1  # Número de réplicas
  selector:
    matchLabels:
      app: db_comms
  template:
    metadata:
      labels:
        app: db_comms
    spec:
      containers:
      - name: postgres
        image: postgres:latest  # Imagen de PostgreSQL
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          value: "postgres123"
        - name: POSTGRES_DB
          value: "p4"
        - name: PGUSER
          value: "postgres"
        - name: PGDATA
          value: "/var/lib/postgresql/data/pgdata"
        volumeMounts:
        - name: postgres-data-comms
          mountPath: /var/lib/postgresql/data  # Ruta donde PostgreSQL almacenará los datos
  volumeClaimTemplates:
  - metadata:
      name: postgres-data-comms
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi # Tamaño del volumen persistente
---
apiVersion: v1
kind: Service
metadata:
  name: db-comms-svc
spec:
  ports:
    - port: 5432
  clusterIP: None  # Esto es clave para los StatefulSets
  selector:
    app: db_comms
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: comms-api-deployment
  labels:
    app: api-comms
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-comms
  template:
    metadata:
      labels:
        app: api-comms
    spec:
      containers:
      - name: api-comms
        image: stevengez/sap5-comms:latest
        imagePullPolicy: Always
        resources:
          requests:
            memory: "128Mi"
            cpu: "80m"
          limits:
            memory: "128Mi"
            cpu: "300m"
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "db-comms-svc"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres123"
        - name: DB_NAME
          value: "p4"
---
apiVersion: v1
kind: Service
metadata:
  name: api-comms-svc
spec:
  selector:
    app: api-comms
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: comms-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: comms-api-deployment
  minReplicas: 1
  maxReplicas: 2
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### ms_auth_deploy.yaml
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db-auth-stateful
spec:
  serviceName: "postgres"  # Nombre del servicio que maneja los pods de PostgreSQL
  replicas: 1  # Número de réplicas
  selector:
    matchLabels:
      app: db_auth
  template:
    metadata:
      labels:
        app: db_auth
    spec:
      containers:
      - name: postgres
        image: postgres:latest  # Imagen de PostgreSQL
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          value: "postgres123"
        - name: POSTGRES_DB
          value: "p5"
        - name: PGUSER
          value: "postgres"
        - name: PGDATA
          value: "/var/lib/postgresql/data/pgdata"  # Ruta donde PostgreSQL almacenará los datos
        volumeMounts:
        - name: postgres-data-auth
          mountPath: /var/lib/postgresql/data  # Ruta donde PostgreSQL almacenará los datos
  volumeClaimTemplates:
  - metadata:
      name: postgres-data-auth
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi # Tamaño del volumen persistente
---
apiVersion: v1
kind: Service
metadata:
  name: db-auth-svc
spec:
  ports:
    - port: 5432
  clusterIP: None  # Esto es clave para los StatefulSets
  selector:
    app: db_auth
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-api-deployment
  labels:
    app: api-auth
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-auth
  template:
    metadata:
      labels:
        app: api-auth
    spec:
      containers:
      - name: api-auth
        image: stevengez/sap5-msauth:p6-v1
        imagePullPolicy: Always
        resources:
          requests:
            memory: "128Mi"
            cpu: "80m"
          limits:
            memory: "180Mi"
            cpu: "350m"
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "db-auth-svc"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres123"
        - name: DB_NAME
          value: "p5"
---
apiVersion: v1
kind: Service
metadata:
  name: api-auth-svc
spec:
  selector:
    app: api-auth
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-api-deployment
  minReplicas: 1
  maxReplicas: 2
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### gateway.yaml
```yaml
kind: Gateway
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
  name: proyect-gateway
spec:
  gatewayClassName: gke-l7-global-external-managed
  listeners:
  - name: http
    protocol: HTTP
    port: 80
---
kind: HTTPRoute
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
  name: proyect-route
spec:
  parentRefs:
    - kind: Gateway
      name: proyect-gateway
  rules:
    - matches:
      - path:
          value: /api/v1/usuarios
      filters:
      - type: URLRewrite
        urlRewrite:
          path:
            type: ReplacePrefixMatch
            replacePrefixMatch: /graphql
      backendRefs:
        - name: api-auth-svc
          port: 80
          namespace: p5
---
kind: HTTPRoute
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
  name: proyect-route-reacts
spec:
  parentRefs:
    - kind: Gateway
      name: proyect-gateway
  rules:
    - matches:
      - path:
          value: /api/v1/reacciones
      filters:
      - type: URLRewrite
        urlRewrite:
          path:
            type: ReplacePrefixMatch
            replacePrefixMatch: /
      backendRefs:
        - name: api-reacts-svc
          port: 80
          namespace: p5
---
kind: HTTPRoute
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
  name: proyect-route-posts
spec:
  parentRefs:
    - kind: Gateway
      name: proyect-gateway
  rules:
    - matches:
      - path:
          value: /api/v1/publicaciones
      filters:
      - type: URLRewrite
        urlRewrite:
          path:
            type: ReplacePrefixMatch
            replacePrefixMatch: /graphql
      backendRefs:
        - name: api-posts-svc
          port: 80
          namespace: p5
---
kind: HTTPRoute
apiVersion: gateway.networking.k8s.io/v1beta1
metadata:
  name: proyect-route-comms
spec:
  parentRefs:
    - kind: Gateway
      name: proyect-gateway
  rules:
    - matches:
      - path:
          value: /api/v1/comentarios
      filters:
      - type: URLRewrite
        urlRewrite:
          path:
            type: ReplacePrefixMatch
            replacePrefixMatch: /
      backendRefs:
        - name: api-comms-svc
          port: 80
          namespace: p5
  
```

### Verificar el estado de los recursos
Para verificar el estado de los recursos desplegados, se pueden utilizar los siguientes comandos:

- Verificar los pods:
```sh
kubectl get pods -n sa-p5
```

- Verificar los servicios:
```sh
kubectl get svc -n sa-p5
```

- Verificar los deployments:
```sh
kubectl get deployments -n sa-p5
```

- Verificar los statefulsets:
```sh
kubectl get statefulsets -n sa-p5
```

- Verificar los horizontal pod autoscalers:
```sh
kubectl get hpa -n sa-p5
```

## Diagrama de Arquitectura
![alt text](<P5 - Diagrama de Arquitectura.jpg>)

## Por que usar Google Cloud Platform?

Google Cloud ofrecío servicios de kubernetes como servicio primero que las otras grandes plataformas por lo que su uso es considerablemente mas facil en comparacion.
Adicionalmente ofrece herramientas que se integracon con kubernetes de manera muy amigable y potente
Tambien porque ofrece el uso de kubernetes en la capa gratuita

Comandos usados: 

Para crear el cluster
```bash
gcloud container clusters create CLUSTER_NAME \
  --num-nodes=NODE_NUMBER \
  --location=CLUSTER_LOCATION
```

Para agregar directivas que permiten el uso de Gateway
```bash
gcloud container clusters update CLUSTER_NAME \
    --location=CLUSTER_LOCATION\
    --gateway-api=standard
```

Conectar Kubectl local con remoto
```bash
gcloud container clusters get-credentials sa-p5-cluster --zone us-central1-a --project saproyect
```