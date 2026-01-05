# SmartSense Docker Setup

This guide explains how to run the SmartSense Industrial Safety Monitoring System using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)

[Download Docker Desktop](https://www.docker.com/products/docker-desktop)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Navigate to the project root directory
cd smartsense-monitor

# Start both frontend and backend services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the services
docker-compose down
```

After running the commands, the application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Service Details

### Backend Service
- **Container Name**: `smartsense-backend`
- **Port**: 8000
- **Image**: Built from `Dockerfile.backend`
- **Technology**: Python 3.11 + FastAPI + Uvicorn
- **Health Check**: Automatic (checks every 30s)

### Frontend Service
- **Container Name**: `smartsense-frontend`
- **Port**: 3000
- **Image**: Built from `Dockerfile.frontend`
- **Technology**: Node.js + React + Vite
- **Health Check**: Automatic (checks every 30s)
- **Depends On**: Backend (waits for backend to be healthy)

## Configuration

### Environment Variables

The frontend service respects the following environment variable:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)

To customize the API URL, modify the `docker-compose.yml` file:

```yaml
frontend:
  environment:
    - VITE_API_URL=http://your-api-url:8000
```

## Individual Docker Commands

### Build Images
```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Start Services
```bash
# Start all services in background
docker-compose up -d

# Start all services in foreground (with logs)
docker-compose up

# Start specific service
docker-compose up -d frontend
docker-compose up -d backend
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100
```

### Stop Services
```bash
# Stop all services (containers remain)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### Health Status
```bash
# View service status
docker-compose ps

# View detailed container information
docker inspect smartsense-backend
docker inspect smartsense-frontend
```

## Docker Compose Networking

Both services communicate through a dedicated Docker network called `smartsense-network`. This allows:
- Services to communicate with each other
- Isolated networking from other containers
- Service discovery by container name

## Production Considerations

For production deployments, consider:

1. **Environment Variables**: Use `.env` files or Docker secrets
2. **Resource Limits**: Add memory and CPU limits in docker-compose.yml
3. **Volumes**: Persist data with named volumes for database (if added)
4. **Logging**: Configure log drivers for centralized logging
5. **Security**: Never expose sensitive data in docker-compose.yml
6. **Reverse Proxy**: Use nginx or similar for SSL/TLS termination
7. **Database**: Add persistent storage for any database service

Example production configuration:
```yaml
services:
  backend:
    image: smartsense-backend:1.0.0
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Demo Credentials

When logging into the application:
- **Admin** - Username: `admin`, Password: `admin123`
- **User** - Username: `user`, Password: `user123`

## Troubleshooting

### Services won't start
```bash
# Check for port conflicts
netstat -an | findstr :3000  # Windows
netstat -an | grep :3000     # Linux/Mac

# Check Docker daemon
docker info

# View error logs
docker-compose logs
```

### Frontend can't connect to backend
- Verify backend is running: `docker-compose ps`
- Check backend health: `curl http://localhost:8000`
- Verify `VITE_API_URL` environment variable in docker-compose.yml
- Check firewall rules

### Database/Data persistence (if added)
```bash
# View volumes
docker volume ls

# Inspect volume
docker volume inspect smartsense_dbdata
```

## Building for Production

### Manual Docker Builds
```bash
# Build images with tags
docker build -f Dockerfile.frontend -t smartsense-frontend:1.0.0 .
docker build -f Dockerfile.backend -t smartsense-backend:1.0.0 .

# Push to registry
docker push your-registry/smartsense-frontend:1.0.0
docker push your-registry/smartsense-backend:1.0.0
```

## Files Reference

- **Dockerfile.frontend**: Frontend build configuration
- **Dockerfile.backend**: Backend build configuration
- **docker-compose.yml**: Service orchestration configuration
- **.dockerignore**: Files to exclude from Docker build context
- **.env.example**: Example environment variables

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Configuration](https://vitejs.dev/config/)
