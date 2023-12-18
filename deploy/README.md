# Campus-Chats-Deploy
The unified codebase that delivers both the APIs and website for campus chats.
### File Structure
```
├───index.js            # Server Entry Point
├───api
│   ├───middlewares     # Middlewares
│   └───routes          # Express route controllers for the server endpoints
├── client
│   └── build           # optimized production build of the FE
├───config              # Environment variables and configuration
├───loaders             # Start-up process split into modules
├───models              # Database Models
└───services            # Business Logic for interacting with Database
