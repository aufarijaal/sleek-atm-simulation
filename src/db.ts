import chalk from 'chalk'
import knex from 'knex'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { log } from '@clack/prompts'

type DbConfig = {
    host: string
    port: number
    user: string
    password: string
    database: string
}

const configPath = path.join(
    os.homedir(),
    '.sleek-atm-simulation',
    'config.json'
)

function getDbConfig(): DbConfig {
    try {
        if (!fs.existsSync(configPath)) {
            log.error(
                `Config file not found at ${configPath}.\nRun 'sleek-atm-simulation configure-db' first to configure the db connection info.`
            )
            process.exit(1)
        }

        const raw = fs.readFileSync(configPath, 'utf8')
        const config = JSON.parse(raw)

        const required = ['host', 'port', 'user', 'database']
        for (const key of required) {
            if (!config[key]) {
                log.error(`Missing '${key}' in DB config.`)
            }
        }

        return config
    } catch (error) {
        log.error(error.message)
        process.exit(1)
    }
}

export function getDB() {
    const dbConfig = getDbConfig()
    return knex({
        client: 'mysql2',
        connection: {
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
        },
    })
}

export async function init() {
    console.log(chalk.bgBlue.white('WARNING: ONLY SUPPORTED MYSQL DATABASE'))
    getDB().transaction(async (trx) => {
        try {
            const accountsTableExist = await trx.schema.hasTable('accounts')

            if (!accountsTableExist) {
                await trx.schema
                    .createTable('accounts', function (table) {
                        table.increments('id').primary()
                        table.string('name').notNullable()
                        table.string('pin').notNullable()
                        table.decimal('balance', 10, 2).notNullable()
                        table.timestamp('created_at').defaultTo(trx.fn.now())
                    })
                    .transacting(trx)

                console.log('accounts table created')
            } else console.log('accounts table already exists')

            const transactionsTableExist = await trx.schema.hasTable(
                'transactions'
            )

            if (!transactionsTableExist) {
                await trx.schema
                    .createTable('transactions', function (table) {
                        table.increments('id').primary()
                        table.integer('account_id').unsigned().notNullable()
                        table.decimal('amount', 10, 2).notNullable()
                        table.string('type').notNullable()
                        table.integer('target_id').nullable().defaultTo(null)
                        table.timestamp('created_at').defaultTo(trx.fn.now())
                        table
                            .foreign('account_id')
                            .references('id')
                            .inTable('accounts')
                    })
                    .transacting(trx)

                console.log('transactions table created')
            } else console.log('transactions table already exists')

            process.exit(0)
        } catch (error) {
            trx.rollback()
            console.log('Error initializing database')
            console.log(error)
            process.exit(1)
        }
    })
}

export async function checkDBExsistence(): Promise<boolean> {
    try {
        await getDB().raw('SELECT 1')
        await getDB().raw('SELECT id FROM accounts LIMIT 1')
        await getDB().raw('SELECT id FROM transactions LIMIT 1')

        return true
    } catch (error) {
        switch (error.errno) {
            case 1049:
                throw new Error(
                    'MYSQL Database "atm_simulation" doesn\'t exist. Please create it.'
                )
            case 1146:
                throw new Error("Table accounts and transactions doesn't exist")
            default:
                break
        }
    }
}
