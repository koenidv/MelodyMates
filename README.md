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

### Project Architecture
... work in progress

### Data Model
![Data Model](https://user-images.githubusercontent.com/32238636/234260833-f57e03cb-11a6-4841-bcd5-f1e686b2f7ec.png)

#### [Browse the Data Model Online](https://app.graphqleditor.com/florians-workspace/melodymates?v=latest&c=off&pane=relation)
[<img src="https://user-images.githubusercontent.com/32238636/234260989-8a196c06-4336-427a-b1e5-8905ad72aaac.png" alt="GraphQL schema" width="300">](https://app.graphqleditor.com/florians-workspace/melodymates?v=latest&c=off&pane=relation)
