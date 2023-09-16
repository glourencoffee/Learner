# About

This directory is a sub-project of Learner that provides web services for the web application. It is a REST application written in TypeScript on top of Node.js and MySQL.

# API

The documentation for the API is found in `/docs`.

# Requirements

Installation has the following requirements:
- Node version 20.4.0 or greater.
- MySQL/MariaDB 11.0.2 or greater.

# Installation

## Configuring the Database

Note: The instructions below use the word `learner` for username, password, and database name. Replace it with something else if you want to.

1\. Start MySQL/MariaDB's command-line interface with root privileges:

```bash
mariadb
```

2\. Create a MySQL database called `learner`:

```sql
CREATE DATABASE learner;
```

3\. Create a user called `learner` with password `learner`:

```sql
CREATE USER 'learner'@'localhost' IDENTIFIED BY 'learner';
```

4\. Grant privileges on database `learner` to user `learner`:

```sql
GRANT ALL PRIVILEGES ON `learner`.* TO 'learner'@'localhost';
```

5\. Optionally, grant privileges to user for remote access to the database. This is necessary if you intend to run the server in LAN:

```sql
GRANT ALL PRIVILEGES ON `learner`.* TO 'learner'@'localhost' IDENTIFIED BY 'learner';
```

6\. Flush privileges:

```sql
FLUSH PRIVILEGES;
```

## Running the Server

1\. Clone this repository:

```bash
git clone https://github.com/glourencoffee/Learner.git
```

2\. Head to the `webservices` directory:

```bash
cd Learner/webservices
```

3\. Install the dependencies:

```
npm install
```

4\. Create a file with name `.env` and set the server's configuration variables:

```
DB_HOST=localhost
DB_USER=learner
DB_PASS=learner
DB_NAME=learner
PORT=3000
```

Note: The webservices' host address and `PORT` should be informed in the configuration of the [webpages application](https://github.com/glourencoffee/Learner/tree/main/webpages).

5\. Build the production version:

```
npm run build
```

6\. Run the server:

```
npm start
```