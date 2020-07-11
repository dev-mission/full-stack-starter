# Full-Stack Starter

This repository contains a "starter" project for web application development in JavaScript.

## Getting Started

1. Clone this git repo to a "local" directory (on your computer), then change
   into the directory.

   ```
   $ git clone https://github.com/dev-mission/full-stack-starter.git
   $ cd full-stack-starter
   ```

   <!-- AFTER SETTING UP, DELETE FROM HERE... -->

1. After cloning, your "local" repo (in this directory on your computer) will be linked to the "remote"
   repo (as the "origin"). To track and save your own work on top of this code, rename the remote
   to something else (in this example, to the name "upstream"):

   ```
   $ git remote rename origin upstream
   ```

1. Create your own new git repo for your work, then push up and link your local repo
   to it as the new "origin" :

   ```
   $ git remote add origin <your new remote repository URL>
   $ git push -u origin master
   ```

   <!-- ... TO HERE!!! -->

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop

   1. If you have Windows Home Edition, you will need to install Docker Toolbox instead.
   See the troubleshooting notes below.

2. Open a command-line shell, change into your repo directory, and execute this command:

   ```
   $ docker-compose up
   ```

   It will take a while the first time you run this command to build the "images" to
   run the web application code in a Docker "container". When you see messages that look
   like this, the server is running:

   ```
   server_1       | 2:14:26 AM web.1     |  > app@0.0.0 start /opt/node/app
   server_1       | 2:14:26 AM web.1     |  > nodemon -V --ignore ./client ./bin/www
   server_1       | 2:14:26 AM web.1     |  [nodemon] 1.19.0
   server_1       | 2:14:26 AM web.1     |  [nodemon] to restart at any time, enter `rs`
   server_1       | 2:14:26 AM web.1     |  [nodemon] or send SIGHUP to 57 to restart
   ```

3. Now you should be able to open the web app in your browser at: http://localhost:3000/

   1. If you had to install Docker Toolbox, then replace "localhost" with the IP
   address of the Docker Virtual Machine.

4. To stop the server, press CONTROL-C in the window with the running server.
   If it is successful, you will see something like this:

   ```
   Killing full-stack-starter_db_1           ... done
   Killing full-stack-starter_server_1       ... done
   Killing full-stack-starter_mailcatcher_1  ... done
   ```

   If it is not successful, you may see something like this:

   ```
   ERROR: Aborting.
   ```

   If you get an error, the server may still be running on your computer. To force it to stop,
   run the following command and wait for the output to report DONE:

   ```
   $ docker-compose stop
   Stopping full-stack-starter_db_1          ... done
   Stopping full-stack-starter_server_1      ... done
   Stopping full-stack-starter_mailcatcher_1 ... done
   ```

5. That's it! After all this setup is complete, the only command you need to run to get
started again is the ```docker-compose up``` command.

## Shell Command Quick Reference

 * Every directory and file on your computer has a *path* that describes its location in storage. Special path symbols include:

   * The current *working directory* you are in: `.`
   * The *parent* of the current working directory: `..`
   * Your *home* directory: `~`
   * The *root* directory: `/` (Mac, Linux) or `\` (Windows)
     * The same symbol is used as a *separator* when specifying multiple directories in a path
     * If the path *starts* with the separator, it means the path starts at the *root*
       * For example: `/Users/myusername/Documents`
       * This is called an *absolute* path
     * If the path *does not start* with the separator, it means the path starts at the current *working directory*
       * For example, if the current *working directory* is: `/Users`  
         then the same path as the previous example is: `myusername/Documents`
       * This is called a *relative* path
     * A path can also start with any of the above special path symbols
       * For example, on Mac the same path as the previous example is: `~/Documents`

 * To *print the working directory* (i.e. to see the full path of the directory you are currently in):

   ```
   $ pwd
   ```

 * To *list* the files in the working directory:

   ```
   $ ls -l
   ```

 * To *change* the working directory:

   ```
   $ cd path
   ```

 * To *make* a new directory inside the working directory:

   ```
   $ mkdir newpath
   ```

 * To create a new *empty file* inside the working directory:

   ```
   $ touch filename.ext
   ```

## git Command Quick Reference

 * To check the *status* of the files in your local repo (i.e. what's been added or changed):

   ```
   $ git status
   ```

 * To *add all* the changed files to the next commit:

   ```
   $ git add .
   ```

   To *add specific file(s)* to the next commit:

   ```
   $ git add path/to/file1.ext path/to/file2.ext path/with/wildcard/*
   ```

 * To *commit* the added files with a message:

   ```
   $ git commit -m "My description of what's changed"
   ```

 * To *push* the commit to the remote repo:

   ```
   $ git push
   ```

 * To *pull* any new commits from the remote repo:

   ```
   $ git pull
   ```

## Docker Command Quick Reference

 * To start all the containers:

   ```
   $ docker-compose up
   ```

 * To log in to the running server container:

   ```
   $ docker-compose exec server bash -l
   ```

 * To stop all the containers, in case things didn't shutdown properly with CTRL-C:

   ```
   $ docker-compose stop
   ```

 * To run the server container without starting everything using the up command:

   ```
   $ docker-compose run --rm server bash -l
   ```

 * To re-build the server container:

   ```
   $ docker-compose build server
   ```

## Docker Troubleshooting

* On some PC laptops, a hardware CPU feature called virtualization is disabled by default, which is required by Docker. To enable it, reboot your computer into its BIOS interface (typically by pressing a key like DELETE or F1 during the boot process), and look for an option to enable it. It may be called something like *Intel Virtualization Technology*, *Intel VT*, *AMD-V*, or some similar variation.

* On Windows, Docker Desktop cannot run on Windows Home edition. Install Docker Toolbox instead:

  https://docs.docker.com/toolbox/overview/

  https://github.com/docker/toolbox/releases

  Use the *Docker QuickStart shell* installed with Docker Toolbox to open a command-line shell that launches Docker for you when it starts. On Windows, right-click on the shotcut and Run as Administrator. Note: this can take a long time to start, depending upon your computer, as it needs to start a virtual machine running Linux.

  The virtual machine will have its own, separate IP address on your computer. In the ```.env``` file (see step 4 in Getting Started), replace *localhost* with *192.168.99.100* in the BASE_HOST and BASE_URL variables. To confirm that this is the correct IP address, run this command in the command-line shell:

  ```
  $ docker-machine ip
  ```

## License

Full-Stack Starter
Copyright (C) 2020 <dev/Mission>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
