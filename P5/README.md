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
kubectl apply -f ms_auth_deploy.yaml -n sa-p5
kubectl apply -f ms_reacts_deploy.yaml -n sa-p5
kubectl apply -f ms_posts_deploy.yaml -n sa-p5
kubectl apply -f ms_comms_deploy.yaml -n sa-p5
kubectl apply -f ingress.yaml -n sa-p5
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
        image: p4-api_reacts:latest
        imagePullPolicy: Never
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
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
        image: p4-api_posts:latest
        imagePullPolicy: Never
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
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
        image: p4-api_comments:latest
        imagePullPolicy: Never
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
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
        image: p4-api_auth:latest
        imagePullPolicy: Never
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
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

### ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: proyect-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /api/v1/usuarios(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: api-auth-svc
            port:
              number: 80
      - path: /api/v1/publicaciones(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: api-posts-svc
            port:
              number: 80
      - path: /api/v1/comentarios(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: api-comms-svc
            port:
              number: 80
      - path: /api/v1/reacciones(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: api-reacts-svc
            port:
              number: 80
  
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

## ¿Qué es un CronJob?

Un CronJob en Kubernetes es un recurso que permite ejecutar tareas programadas en el clúster. Funciona de manera similar a cron en sistemas Unix, permitiendo definir trabajos que se ejecutan en intervalos de tiempo específicos. Los CronJobs son útiles para tareas periódicas como copias de seguridad, informes y limpieza de datos.