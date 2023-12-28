# theinternetfolks-assignment
The Interenet Folks Assignment


## Introduction

This project revolves around a SaaS platform that empowers users to create communities and manage their members efficiently. Through this platform, users can perform various actions such as signing up, creating communities, moderating members within those communities, and handling authentication.


## Tech Stack

The technology stack employed for this project includes:

    Database: PostgreSQL
    Backend: Node.js, Express.js
    ORM: Sequelize



<br>


## API Reference

### Roles

#### Get All Roles

```http
  GET /v1/role
```


#### Create Role

```http
  POST /v1/role
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. name |
  **"name"**: "Community Admin",
}`

<br>

### User

#### Register user
```http
  POST /v1/auth/signup
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. name, email, password |
  **"name"**: "name",
  **"email"**: "email",
  **"password"**: "password"
}`


#### Sign In User
```http
  POST /v1/auth/signin
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. email, password |
  **"email"**: "email",
  **"password"**: "password"
}`


#### Get Me
```http
  GET /v1/auth/me
```

| Headers | Type     | Value                       |
| :-------- | :------- | :-------------------------------- |
|  **Authorization**         | `token` |'your_jwt_token' |

<br>

### Community (All of these require Token Auth)

#### Create Community
```http
  POST /v1/community
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. name |
  **"name"**: "Community Name",
}`

#### Get All

```http
  GET /v1/community
```

#### Get All Members

```http
  GET /v1/community/:id/members
```


#### Get My Owned Community

```http
  GET /v1/community/me/owner
```

#### Get My Owned Community

```http
  GET /v1/community/me/member
```


<br/>

### Member (All of these require Token Auth)

#### Add Member
```http
  POST /v1/member
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `{            | `json` | **Required**. community, user, role |
  **"community"**: "communityID",
  **"user"**: "userID",
  **"role":** "roleID"
}`


#### Delete Member
```http
  DELETE /v1/member/:id
```


<br>


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST`

`DB_PASSWORD`

`DB_USERNAME`

`JWT_SECRET`


<br>



## Installation

Install with git:

```bash
  git clone https://github.com/ugauniyal/theinternetfolks-assignment.git
  cd theinternetfolks-assignment
```

Run:

```bash
  node index.js
```

<br>