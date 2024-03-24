#!/usr/bin/env bash

#Stop following command execution if command before failed
set -e

dst="./db-data"
project="fuelerp-dev"
bucketName="gs://${project}.appspot.com/${dst}"

delete_previous_version_if_exists() {
  #We either delete local folder and bucket object or just a bucket
  (rm -r "$dst" && gsutil -o "GSUtil:parallel_process_count=1" -m rm -r "$bucketName") || gsutil -o "GSUtil:parallel_process_count=1" -m rm -r "$bucketName"
}

export_production_firebase_to_emulator() {
  gcloud config set project "$project"

  #Export production firebase to emulator bucket
  gcloud firestore export "$bucketName"

  #Copy to local folder
  gsutil -o "GSUtil:parallel_process_count=1" -m cp -r "$bucketName" .
}

#Run bash functions, either delete previous bucket and local folder if exists for update or just export clean way
delete_previous_version_if_exists && export_production_firebase_to_emulator ||
export_production_firebase_to_emulator
