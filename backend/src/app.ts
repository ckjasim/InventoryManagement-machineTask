import express, { json } from 'express'
import 'express-async-errors'

import {
    singinRouter,
    singupRouter,
    singoutRouter,
    currentUserRouter,

    salesRouter,
    emailRouter,
    customerRouter,
    itemRouter,
} from './routes/index'
import { errorhandler } from './middlewares/error-handler'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'
const app = express()


app.use(json())

app.use(cookieSession({
    signed: false
    , secure: false
}))
app.use(cors({ origin:process.env.CLIENT_PORT, 
    credentials: true}))
app.use(customerRouter)
app.use(itemRouter)
app.use(salesRouter)

app.use(currentUserRouter)
app.use(singinRouter)
app.use(singoutRouter)
app.use(singupRouter)
app.use(emailRouter)
app.all('*', async () => {
    throw new NotFoundError();
})
app.use(errorhandler as express.ErrorRequestHandler)
export { app }