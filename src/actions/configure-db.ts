import { text, password as passPrompt, isCancel, outro } from '@clack/prompts'
import fs from 'fs'
import os from 'os'
import path from 'path'

const configDir = path.join(os.homedir(), '.sleek-atm-simulation')
const configPath = path.join(configDir, 'config.json')

async function configureDb() {
    const host = await text({
        message: 'Enter MySQL host:',
        initialValue: 'localhost',
        validate: (val) => (!val ? 'Host is required' : undefined),
    })

    const port = await text({
        message: 'Enter MySQL port:',
        initialValue: '3306',
        validate: (val) =>
            isNaN(parseInt(val)) ? 'Port must be a number' : undefined,
    })

    const user = await text({
        message: 'Enter MySQL username:',
        placeholder: 'root',
        initialValue: 'root',
        validate: (val) => (!val ? 'Username is required' : undefined),
    })

    const password = await passPrompt({
        message: 'Enter MySQL password, leave it blank if its an empty string:',
        mask: '*',
    })

    const database = await text({
        message: 'Enter database name:',
        placeholder: 'atm_simulation',
        initialValue: 'atm_simulation',
        validate: (val) => (!val ? 'Database name is required' : undefined),
    })

    if ([host, port, user, password, database].some(isCancel)) {
        outro('Configuration cancelled.')
        return
    }

    const config = {
        host,
        port,
        user,
        password: password ?? '',
        database,
    }

    fs.mkdirSync(configDir, { recursive: true })
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    outro(`✅ Database configuration saved to ${configPath}`)
    process.exit(0)
}

export default configureDb
