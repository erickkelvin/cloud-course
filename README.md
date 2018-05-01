# Cloud Course
Repository containing projects for the cloud course at UFC, using Amazon Web Services and Google Cloud Platform.


## AWS Project

### Setup

1. Set the following environment variables:
   * DB_HOST
   * DB_NAME
   * DB_USER
   * DB_PASS
   * DB_PORT
   * DB_DIALECT
   * AWS_ACCESS_KEY_ID
   * AWS_SECRET_ACCESS_KEY
   * AWS_DEFAUT_REGION
   * S3_BUCKET
   * SES_EMAIL
   * SES_REGION

2. Clone the repository and then run in the terminal:  
    ```bash
    cd ecommerce_aws 
    npm install
    ```
    
### Run
1. In the terminal, type:

    ```bash
    npm start
    ```
    
2. Open `http://localhost:3000` (replace 'localhost' if running on AWS) in your browser.

<br/>

## GCP Project

### Setup

1. Set the following environment variables:
   * DB_HOST
   * DB_NAME
   * DB_USER
   * DB_PASS
   * DB_PORT
   * DB_DIALECT
   * DB_INSTANCE_CONNECTION_NAME
   * GCS_KEYFILE
   * GCS_BUCKET
   * GCLOUD_PROJECT
   * MEMCACHE_URL
   * MEMCACHE_USERNAME
   * MEMCACHE_PASSWORD
   * MJ_APIKEY_PUBLIC
   * MJ_APIKEY_PRIVATE
   * MJ_SENDER
   * GOOGLE_APPLICATION_CREDENTIALS (only for dev environment)

2. If in production, also set beta_settings.cloud_sql_instances inside app.yaml

3. Clone the repository and then run in the terminal:  
    ```bash
    cd ecommerce_gcp 
    npm install
    ```
    
### Run

1. If in development, run Google Cloud SQL Proxy first. Then in the terminal, type:

    ```bash
    npm start
    ```
    
2. Open `http://localhost:3000` (dev) or appspot url (prod) in your browser.
