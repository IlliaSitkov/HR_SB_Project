import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {requestValidator} from '../middleware/requestMiddleware';
import {
    bratchykCreateSchema,
    bratchykUpdateSchema,
    exBratchykCreateSchema,
    exBratchykUpdateSchema,
    maliukCreateSchema,
    maliukUpdateSchema,
    newcomerCreateSchema,
    newcomerUpdateSchema,
    poshanovanyiCreateSchema,
    poshanovanyiUpdateSchema,
    statusSchema,
    statusUpdateSchema,
    statusUpdateSchemaToMaliuk
} from '../validators/personSchema';
import {idSchema} from '../validators/idSchema';
import authMiddleware from '../middleware/authMiddleware';
import {container} from '../config/container';
import {PersonService} from '../services/PersonService';
import {personValidator} from '../middleware/personValidator';
import {RoleEnum} from '../utils/enum/Role.enum';
import StatusCode from 'status-code-enum';


const personRouter: Router = Router();

const personService = container.get<PersonService>(PersonService);

// @route GET api/people
personRouter.route('/')
    .get(
        ...authMiddleware(),
        asyncHandler(async (req: Request, res: Response) => {
            const people = await personService.getPeople();
            res.json(people);
        })
    )
    .post(
        /*authorize()*/
        ...authMiddleware(),
        personValidator({
            statusSchema,
            NEWCOMER: newcomerCreateSchema,
            MALIUK: maliukCreateSchema,
            BRATCHYK: bratchykCreateSchema,
            POSHANOVANYI: poshanovanyiCreateSchema,
            EX_BRATCHYK: exBratchykCreateSchema
        }),
        asyncHandler(async (req: Request, res: Response) => {
            const personDTO = await personService.checkAndFormatPersonData(req.body);
            const newPerson = await personService.createPerson(personDTO);
            res.json(newPerson);
        })
    );

personRouter.route('/sync-birthdays')
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            try {
                await personService.syncAllBirthdays();
                res.status(StatusCode.SuccessOK).send('Success');
            } catch (e) {
                console.log(e);
                res.status(StatusCode.ServerErrorInternal).send('Error has happened');
            }
        })
    );

personRouter.route('/nearestBirthdays')
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            try {
                const nearestBirthdays = await personService.nearestBirthdays();
                res.status(StatusCode.SuccessOK).json(nearestBirthdays);
            } catch (e){
                console.log(e);
                res.status(StatusCode.ServerErrorInternal).send('Error has happened');
            }
        })
    );

// @route  GET api/people/:id
personRouter.route('/:id')
    .get(
        /*authorize()*/
        ...authMiddleware(),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const person = await personService.getPersonById(Number(req.params.id));
            res.json(person);
        })
    )
    .patch(
        /*authorize()*/
        ...authMiddleware(),
        requestValidator(idSchema, 'params'),
        personValidator({
            statusSchema,
            NEWCOMER: newcomerUpdateSchema,
            MALIUK: maliukUpdateSchema,
            BRATCHYK: bratchykUpdateSchema,
            POSHANOVANYI: poshanovanyiUpdateSchema,
            EX_BRATCHYK: exBratchykUpdateSchema
        }),
        asyncHandler(async (req: Request, res: Response) => {
            const personDTO = await personService.checkAndFormatPersonData(req.body);
            const updatedPerson = await personService.updatePerson(Number(req.params.id), personDTO);
            res.json(updatedPerson);
        })
    )
    .delete(
        /*authorize()*/
        ...authMiddleware(),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const person = await personService.deletePersonById(Number(req.params.id));
            res.json(person);
        })
    );

// @route  GET api/people/:id/status
personRouter.route('/:id/status')
    .put(
        /*authorize()*/
        ...authMiddleware(),
        requestValidator(idSchema, 'params'),
        personValidator({
            statusSchema,
            NEWCOMER: statusUpdateSchemaToMaliuk,
            MALIUK: statusUpdateSchemaToMaliuk,
            BRATCHYK: statusUpdateSchema,
            POSHANOVANYI: statusUpdateSchema,
            EX_BRATCHYK: statusUpdateSchema
        }),
        asyncHandler(async (req: Request, res: Response) => {
            const {id} = req.params;
            const updatedPerson = await personService.updateStatus(Number(id), req.body.status, req.body.date);
            res.json(updatedPerson);
        })
    );

export default personRouter;
