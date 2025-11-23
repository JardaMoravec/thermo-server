import {Request, Response} from 'express'
import {db} from '../database'
import {DeviceRow} from '../types/Device'

export default {

    // GET – zobrazit formulář s předvyplněnými daty
    getForm(req: Request, res: Response) {
        const deviceId = req.params.id

        db.get('SELECT * FROM devices WHERE id = ?', [deviceId], (err, row: DeviceRow) => {
            if (err) {
                return res.status(500).send('Chyba databáze: ' + err.message)
            }
            if (!row) {

                return res.status(404).send('Teploměr nenalezen')
            }

            res.render('device-form', {
                title: 'Editace teploměru',
                page: 'device-form',
                saveRoute: `/devices/${deviceId}/edit`,
                buttonTitle: 'Uložit změny',
                device: row
            })
        })
    },

    // POST – uložit změny
    updateDevice(req: Request, res: Response) {
        const deviceId = req.params.id
        const {name, token, description} = req.body

        if (!name || !token) {
            return res.status(400).send('Name a token jsou povinné!')
        }

        const stmt = db.prepare(`
            UPDATE devices
            SET name        = ?,
                token       = ?,
                description = ?
            WHERE id = ?
        `)

        stmt.run(name, token, description || null, deviceId, function (err: NodeJS.ErrnoException | null) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).send('Token musí být unikátní!')
                }
                return res.status(500).send('Chyba databáze!')
            }

            res.redirect('/')
        })

        stmt.finalize()
    }
}
