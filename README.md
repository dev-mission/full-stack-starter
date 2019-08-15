# Full-Stack Starter

## Docker-based Development

1) Install Docker Desktop: https://www.docker.com/products/docker-desktop
2) Clone this repo into a directory on your computer. Open a command line shell and navigate to the repo directory.
3) Create an environment variables file from the example file: ```$ cp example.env .env```
4) In the root of this repo directory, bring up the environment: ```$ docker-compose up```
5) In another shell, log in to the running server instance: ```$ docker-compose exec server bash -l```
6) Create the database: ```# sequelize db:create```
7) Run the database migrations: ```# sequelize db:migrate```
8) Open the web app in your browser at: http://localhost:3000/

## Docker Troubleshooting

* On some PC laptops, a hardware CPU feature called virtualization is disabled by default, which is required by Docker. To enable it, reboot your computer into its BIOS interface (typically by pressing a key like DELETE or F1 during the boot process), and look for an option to enable it. It may be called something like *Intel Virtualization Technology*, *Intel VT*, *AMD-V*, or some similar variation.

* On Windows, Docker Desktop cannot run on Windows Home edition. Install Docker Toolbox instead:

  https://docs.docker.com/toolbox/overview/

  https://github.com/docker/toolbox/releases

  Use the *Docker QuickStart shell* installed with Docker Toolbox to open a command-line shell that launches Docker for you when it starts. On Windows, right-click on the shotcut and Run as Administrator. Note: this can take a long time to start, depending upon your computer, as it needs to start a virtual machine running Linux.

  The virtual machine will have its own, separate IP address on your computer. In the .env file (see step 3 above), replace *localhost* with *192.168.99.100* in the BASE_HOST and BASE_URL variables. To confirm that this is the correct IP address, run ```$ docker-machine ip``` on the command-line shell.

## License

Full-Stack Starter
Copyright (C) 2019 <dev/Mission>

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
