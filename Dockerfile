FROM node:22.12.0-bookworm

# Support for multi-architecture builds
ARG TARGETARCH

# Set an env variable for the location of the app files
ENV APP_HOME=/opt/node/app

# Install postgres dependencies
RUN apt update -y && \
    apt install -y curl ca-certificates && \
    install -d /usr/share/postgresql-common/pgdg && \
    curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc && \
    sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list' && \
    apt update -y && \
    apt install -y postgresql-client-17 && \
    apt clean

# Install docker dependencies
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt update -y && \
    apt install -y docker-ce-cli docker-buildx-plugin && \
    apt clean

# Install AWS cli dependencies
RUN apt install -y jq less zip && \
    if [ "$TARGETARCH" = "amd64" ]; then \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"; \
    fi && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && \
    rm -Rf aws

# update path to include any installed node module executables
RUN echo "export PATH=./node_modules/.bin:\$PATH\n" >> /root/.bashrc

# Create a directory for the server app to run from
RUN mkdir -p $APP_HOME

# Add the project files into the app directory and set as working directory
ADD . $APP_HOME
WORKDIR $APP_HOME

# Install dependencies, build client app, generate server prisma client
RUN npm install && \
    npm run build -w client && \
    npm run prisma:generate -w server

# Set up default command to run Node on port 3000
EXPOSE 3000
CMD ["./node_modules/.bin/pm2-runtime", "npm", "--", "start", "-w", "server"]
