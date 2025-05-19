#!/usr/bin/env node

import { Command } from 'commander'
import accountService from '@/services/account-service'
import { intro, log, outro } from '@clack/prompts'
import chalk from 'chalk'
import { mainMenu } from './menus/main-menus'
import { checkDBExsistence, init } from './db'
import configureDb from './actions/configure-db'
import register from './actions/register'
import login from './actions/login'

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
    .action(async () => {
        try {
            intro(chalk.bgBlue.white('Checking Database'))
            checkDBExsistence()
            outro(chalk.bgGreen.white('Database OK'))
        } catch (error) {
            outro(chalk.bgRed.white(error))
            process.exit(1)
        }

        register()
    })

program
    .command('login')
    .description('Login to an existing account')
    .action(async () => {
        try {
            intro(chalk.bgBlue.white('Checking Database'))
            checkDBExsistence()
            outro(chalk.bgGreen.white('Database OK'))
        } catch (error) {
            outro(chalk.bgRed.white(error))
            process.exit(1)
        }

        login()
    })

program.parse()
