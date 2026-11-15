

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


datasource: {
  url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
},

//Introspect your database
npx prisma db pull

//Generate Prisma Client
npx prisma generate