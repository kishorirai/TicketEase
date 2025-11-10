-- ========================================
-- Smart Event Booking Database
-- ========================================

-- Use your database
CREATE DATABASE IF NOT EXISTS smart_event;
USE smart_event;

-- ========================================
-- Table: events
-- ========================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    location VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    images JSON,
    time VARCHAR(50),
    address VARCHAR(255),
    description TEXT,
    organizer VARCHAR(255),
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    highlights JSON,
    coordinates JSON,
    subtitle VARCHAR(255)
);

-- ========================================
-- Table: bookings
-- ========================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    user_name VARCHAR(255),
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2),
    status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tickets JSON,
    contact JSON,
    payment JSON,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ========================================
-- Table: ticket_categories
-- ========================================
CREATE TABLE IF NOT EXISTS ticket_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available INT NOT NULL,
    total INT NOT NULL,
    description TEXT,
    features JSON,
    badge VARCHAR(100),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ========================================
-- Sample Data: events
-- ========================================
INSERT INTO events (title, description, location, date, total_seats, available_seats, price, images, time, address, organizer, rating, reviews)
VALUES
('Music Concert', 'An exciting music concert featuring top artists.', 'Stadium A', '2025-12-01 19:00:00', 100, 100, 500.00, '[ "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200&h=600&fit=crop" ]', '19:00', '123 Main St', 'ABC Entertainment', 4.5, 20),
('Tech Conference', 'Annual tech conference with key speakers.', 'Convention Center B', '2025-12-10 09:00:00', 200, 200, 1200.00, '[ "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&h=600&fit=crop" ]', '09:00', '456 Tech Road', 'TechWorld', 4.8, 50);

-- ========================================
-- Sample Data: bookings
-- ========================================
INSERT INTO bookings (event_id, user_name, quantity, total_amount, status, tickets, contact, payment)
VALUES
(1, 'Alice Johnson', 2, 1000.00, 'confirmed', '[{"seat":"A1"},{"seat":"A2"}]', '{"email":"alice@example.com","phone":"9876543210"}', '{"method":"card","transaction_id":"TX123"}'),
(2, 'Bob Smith', 1, 1200.00, 'confirmed', '[{"seat":"B1"}]', '{"email":"bob@example.com","phone":"9123456780"}', '{"method":"paypal","transaction_id":"TX124"}');

-- ========================================
-- Sample Data: ticket_categories
-- ========================================
INSERT INTO ticket_categories (event_id, name, price, available, total, description, features, badge)
VALUES
(1, 'VIP', 1000.00, 10, 10, 'Front row VIP tickets', '[ "Access to lounge", "Complimentary drinks" ]', 'Popular'),
(1, 'Regular', 500.00, 90, 90, 'Standard seating', '[ "General admission" ]', NULL),
(2, 'Early Bird', 1000.00, 50, 50, 'Early registration tickets', '[ "Free swag" ]', 'Limited'),
(2, 'Standard', 1200.00, 150, 150, 'Standard conference ticket', '[]', NULL);
