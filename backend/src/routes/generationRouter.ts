import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {requestValidator} from '../middleware/requestMiddleware';
import {generationSchema} from '../validators/generationSchema';
import {idSchema} from '../validators/idSchema';
import authMiddleware from '../middleware/authMiddleware';
import {container} from '../config/container';
import {GenerationService} from '../services/GenerationService';
import {RoleEnum} from '../utils/enum/Role.enum';

const generationRouter:Router = Router();

const generationService = container.get<GenerationService>(GenerationService);

// @route GET api/generations
generationRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const generations = await generationService.getGenerations();
            res.json(generations);
        })
    )
    .post(
        /*authorize()*/
        ...authMiddleware(RoleEnum.HR),
        requestValidator(generationSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const generationDTO = generationService.checkAndFormatGenerationData(req.body);
            const newGeneration = await generationService.createGeneration(generationDTO);
            res.json(newGeneration);
        })
    );

// @route  GET api/generations/:id
generationRouter.route('/:id')
    .get(
        /*authorize()*/
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const generation = await generationService.getGenerationById(Number(req.params.id));
            res.json(generation);
        })
    )
    .put(
        /*authorize()*/
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        requestValidator(generationSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const generationDTO = generationService.checkAndFormatGenerationData(req.body);
            const updatedGeneration = await generationService.updateGeneration(Number(req.params.id), generationDTO);
            res.json(updatedGeneration);
        })
    )
    .delete(
        /*authorize()*/
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const generation = await generationService.deleteGenerationById(Number(req.params.id));
            res.json(generation);
        })
    );

export default generationRouter;
