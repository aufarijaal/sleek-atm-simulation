#!/usr/bin/env node

import { Command } from 'commander'
import accountService from '@/services/account-service'
import { intro, log, outro } from '@clack/prompts'
import chalk from 'chalk'
import { mainMenu } from './menus/main-menus'
import { checkDBExsistence, init } from './db'
import configureDb from './actions/configure-db'

const program = new Command()

program
    .name('atm-simulation')
    .description('📟 ATM Simulation 📟')
    .argument('<command>', 'command to execute')
    .version('1.0.0')

program
    .command('db-tables-setup')
    .description('Setup the database tables')
    .action(() => {
        init()
    })

program
    .command('configure-db')
    .description(
        'Configure the database connection information. The config file will be created at $HOME/.sleek-atm-simulation/config.json'
    )
    .action(() => {
        configureDb()
    })

program
    .command('register')
    .description('Register a new account')
    .requiredOption('-n, --name <name>', 'Name of the account holder')
    .requiredOption('-p, --pin <pin>', 'PIN for the account')
    .option('-b, --balance <balance>', 'Initial balance', '0')
    .action(async (str: any, options) => {
        try {
            intro(chalk.bgBlue.white('Checking Database'))
            checkDBExsistence()
            outro(chalk.bgGreen.white('Database OK'))
        } catch (error) {
            outro(chalk.bgRed.white(error))
            process.exit(1)
        }

        const opts = options.opts()
        const { name, pin, balance } = opts

        const insertedId = await accountService.register({
            name,
            pin,
            balance: parseFloat(balance),
        })

        if (insertedId === -1) {
            console.log('Error registering account')
            return
        }

        console.log(`🥳 Account registered with ID: ${insertedId}`)
        process.exit(0)
    })

program
    .command('login')
    .description('Login to an existing account')
    .requiredOption('-i, --id <id>', 'Account ID')
    .requiredOption('-p, --pin <pin>', 'PIN for the account')
    .action(async (str: any, options) => {
        try {
            intro(chalk.bgBlue.white('Checking Database'))
            checkDBExsistence()
            outro(chalk.bgGreen.white('Database OK'))
        } catch (error) {
            outro(chalk.bgRed.white(error))
            process.exit(1)
        }

        const opts = options.opts()
        const { id, pin } = opts

        try {
            const name = await accountService.login({
                id: parseInt(id),
                pin,
            })

            intro(chalk.bgCyan('ATM Simulation'))
            log.message(`☺️ Welcome back, ${name}!`)
            await mainMenu()
        } catch (error) {
            log.error(error.message)
            process.exit(1)
        }
    })

program.parse()
