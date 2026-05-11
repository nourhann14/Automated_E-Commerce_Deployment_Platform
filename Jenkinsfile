
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')

        BACKEND_IMAGE = 'nourhan14/mern-amazona-backend'
        FRONTEND_IMAGE = 'nourhan14/mern-amazona-frontend'

        IMAGE_TAG = "${GIT_COMMIT[0..6]}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'

                checkout scm
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning old containers and network...'

                sh '''
                    docker rm -f backend-container || true
                    docker rm -f frontend-container || true
                    docker rm -f mongodb-container || true

                    docker network rm app-network || true
                '''
            }
        }

        stage('Create Docker Network') {
            steps {
                echo 'Creating Docker network...'

                sh '''
                    docker network create app-network || true
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building backend image...'

                sh '''
                    docker build -t backend:latest ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend image...'

                sh '''
                    docker build -t frontend:latest ./frontend
                '''
            }
        }

        stage('Run MongoDB') {
            steps {
                echo 'Starting MongoDB container...'

                sh '''
                    docker run -d \
                        --name mongodb-container \
                        --network app-network \
                        mongo
                '''
            }
        }

        stage('Run Backend Test') {
            steps {
                echo 'Running backend container for testing...'

                sh '''
                    docker run -d \
                        --name backend-container \
                        --network app-network \
                        -p 4000:4000 \
                        -e MONGO_URI=mongodb://mongodb-container:27017/testdb \
                        backend:latest

                    sleep 15

                    docker logs backend-container

                    curl -f http://localhost:4000/api/products
                '''
            }
        }

        stage('Run Frontend Test') {
            steps {
                echo 'Running frontend container for testing...'

                sh '''
                    docker run -d \
                        --name frontend-container \
                        --network app-network \
                        -p 3000:80 \
                        frontend:latest

                    sleep 10

                    curl -f http://localhost:3000
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Logging into Docker Hub and pushing images...'

                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login \
                    -u $DOCKERHUB_CREDENTIALS_USR \
                    --password-stdin

                    # Backend Image
                    docker tag backend:latest $BACKEND_IMAGE:$IMAGE_TAG
                    docker tag backend:latest $BACKEND_IMAGE:latest

                    docker push $BACKEND_IMAGE:$IMAGE_TAG
                    docker push $BACKEND_IMAGE:latest

                    # Frontend Image
                    docker tag frontend:latest $FRONTEND_IMAGE:$IMAGE_TAG
                    docker tag frontend:latest $FRONTEND_IMAGE:latest

                    docker push $FRONTEND_IMAGE:$IMAGE_TAG
                    docker push $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application containers...'

                sh '''
                    docker rm -f backend-container || true
                    docker rm -f frontend-container || true
                    docker rm -f mongodb-container || true

                    docker run -d \
                        --name mongodb-container \
                        --network app-network \
                        mongo

                    docker run -d \
                        --name backend-container \
                        --network app-network \
                        -p 4000:4000 \
                        -e MONGO_URI=mongodb://mongodb-container:27017/proddb \
                        $BACKEND_IMAGE:latest

                    docker run -d \
                        --name frontend-container \
                        --network app-network \
                        -p 3000:80 \
                        $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'

                sh '''
                    sleep 15

                    curl -f http://localhost:4000/api/products

                    curl -f http://localhost:3000

                    echo "Deployment verified successfully!"
                '''
            }
        }
    }

    post {

        always {
            echo 'Pipeline finished.'
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'

            sh '''
                docker logs backend-container || true
                docker logs frontend-container || true
                docker logs mongodb-container || true
            '''
        }
    }
}

