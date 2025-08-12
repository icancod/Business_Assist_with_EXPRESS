import express from 'express'
import { getdata } from './getdata.js'
import { getdatabypath } from './getdatabypath.js'

export const apiRouter = express.Router()

apiRouter.get('/',getdata)
apiRouter.get('/:field/:term',getdatabypath)