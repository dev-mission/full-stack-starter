# AWS Deployment Setup

1. Sign up for an AWS account at: https://portal.aws.amazon.com/billing/signup

   This will create your "root" credentials which have access to and can
   manage everything. AWS best practices suggest immediately creating a
   separate Administrator account in IAM for day to day use. Consider
   creating another separate Administrator account for command-line use.

2. Create an access key for the account you wish to use for this deployment.

3. The AWS Command Line Interface tools (awscli) has been installed as part of the
   Docker image, so that you can access it inside a running container. The Docker
   Compose configuration maps relevant awscli configuration directories (`~/.aws`) so
   that credentials will be saved outside of the container in your own home directory.
   Run `docker compose up` to start your containers, then
   `docker compose exec server bash -l` to "log in" to your running server container.

4. Configure awscli with your account credentials by running: `aws configure`

   Make sure to save your access key id, secret access key, and region you
   wish to deploy/operate in.

5. Change into the `aws` directory (`cd aws`) and run the setup script (`./setup`).
   When prompted for an App name, choose something all lowercase, letters, numbers,
   and hyphen only, as this will be used to generate ids in the scripts.

   ```
   # ./setup
   ```

   This initial setup script creates a CloudFormation stack with an Elastic
   Beanstalk (EB) Application and an Elastic Container Registry (ECR) repository.
   The EB "Application" acts as a top level container for as many different
   "Environments" you would like to deploy. For example, you could have "test",
   "staging", and "production" environments. The ECR repository will hold
   the built Docker images for the application.

6. Tag your repository with a version number (i.e. 1.0.0) and run the push script
   to build a multi-architecture image and push it to the ECR repository.

   ```
   # ./push
   ```

   Then follow the prompts. Or, specify all the prompts on the command line:

   ```
   # ./push app
   ```

7. Create a new EB version from the pushed image using the release script (`./release`).

   ```
   # ./release
   ```

   Then follow the prompts. Or, specify all the prompts on the command line:

   ```
   # ./release app 1.2.0
   ```

8. Now you can create any number of separate environments from that version using
   the create script (`./create`).

   ```
   # ./create
   ```

   Then follow the prompts.

9. To deploy a new version, push and release a new version following steps 6 and 7,
   then run the update script (`./update`).

   ```
   # ./update
   ```

   Then follow the prompts. Or, specify all the prompts on the command line:

   ```
   # ./update app staging 1.2.0
   ```
