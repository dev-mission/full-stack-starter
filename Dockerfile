# Start with the latest Node.js LTS release
FROM node:18.16.0-bullseye

# Support for multi-architecture builds
ARG TARGETARCH

# Set an env variable for the location of the app files
ENV APP_HOME=/opt/node/app

# update path to include any installed node module executables
RUN echo "export PATH=$APP_HOME/node_modules/.bin:~/minio-binaries:\$PATH\n" >> /root/.bashrc

RUN wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" >> /etc/apt/sources.list.d/pgdg.list && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update -y && \
    apt-get install -y docker-ce-cli docker-buildx-plugin jq less postgresql-client-14 zip && \
    apt-get clean && \
    curl https://dl.min.io/client/mc/release/linux-$TARGETARCH/mc --create-dirs -o ~/minio-binaries/mc && \
    chmod +x ~/minio-binaries/mc

RUN if [ "$TARGETARCH" = "amd64" ]; then \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"; \
    fi && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && \
    rm -Rf aws

# Create a directory for the server app to run from
RUN mkdir -p $APP_HOME

# Add the project files into the app directory
ADD . $APP_HOME

# Set workdir
WORKDIR $APP_HOME

# Install dependencies, build client app
RUN npm install && \
    npm run build -w client

# Set up default command to run Node on port 3000
EXPOSE 3000
CMD ["./node_modules/.bin/pm2-runtime", "./server/bin/www.js"]
