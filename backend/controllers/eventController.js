const db = require("../models/db");

// Helper to robustly parse images JSON
const parseImages = (event) => {
    let imagesRaw = event.images;
    if (!imagesRaw || imagesRaw === "null") {
        return { ...event, images: ["https://via.placeholder.com/600x400"] };
    }
    if (Array.isArray(imagesRaw)) {
        // Already parsed by MySQL2 for JSON columns
        return { ...event, images: imagesRaw };
    }
    try {
        const parsed = JSON.parse(imagesRaw);
        if (Array.isArray(parsed)) return { ...event, images: parsed };
        if (typeof parsed === "string") return { ...event, images: [parsed] };
    } catch (e) {
        if (
            typeof imagesRaw === "string" &&
            (imagesRaw.startsWith("http://") || imagesRaw.startsWith("https://"))
        ) {
            return { ...event, images: [imagesRaw] };
        }
    }
    return { ...event, images: ["https://via.placeholder.com/600x400"] };
};

// Helper to robustly parse highlights JSON
const parseHighlights = (event) => {
    let highlightsRaw = event.highlights;
    if (!highlightsRaw || highlightsRaw === "null") {
        return { ...event, highlights: [] };
    }
    if (Array.isArray(highlightsRaw)) {
        return { ...event, highlights: highlightsRaw };
    }
    try {
        const parsed = JSON.parse(highlightsRaw);
        if (Array.isArray(parsed)) return { ...event, highlights: parsed };
        if (typeof parsed === "string") return { ...event, highlights: [parsed] };
    } catch (e) {
        return { ...event, highlights: [] };
    }
    return { ...event, highlights: [] };
};

// Helper to robustly parse coordinates JSON (optional)
const parseCoordinates = (event) => {
    let coordinatesRaw = event.coordinates;
    if (!coordinatesRaw || coordinatesRaw === "null") {
        return { ...event, coordinates: null };
    }
    try {
        const parsed = typeof coordinatesRaw === "string" ? JSON.parse(coordinatesRaw) : coordinatesRaw;
        return { ...event, coordinates: parsed };
    } catch (e) {
        return { ...event, coordinates: null };
    }
};

// Compose robust event object
const parseFullEvent = (event) => {
    return parseCoordinates(parseHighlights(parseImages(event)));
};

// GET /api/events - List all events
exports.getEvents = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM events");
        const events = rows.map(parseFullEvent);
        res.json(events);
    } catch (err) {
        console.error("getEvents error:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/events/:id - Get event by ID, include ticket types
exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Event not found" });
        const event = parseFullEvent(rows[0]);

        const [ticketRows] = await db.query("SELECT * FROM ticket_categories WHERE event_id = ?", [id]);
        const ticket_types = ticketRows.map(row => ({
            id: row.id,
            name: row.name,
            price: row.price,
            available: row.available,
            total: row.total,
            description: row.description,
            features: (() => {
                try {
                    return JSON.parse(row.features);
                } catch (e) {
                    return [];
                }
            })(),
            badge: row.badge
        }));

        res.json({ ...event, ticket_types });
    } catch (err) {
        console.error("getEventById error:", err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/events - Create new event
exports.createEvent = async (req, res) => {
    const { title, date, location, price, total_seats, images } = req.body;
    try {
        const totalSeatsNum = parseInt(total_seats, 10) || 0;
        const [result] = await db.query(
            "INSERT INTO events (title, date, location, price, total_seats, available_seats, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [title, date, location, price, totalSeatsNum, totalSeatsNum, JSON.stringify(images || [])]
        );
        const [newEvent] = await db.query("SELECT * FROM events WHERE id = ?", [result.insertId]);
        res.status(201).json(parseFullEvent(newEvent[0]));
    } catch (err) {
        console.error("createEvent error:", err);
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/events/:id - Update event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, location, price, total_seats, images } = req.body;

    try {
        const [currentRows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
        if (currentRows.length === 0) return res.status(404).json({ message: "Event not found" });
        const current = currentRows[0];

        // Ensure numeric values
        const incomingTotal = typeof total_seats !== 'undefined' ? parseInt(total_seats, 10) : undefined;
        let availableSeats = Number(current.available_seats || 0);
        if (typeof incomingTotal !== 'undefined' && !Number.isNaN(incomingTotal) && incomingTotal !== Number(current.total_seats)) {
            availableSeats += incomingTotal - Number(current.total_seats || 0);
            if (availableSeats < 0) availableSeats = 0;
        }

        // Parentheses ensure correct fallback for images
        const imagesToStore = JSON.stringify(images || (current.images ? current.images : []));

        await db.query(
            "UPDATE events SET title=?, date=?, location=?, price=?, total_seats=?, available_seats=?, images=? WHERE id=?",
            [
                title || current.title,
                date || current.date,
                location || current.location,
                typeof price !== 'undefined' ? price : current.price,
                typeof incomingTotal !== 'undefined' && !Number.isNaN(incomingTotal) ? incomingTotal : current.total_seats,
                availableSeats,
                imagesToStore,
                id
            ]
        );

        const [updatedEvent] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
        res.json(parseFullEvent(updatedEvent[0]));
    } catch (err) {
        console.error("updateEvent error:", err);
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/events/:id - Delete event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("deleteEvent error:", err);
        res.status(500).json({ error: err.message });
    }
};