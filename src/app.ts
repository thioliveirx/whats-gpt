import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import { sendWhatsappMessage } from "./services/twilio.js"
import { getOpenAICompletion } from "./services/openai.js"

dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())


app.post('/chat/send', async (req, res) =>{
    const {to, body} = req.body
    try {
        await sendWhatsappMessage(to, body)
        res.status(200).json({success: true, body})
    }catch (error) {
        res.status(500).json({sucess: false, error})
    }
})

app.post('/chat/receive', async (req, res) => {
    const twilioRequestBody = req.body 
    const messageBody = twilioRequestBody.Body
    const to = twilioRequestBody.From

    console.log('Incoming Twilio webhook body:', twilioRequestBody)

    try {
        const completion = await getOpenAICompletion(messageBody)

        await sendWhatsappMessage(to, completion)
        res.status(200).json({success: true, messageBody})

    } catch (error) {
        console.error('Error handling incoming message:', error)
        res.status(500).json({sucess: false, error})
    }

})



app.get('/', (req, res) => {
    res.send('<h1>Whats-GPT</h1><p>API running — use POST /chat/send</p>')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`O servidor está rodando na porta: ${port}`)
})