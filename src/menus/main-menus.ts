import { select } from '@clack/prompts'
import { logout } from '../actions/logout'
import withdraw from '@/actions/withdraw'
import deposit from '@/actions/deposit'
import checkBalance from '@/actions/check-balance'
import transfer from '@/actions/transfer'
import history from '@/actions/history'

export async function mainMenu() {
    const menu = await select({
        message: 'Select a menu:.',
        options: [
            { value: 'check-balance', label: 'Check my balance' },
            { value: 'deposit', label: 'Deposit' },
            { value: 'tf', label: 'Transfer' },
            { value: 'withdraw', label: 'Withdraw' },
            { value: 'history', label: 'History' },
            { value: 'logout', label: 'Logout' },
        ],
    })

    if (menu === 'logout') logout()
    else if (menu === 'check-balance') {
        checkBalance()
    } else if (menu === 'deposit') {
        deposit()
    } else if (menu === 'withdraw') {
        withdraw()
    } else if (menu === 'tf') {
        transfer()
    } else if (menu === 'history') {
        history()
    }
}
