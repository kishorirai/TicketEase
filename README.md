# TICKETEASE



A full-stack event booking application where users can browse events, book tickets, and manage reservations, while admins can create and manage events. Real-time seat availability, smooth animations, and responsive design included.

---

## 🔖 Badges

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-red)
![Tailwind](https://img.shields.io/badge/CSS-Tailwind-purple)
![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-pink)

---

## ✨ Features

### 🧑‍💻 User Features

* Browse upcoming events 🗓️
* Search and filter by location & date 🔍
* Real-time seat availability 📊
* Smooth ticket booking animations 💫
* Downloadable QR ticket 🎫

### 👩‍💼 Admin Features

* Create / Update / Delete events ✏️🗑️
* Track bookings per event 📋

### ⚡ Advanced Features

* Real-time seat locking with **Socket.IO** 🔒
* Confetti animation on successful booking 🎉
* Mobile-friendly **PWA** support 📱

---

## 💾 Database Design (MySQL)

### `events`

| Column          | Type     | Description       |
| --------------- | -------- | ----------------- |
| id              | PK       | Primary Key       |
| title           | VARCHAR  | Event title       |
| description     | TEXT     | Event description |
| location        | VARCHAR  | Event location    |
| date            | DATETIME | Event date        |
| total_seats     | INT      | Total seats       |
| available_seats | INT      | Available seats   |
| price           | DECIMAL  | Ticket price      |
| img             | VARCHAR  | Event image URL   |

### `bookings`

| Column       | Type     | Description                |
| ------------ | -------- | -------------------------- |
| id           | PK       | Primary Key                |
| event_id     | FK       | Foreign Key to `events.id` |
| name         | VARCHAR  | Booker's name              |
| email        | VARCHAR  | Booker's email             |
| quantity     | INT      | Number of tickets booked   |
| mobile       | VARCHAR  | Mobile number              |
| total_amount | DECIMAL  | Total amount paid          |
| booking_date | DATETIME | Date of booking            |
| status       | ENUM     | Confirmed or Cancelled     |

---

## 💻 Backend APIs

### Event APIs

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| POST   | `/events`     | Create event (Admin only) |
| GET    | `/events`     | List all events           |
| GET    | `/events/:id` | Event details             |
| PUT    | `/events/:id` | Update event (Admin only) |
| DELETE | `/events/:id` | Delete event (Admin only) |

### Booking APIs

| Method | Endpoint    | Description  |
| ------ | ----------- | ------------ |
| POST   | `/bookings` | Book tickets |

---

## 🎨 Frontend Pages

### Landing Page

![Landing Page](https://via.placeholder.com/600x300.png?text=Landing+Page+GIF)

### Event Listing Page

* Animated event cards
* Search & filter by date/location
* Real-time seat availability

![Event Listing Animation](https://via.placeholder.com/600x300.gif?text=Event+Listing+GIF)

### Event Details Page

* Event description & Google Maps integration
* Dynamic ticket categories & pricing

![Event Details Animation](https://via.placeholder.com/600x300.gif?text=Event+Details+GIF)

### Booking Flow

* Animated checkout form
* Success screen with confetti & QR ticket

![Booking Success GIF](https://via.placeholder.com/600x300.gif?text=Booking+Success+GIF)

### Admin Dashboard

* CRUD operations for events
* Booking overview per event

![Admin Dashboard](https://via.placeholder.com/600x300.png?text=Admin+Dashboard+GIF)

---

## 🏗️ Project Structure

```
event-booking-app/
│
├── backend/           # Node.js + Express + MySQL server
│   ├── controllers/   # API logic
│   ├── models/        # DB models
│   ├── routes/        # API routes
│   ├── index.js       # Entry point
│   └── config.js      # DB config
│
├── frontend/          # React + Tailwind frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
│
├── event_booking.sql  # MySQL schema
└── README.md
```

---

## ⚡ Setup Instructions

### Backend

```bash
git clone https://github.com/your-username/event-booking-app.git
cd event-booking-app/backend
npm install
```

* Create `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=event_booking
PORT=5000
```

* Import database:

```bash
mysql -u root -p event_booking < event_booking.sql
```

* Start server:

```bash
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
npm start
```



