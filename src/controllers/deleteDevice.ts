import {Request, Response} from 'express'
import {db} from '../database'

export default function deleteDevice(req: Request, res: Response) {
    const deviceId = req.params.id

    // Smazání z tabulky measurements nejprve, pokud máš FK omezení
    db.run('DELETE FROM measurements WHERE device_id = ?', [deviceId], function (err) {
        if (err) {
            return res.status(500).send('Chyba DB: ' + err.message)
        }

        // Pak smažeme teploměr
        db.run('DELETE FROM devices WHERE id = ?', [deviceId], function (err2) {
            if (err2) {
                return res.status(500).send('Chyba DB: ' + err2.message)
            }
            res.redirect('/')
        })
    })
}
