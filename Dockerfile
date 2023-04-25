# Start with the latest Node.js LTS release
FROM node:18.16.0

# Support for multi-architecture builds
ARG TARGETARCH

# Set an env variable for the location of the app files
ENV APP_HOME=/opt/node/app

# update path to include any installed node module executables
RUN echo "export PATH=$APP_HOME/node_modules/.bin:~/minio-binaries:\$PATH\n" >> /root/.bashrc

RUN wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" >> /etc/apt/sources.list.d/pgdg.list && \
    apt-get update -y && \
    apt-get install -y postgresql-client-14 && \
    apt-get clean && \
    curl https://dl.min.io/client/mc/release/linux-$TARGETARCH/mc --create-dirs -o ~/minio-binaries/mc && \
    chmod +x ~/minio-binaries/mc

# Create a directory for the server app to run from
RUN mkdir -p $APP_HOME

# Add the project files into the app directory
ADD . $APP_HOME

# Set workdir and install dependencies
WORKDIR $APP_HOME
RUN npm install
