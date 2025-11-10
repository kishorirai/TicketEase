
# 🎟️ TICKETEASE



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
* Animated ticket booking flow 💫
* Downloadable QR ticket 🎫

### 👩‍💼 Admin Features

* Create / Update / Delete events ✏️🗑️
* Track bookings per event 📋
* Manage ticket categories dynamically 🎟️

### ⚡ Advanced Features

* Real-time seat locking with **Socket.IO** 🔒
* Confetti animation on successful booking 🎉
* Mobile-friendly **PWA** support 📱

---

## 💾 Database Design (MySQL)

### `events`

| Column          | Type          | Description                 |
| --------------- | ------------- | --------------------------- |
| id              | int           | Primary key, auto_increment |
| title           | varchar(255)  | Event title                 |
| date            | datetime      | Event date                  |
| location        | varchar(255)  | Event location              |
| price           | decimal(10,2) | Ticket price                |
| total_seats     | int           | Total seats                 |
| available_seats | int           | Current available seats     |
| created_at      | timestamp     | Auto-generated timestamp    |
| images          | json          | Event images array          |
| time            | varchar(50)   | Event start time            |
| address         | varchar(255)  | Event address               |
| description     | text          | Event description           |
| organizer       | varchar(255)  | Event organizer             |
| rating          | decimal(3,1)  | Average rating              |
| reviews         | int           | Number of reviews           |
| highlights      | json          | Event highlights            |
| coordinates     | json          | Latitude & longitude        |
| subtitle        | varchar(255)  | Event subtitle              |

---

### `bookings`

| Column       | Type                          | Description                           |
| ------------ | ----------------------------- | ------------------------------------- |
| id           | int                           | Primary key                           |
| event_id     | int                           | Foreign key to `events.id`            |
| user_name    | varchar(255)                  | Name of booker                        |
| quantity     | int                           | Number of tickets booked              |
| total_amount | decimal(10,2)                 | Total amount paid                     |
| status       | enum('confirmed','cancelled') | Booking status                        |
| created_at   | timestamp                     | Booking timestamp                     |
| tickets      | json                          | Ticket details (seat numbers, etc.)   |
| contact      | json                          | User contact info (email/phone)       |
| payment      | json                          | Payment info (method, transaction ID) |

---

### `ticket_categories`

| Column      | Type          | Description                 |
| ----------- | ------------- | --------------------------- |
| id          | int           | Primary key                 |
| event_id    | int           | Foreign key to `events.id`  |
| name        | varchar(255)  | Ticket category name        |
| price       | decimal(10,2) | Category price              |
| available   | int           | Available seats             |
| total       | int           | Total seats                 |
| description | text          | Category description        |
| features    | json          | Features included           |
| badge       | varchar(100)  | Badge label (e.g., Popular) |

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

### Ticket Categories APIs

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| POST   | `/ticket-categories`     | Create category (Admin) |
| GET    | `/ticket-categories/:id` | Get category details    |
| PUT    | `/ticket-categories/:id` | Update category (Admin) |
| DELETE | `/ticket-categories/:id` | Delete category (Admin) |

---

## 🎨 Frontend Pages

### Landing Page

https://ticket-booking-sepia.vercel.app/

### Event Listing Page

* Animated event cards
* Search & filter by date/location
* Real-time seat availability indicator

![Event Listing Animation](https://via.placeholder.com/600x300.gif?text=Event+Listing+GIF)

### Event Details Page

* Event description & Google Maps integration
* Dynamic ticket categories & pricing



### Booking Flow

* Animated checkout form
* Success screen with confetti & QR ticket



### Admin Dashboard

* CRUD operations for events & ticket categories
* Booking overview per event



---

## 🏗️ Project Structure

```
smart-event-app/
│
├── backend/           # Node.js + Express + MySQL server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── config.js
│
├── frontend/          # React + Tailwind frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
│
├── smart_event.sql    # MySQL schema + sample data
└── README.md
```

---

## ⚡ Setup Instructions

### Backend

```bash
git clone https://github.com/your-username/smart-event-app.git
cd smart-event-app/backend
npm install
```

* Create `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=smart_event
PORT=5000
```

* Import database:

```bash
mysql -u root -p < smart_event.sql
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

---

## 🚀 Deployment

* Backend: Render / Heroku
* Frontend: Vercel / Netlify

do that next?
