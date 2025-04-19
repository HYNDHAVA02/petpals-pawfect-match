# PetPals — Pawfect Match

PetPals is a pet dating application that helps pet owners connect, match, and chat to arrange playdates for their furry friends.

## Features
- **Profile Management**: Create and manage profiles for multiple pets with photos and details.
- **Swipe & Match**: Browse pet profiles and swipe to discover potential playmates in your area.
- **Real-Time Chat**: Chat with matched pet owners to plan meetups.

## Tech Stack
- **Frontend**: Vite · TypeScript · React · shadcn/ui · Tailwind CSS
- **Backend**: Node.js · Express · MongoDB (MERN)
- **Deployment**: Docker · AWS Amplify (serverless API & hosting)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or Yarn
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd <PROJECT_DIR>
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Development

Start the development server with hot-reloading:
```bash
npm run dev
# or
yarn dev
```
Open your browser at `http://localhost:5173` to view the app.

### Production Build

Generate optimized static files:
```bash
npm run build
# or
yarn build
```
Built files are output to the `dist/` directory.

## Docker (Optional)

Build and run the frontend container:
```bash
docker build -t petpals-frontend .
docker run -d -p 3000:80 petpals-frontend
```
Visit `http://localhost:3000` to access the app in Docker.

## Backend (AWS)

This project uses AWS Amplify to deploy its serverless backend (REST API via Lambda & DynamoDB). After pushing updates with:
```bash
amplify push
```
configure your frontend API URL in an environment file:
```bash
VITE_API_URL=https://<your-api>.execute-api.<region>.amazonaws.com/dev
```

## License

MIT

