# CROC Power BI Integration Project

A full-stack data pipeline integrating PostgreSQL, Node.js, Docker, Angular, and Power BI.

## 📌 Overview

This project restores a production PostgreSQL database from a Docker backup image and serves the data through a Node.js REST API, visualized in an Angular frontend with Chart.js.

## 🏗️ Architecture

## 📂 Project Structure

| Folder | Description |
|--------|-------------|
| `backend/` | Node.js + Express REST API (Dockerized) |
| `frontend/` | Angular 19 application with Chart.js |
| `database/` | PostgreSQL backup file & restore scripts |
| `docs/` | Full project report and documentation |
| `screenshots/` | Captured screenshots of the workflow |

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
docker run --name postgres-croc \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=croc_db \
  -p 5432:5432 \
  -v ~/projects/pgdata:/var/lib/postgresql/data \
  -d timescale/timescaledb:latest-pg16
 Restore Backup
bash
docker cp database/CROC_IOCL_DC.backup postgres-croc:/tmp/backup.backup
docker exec -it postgres-croc pg_restore -U admin -d croc_db --no-owner /tmp/backup.backup
3. Run Backend
bash
cd backend
docker build -t hello-node-app .
docker run --rm --name my-node-app -p 3000:3000 hello-node-app
4. Run Frontend
bash
cd frontend
npm install
ng serve
Open http://localhost:4200 in your browser.

📊 Data
Source: CROC_IOCL_DC.backup

Main table: pump_transactions

Row count: 47,041

🔐 Environment Variables
Create a .env file in the backend folder:

text
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=croc_db
DB_HOST=host.docker.internal
DB_PORT=5432
📖 Documentation
See docs/PROJECT_REPORT.md for the complete technical write-up.

👤 Author
Prasad — September 2026

text

Save and exit.

---

## 🚫 Step 4: Create `.gitignore` Files

We must exclude sensitive files, large binaries, and dependencies. Run this:

```bash
# Root .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment files (SECRETS - never commit!)
.env
*.env
backend/.env
frontend/.env

# Build outputs
dist/
build/
*.log

# Docker
pgdata/
*.tar.gz

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Angular cache
frontend/.angular/

# Backup files (large binary - keep locally only)
database/*.backup
database/*.dump
database/*.sql

# Database data
database/pgdata/
EOF
