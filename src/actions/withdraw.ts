import { confirm, text, select, log } from '@clack/prompts'
import chalk from 'chalk'
import { mainMenu } from '@/menus/main-menus'
import { logout } from '@/actions/logout'
import transactionService from '@/services/transaction-service'
import Session from '@/session'
import toRupiah from '@develoka/angka-rupiah-js'
import accountService from '@/services/account-service'

export default async function withdraw() {
    let withdrawAmount = 0
    let showRemainingBalance = false

    log.message(chalk.bold.bgYellow.black(' WITHDRAW '))
    showRemainingBalance = (await confirm({
        message: 'Show remaining balance after withdraw?',
    })) as boolean

    log.message(chalk.bold.bgYellow.black(' WITHDRAW '))
    const amount = await select({
        message: 'Enter the amount to withdraw:',
        options: [
            { value: 100000, label: 'Rp 100.000' },
            { value: 200000, label: 'Rp 200.000' },
            { value: 500000, label: 'Rp 500.000' },
            { value: 1000000, label: 'Rp 1.000.000' },
            { value: -1, label: 'Custom' },
        ],
    })

    if (amount === -1) {
        log.message(chalk.bold.bgYellow.black(' WITHDRAW '))
        const customAmount = await text({
            message: 'Enter the amount to withdraw (min: Rp 20.000):',
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

        withdrawAmount = parseInt(customAmount as string)
    } else withdrawAmount = amount as number

    try {
        await transactionService.withdraw({
            id: Session.loggedInId,
            amount: withdrawAmount,
        })
    } catch (error) {
        log.error(error.message)
        return mainMenu()
    }

    log.message(chalk.bold.bgYellow.black(' WITHDRAW '))
    log.success(
        `Withdrawn: ${chalk.bold.green(toRupiah(withdrawAmount as number))}`
    )
    log.message('')

    if (showRemainingBalance) {
        const balance = await accountService.checkBalance({
            id: Session.loggedInId,
        })
        log.info(
            `💵 Remaining balance: ${chalk.bold.yellow(toRupiah(balance))}`
        )
    }

    log.message(chalk.bold.bgYellow.black(' WITHDRAW '))
    const shouldContinue = await confirm({
        message: 'Do you want to continue? No will logout',
    })
    return shouldContinue ? await mainMenu() : logout()
}
