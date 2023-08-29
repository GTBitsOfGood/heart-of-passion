## Current Deployment

- [Netlify](https://netlify.com) is used for hosting the application
  - Important Environment Variables to Set
    - `DATABASE_URL`: MongoDB connection string with a specified OAuth
      - There are different values set for staging, production, and deploy previews
    - `NEXTAUTH_URL`: Url of the site running in production.
    - `NEXTAUTH_SECRET`: Secret used for NextAuth generated using `openssl rand -base64 32`
    - **TODO** OAuth stuff
- [Azure Cosmos DB](https://azure.microsoft.com/en-us/products/cosmos-db) is used for MongoDB hosting
