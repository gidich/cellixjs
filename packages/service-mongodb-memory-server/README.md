# @ocom/service-mongodb-memory-server

MongoDB Memory Server service for CellixJS monorepo.

## Usage

```
TS_NODE_TRANSPILE_ONLY=1 ts-node src/index.ts
```

## API
- `MongoDbMemoryService.start(): Promise<string>` - Starts the in-memory server and returns the connection URI.
- `MongoDbMemoryService.stop(): Promise<void>` - Stops the server.
- `MongoDbMemoryService.getInstance(): MongoMemoryServer | null` - Returns the current server instance.

## License
MIT