#!/usr/bin/env groovy

import java.util.Date

def repoName = 'image_editor_app'
def projectName = 'utilities'

def isMaster = env.BRANCH_NAME == 'master'
def isStaging = env.BRANCH_NAME == 'staging'
def start = new Date()
def err = null

String jobInfoShort = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME}"
String jobInfo = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME} \n${env.BUILD_URL}"
String buildStatus
String timeSpent

currentBuild.result = "SUCCESS"

try {
    node {
        deleteDir()
        env.NODEJS_HOME = "${tool 'Node 6.14.1'}"
        env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"

        // Mark the code checkout 'stage'
        stage ('Checkout') {
            // Get the code from the repository
            checkout scm
        }

        if(isMaster || isStaging){
            def tag = isMaster ? "latest" : "staging"
            stage ('Docker Build') {
                sh "docker build -t ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${tag} ."
            }
            stage ('Push to ECR') {
                sh "\$(aws ecr get-login --no-include-email --region ${AWS_ECR_REGION})"
                pushImage(repoName, projectName, tag)
            }

            // stage ('Deploy to rancher') {
            //     sh "curl -d \"imageId=docker:${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${tag}\" ${RANCHER_ECR_AUTODEPLOYER_ENDPOINT}"
            // }
        }
    }
} catch (caughtError) {
    err = caughtError
    currentBuild.result = "FAILURE"
} finally {
    timeSpent = "\nTime spent: ${timeDiff(start)}"

    if (err) {
        slackSend (color: 'danger', message: "_Build failed_: ${jobInfo} ${timeSpent}")
        throw err
    } else {
        if (currentBuild.previousBuild == null) {
            buildStatus = '_First time build_'
        } else if (currentBuild.previousBuild.result == 'SUCCESS') {
            buildStatus = '_Build complete_'
        } else {
            buildStatus = '_Back to normal_'
        }

        slackSend (color: 'good', message: "${buildStatus}: ${jobInfo} ${timeSpent}")
        if (isStaging || isMaster) {
            slackSend (color: 'good', message: "*${env.BRANCH_NAME}* branch deployed to _Amazon ECR_")
        }
    }


}

def pushImage(repoName, projectName, tag){
    try{
        sh "docker push ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${tag}"
    }catch(e){
        sh "aws ecr create-repository --repository-name ${projectName}/${repoName} --region ${AWS_ECR_REGION}"
        sh "aws ecr set-repository-policy --repository-name ${projectName}/${repoName} --policy-text \"\$(curl https://s3-eu-west-1.amazonaws.com/ecr-policy/ecr-policy.json)\" --region ${AWS_ECR_REGION}"
        sh "docker push ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${tag}"
    }
}

def timeDiff(st) {
    def delta = (new Date()).getTime() - st.getTime()
    def seconds = delta.intdiv(1000) % 60
    def minutes = delta.intdiv(60 * 1000) % 60

    return "${minutes} min ${seconds} sec"
}