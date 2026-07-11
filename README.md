# 🚗 RideShare — Full Stack Ride Sharing App

A full-stack ride sharing web application where users can post rides, book rides, manage bookings, and leave reviews.

## 🔗 Live Demo

**[https://ride-share-full-stack.vercel.app/](https://ride-share-full-stack.vercel.app/)**

---

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Bootstrap 5
- Axios
- Google OAuth2 (`@react-oauth/google`)
- React Toastify
- Hosted on **Vercel**

### Backend
- Java 21
- Spring Boot 4.1.0
- Spring Security + JWT (JJWT 0.11.5)
- Spring Data JPA + Hibernate 6
- Google API Client (OAuth2 verification)
- Lombok
- Maven
- Containerized with **Docker**
- Hosted on **Render**

### Database
- MySQL (hosted on **Aiven.io** with SSL)

---

## 📁 Project Structure

```
RideShareFS/
├── RideShare/          # Spring Boot backend
└── rideshare-frontend/ # React frontend
```

---

## ⚙️ Environment Variables

### Backend (Render)
| Variable | Description |
|---|---|
| `SPRING_DATASOURCE_URL` | Aiven MySQL JDBC URL with SSL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `CORS_ALLOWED_ORIGINS` | Vercel frontend URL |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `REACT_APP_API_BASE_URL` | Render backend URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth2 client ID |

---

## 🚀 Running Locally

### Backend
```bash
cd RideShare
mvn spring-boot:run
```

### Frontend
```bash
cd rideshare-frontend
npm install
npm start
```
