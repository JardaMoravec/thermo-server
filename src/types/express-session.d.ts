import 'express-session'

declare module 'express-session' {
    interface SessionData {
        authenticated?: boolean
    }

    interface Session {
        authenticated?: boolean
    }
}

