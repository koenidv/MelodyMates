# MelodyMates

**Share music with your mates**

[![Test Client](https://img.shields.io/badge/Visit-PWA%20Client-blue)](https://melodymates.app)
[![Add me on MelodyMates](https://img.shields.io/badge/Add%20me%20on-MelodyMates-purple)]([https://melodymates.app](https://melodymates.app/user/3ukbsbcagr66rfk9yokfd53ak))
[![Test Client](https://img.shields.io/badge/Browse-GraphQL%20Schema-green)](https://app.graphqleditor.com/florians-workspace/melodymates?v=latest&c=off&pane=relation)

This repository contains the [database configuration](https://github.com/koenidv/MelodyMates/tree/main/.fauna) and a PWA test client for MelodyMates deployed at [MelodyMates.app](https://melodymates.app).

MelodyMates is a social network for close friends who want to share new songs they've discovered.
Users can post the song they're currently listening to or search for specific titles.
They can react to their friend's posts and reply by text or songs. MelodyMates is made for young music lovers.

---

### Running the PWA Test Client

1. Install dependencies using `npm i`
2. Run and open the dev server using `npm run dev --open`

### Deploying the PWA Test Client

This client is continuously deployed on Netlify on pushes to main.  
If you still want to create a production version of the client, use `npm run build` and preview using `npm run preview`

### Database Configuration

The database is currently not managed as IaC, meaning it has to be set up manually.  
The [.fauna directory](https://github.com/koenidv/MelodyMates/tree/main/.fauna) includes a GraphQL schema including relationship indexes, as well as generated indexes, role definitions and user-defined functions. 

---

### Project Architecture

For learning purposes, I decided to build most of the backend functionality using [Fauna's user-defined functions](https://docs.fauna.com/fauna/current/learn/understanding/user_defined_functions) and using narrow [attribute-based access control](https://docs.fauna.com/fauna/current/security/abac).  
The only function not contained within Fauna or the client is the authentication service on Google Cloud Functions. It validates a user's spotify key and generates a JWT for authorization on Fauna.

#### This is how the authentication & authorization process works:
1. A Client completes an OAuth2 handshake with a Music API to get an access key and refresh token.
2. The client then sends the access key to the authentication service to get a MelodyMates JWT.
3. The authentication service validates the authenticity and validity of the access key and generates the token using our private key.
4. The client then uses this token in its request to the Fauna API.
5. Fauna retrieves our public key from Netlify and validates the JWT. If correct, it uses the token's _sub_ attribute to control which resources can be accessed.

![MelodyMates](https://user-images.githubusercontent.com/32238636/234372177-d8483013-8467-42c6-81a3-15f0575124f9.png)


### Data Model
![Data Model](https://user-images.githubusercontent.com/32238636/234260833-f57e03cb-11a6-4841-bcd5-f1e686b2f7ec.png)

#### [Browse the Data Model Online](https://app.graphqleditor.com/florians-workspace/melodymates?v=latest&c=off&pane=relation)
[<img src="https://user-images.githubusercontent.com/32238636/234260989-8a196c06-4336-427a-b1e5-8905ad72aaac.png" alt="GraphQL schema" width="300">](https://app.graphqleditor.com/florians-workspace/melodymates?v=latest&c=off&pane=relation)
