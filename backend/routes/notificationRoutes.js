import express from 'express'
 
 import {
    list,
  markRead,
  markAllRead,
} from '../controllers/notificationController.js'

const notificationRouter = express.Router();

notificationRouter.get('/notifications', list)
notificationRouter.put('/notifications/read-all', markAllRead)
notificationRouter.put('/notifications/:id/read', markRead)

export default notificationRouter;