import { mainMenu } from '@/menus/main-menus'
import toRupiah from '@develoka/angka-rupiah-js'
import chalk from 'chalk'
import { log, confirm } from '@clack/prompts'
import Session from '@/session'
import { logout } from './logout'
import transactionService from '@/services/transaction-service'
import Table from 'cli-table3'

export default async function history() {
    const table = new Table()
    const balance = await transactionService.transactionHistory(
        Session.loggedInId
    )

    log.message(chalk.bold.bgMagenta.white(' TRANSACTION HISTORY '))
    table.push(
        ['Amount', 'Type', 'Target ID', 'Timestamp'],
        ...balance.map((item) => [
            toRupiah(item.amount),
            item.type,
            item.target_id?.toString() ?? chalk.dim('-'),
            new Date(item.created_at)
                .toISOString()
                .replace('.000Z', '')
                .split('T')
                .join(' '),
        ])
    )
    console.log(table.toString())
    const shouldContinue = await confirm({
        message: 'Do you want to continue?',
    })
    shouldContinue ? await mainMenu() : logout()
}
