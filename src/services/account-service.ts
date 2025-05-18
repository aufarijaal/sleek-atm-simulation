import { getDB } from '@/db'
import Session from '@/session'

async function register({
    name,
    pin,
    balance,
}: {
    name: string
    pin: string
    balance: number
}): Promise<number> {
    try {
        const result = await getDB().table('accounts').insert({
            name,
            pin,
            balance,
        })
        return result[0]
    } catch (error) {
        console.log('Error registering account')
        console.log(error)

        return -1
    }
}

async function login({
    id,
    pin,
}: {
    id: number
    pin: string
}): Promise<string> {
    try {
        const result = await getDB()
            .table('accounts')
            .select('name')
            .where({ id, pin })
            .first()

        if (!result) {
            throw new Error('Invalid id or PIN or account not found')
        }

        Session.loggedInId = id

        // return the name
        return result.name
    } catch (error) {
        throw new Error(error)
    }
}

async function checkBalance({ id }: { id: number }): Promise<number | null> {
    try {
        const result = await getDB()
            .table('accounts')
            .select('balance')
            .where({ id })
            .first()

        if (!result) {
            console.log('Account not found')
            return null
        }

        return result.balance
    } catch (error) {
        console.log('Error checking balance')
        return null
    }
}

async function findName(id: number): Promise<string | null> {
    try {
        const result = await getDB()
            .table('accounts')
            .select('name')
            .where({ id })
            .first()

        if (!result) {
            console.log('Account not found')
            return null
        }

        return result.name
    } catch (error) {
        console.log('Error finding account name')
        return null
    }
}

const accountService = {
    register,
    login,
    checkBalance,
    findName,
}
export default accountService
