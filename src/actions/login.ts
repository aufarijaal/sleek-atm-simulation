import { mainMenu } from '@/menus/main-menus'
import accountService from '@/services/account-service'
import { intro, log, password, text } from '@clack/prompts'
import chalk from 'chalk'

export default async function login() {
    const id = await text({
        message: 'ID',
        validate: (value) => {
            if (!value) {
                return 'Please provide a valid id'
            }
        },
    })

    const pin = await password({
        message: 'PIN',
        mask: '●',
        validate: (value) => {
            if (!value) {
                return 'Please provide a PIN'
            }

            if (isNaN(parseInt(value))) {
                return 'Please provide a valid PIN'
            }

            if (value.length != 6) {
                return 'PIN should be 6 digits long'
            }
        },
    })

    try {
        const name = await accountService.login({
            id: parseInt(id as string),
            pin: pin as string,
        })

        intro(chalk.bgCyan('ATM Simulation'))
        log.message(`☺️ Welcome back, ${name}!`)
        return await mainMenu()
    } catch (error) {
        log.error(error.message)
        process.exit(1)
    }
}
