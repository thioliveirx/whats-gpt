import twilio from 'twilio'
import dotenv from "dotenv"

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER

if (!accountSid || !authToken) {
    console.warn('Twilio credentials are missing (TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN)')
}

const client = twilio(accountSid as string, authToken as string)

function cleanNumber(raw?: string) {
    if (!raw) return ''
    return raw.trim().replace(/^whatsapp:/i, '')
}

export const sendWhatsappMessage = async (to: string, body: string): Promise<any> => {
    const fromClean = cleanNumber(whatsappPhoneNumber)
    const toClean = cleanNumber(to)

    const from = fromClean ? `whatsapp:${fromClean}` : ''
    const toFinal = toClean ? `whatsapp:${toClean}` : ''

    console.log('Twilio send — from=', from, 'to=', toFinal, 'body=', body)

    if (!fromClean) {
        console.error('Missing WHATSAPP_PHONE_NUMBER in env or it is empty')
        throw new Error('Missing WHATSAPP_PHONE_NUMBER')
    }
    if (!toClean) {
        console.error('Invalid `to` number provided to sendWhatsappMessage:', to)
        throw new Error('Invalid to number')
    }

    try {
        const msg: any = await client.messages.create({
            from,
            to: toFinal,
            body,
        })
        console.log('Twilio message sent:', { sid: msg.sid, status: msg.status })
        return msg
    } catch (error: any) {
        console.error(`Error sending message to ${toFinal}:`, error.message ?? error)
        throw error
    }
}