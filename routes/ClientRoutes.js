import express from 'express';
import { createClient, getClients } from '../controllers/clientController.js'
import { protect} from '../middleware/middleware.js'

const router = express.Router()

router.route('/')
.post(protect. createClient)
.get(protect, getClients)

export default router;