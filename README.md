# Heart of Passion

Heart of Passion is a nonprofit organization led by dedicated teen volunteers. The group organizes specialized retreats for adolescents with cancer, aiming to foster emotional support and meaningful connections among attendees. Created by teens for teens, these retreats serve as a unique platform for young cancer patients to share experiences and create lasting memories, all within a nurturing environment.

This repository aims to support teen volunteers in their retreat planning and budgeting efforts.

## Setup

- Get a running MongoDB instance
- Create a .env file with DATABASE_URL=YOUR-URL-HERE
- `npm install`
- `npm start`

## Tour of the Codebase

- `/public` static assets
- `/prisma` database schema
- `/src` source folder
  - `/src/pages` next.js pages directory, can create new frontend routes here
  - `/src/server` trpc router definitions
  - `/src/styles` css entrypoint (shouldn't need to mess with here much)
  - `/src/utils` miscellaneous functions

## Major Technologies

- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [NextAuth.js](https://next-auth.js.org)

## Setup

**TODO**

## Learn More

- [T3 Stack Documentation](https://create.t3.gg/)
