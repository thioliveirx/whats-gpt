import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { sendWhatsappMessage } from "./services/twilio.js"

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

app.get('/', (req, res) => {
    res.send('<h1>Whats-GPT</h1><p>API running — use POST /chat/send</p>')
})

const port = 3000

app.listen(port, () => {
    console.log(`O servidor está rodando na porta: ${port}`)
})