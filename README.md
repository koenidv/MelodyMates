# MelodyMates

**Share music with your mates**

This repository contains the [database configuration](https://github.com/koenidv/MelodyMates/tree/main/.fauna) and a PWA test client for MelodyMates deployed at [MelodyMates.app](https://melodymates.app).

MelodyMates is a social network for close friends who want to share new songs they've discovered.
Users can post the song they're currently listening to or search for specific titles.
They can react to their friend's posts and reply by text or songs. MelodyMates is made for young music lovers.

### Running the PWA Test Client

1. Install dependencies using `npm i`
2. Run and open the dev server using `npm run dev --open`

### Deploying the PWA Test Client

This client is continuously deployed on Netlify on pushes to main.  
If you still want to create a production version of the client, use `npm run build` and preview using `npm run preview`

### Database Configuration

The database is currently not managed as IaC, meaning it has to be set up manually.  
The [.fauna directory](https://github.com/koenidv/MelodyMates/tree/main/.fauna) includes a GraphQL schema including relationship indexes, as well as generated indexes, role definitions and user defined functions.
