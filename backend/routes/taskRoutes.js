import express from 'express'
 
 import {
    list,
  create,
  update,
  remove,
  getComments,
  addComment,
  dashboard,
} from '../controllers/taskController'


const taskRouter = express.Router();

taskRouter.get('/groups/:groupId/tasks', list)
taskRouter.get('/groups/:groupId/tasks/:taskId/comments', getComments)
taskRouter.get('/groups/:groupId/dashboard', dashboard)
taskRouter.post('/groups/:groupId/tasks', create)
taskRouter.post('/groups/:groupId/tasks/:taskId/comments', addComment)
taskRouter.put('/groups/:groupId/tasks/:taskId', update)
taskRouter.delete('/groups/:groupId/dashboard', remove)

export default taskRouter;