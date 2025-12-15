import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) console.error('Missing OPENAI_API_KEY in environment')

const client = new OpenAI({ apiKey })

export const getOpenAICompletion = async (input: string): Promise<string> => {
    try {
        const completion = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: input }],
        })

        const choice = (completion as any).choices?.[0]
        const content = choice?.message?.content ?? choice?.text ?? ''
        return content as string
    } catch (error: any) {
        console.error('Error completing input:', error?.message ?? error)
        return ''
    }
}