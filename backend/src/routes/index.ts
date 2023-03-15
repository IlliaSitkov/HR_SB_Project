import {Router} from 'express';

const router:Router = Router();

import generationRouter from './generationRouter';
import {categoryRouter} from "./categoryRouter";
import userRouter from './userRouter';
import personRouter from "./personRouter";
import {eventRouter} from "./eventRouter";

router.use('/generations', generationRouter);
router.use('/categories', categoryRouter);
router.use('/user', userRouter);
router.use('/people', personRouter);
router.use('/events', eventRouter);

export default router;
