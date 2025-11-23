import {Request, Response} from 'express'
import {db} from '../database'
import {DeviceRow} from '../types/Device'
import {TemperatureDto} from '../types/Temperature'
import {Statement} from 'sqlite3'
import {MeasurementResult} from '../types/Measurement'

export default function addMeasurements(req: Request, res: Response) {
    const body: TemperatureDto | TemperatureDto[] = req.body
    const measurements = Array.isArray(body) ? body : [body]

    const results: MeasurementResult[] = []
    const stmt = db.prepare(`
        INSERT INTO measurements (device_id, temperature, humidity)
        VALUES (?, ?, ?)
    `)

    const processNext = (i: number) => {
        if (i >= measurements.length) {
            stmt.finalize()
            return res.json({added: results.length, results})
        }

        const m = measurements[i]

        if (!m.token || m.temperature === undefined) {
            return res.status(400).json({error: 'Token a teplota jsou povinné'})
        }

        db.get('SELECT id FROM devices WHERE token = ?', [m.token], (err, row: DeviceRow) => {
            if (err) {
                return res.status(500).json({error: err.message})
            }

            const insertMeasurement = (deviceId: number) => {
                stmt.run(deviceId, m.temperature, m.humidity || null, function (err2: NodeJS.ErrnoException | null) {
                    if (err2) {
                        return res.status(500).json({error: err2.message})
                    }

                    results.push({
                        device_id: deviceId,
                        temperature: m.temperature,
                        humidity: m.humidity || null
                    })

                    processNext(i + 1)
                })
            }

            if (!row) {
                // Pokud zařízení s tokenem neexistuje, vytvoř ho automaticky
                const name = `Device ${m.token}`
                const description = 'Vytvořeno automaticky'

                const createStmt = db.prepare(`
                    INSERT INTO devices (name, token, description)
                    VALUES (?, ?, ?)
                `)

                createStmt.run(name, m.token, description, function (this: Statement, createErr: NodeJS.ErrnoException | null) {
                    if (createErr) {
                        // Možný závodní stav – zařízení již mohlo být vytvořeno jinde
                        if (createErr.code === 'SQLITE_CONSTRAINT') {
                            db.get('SELECT id FROM devices WHERE token = ?', [m.token], (reErr, reRow: DeviceRow) => {
                                if (reErr || !reRow) {
                                    return res.status(500).json({error: reErr?.message || 'Nepodařilo se znovu načíst zařízení'})
                                }
                                insertMeasurement(reRow.id)
                            })
                        } else {
                            return res.status(500).json({error: createErr.message})
                        }
                    } else {
                        insertMeasurement((this as any).lastID)
                    }
                })

                createStmt.finalize()
                return
            }

            insertMeasurement(row.id)
        })
    }

    processNext(0)
}
