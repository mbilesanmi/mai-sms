module.exports = {
  "development": {
    "username": process.env.DB_USERNAME_DEV§,
    "password": process.env.DB_PASSWORD_DEV§,
    "database": process.env.DB_DATABASE_DEV§,
    "host": process.env.DB_HOST_DEV§,
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": process.env.DB_USERNAME_TEST,
    "password": process.env.DB_PASSWORD_TEST,
    "database": process.env.DB_DATABASE_TEST,
    "host": process.env.DB_HOST_TEST,
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  }
}