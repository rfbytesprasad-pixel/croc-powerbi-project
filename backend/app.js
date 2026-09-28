const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: 'admin',
  host: 'host.docker.internal', // Connects from the Node.js container to the PostgreSQL container on the host
  database: 'croc_db',
  password: 'admin123',
  port: 5432,
});

const express = require('express');
const app = express(); // <--- Declared FIRST
const cors = require('cors');
app.use(cors()); // <--- Used SECOND
const PORT = 3000;

app.use(express.static('public'));

// --- MOCK POWER BI DATA ---
// This mimics exactly what the real Power BI API will return later.
const mockEmbedConfig = {
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=mock-report-id&groupId=mock-workspace-id",
    embedToken: "mock-token-12345",
    reportId: "mock-report-id",
    filters: []
};

// --- ROUTES ---

// 1. Your original Hello World route
app.get('/', (req, res) => {
    res.send('Hello from Node.js inside Docker! 🚀');
});

// 2. Mock Power BI Embed Config Endpoint
app.get('/api/embed-config', (req, res) => {
    console.log('Mock embed config requested');
    res.json(mockEmbedConfig);
});

// 3. Mock Dynamic Parameter Endpoint (Matches your notes!)
// Example: /api/embed-config/12345
app.get('/api/embed-config/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    console.log(`Mock embed config requested for customer: ${customerId}`);
    
    // Simulate a dynamic filter based on the customer ID passed in the URL
    const configWithFilter = {
        ...mockEmbedConfig,
        filters: [
            {
                $schema: "http://powerbi.com/product/schema#basic",
                target: { table: "Customers", column: "CustomerID" },
                operator: "In",
                values: [customerId]
            }
        ]
    };
    res.json(configWithFilter);
});
// Real data endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_details LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
// Real data endpoint for pump transactions
app.get('/api/pump-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pump_transactions LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
// Monthly transactions endpoint for the Angular chart
app.get('/api/monthly-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(start_time, 'YYYY-MM') as month, 
        COUNT(id) as transaction_count 
      FROM pump_transactions 
      GROUP BY month 
      ORDER BY month
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
