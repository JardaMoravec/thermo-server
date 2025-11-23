import sqlite3 from 'sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

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
                timestamp   TEXT DEFAULT CURRENT_TIMESTAMP,
                temperature REAL,
                humidity    REAL,
                FOREIGN KEY (device_id) REFERENCES devices (id)
            )
        `)

        // Create auth table to store single password hash
        db.run(`
            CREATE TABLE IF NOT EXISTS auth
            (
                id            INTEGER PRIMARY KEY,
                password_hash TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating auth table', err)
                return
            }

            // Ensure a default password is present
            db.get(`SELECT COUNT(*) as cnt
                    FROM auth`, (err, row) => {
                if (err) {
                    console.error('Error checking auth table', err)
                    return
                }

                const count = row && (row as any).cnt ? (row as any).cnt : 0
                if (count === 0) {
                    const defaultPassword = 'termo83'
                    const hash = bcrypt.hashSync(defaultPassword, 10)
                    db.run(`INSERT INTO auth (password_hash)
                            VALUES (?)`, [hash], (err) => {
                        if (err) {
                            console.error('Error inserting default auth row', err)
                        } else {
                            console.log('🔐 Default login password inserted into auth table.')
                        }
                    })
                }
            })
        })

        console.log('📦 SQLite database is initialized.')
    })
}
