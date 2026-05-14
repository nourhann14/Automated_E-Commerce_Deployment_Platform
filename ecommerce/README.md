## 3-tier Ecommerce Demo (HTML/CSS + Express + MySQL)

### Folder structure
- `frontend/`: static HTML/CSS/JS
- `backend/`: Node 18 + Express REST API (serves the frontend too)
- `db/`: MySQL schema + seed

### 1) Create the MySQL database

In MySQL, run:

```sql
SOURCE db/schema.sql;
```

Or paste the file contents into your MySQL client.

### 2) Configure backend env

Copy:
- `backend/.env.example` → `backend/.env`

Edit `backend/.env` with your MySQL credentials.

### 3) Install and run backend

From `backend/`:

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000/`

### API
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`

