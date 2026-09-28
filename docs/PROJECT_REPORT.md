CROC Power BI Integration Project
Complete Technical Documentation
Project: Power BI Data Pipeline with Node.js, Docker, PostgreSQL, and Angular
Developer: Prasad
Date: September 2026
Environment: Windows 11 + WSL 2 (Ubuntu) + Docker Desktop

📑 Table of Contents
Project Overview

Architecture Diagram

Phase 1 — Environment Setup

Phase 2 — Docker Hello World Verification

Phase 3 — Node.js App Containerization

Phase 4 — Mock Power BI Embedding

Phase 5 — PostgreSQL Database from Docker Backup

Phase 6 — Node.js + PostgreSQL Integration

Phase 7 — Real Data Display in HTML

Phase 8 — Power BI Desktop Connection

Phase 9 — Angular Frontend with Chart.js

Final Deliverables

Next Steps — Real Power BI Embedding

Summary

1. Project Overview
Objective
Build a full-stack web application that:

Restores a production PostgreSQL database from a Docker backup image

Serves the data through a Node.js REST API

Displays dynamic visualizations in an Angular frontend

Establishes the foundation for embedding Power BI reports

Tech Stack
Layer	Technology	Purpose
Operating System	Windows 11 + WSL 2	Development host
Container Runtime	Docker Desktop	Container orchestration
Backend	Node.js 20 + Express	REST API server
Database	PostgreSQL 16 + TimescaleDB	Data storage
Frontend	Angular 19	Web application
Visualization	Chart.js	Interactive charts
BI Tool	Power BI Desktop	Report authoring
2. Architecture Diagram
text
┌─────────────────────────────────────────────────────────────┐
│                    WINDOWS 11 HOST                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              WSL 2 (Ubuntu)                           │  │
│  │                                                       │  │
│  │   ┌──────────────┐      ┌──────────────┐              │  │
│  │   │  Node.js     │─────▶│ PostgreSQL   │              │  │
│  │   │  Container   │      │ Container    │              │  │
│  │   │  (Port 3000) │      │ (Port 5432)  │              │  │
│  │   └──────┬───────┘      └──────┬───────┘              │  │
│  │          │                     │                      │  │
│  │          │         ┌───────────┴───────────┐          │  │
│  │          │         │ ~/projects/pgdata     │          │  │
│  │          │         │ (Persistent Volume)   │          │  │
│  │          │         └───────────────────────┘          │  │
│  │          │                                            │  │
│  │          ▼                                            │  │
│  │   ┌──────────────────┐                                │  │
│  │   │ Angular Frontend │                                │  │
│  │   │  (Port 4200)     │                                │  │
│  │   └──────────────────┘                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│   ┌────────────────────────────────────────────────────┐    │
│   │  Power BI Desktop (Windows Application)            │    │
│   │  Connected to localhost:5432                       │    │
│   └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
3. Phase 1 — Environment Setup
3.1 Install WSL 2 and Ubuntu
WSL 2 provides a real Linux kernel on Windows, which is essential for running Docker efficiently.

Command executed:

powershell
wsl --install -d Ubuntu
Setup performed:

Ubuntu distribution installed

Created Unix user: prasad

Set password for the user

Verification commands:

bash
cat /etc/os-release
uname -r
📸 IMAGE 1: Terminal screenshot showing WSL Ubuntu installation complete with user prasad created

3.2 Install Node.js 20 (LTS)
Commands executed:

bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
Verification:

bash
node -v
npm -v
Expected output: v20.x.x and 10.x.x

📸 IMAGE 2: Terminal output showing node -v and npm -v version numbers

3.3 Install Docker Desktop
Download source: Docker Desktop for Windows (official website)

Configuration steps:

Enabled Use WSL 2 based engine during installation

Opened Docker Desktop → Settings → Resources → WSL Integration

Toggled Ubuntu to ON

Clicked Apply & Restart

Verification:

bash
docker --version
docker run hello-world
📸 IMAGE 3: Docker Desktop Settings → Resources → WSL Integration with Ubuntu toggle ON

