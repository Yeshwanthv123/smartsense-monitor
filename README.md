# SmartSense Industrial Safety Monitoring System

A real-time industrial safety monitoring platform with temperature and gas level detection, built with React, FastAPI, and WebSocket for live updates.

## 📋 Project Overview

SmartSense monitors critical industrial safety parameters including:
- Temperature monitoring
- Gas level detection
- Humidity tracking
- Real-time alerts and status notifications
- User authentication and role-based access

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)

### Development Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd smartsense-monitor

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Start backend (in one terminal)
cd backend
python -m uvicorn main:app --reload --port 8000

# Start frontend (in another terminal)
npm run dev
```

Access the application at `http://localhost:8080`

### Docker Setup

For a containerized deployment:

```sh
# Build and run services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

For detailed Docker instructions, see [DOCKER.md](DOCKER.md)

## 📁 Project Structure

```
smartsense-monitor/
├── src/                      # Frontend (React + TypeScript)
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components (Login, Dashboard)
│   ├── contexts/            # Auth context
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── backend/                 # Backend (FastAPI + Python)
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── simulate_sensors.py   # Sensor data simulator
├── Dockerfile.frontend      # Frontend container config
├── Dockerfile.backend       # Backend container config
├── docker-compose.yml       # Docker Compose orchestration
└── vite.config.ts          # Vite configuration
```

## 🔐 Authentication

Default demo credentials:
- **Admin**: username `admin`, password `admin123`
- **User**: username `user`, password `user123`

## 🛠️ Technologies

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **shadcn-ui** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Framer Motion** - Animations

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **WebSocket** - Real-time communication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📝 Available Scripts

### Frontend
```sh
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```sh
# In the backend directory
python -m uvicorn main:app --reload              # Development server
python simulate_sensors.py                       # Run sensor simulator
```

## 🌐 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /verify-token` - Verify auth token

### Sensor Data
- `POST /data` - Receive sensor data
- `WebSocket /ws` - Real-time data streaming

### System
- `GET /` - Health check

## 🐳 Docker Commands

```sh
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

## 📊 Real-Time Data

The system uses WebSocket connections for real-time sensor data:
- Temperature monitoring (°C)
- Gas levels (PPM)
- Humidity levels (%)
- Safety status (SAFE, WARNING, DANGER)

### Status Thresholds
- **DANGER**: Temperature > 45°C OR Gas > 500 PPM
- **WARNING**: Temperature > 35°C OR Gas > 300 PPM
- **SAFE**: All readings within normal range

## 🔧 Configuration

### Frontend Environment Variables
Create a `.env` file or modify docker-compose.yml:
```
VITE_API_URL=http://localhost:8000
```

See `.env.example` for reference.

## 📚 Additional Documentation

- [Docker Setup Guide](DOCKER.md) - Detailed Docker instructions
- [Backend README](backend/README.md) - Backend-specific documentation

## 🤝 Development Workflow

1. Create a feature branch
2. Make your changes
3. Test locally (both frontend and backend)
4. Commit and push changes
5. Submit a pull request

## 📦 Building for Production

### Frontend
```sh
npm run build  # Creates optimized dist/ folder
```

### Backend
```sh
# Deploy using Docker or direct Python
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🐛 Troubleshooting

### Frontend won't start
```sh
npm install
npm run dev
```

### Backend connection issues
- Ensure backend is running on port 8000
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend/main.py

### Docker issues
See [DOCKER.md](DOCKER.md#troubleshooting) for detailed troubleshooting.

## 📄 License

This project is part of the SmartSense Industrial Safety Monitoring System.

## 👥 Support

For issues or questions, please refer to the documentation or contact the development team.

