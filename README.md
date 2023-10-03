<p align="center">
  <img width="239" src="https://github.com/GTBitsOfGood/heart-of-passion/assets/20666846/ac2e6e6d-692c-488b-88cc-0512744e7a4e" alt="Heart of Passion logo"/>
</p>

Heart of Passion is a nonprofit organization led by dedicated teen volunteers. The group organizes specialized retreats for adolescents with cancer, aiming to foster emotional support and meaningful connections among attendees. Created by teens for teens, these retreats serve as a unique platform for young cancer patients to share experiences and create lasting memories, all within a nurturing environment.

This repository aims to support teen volunteers in their retreat planning and budgeting efforts.

## Development Setup

- Get a locally running MongoDB instance
   - If you have docker installed I believe `docker run --name mongodb -d -p 27017:27017 mongo` will work
- Create a `.env` file in the root of the repository with the content: `DATABASE_URL=YOUR-URL-HERE`
   - This is generally `DATABASE_URL=mongodb://localhost:27017/heartofpassion`
- `npm install`
- `npm run generate-dummy-data`
- `npm run dev`

## Major Technologies

- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- Chakra UI
- Mongoose
