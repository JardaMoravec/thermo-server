import { Request, Response } from 'express'
import { db } from '../database'

export default function dashboard(req: Request, res: Response) {
    const query = `
        SELECT d.id,
               d.name,
               d.description,
               m.temperature,
               m.humidity,
               m.timestamp
        FROM devices d
                 LEFT JOIN measurements m
                           ON m.device_id = d.id
                               AND m.timestamp = (
                                   SELECT MAX(timestamp)
                                   FROM measurements
                                   WHERE device_id = d.id
                               )
        ORDER BY m.timestamp DESC
    `

    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).send('DB error: ' + err.message)
        }

        res.render('dashboard', {
            title: 'Dashboard',
            devices: rows
        })
    })
}
