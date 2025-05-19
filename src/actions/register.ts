import accountService from '@/services/account-service'
import { confirm, password, text } from '@clack/prompts'

export default async function register() {
    const name = await text({
        message: 'Full name',
        validate: (value) => {
            if (!value || value.length <= 0) {
                return 'Please provide a name'
            }

            // make sure name does not contain number
            if (/\d/.test(value)) {
                return 'Name cannot contain numbers'
            }
        },
    })

    const pin = await password({
        message: 'Your PIN',
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

    await password({
        message: 'PIN confirmation',
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

            if (value !== pin) {
                return "PIN confirmation doesn't match"
            }
        },
    })

    let initialBalance = '0'
    const confirmInitialBalance = await confirm({
        message: 'Do you want to add initial balance?',
    })

    if (confirmInitialBalance) {
        initialBalance = (await text({
            message: 'Initial balance',
            initialValue: '0',
            validate: (value) => {
                if (!value) {
                    return 'Please provide a valid balance'
                }

                if (isNaN(parseInt(value)) || parseInt(value) < 0) {
                    return 'Please provide a valid balance'
                }
            },
        })) as string
    }

    const insertedId = await accountService.register({
        name: name as string,
        pin: pin as string,
        balance: parseFloat(initialBalance as string) ?? 0,
    })

    if (insertedId === -1) {
        console.log('Error registering account')
        return
    }

    console.log(`🥳 Account registered with ID: ${insertedId}`)
    console.log(`You can now login by typing sleek-atm-simulation login`)
    process.exit(0)
}
