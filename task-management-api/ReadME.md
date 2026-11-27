
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

npm install express-rate-limit

//TO INSTALL POSGRESQL PACKAGE
nmp i pg



//TO INSTALL PRISMA
npm i -D prisma@7

//Install Prisma Client and PostgreSQL adapter
npm install @prisma/client@7 @prisma/adapter-pg

//Initialize Prisma
npx prisma init --datasource-provider postgresql --output ../generated/prisma

then

Get-ChildItem

Get-ChildItem prisma

Get-Content prisma7.config.ts

Get-Content prisma/schema.prisma


Select-String -Path prisma/migrations/0_init/migration.sql -Pattern 'email'


Get-Content prisma/migrations/0_init/migration.sql | Select-Object -Last 15

Get-FileHash prisma/migrations/0_init/migration.sql -Algorithm SHA256


datasource: {
  url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
},

//Introspect your database
npx prisma db pull

//Generate Prisma Client
npx prisma generate






npx prisma db pull	Reads the existing database and updates your Prisma schema.



npx prisma migrate dev	//Creates and applies newmigrations during development.
New-Item -ItemType Directory -Path prisma/migrations //to creade a new path or folder
New-Item -ItemType Directory -Path prisma/migrations/0_init //The 0_ prefix ensures this baseline comes before future migrations in Prisma's migration order.
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script --output prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init
npx prisma migrate status
npx prisma migrate dev --create-only --name add-user-password
npx prisma migrate dev --name add_task_priority



npx prisma migrate deploy	Applies existing migrations in production.





//generate a strong random secret key instead of inventing one.
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(64).toString('hex'))"