3.4 Install Power BI Desktop
Download source: Power BI Desktop (64-bit) from Microsoft Download Center

Important note: Power BI Desktop is not available from the Microsoft Store. It must be downloaded as a standalone .exe installer from the official Microsoft website.

4. Phase 2 — Docker Hello World Verification
Objective
Confirm that Docker can pull images and run containers successfully.

Command Executed
bash
docker run hello-world
Expected Output
text
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image...
 4. The Docker daemon streamed that output to the Docker client...
📸 IMAGE 4: Terminal showing successful "Hello from Docker!" output

5. Phase 3 — Node.js App Containerization
5.1 Project Structure Created
Commands executed:

bash
mkdir -p ~/projects/hello-node-docker
cd ~/projects/hello-node-docker
npm init -y
npm install express
5.2 Created app.js
javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Node.js inside Docker! 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
5.3 Created Dockerfile
dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
5.4 Build and Run
bash
docker build -t hello-node-app .
docker run --rm --name my-node-app -p 3000:3000 hello-node-app
Result: Browser at http://localhost:3000 shows the hello message.

📸 IMAGE 5: Browser showing "Hello from Node.js inside Docker! 🚀"

6. Phase 4 — Mock Power BI Embedding
6.1 Added Mock Endpoints
Two endpoints were created in app.js:

/api/embed-config — returns mock Power BI embed config

/api/embed-config/:customerId — returns config with a dynamic filter based on the customer ID

6.2 Created Frontend (public/index.html)
Loaded the official powerbi-client library from CDN

Fetched the mock config from the backend

Attempted to embed a report using the mock token

Result: The pipeline worked end-to-end. The token error was expected because the token was fake.

📸 IMAGE 6: Browser showing Power BI Mock Embed page with console showing Fetched config log

7. Phase 5 — PostgreSQL Database from Docker Backup
7.1 Pull Backup Image
bash
docker pull noidafernandes/croc-db-backup:2026-09-19
7.2 Locate Backup File
bash
docker run --rm noidafernandes/croc-db-backup:2026-09-19 \
  find / -type f \( -name "*.sql" -o -name "*.dump" -o -name "*.backup" \) 2>/dev/null
Found file: /backup/CROC_IOCL_DC.backup

7.3 Extract Backup to Host
bash
docker run --rm -v ~/projects/croc-db-setup:/host-backup \
  noidafernandes/croc-db-backup:2026-09-19 \
  cp /backup/CROC_IOCL_DC.backup /host-backup/
📸 IMAGE 7: Terminal showing ls -lh ~/projects/croc-db-setup with the .backup file listed

7.4 Start PostgreSQL Container (with TimescaleDB)
bash
docker run --name postgres-croc \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=croc_db \
  -p 5432:5432 \
  -v ~/projects/pgdata:/var/lib/postgresql/data \
  -d timescale/timescaledb:latest-pg16
7.5 Restore Database
bash
docker cp ~/projects/croc-db-setup/CROC_IOCL_DC.backup \
  postgres-croc:/tmp/backup.backup

docker exec -it postgres-croc pg_restore -U admin -d croc_db \
  --no-owner /tmp/backup.backup
Important note: The 10 errors related to TimescaleDB internal catalog tables are harmless (they are caused by version mismatch between the backup and the new database). All the actual data tables in the public schema were restored successfully.

7.6 Verify Data
bash
docker exec -it postgres-croc psql -U admin -d croc_db -c "\dt"
docker exec -it postgres-croc psql -U admin -d croc_db -c \
  "SELECT COUNT(*) FROM pump_transactions;"
Result: 47,041 rows found in the pump_transactions table.

📸 IMAGE 8: Terminal showing \dt table list and COUNT = 47041

