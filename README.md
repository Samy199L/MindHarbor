Instalation:

1. cd server && npm install

2. remplir .env avec les variable dans .example

3. npx prisma mirgate deply

4. npm run dev

le projet a seulement les module authetification (register,login,logout,refreshet journal ,me)
et les module journal(creation, liste, consultation par date, modification avec regle du minuit, tendances, insight)

Endpoints:

POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET /api/v1/auth/me
GET /api/v1/journal
POST /api/v1/journal
GET /api/v1/journal/:date
PATCH /api/v1/journal/:date
GET /api/v1/journal/stats
GET /api/v1/journal/insight
