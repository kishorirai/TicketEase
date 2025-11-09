const db = require("./models/db");

async function testConnection() {
    try {
        const [rows] = await db.query("SELECT NOW() as now");
        console.log("DB Connected:", rows[0].now);
    } catch (err) {
        console.error("DB Connection Failed:", err);
    }
}

testConnection();
