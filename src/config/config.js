const { base64encode, base64decode } = require('nodejs-base64');
import 'dotenv/config'
export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${base64encode(process.env.BASIC_USERNAME+':'+process.env.BASIC_PASSWORD)}`
}