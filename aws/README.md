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
   You can edit the `setup` script files or pass arguments to customize the
   application name.

   ```
   # ./setup fss
   ```

   This initial setup script creates a CloudFormation stack with an Elastic
   Beanstalk (EB) Application and an Elastic Container Registry (ECR) repository.
   The EB "Application" acts as a top level container for as many different
   "Environments" you would like to deploy. For example, you could have "test",
   "staging", and "production" environments. The ECR repository will hold
   the built Docker images for the application.

6. Push the built Docker images for the version you wish to deploy to the new
   ECR repository using the push script (`./push`).

   ```
   # ./push fss 4.1.2
   ```

7. Create a new EB version from the pushed image using the release script (`./release`).

   ```
   # ./release fss 4.1.2
   ```

8. Now you can create any number of separate environments from that version using
   the create script (`./create`).

   ```
   # ./create fss test 4.1.12
   ```
