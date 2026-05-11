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
                echo 'Cleaning up any leftover containers...'
                sh '''
                    docker ps -q --filter "publish=4000" | xargs -r docker stop | xargs -r docker rm || true
                    docker ps -q --filter "publish=3000" | xargs -r docker stop | xargs -r docker rm || true
                    docker compose-down || true
                '''
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
                    docker ps -q --filter "publish=4000" | xargs -r docker stop | xargs -r docker rm || true
                    docker ps -q --filter "publish=27017" | xargs -r docker stop | xargs -r docker rm || true
                    docker compose-up -d mongodb backend
                    sleep 15
                    docker exec mern-cicd-pipeline-backend-1 curl -f http://localhost:4000/api/products || exit 1
                    docker compose-down
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin

                    # Save current latest as "previous" before pushing new one
                    docker pull $BACKEND_IMAGE:latest && \
                    docker tag $BACKEND_IMAGE:latest $BACKEND_IMAGE:previous && \
                    docker push $BACKEND_IMAGE:previous || true

                    docker pull $FRONTEND_IMAGE:latest && \
                    docker tag $FRONTEND_IMAGE:latest $FRONTEND_IMAGE:previous && \
                    docker push $FRONTEND_IMAGE:previous || true

                    # Push new version
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
                    docker-compose pull
                    docker-compose up -d mongodb backend frontend
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment is healthy...'
                sh '''
                    sleep 15
                    docker exec mern-cicd-pipeline-backend-1 curl -f http://localhost:4000/api/products || exit 1
                    echo "✅ Deployment verified successfully!"
                '''
            }
        }

        stage('Rollback') {
            when {
                expression { currentBuild.result == 'FAILURE' }
            }
            steps {
                echo '❌ Deployment failed — rolling back to previous version...'
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    docker pull $BACKEND_IMAGE:previous
                    docker pull $FRONTEND_IMAGE:previous
                    docker tag $BACKEND_IMAGE:previous $BACKEND_IMAGE:latest
                    docker tag $FRONTEND_IMAGE:previous $FRONTEND_IMAGE:latest
                    docker-compose down
                    docker-compose up -d mongodb backend frontend
                    echo "✅ Rolled back to previous version successfully!"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
            sh 'docker-compose down || true'  // only kill on failure
        }
    }
}
