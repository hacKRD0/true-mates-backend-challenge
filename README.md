# Requirement 2

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

## Scope

## Validations

-   The number of images uploaded cannot be more than 5.
-   Created an md5 hash for each uploaded file using the filename, creation dateTime and the userId of the creator for unique keys for each image being stored in GCS.
-   Post description can only be edited by a user if that user is its creator.

## Features

-   Sequelize by default adds createdAt and updatedAt fields when creating new models. The app utilizes this attribute when calculating the time difference for a get request made to a specific post.
-   The photoUrl attribute of type STRING was replaced by photoUrls attribute of type ARRAY of STRINGS, which stores an array of urls (GCS storage keys for each image).
-   The description of a post can be edited with a put request.
