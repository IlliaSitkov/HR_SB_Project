import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import {requestValidator} from "../middleware/requestMiddleware";
import {generationSchema, idSchema} from "../validators/generationSchema";
import {container} from "../config/container";
import {GenerationService} from "../services/GenerationService";

export const generationRouter = Router();

const generationService = container.get<GenerationService>(GenerationService);

// @route GET api/generations
generationRouter.route("/")
    .get(
        asyncHandler(async (req: Request, res: Response) => {
            const generations = await generationService.getGenerations();
            res.json(generations);
        })
    )
    .post(
        /*authorize()*/
        requestValidator(generationSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const generationDTO = generationService.checkAndFormatGenerationData(req.body);
            const newGeneration = await generationService.createGeneration(generationDTO);
            res.json(newGeneration);
        })
    );

// @route  GET api/generations/:id
generationRouter.route("/:id")
    .get(
        /*authorize()*/
        requestValidator(idSchema, "params"),
        asyncHandler(async (req: Request, res: Response) => {
            const {id} = req.params;
            const generation = await generationService.getGenerationById(Number(id));
            res.json(generation);
        })
    )
    .put(
        /*authorize()*/
        requestValidator(idSchema, "params"),
        requestValidator(generationSchema, "body"),
        asyncHandler(async (req: Request, res: Response) => {
            const {id} = req.params;
            const generationDTO = generationService.checkAndFormatGenerationData(req.body);
            const updatedGeneration = await generationService.updateGeneration(Number(id), generationDTO);
            res.json(updatedGeneration);
        })
    )
    .delete(
        /*authorize()*/
        // requestValidator(idSchema, "params"),
        asyncHandler(async (req: Request, res: Response) => {
            const {id} = req.params;
            await generationService.deleteGenerationById(Number(id));
            res.json({message: "Success"});
        })
    );
