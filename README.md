# Requirement 2

## Approach

-   Sequelize by default adds createdAt and updatedAt fields when creating new models which I utilized to complete the first bit.
-   The moment module calculates the time difference between now and the createdAt attribute of the requested post.
-   I changed the posts table schema by dropping the photoUrl column and creating a new column named photoUrls which stores an array of strings instead of a single string using sequelize migrations.
-   A post's description can be edited through a put request.

## Validations

-   The number of images uploaded cannot be more than 5.
-   Created an md5 hash using javascript's crypto library for each uploaded file using the filename, creation dateTime and the userId of the creator for unique keys for each image being stored in GCS.
-   Post description can only be edited by a user if that user is its creator.

## Features

-   The getPost request returns the time difference between current time and creation time of the post
    ![Getting Started](./api_call_screenshots/getPost_success.png)
-   The photoUrl attribute of type STRING was replaced by photoUrls attribute of type ARRAY of STRINGS, which stores an array of urls (GCS storage keys for each image).
    ![Getting Started](./api_call_screenshots/createPost_success.png)
-   The description of a post can be edited with a put request.
    ![Getting Started](./api_call_screenshots/editPost_success.png)
