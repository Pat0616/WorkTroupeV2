import express from 'express'
 
import {
  list,
  create,
  getOne,
  join,
  remove,
} from '../controllers/groupController.js'

const groupRouter = express.Router();

groupRouter.get('/groups', list)
groupRouter.post('/groups', create)
groupRouter.get('/groups/:id', getOne)
groupRouter.post('/groups/join', join)
groupRouter.delete('/groups/:id', remove)

export default groupRouter;