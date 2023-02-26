import {Router} from 'express';

const router:Router = Router();

import {generationRouter} from './generationRouter';
import {categoryRouter} from './categoryRouter';
import {personRouter} from "./personRouter";

router.use('/generations', generationRouter);
router.use('/categories', categoryRouter);
router.use('/people', personRouter);

export default router;
