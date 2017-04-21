# Testly - The Friendly Testing Framework

This is an example of a full stack application consisting of
- Frontend
- Backend
- Database
- Cache
- Background Processing


## Deployment using Docker
```
docker-compose up
```

# Frontend
Angular 1.x, TypeScript, and Webpack

## Development
```
cd frontend
npm install
npm start
```

## Building Dist directory
Current `frontend/dist` already contains everything needed to host the frontend.

```
cd frontend
npm run build
```

# Backend
Python 3.6 and Django 1.11

## Development

```
cd backend
pip install -r requirements.txt
python manage.py runserver
```

## Database Migrations
Run this directly after the first deployment. Also after making changes to the backend models.

```
docker exec -it backend-01 python manage.py migrate
```