8. Phase 6 — Node.js + PostgreSQL Integration
8.1 Install PostgreSQL Client
bash
cd ~/projects/hello-node-docker
npm install pg cors
8.2 Added Database Connection
javascript
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const { Pool } = require('pg');
const pool = new Pool({
  user: 'admin',
  host: 'host.docker.internal',
  database: 'croc_db',
  password: 'admin123',
  port: 5432,
});
8.3 Added Data Endpoints
javascript
// Endpoint 1: First 10 pump transactions
app.get('/api/pump-data', async (req, res) => {
  const result = await pool.query('SELECT * FROM pump_transactions LIMIT 10');
  res.json(result.rows);
});

// Endpoint 2: Monthly aggregated data
app.get('/api/monthly-data', async (req, res) => {
  const result = await pool.query(`
    SELECT TO_CHAR(start_time, 'YYYY-MM') as month, 
           COUNT(id) as transaction_count 
    FROM pump_transactions 
    GROUP BY month ORDER BY month
  `);
  res.json(result.rows);
});
8.4 Rebuild and Test
bash
docker rm -f my-node-app
docker build -t hello-node-app .
docker run --rm --name my-node-app -p 3000:3000 hello-node-app
Result: http://localhost:3000/api/pump-data returns real JSON data.

📸 IMAGE 9: Browser showing JSON output from /api/pump-data

9. Phase 7 — Real Data Display in HTML
9.1 Updated public/index.html
Replaced the mock Power BI embed with a dynamic HTML table that:

Fetches data from /api/pump-data

Dynamically builds a table based on the returned JSON keys

Styles the output with clean CSS

Result: Browser shows a clean table with real transaction data.

📸 IMAGE 10: Browser showing the "⛽ Pump Transactions Data" table with real rows

10. Phase 8 — Power BI Desktop Connection
10.1 Connection Steps
Opened Power BI Desktop

Clicked Get Data → More → PostgreSQL database

Entered server details:

Server: localhost:5432

Database: croc_db

Entered credentials:

User name: admin

Password: admin123

In the Navigator window, selected public.pump_transactions

Clicked Load

📸 IMAGE 11: Power BI Navigator window showing table list with pump_transactions checked and preview data on the right

10.2 Created Visualizations
Pie Chart: Transactions by Year / Month

Bar Chart: Monthly transaction comparison

Table Visual: Day-wise transaction counts

📸 IMAGE 12: Power BI Desktop showing pie chart with real data slices

📸 IMAGE 13: Power BI Desktop showing bar chart with months on X-axis and counts on Y-axis

10.3 Saved Report
File saved as: pump_report.pbix

11. Phase 9 — Angular Frontend with Chart.js
11.1 Angular Project Setup
bash
cd ~/projects
ng new powerbi-angular-app --no-standalone --routing=false --style=css
cd powerbi-angular-app
npm install chart.js
ng generate component powerbi-report
11.2 Component Code
File: src/app/powerbi-report/powerbi-report.ts

typescript
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-powerbi-report',
  standalone: false,
  template: `
    <div style="width: 80%; margin: 40px auto; background: white; padding: 20px; border-radius: 8px;">
      <h2>⛽ Monthly Pump Transactions</h2>
      <p>Data fetched from Node.js + PostgreSQL (Docker)</p>
      <canvas #myChart></canvas>
    </div>
  `
})
export class PowerbiReport implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef;

  async ngOnInit() {
    const response = await fetch('http://localhost:3000/api/monthly-data');
    const data = await response.json();

    const labels = data.map((row: any) => row.month);
    const counts = data.map((row: any) => row.transaction_count);

    new Chart(this.myChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Transactions per Month',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
      },
      options: { responsive: true }
    });
  }
}
11.3 Registered in app-module.ts
typescript
import { PowerbiReport } from './powerbi-report/powerbi-report';

@NgModule({
  declarations: [App, PowerbiReport],
  ...
})
11.4 Updated app.html
html
<app-powerbi-report></app-powerbi-report>
11.5 Final Result
Terminal 1 (Backend):

bash
docker run --rm --name my-node-app -p 3000:3000 hello-node-app
Terminal 2 (Frontend):

bash
ng serve
Browser: http://localhost:4200 displays the bar chart with real data.


