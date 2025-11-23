import {Request, Response} from 'express'
import {db} from '../database'
import {DeviceRow} from '../types/Device'

export default function deviceDetail(req: Request, res: Response) {
    const deviceId = req.params.id
    const page = parseInt(req.query.page as string) || 1
    const pageSize = 50
    const offset = (page - 1) * pageSize

    // Nejprve načíst info o teploměru
    db.get('SELECT * FROM devices WHERE id = ?', [deviceId], (err, device:DeviceRow) => {
        if (err) {
            return res.status(500).send('Chyba DB: ' + err.message)
        }
        if (!device) {
            return res.status(404).send('Teploměr nenalezen')
        }

        // Počítáme celkový počet záznamů pro stránkování
        db.get(
            'SELECT COUNT(*) AS total FROM measurements WHERE device_id = ?',
            [deviceId],
            (err2, countRow: any) => {
                if (err2) {
                    return res.status(500).send('Chyba DB: ' + err2.message)
                }
                const total = countRow.total
                const totalPages = Math.ceil(total / pageSize)

                // Načteme měření pro aktuální stránku
                db.all(
                    `SELECT temperature, humidity, timestamp
                     FROM measurements
                     WHERE device_id = ?
                     ORDER BY timestamp DESC
                     LIMIT ? OFFSET ?`,
                    [deviceId, pageSize, offset],
                    (err3, measurements) => {
                        if (err3) {
                            return res.status(500).send('Chyba DB: ' + err3.message)
                        }

                        res.render('device-detail', {
                            title: `Detail: ${device.name}`,
                            page: 'device-detail',
                            device,
                            measurements,
                            currentPage: page,
                            totalPages
                        })
                    }
                )
            }
        )
    })
}
