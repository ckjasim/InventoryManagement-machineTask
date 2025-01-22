import express, { json } from 'express'
import 'express-async-errors'

import {
    singinRouter,
    singupRouter,
    singoutRouter,
    currentUserRouter,
    createItemRouter,
    allItemRouter,
    editItemRouter,
    getEachItemRouter,
    createCustomerRouter,
    AllCustomerRouter,
    placeorderRouter,
    editCustomerRouter,
    salesReportRouter,
    editSalesRouter,
    deleteSaleRouter
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
app.use(currentUserRouter)
app.use(singinRouter)
app.use(singoutRouter)
app.use(singupRouter)
app.use(createItemRouter)
app.use(allItemRouter)
app.use(editItemRouter)
app.use(getEachItemRouter)
app.use(createCustomerRouter)
app.use(AllCustomerRouter)
app.use(placeorderRouter)
app.use(editCustomerRouter)
app.use(salesReportRouter)
app.use(editSalesRouter)
app.use(deleteSaleRouter)
app.all('*', async () => {
    throw new NotFoundError();
})
app.use(errorhandler as express.ErrorRequestHandler)
export { app }