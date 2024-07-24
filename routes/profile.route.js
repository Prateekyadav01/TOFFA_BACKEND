import {Router} from 'express'
import { updateProfile } from '../controller/profile.controller';
import { authVerifyMiddleware } from '../middleware/auth.middleware';

const router = Router();


router.route('/updateProfile').post(authVerifyMiddleware,updateProfile);