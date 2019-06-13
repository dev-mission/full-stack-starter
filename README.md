# Full-Stack Starter

## Docker-based Development

1) Install Docker for your OS: https://www.docker.com/products/docker-desktop
2) Clone this repo into a directory on your computer
3) In the root of this repo directory, bring up the environment: ```$ docker-compose up```
4) In another shell, log in to the running server instance: ```$ docker-compose exec server bash -l```
5) Create the database: ```# sequelize db:create```
6) Run the database migrations: ```# sequelize db:migrate```
7) Open the web app in your browser at: http://localhost:3000/

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
