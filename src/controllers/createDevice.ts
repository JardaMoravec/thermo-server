import {Request, Response} from 'express'
import {db} from '../database'

export default {

    // GET formulář pro nový teploměr
    getForm(_req: Request, res: Response) {
        res.render('device-form', {
            title: 'Přidat teploměr',
            page: 'device-form',
            saveRoute: '/devices/add',
            buttonTitle: 'Přidat teploměr',
            device: null
        })
    },

    // POST – uložení nového teploměru
    createDevice(req: Request, res: Response) {
        const {name, token, description} = req.body

        if (!name || !token) {
            return res.status(400).send('Name a token jsou povinné!')
        }

        const stmt = db.prepare(`
            INSERT INTO devices (name, token, description)
            VALUES (?, ?, ?)
        `)

        stmt.run(name, token, description || null, function (err: NodeJS.ErrnoException | null) {
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
