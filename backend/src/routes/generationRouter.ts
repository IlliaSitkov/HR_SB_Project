import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {requestValidator} from '../middleware/requestMiddleware';
import {generationSchema} from '../validators/generationSchema';
import {idSchema} from '../validators/idSchema';
import {container} from '../config/container';
import {GenerationService} from '../services/GenerationService';

export const generationRouter = Router();

const generationService = container.get<GenerationService>(GenerationService);

// @route GET api/generations
generationRouter.route('/')
    .get(
        asyncHandler(async (req: Request, res: Response) => {
            const generations = await generationService.getGenerations();
            res.json(generations);
        })
    )
    .post(
        /*authorize()*/
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
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const generation = await generationService.getGenerationById(Number(req.params.id));
            res.json(generation);
        })
    )
    .put(
        /*authorize()*/
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
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const generation = await generationService.deleteGenerationById(Number(req.params.id));
            res.json(generation);
        })
    );
