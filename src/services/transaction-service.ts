import { getDB } from '@/db'

async function deposit({
    id,
    amount,
}: {
    id: number
    amount: number
}): Promise<boolean> {
    try {
        await getDB().transaction(async (trx) => {
            const result = await trx('accounts')
                .where({ id })
                .select('balance')
                .first()

            if (!result) {
                throw new Error('Account not found')
            }

            await trx('accounts')
                .where({ id })
                .update({ balance: parseInt(result.balance) + amount })

            await trx('transactions').insert({
                account_id: id,
                type: 'deposit',
                amount,
                target_id: null,
            })
        })

        return true
    } catch (error) {
        throw new Error(error)
    }
}

async function withdraw({
    id,
    amount,
}: {
    id: number
    amount: number
}): Promise<boolean> {
    try {
        await getDB().transaction(async (trx) => {
            const result = await getDB()
                .table('accounts')
                .where({ id })
                .select('balance')
                .first()

            if (!result) {
                throw new Error('Account not found')
            } else if (result.balance < amount) {
                throw new Error('Insufficient balance')
            }

            await getDB()
                .table('accounts')
                .where({ id })
                .update({ balance: result.balance - amount })

            await trx('transactions').insert({
                account_id: id,
                type: 'withdraw',
                amount,
                target_id: null,
            })
        })

        return true
    } catch (error) {
        throw new Error(error)
    }
}

async function transfer({
    from,
    to,
    amount,
}: {
    from: number
    to: number
    amount: number
}): Promise<boolean> {
    try {
        await getDB().transaction(async (trx) => {
            // Get the current balance from transferrer account
            const fromAccount = await trx('accounts')
                .where({ id: from })
                .select('balance')
                .first()

            // Get the current balance from recipient account
            const toAccount = await trx('accounts')
                .where({ id: to })
                .select('balance')
                .first()

            // Throw an error if there is an error finding account
            if (!fromAccount || !toAccount) {
                throw new Error('Error transferring money')
            }

            if (fromAccount.balance < amount) {
                throw new Error('Insufficient balance')
            }

            // Reduce the transferrer account's balance
            await trx('accounts')
                .where({ id: from })
                .update({ balance: parseInt(fromAccount.balance) - amount })

            // Reduce the transferrer account's balance
            await trx('accounts')
                .where({ id: to })
                .update({ balance: parseInt(toAccount.balance) + amount })

            // Add a new transfer_in record for the recipient
            await trx('transactions').insert({
                account_id: to,
                type: 'transfer_in',
                amount,
                target_id: null,
            })

            // Add a new transfer_out record for the transferrer
            await trx('transactions').insert({
                account_id: from,
                type: 'transfer_out',
                amount,
                target_id: to,
            })
        })

        return true
    } catch (error) {
        throw new Error(error)
    }
}

async function transactionHistory({ id }: { id: number }): Promise<void> {
    try {
        const result = await getDB()
            .table('transactions')
            .where({ account_id: id })
        console.log(result)
    } catch (error) {
        console.log('Error fetching transaction history')
    }
}

const transactionService = {
    deposit,
    withdraw,
    transfer,
    transactionHistory,
}

export default transactionService
