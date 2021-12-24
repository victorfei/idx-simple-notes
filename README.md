# Source
This repo comes from Ceramic tutorial building a simple notes app with idx:
https://blog.ceramic.network/how-to-build-a-simple-notes-app-with-idx/

## Start
1. Install IPFS locally.
2. `npm run ceramic` to start a local ceramic node
3. `npm run start` launch a local server at `localhost:3000` and interact with the app there.

# Sample commands & notes
Created DID: `did:key:z6MkpBfT4i5iipnU1W9j4SyvUHKwCLYBc56QKBsqqnAMGJ2X`
Stream created with ID: `kjzl6cwe1jw14biclquddtvp0h2m56at6iudvftospxwqx9i8n8djzn9hdadpr7`

Add new content to stream
`idx index:set local kjzl6cwe1jw14abyul09e7c6woy4prx2eba8z8mgsmazbricbr00l2f6x0vkx8o "{\"notes\":[{\"id\":\"ceramic://kjzl6cwe1jw14biclquddtvp0h2m56at6iudvftospxwqx9i8n8djzn9hdadpr7\",\"title\":\"First\"}]}"`

Retrieve previous content
`idx tile:get ceramic://kjzl6cwe1jw14biclquddtvp0h2m56at6iudvftospxwqx9i8n8djzn9hdadpr7`

Sample seed: `9ba9081857e066015c971e42b221b5355d9a729926eab9c9e636ef81327d453e`