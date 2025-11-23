import {Request, Response, NextFunction} from 'express'

const whitelist = [
    '/login',
    '/logout',
    '/static',
    '/measurements'
]

function isWhitelisted(path: string) {
    // allow prefix matches for static and other endpoints
    return whitelist.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p))
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (isWhitelisted(req.path)) {
        return next()
    }

    // For JSON/API requests, return 401
    const acceptsJson = req.is('application/json') || req.get('Accept')?.includes('application/json')

    if (req.session && (req.session as any).authenticated) {
        return next()
    }

    if (acceptsJson) {
        res.status(401).json({error: 'Unauthorized'})
    } else {
        res.redirect('/login')
    }
}

