# Gogir Labs - Portfolio Website

A production-ready portfolio website built with Django REST Framework (backend) and Next.js (frontend), featuring blog, portfolio showcase, contact forms, newsletter, notifications, and analytics.

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Start all services
./start.sh

# Or manually
docker-compose up -d
```

### Local Development

```bash
# Backend
./start-backend.sh

# Frontend (in another terminal)
./start-frontend.sh
```

## 📋 Features

- **Portfolio Showcase**: Display projects with images, videos, and descriptions
- **Blog System**: Rich text blog posts with categories, tags, and comments
- **Contact Forms**: Secure contact form with spam protection
- **Newsletter**: Email subscription with verification
- **Notifications**: System-wide and granular notification system
- **Analytics**: Page view and event tracking
- **Admin Panel**: Full Django admin for content management
- **Responsive Design**: Mobile-friendly with dark/light theme toggle
- **SEO Optimized**: Meta tags, structured data, semantic HTML

## 🧪 Testing

### Run All Tests

```bash
./run-tests.sh
```

### Backend Tests Only

```bash
cd gogir-labs-be
pytest
```

### Frontend Tests Only

```bash
cd gogir-labs-fe
npm test
```

**Test Coverage**:
- Backend: 170 tests passing (100%)
- Frontend: 31 tests passing (96.9%)

## 🏗️ Architecture

### Backend (Django/DRF)
- Django 4.2.7
- Django REST Framework
- PostgreSQL database
- JWT authentication
- CKEditor for rich text
- Redis for caching (optional)

### Frontend (Next.js)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query for data fetching
- Framer Motion for animations

## 📦 Deployment

### Prerequisites
- Docker and Docker Compose
- Domain name with DNS configured
- SSL certificates
- Server with 2GB+ RAM

### Quick Deployment

```bash
# Staging
./deploy.sh staging

# Production
./deploy.sh production
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔄 CI/CD Pipeline

The project includes automated CI/CD pipelines:

- **CI Pipeline**: Runs tests, security scans, and builds Docker images
- **CD Pipeline**: Automatically deploys to staging and production
- **Code Quality**: Linting and formatting checks

See [CI_CD_README.md](./CI_CD_README.md) for details.

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Deployment summary
- [CI_CD_README.md](./CI_CD_README.md) - CI/CD pipeline documentation
- [TESTING.md](./TESTING.md) - Testing guide
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Admin user guide

## 🔐 Security

- SSL/TLS encryption
- Security headers (HSTS, CSP, etc.)
- Rate limiting
- Input validation and sanitization
- JWT token authentication
- CORS configuration
- SQL injection prevention
- XSS protection

## 📁 Project Structure

```
gogir_labs/
├── gogir-labs-be/          # Django backend
│   ├── apps/               # Django applications
│   │   ├── blog/
│   │   ├── portfolio/
│   │   ├── contact/
│   │   ├── newsletter/
│   │   ├── notifications/
│   │   └── ...
│   ├── config/             # Django settings
│   └── requirements.txt
├── gogir-labs-fe/          # Next.js frontend
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   └── package.json
├── nginx/                  # Nginx configuration
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Development
├── docker-compose.prod.yml # Production
└── deploy.sh              # Deployment script
```

## 🛠️ Development

### Backend Setup

```bash
cd gogir-labs-be
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd gogir-labs-fe
npm install
npm run dev
```

## 📝 Environment Variables

See `.env.production.example` and `.env.staging.example` for required environment variables.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `./run-tests.sh`
4. Submit a pull request

## 📄 License

[Your License Here]

## 👤 Author

Emmanuel Ugbaije - Software Engineer

## 🙏 Acknowledgments

- Django REST Framework
- Next.js
- Tailwind CSS
- All open-source contributors
