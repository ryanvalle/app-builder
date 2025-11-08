# Docker Quick Start Guide

This guide helps you get the AI App Builder running with Docker.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) installed on your machine
- Basic familiarity with command line

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd app-builder
   ```

2. **Start the application**:
   ```bash
   docker-compose up
   ```
   
   The first time you run this, Docker will:
   - Download the Node.js base image
   - Install all dependencies
   - Start the development server
   
   This may take a few minutes.

3. **Access the application**:
   - Open your browser to [http://localhost:5173](http://localhost:5173)
   - You should see the AI App Builder template gallery

4. **Stop the application**:
   - Press `Ctrl+C` in the terminal
   - Or run: `docker-compose down`

## Common Commands

### Development

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached)
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild after dependency changes
docker-compose up --build

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production

```bash
# Build production image
docker build -f Dockerfile.prod -t app-builder:prod .

# Run production container
docker run -p 80:80 app-builder:prod

# Access at http://localhost
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, edit `docker-compose.yml`:
```yaml
ports:
  - "3000:5173"  # Change 3000 to any available port
```

### Changes Not Reflecting

If your code changes aren't showing up:
```bash
docker-compose down
docker-compose up --build
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## File Structure

- `Dockerfile` - Development environment
- `Dockerfile.prod` - Production build with Nginx
- `docker-compose.yml` - Development orchestration
- `.dockerignore` - Files to exclude from Docker builds

## Benefits of Using Docker

✅ **Consistent Environment**: Same setup works on Mac, Windows, and Linux  
✅ **No Dependency Issues**: All dependencies installed in container  
✅ **Isolated**: Doesn't interfere with your system Node.js  
✅ **Easy Cleanup**: Remove everything with one command  
✅ **Production-Ready**: Same Dockerfile can deploy to cloud

## Need Help?

- Check [Docker Documentation](https://docs.docker.com/)
- See main [README.md](README.md) for application details
- Report issues on GitHub
