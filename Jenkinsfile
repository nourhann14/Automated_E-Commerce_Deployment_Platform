pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')

        BACKEND_IMAGE = 'nourhan14/mern-amazona-backend'
        FRONTEND_IMAGE = 'nourhan14/mern-amazona-frontend'

        IMAGE_TAG = "${GIT_COMMIT[0..6]}"

        MONGO_URI = 'mongodb://mongodb-container:27017/amazona'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker rm -f backend-container || true
                    docker rm -f frontend-container || true
                    docker rm -f mongodb-container || true
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t backend:latest ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t frontend:latest ./frontend
                '''
            }
        }

        stage('Start MongoDB') {
            steps {
                sh '''
                    docker run -d \
                      --name mongodb-container \
                      -p 27017:27017 \
                      mongo

                    sleep 15
                '''
            }
        }

        stage('Run Backend Test') {
            steps {
                sh '''
                    docker run -d \
                      --name backend-container \
                      -p 4000:4000 \
                      --link mongodb-container:mongodb-container \
                      -e MONGO_URI=$MONGO_URI \
                      backend:latest

                    sleep 20

                    docker logs backend-container

                   curl -f http://localhost:4000/api/products | grep '\['
                '''
            }
        }

        stage('Run Frontend Test') {
            steps {
                sh '''
                    docker run -d \
                      --name frontend-container \
                      -p 3000:80 \
                      frontend:latest

                    sleep 10

                    curl -f http://localhost:3000
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login \
                      -u $DOCKERHUB_CREDENTIALS_USR \
                      --password-stdin

                    docker tag backend:latest $BACKEND_IMAGE:$IMAGE_TAG
                    docker tag backend:latest $BACKEND_IMAGE:latest

                    docker push $BACKEND_IMAGE:$IMAGE_TAG
                    docker push $BACKEND_IMAGE:latest

                    docker tag frontend:latest $FRONTEND_IMAGE:$IMAGE_TAG
                    docker tag frontend:latest $FRONTEND_IMAGE:latest

                    docker push $FRONTEND_IMAGE:$IMAGE_TAG
                    docker push $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f backend-container || true
                    docker rm -f frontend-container || true

                    docker run -d \
                      --name backend-container \
                      -p 4000:4000 \
                      --link mongodb-container:mongodb-container \
                      -e MONGO_URI=$MONGO_URI \
                      $BACKEND_IMAGE:latest

                    docker run -d \
                      --name frontend-container \
                      -p 3000:80 \
                      $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 15

                    curl -f http://localhost:4000/api/products

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
