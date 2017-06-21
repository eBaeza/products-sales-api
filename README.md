## Dependencies
- Node JS _Use: v6.10.3_
- npm _Use: v5.0.3_
- [MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html) _Use: v5.7.18_
- [PostgreSQL](https://www.postgresql.org/download/) _Use: v9.6.3_

## Docs
- [Api Docs](https://documenter.getpostman.com/view/592641/products-sales-api/6Z6tBrf#3343a349-2a02-f5ec-390f-750787fbe11d)

## Initialize

### Configuration
- `npm run init`
- All of the configuration files (.json) are stored in the config directory.

### Run migrations
`npm run migrate && npm run migrate:v2`

### Run seeders
`npm run seed && npm run seed:v2`

_You can also change the user's values or add new users in the "users-seeder"_

## Develop

### Start development mode
`npm start`

### Use sequelize cli
`npm run sequelize`

## Production

### Compile babel
`npm run build`

### Run production server
`npm run serve`