pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        BACKEND_IMAGE = 'yourusername/mern-amazona-backend'
        FRONTEND_IMAGE = 'yourusername/mern-amazona-frontend'
        IMAGE_TAG = "${GIT_COMMIT[0..6]}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Testing backend is reachable...'
                sh '''
                    docker compose up -d mongodb backend
                    sleep 10
                    curl -f http://localhost:4000/api/products || exit 1
                    docker compose down
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin

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
                echo 'Deploying latest version...'
                sh '''
                    docker compose down
                    docker compose pull
                    docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Build failed — rolling back to previous version...'
            sh '''
                docker compose down
                docker tag $BACKEND_IMAGE:previous $BACKEND_IMAGE:latest || true
                docker tag $FRONTEND_IMAGE:previous $FRONTEND_IMAGE:latest || true
                docker compose up -d
            '''
        }
    }
}