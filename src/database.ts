import sqlite3 from 'sqlite3'
import path from 'path'

const dbFile = path.join(__dirname, '../data/temperatures.db')
export const db = new sqlite3.Database(dbFile)

export function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS devices
            (
                id          INTEGER PRIMARY KEY,
                name        TEXT NOT NULL,
                token       TEXT NOT NULL UNIQUE,
                description TEXT
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS measurements
            (
                id          INTEGER PRIMARY KEY,
                device_id   INTEGER NOT NULL,
                timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
                temperature REAL,
                humidity    REAL,
                FOREIGN KEY (device_id) REFERENCES devices (id)
            )
        `)

        console.log('📦 SQLite database is initialized.')
    })
}
