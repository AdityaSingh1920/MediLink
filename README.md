# 🩺 MediLink

**MediLink** is a full-stack MERN (MongoDB, Express, React, Node.js) platform designed to simplify **donation and distribution of medical equipment and medicines**.  
It connects **donors, patients, and hospitals** to ensure unused or surplus medical resources reach those in need.

🌐 **Live Project:**  
Frontend → [https://medi-link-beige.vercel.app](https://medi-link-beige.vercel.app)  
Backend API → [https://medilink.zeabur.app](https://medilink.zeabur.app/api/health)

---

## 🚀 Features

- 👤 **Authentication**
  - Secure signup/login with JWT
  - Email verification via SMTP

- 💊 **Donation System**
  - Donate or request medicines and medical equipment
  - Filter and search donations by type, location, or status

- 💬 **Real-Time Chat**
  - Communication between donors and requesters using Socket.IO

- 📨 **Email Notifications**
  - Automatic verification and confirmation emails via Nodemailer

- ☁️ **Image Upload**
  - Cloudinary integration for secure storage of uploaded images

- 🏆 **Leaderboard**
  - Highlights top contributors based on donations

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + TailwindCSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Atlas) |
| **Storage** | Cloudinary |
| **Email Service** | SMTP (Nodemailer) |
| **Hosting** | Vercel (Frontend) + Zeabur (Backend) |
| **Realtime** | Socket.IO |

---

## ⚙️ Environment Variables

### **Backend (`.env`)**
```env
MONGO_URI=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=production
PORT=8080
FRONTEND_URLS=

## **Frontend (.env)**
VITE_API_BASE_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

🐳 Docker Setup (Optional)

Run with Docker Compose:

docker-compose up --build


Example docker-compose.yml:

version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    env_file:
      - ./server/.env
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    env_file:
      - ./frontend/.env
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:

💻 Local Development

To run both frontend and backend together:

# 1. Clone the repository
git clone https://github.com/<your-username>/MediLink.git

# 2. Move into the project
cd MediLink

# 3. Install all dependencies
npm install

# 4. Create .env files (see variables above)

# 5. Start both frontend and backend concurrently
npm run dev


The app will start with:

Frontend → http://localhost:3000

Backend → http://localhost:5000/api

🧠 API Health Check

To verify backend is running:

curl http://localhost:5000/api/health
# Output: {"ok":true}

💬 Developer Info

Developer: Aditya Singh
Frontend → https://medi-link-beige.vercel.app

Backend → https://medilink.zeabur.app

🛠️ Future Enhancements

Hospital/NGO verification
Donation pickup and delivery tracking
Admin dashboard for analytics
Push notifications for urgent needs
