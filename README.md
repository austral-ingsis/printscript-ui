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

## Cypress

To start cypress, make sure that the UI is running and enter: 

```bash
npm run cypress
```

## Enable Auth0

This application uses https://www.npmjs.com/package/@auth0/auth0-react library for Auth0 integration, to enable it you need to change:
* Uncomment autologin in [App.tsx](src/App.tsx)
* Uncomment token retrieval for operations [queries.tsx](src/utils/queries.tsx) 
* Create a `.env` file with the required env vars:
```
VITE_AUTH0_DOMAIN=<domain>
VITE_AUTH0_CLIENT_ID=<client_id>
```

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