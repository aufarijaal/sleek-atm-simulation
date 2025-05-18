import Session from '@/session'
import { log } from '@clack/prompts'

export function logout() {
    log.message('Logging out...')
    Session.loggedInId = null
    process.exit(0)
}
