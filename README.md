# Printscript UI

This is a React project using Vite and Node.js 20. This README will guide you on how to set up and start the project locally.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js 20 or later
- You have installed npm

## Getting Started

To get a local copy up and running, follow these steps:

### 1. Fork this Repository in your github account

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/printscript-ui.git
```

###  3. Navigate to the Project Directory
```bash
cd printscript-ui
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Development Server

```bash
npm run dev
```

This will start the Vite development server. You can now open your browser and navigate to http://localhost:5173/ to see the application running.

## Build production version

To use this UI in production you should use an optimized and static version, this command will generate this version in `dist` directory:  

```bash
npm run build
```

## Docker

Serves the built UI as static files on port 3000 (the reverse proxy lives in the infra repo). `VITE_*` vars are baked in at build time:

```bash
docker build -t printscript-ui \
  --build-arg VITE_AUTH0_DOMAIN=<domain> \
  --build-arg VITE_AUTH0_CLIENT_ID=<client_id> \
  --build-arg VITE_AUTH0_AUDIENCE=<api identifier> .
docker run -p 3000:3000 printscript-ui
```

## Cypress

To start cypress, make sure that the UI is running and enter: 

```bash
npm run cypress
```

## Auth0 and backend

The UI logs in with Auth0 and calls snippet-service (`src/utils/snippetServiceOperations.ts`) with the access token.
Create a `.env` from `.env.example`:
```
VITE_AUTH0_DOMAIN=<domain>
VITE_AUTH0_CLIENT_ID=<client_id>
VITE_AUTH0_AUDIENCE=<api identifier>   # required: without it the token is not a JWT and the backend answers 401
```

Requests go to `/api` on the same origin. In dev, Vite proxies `/api/*` to `http://localhost:8080/*`
(override with `SNIPPET_SERVICE_URL`); in prod, nginx does it.

If you get 401 loop when getting token:
* Change application type in Auth0 to "Regular Web Application"
* In Application Settings > Credentials > "Authentication Method" select "None" 

## Start working

1. Fork the Project
2. Do your magic

## Contributing

1. Create your Feature Branch in this repo (git checkout -b feature/AmazingFeature)
2. Commit your Changes (git commit -m 'Add some AmazingFeature')
3. Push to the Branch (git push origin feature/AmazingFeature)
4. Open a Pull Request

## Tasks

- [ ] Integrate Auth0 UI and private routes
- [ ] Integrate your endpoints to the UI (Create custom "SnippetOperations")
- [ ] Dockerize
- [ ] CI/CD
- [ ] Sockets*