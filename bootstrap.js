

const fromString = require('uint8arrays/from-string')
const { writeFile } = require('fs').promises
const Ceramic = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const ThreeIdResolver = require('@ceramicnetwork/3id-did-resolver').default
const KeyDidResolver = require('key-did-resolver').default
const { Resolver } = require('did-resolver')
const { DID } = require('dids')

const CERAMIC_URL = 'http://localhost:7007'

const NoteSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Note',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date-time',
      title: 'date',
      maxLength: 30,
    },
    text: {
      type: 'string',
      title: 'text',
      maxLength: 4000,
    },
  },
}

const NotesListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NotesList',
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      title: 'notes',
      items: {
        type: 'object',
        title: 'NoteItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicStreamId',
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: 'string',
      pattern: '^ceramic://.+(\\\\?version=.+)?',
      maxLength: 150,
    },
  },
}

async function run() {
  // process.env.SEED = '461b477fd6e44f0ce3cfddb7b5fc19d940aef92fd70f36f62b63ab7d9402cf27'
  const seed_phrase = '461b477fd6e44f0ce3cfddb7b5fc19d940aef92fd70f36f62b63ab7d9402cf27'
  // The seed must be provided as an environment variable
  const seed = fromString(seed_phrase, 'base16')
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Provide the DID Resolver and Provider to Ceramic
  const resolver = new Resolver({
      ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(ceramic) })
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver })
  await ceramic.setDID(did)
  // Authenticate the Ceramic instance with the provider
  await ceramic.did.authenticate()
    

  // Publish the two schemas
  const [noteSchema, notesListSchema] = await Promise.all([
    publishSchema(ceramic, { content: NoteSchema }),
    publishSchema(ceramic, { content: NotesListSchema }),
  ])

  // Create the definition using the created schema ID
  const notesDefinition = await createDefinition(ceramic, {
    name: 'notes',
    description: 'Simple text notes',
    schema: notesListSchema.commitId.toUrl(),
  })

  // Write config to JSON file
  const config = {
    definitions: {
      notes: notesDefinition.id.toString(),
    },
    schemas: {
      Note: noteSchema.commitId.toUrl(),
      NotesList: notesListSchema.commitId.toUrl(),
    },
  }
  await writeFile('./src/config.json', JSON.stringify(config))

  console.log('Config written to src/config.json file:', config)
  process.exit(0)
}

run().catch(console.error)