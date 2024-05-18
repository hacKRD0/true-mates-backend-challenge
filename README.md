# Requirement 1

## 1. Create an Express.js app and use PostgreSQL for their database.

-   Create an Express server
-   Configure Sequelize and PostgreSQL

```bash
mkdir true-mates-backend
cd true-mates-backend
npm init -y  # Initializes a new Node.js project with default settings
```

-   Install the required dependencies

```bash
npm install express sequelize pg pg-hstore jsonwebtoken multer dotenv
```

-   Initialize a new git repository

```bash
git init
```

-   Add a .gitignore file from https://github.com/github/gitignore/blob/main/Node.gitignore to your project folder before committing anything.

-   Run the following commands to add all files to be committed, commit changes and push them

```bash
git add .
git commit -m "Setup complete"
git branch -M main
git remote add origin "Your github repo link"
git push -u origin main
```

## Scope

-   Since the tech stack was already decided I dove right into creating the features.
-

## Validations

-   The app prevents duplicate user registration

## Features

-   User gives name, email and password while registering. If the email is not already in the database, the app creates a new user with a hashed password stored to the database in place of the plaintext password.
-   User gives email and password while logging in. If the email does not exist in the user or the password entered is incorrect then corresponding messages are sent back. If the log in is successful then the request returns a JWT bearer token.
-   When a user tries to create a post, there is check in place to make sure that a bearer token is present, is valid and has not expired before the creation of a post is allowed.
-   Post is created only after storing the uploaded image to GCS. If the upload fails for some reason then post creation fails and returns a message with the reason.
-   Posts database only stores the GCS bucket key for each image for future access.
