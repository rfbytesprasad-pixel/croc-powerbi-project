
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
  -d timescale/timescaledb:latest-pg16# CROC Power BI Integration Project

A full-stack data pipeline integrating PostgreSQL, Node.js, Docker, Angular, and Power BI.

## 📌 Overview

This project restores a production PostgreSQL database from a Docker backup image and serves the data through a Node.js REST API, visualized in an Angular frontend with Chart.js.

## 🏗️ Architecture
