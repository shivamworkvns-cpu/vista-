# Site Manager (HTML + CSS + JavaScript + Node.js + MongoDB)

## Run on your computer
1. Install Node.js (version 18 or newer).
2. In this folder run:  npm install
3. Copy `.env.example` to `.env` and fill in MONGO_URI, API_KEY, and ADMIN_EMAIL.
4. Run:  npm start
5. Open http://localhost:3000 and sign in on the VISTA Admin portal using the API_KEY as the access password.

## Put it live (Render.com)
1. Upload this folder to GitHub (the .env file is ignored automatically).
2. Render -> New -> Web Service -> pick the repo.
3. Build command: npm install     Start command: node server.js
4. Add the 3 environment variables (MONGO_URI, API_KEY, PORT=3000).
5. Deploy. Your live link will look like https://site-manager.onrender.com

## Files
- server.js        Express server + MongoDB (Mongoose) API
- public/index.html  Page structure (HTML)
- public/style.css   Design (CSS)
- public/script.js   App logic (JavaScript)
