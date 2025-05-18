import { confirm, text, select, log } from '@clack/prompts'
import chalk from 'chalk'
import { mainMenu } from '@/menus/main-menus'
import { logout } from '@/actions/logout'
import transactionService from '@/services/transaction-service'
import Session from '@/session'
import toRupiah from '@develoka/angka-rupiah-js'
import accountService from '@/services/account-service'

export default async function deposit() {
    let depositAmount = 0
    let showUpdatedBalance = false

    log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
    showUpdatedBalance = (await confirm({
        message: 'Show updated balance after deposit?',
    })) as boolean

    log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
    const amount = await select({
        message: 'Enter the amount to deposit:',
        options: [
            { value: 100000, label: 'Rp 100.000' },
            { value: 200000, label: 'Rp 200.000' },
            { value: 500000, label: 'Rp 500.000' },
            { value: 1000000, label: 'Rp 1.000.000' },
            { value: -1, label: 'Custom' },
        ],
    })

    if (amount === -1) {
        log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
        const customAmount = await text({
            message: 'Enter the amount to deposit (min: Rp 20.000):',
            placeholder: '20000',
            initialValue: '20000',
            validate(value) {
                if (parseInt(value) < 20000) {
                    return `Minimum amount must at least Rp 20.000!`
                }
                if (parseInt(value) % 20000 !== 0) {
                    return `Must multiply of 20.000!`
                }
                if (isNaN(parseInt(value))) return `Invalid input`
            },
        })

        depositAmount = parseInt(customAmount as string)
    } else depositAmount = amount as number

    try {
        await transactionService.deposit({
            id: Session.loggedInId,
            amount: depositAmount,
        })
    } catch (error) {
        log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
        log.error(error.message)
        const shouldContinue = await confirm({
            message: 'Do you want to retry? No will back to main menu',
        })
        shouldContinue ? await deposit() : mainMenu()
        return
    }

    log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
    log.success(
        `Deposited: ${chalk.bold.green(toRupiah(depositAmount as number))}`
    )
    log.message('')

    if (showUpdatedBalance) {
        const balance = await accountService.checkBalance({
            id: Session.loggedInId,
        })
        log.info(`💵 Updated balance: ${chalk.bold.yellow(toRupiah(balance))}`)
    }

    log.message(chalk.bold.bgGreen.white(' DEPOSIT '))
    const shouldContinue = await confirm({
        message: 'Do you want to continue? No will logout',
    })
    shouldContinue ? await mainMenu() : logout()
}
