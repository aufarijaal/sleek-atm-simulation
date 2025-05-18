import { mainMenu } from '@/menus/main-menus'
import toRupiah from '@develoka/angka-rupiah-js'
import chalk from 'chalk'
import { log, text, confirm } from '@clack/prompts'
import { logout } from './logout'
import accountService from '@/services/account-service'
import transactionService from '@/services/transaction-service'
import Session from '@/session'

export default async function transfer() {
    let recipientName: string = null
    let showRemainingBalance = false

    log.message(chalk.bold.bgBlue.white(' TRANSFER '))
    showRemainingBalance = (await confirm({
        message: 'Show remaining balance after transfer?',
    })) as boolean

    const recipientId = await text({
        message: 'Enter the account id to transfer to:',
        placeholder: '1',
        validate(value) {
            if (parseInt(value) === Session.loggedInId)
                return `You cannnot transfer to yourself`
            if (isNaN(parseInt(value))) return `Invalid input`
        },
    })

    const result = await accountService.findName(
        parseInt(recipientId as string)
    )

    if (!result) {
        log.message(chalk.bold.bgBlue.white(' TRANSFER '))
        log.error('No account matches with that id')
        const shouldContinue = await confirm({
            message: 'Do you want to retry?',
        })
        shouldContinue ? await transfer() : logout()
    } else recipientName = result

    log.message(chalk.bold.bgBlue.white(' TRANSFER '))
    const amount = await text({
        message: 'Enter the amount to transfer:',
        placeholder: '10000',
        initialValue: '10000',
        validate(value) {
            if (parseInt(value) < 10000) {
                return `Minimum transfer amount must at least Rp 10.000!`
            }
            if (isNaN(parseInt(value))) return `Invalid input`
        },
    })

    const confirmTransfer = await confirm({
        message: `You about to tranfer ${toRupiah(
            parseInt(amount as string)
        )} to ${recipientName}, proceed?`,
    })

    if (confirmTransfer) {
        try {
            await transactionService.transfer({
                from: Session.loggedInId,
                to: parseInt(recipientId as string),
                amount: parseInt(amount as string),
            })
        } catch (error) {
            log.error(error.message)
            const shouldContinue = await confirm({
                message:
                    'Do you want to retry transferring? No will back to main menu',
            })
            shouldContinue ? await transfer() : mainMenu()
            return
        }
    } else mainMenu()

    log.message(chalk.bold.bgBlue.white(' TRANSFER '))
    log.success(
        `Transferred: ${chalk.bold.green(toRupiah(parseInt(amount as string)))}`
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

    const shouldContinue = await confirm({
        message: 'Do you want to continue? No will logout',
    })
    shouldContinue ? await mainMenu() : logout()
}
