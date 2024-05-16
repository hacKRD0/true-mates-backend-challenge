# True-mates Backend Challenge

## Step 1: Initialize the project

-   Open the terminal, navigate to the project directory and initialize a new node.js project

```bash
mkdir true-mates-backend
cd true-mates-backend
npm init -y  # Initializes a new Node.js project with default settings
```

-   Install the required dependencies

```bash
npm install express sequelize pg pg-hstore jsonwebtoken multer dotenv nodemon
npm --save-dev sequelize-cli
```

-   Initialize a new git repository

```bash
git init
```

-   Add a .gitignore file from https://github.com/github/gitignore/blob/main/Node.gitignore to your project folder before committing anything.

-   Store your GCS secret key JSON file in the root directory of the project folder
-   Add the secret key file name to the gitignore file.

-   Create a .sequelizerc file and initialize a sequelize project
-   Create a .env file to store environment variables
-   Add scripts to package.json to run sequelize commands to create, migrate, seed, reset and reseed the database

