import {Request, Response} from 'express'
import {db} from '../database'
import bcrypt from 'bcryptjs'

export function getLogin(req: Request, res: Response) {
    res.render('login', {error: null})
}

export function postLogin(req: Request, res: Response) {
    const password = req.body.password
    if (!password) {
        return res.render('login', {error: 'Zadejte heslo'})
    }

    db.get(`SELECT password_hash
            FROM auth
            LIMIT 1`, (err, row) => {
        if (err) {
            console.error('DB error fetching auth hash', err)
            return res.status(500).send('Server error')
        }

        const hash = row ? (row as any).password_hash : null
        if (!hash) {
            return res.status(500).send('No password set')
        }

        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                console.error('bcrypt error', err)
                return res.status(500).send('Server error')
            }

            if (result) {
                if (req.session) {
                    req.session.authenticated = true
                }
                return res.redirect('/')
            } else {
                return res.render('login', {error: 'Nesprávné heslo'})
            }
        })
    })
}

export function logout(req: Request, res: Response) {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Session destroy error', err)
            }
            res.redirect('/login')
        })
    } else {
        res.redirect('/login')
    }
}

