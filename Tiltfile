k8s_yaml([
    'k8s/secret.yaml',
    'k8s/consumer-deployment.yaml',
    'k8s/producer-deployment.yaml',
    'k8s/rabbitmq-deployment.yaml',
 ])

docker_build('bencoderus/nodemq', '.', live_update=[
    sync('./src', '/app/src'),
])

k8s_resource(
    'nodemq-consumer-deployment', 
    resource_deps=[
        'nodemq-rabbitmq-deployment', 
    ],
    labels='Service'
)

k8s_resource(
    'nodemq-producer-deployment', 
    resource_deps=[
        'nodemq-rabbitmq-deployment'
    ],
    port_forwards=['3000:3000'],
    labels='Service'
)

k8s_resource(
    'nodemq-rabbitmq-deployment', 
    port_forwards=['15672:15672'],
    labels='Infrastructure'
)