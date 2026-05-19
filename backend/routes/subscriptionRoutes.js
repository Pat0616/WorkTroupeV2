import express from 'express'
 
 import {
    subscribe,
  getMy,
} from '../controllers/subscriptionController.js'


const subscriptionRouter = express.Router();

subscriptionRouter.post('/subscriptions/subscribe', subscribe)
subscriptionRouter.get('/subscriptions/my', getMy)

export default subscriptionRouter;