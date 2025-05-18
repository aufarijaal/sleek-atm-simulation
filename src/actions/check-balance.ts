import { mainMenu } from '@/menus/main-menus'
import accountService from '@/services/account-service'
import toRupiah from '@develoka/angka-rupiah-js'
import chalk from 'chalk'
import { log, confirm } from '@clack/prompts'
import Session from '@/session'
import { logout } from './logout'

export default async function checkBalance() {
    const balance = await accountService.checkBalance({
        id: Session.loggedInId,
    })

    log.message(chalk.bold.bgMagenta.white(' CHECK BALANCE '))
    log.info(`💵 Your balance is: ${chalk.bold.green(toRupiah(balance))}`)
    log.message('')
    const shouldContinue = await confirm({
        message: 'Do you want to continue?',
    })
    shouldContinue ? await mainMenu() : logout()
}
