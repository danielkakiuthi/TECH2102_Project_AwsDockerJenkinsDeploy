pipeline {
  agent any 
  environment {
    AWS_ACCOUNT_ID="058264500364"
    AWS_DEFAULT_REGION="us-east-1"
    IMAGE_REPO_NAME="tech2102_project_repository_jenkins-pipeline"
    IMAGE_TAG="latest"
    REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    ECS_CLUSTER_NAME="TECH2102_Project_Cluster"
    ECS_SERVICE_NAME="TECH2102_Project_Service"
  }
  stages {
    stage('Logging into AWS ECR') { 
      steps {
        script {
          sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
        }
      }
    }

    stage('Cloning Git') { 
      steps {
        checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/danielkakiuthi/TECH2102_Project_AwsDockerJenkinsDeploy.git']]])
      }
    }

    //Building Docker Images
    stage('Building image'){
      steps {
        script {
          dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
        }
      }
    }

    //Uploading Docker Images into AWS ECR
    stage('Pushing to ECR'){
      steps {
        script {
          sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:${IMAGE_TAG}"
          sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
        }
      }
    }
    
    //Update Container on new Image
    stage('Update Container in ECS'){
      steps {
        script {
          aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --force-new-deployment
        }
      }
    }
  }
}