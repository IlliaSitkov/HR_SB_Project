import {Router} from 'express';

const router:Router = Router();

import {generationRouter} from './generationRouter';
import {categoryRouter} from "./categoryRouter";

router.use('/generations', generationRouter);
router.use('/categories', categoryRouter);

export default router;
