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
    oldStatusSchema,
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
import {oldStatusValidator, statusValidator} from '../middleware/personValidator';
import {RoleEnum} from '../utils/enum/Role.enum';
import StatusCode from 'status-code-enum';
import {Role} from '@prisma/client';


const personRouter: Router = Router();

const personService = container.get<PersonService>(PersonService);

// @route GET api/people
personRouter.route('/')
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const people = await personService.getPeople();
            res.json(people);
        })
    )
    .post(
        ...authMiddleware(RoleEnum.HR),
        statusValidator({
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

personRouter.route('/join')
    .post(
        ...authMiddleware(),
        statusValidator({
            statusSchema,
            NEWCOMER: newcomerCreateSchema
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
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const person = await personService.getPersonById(Number(req.params.id));
            res.json(person);
        })
    )
    .patch(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        statusValidator({
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
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const person = await personService.deletePersonById(Number(req.params.id));
            res.json(person);
        })
    );

// @route  GET api/people/:id/status
personRouter.route('/:id/status')
    .put(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        oldStatusValidator({
            oldStatusSchema,
            NEWCOMER: statusUpdateSchemaToMaliuk,
            MALIUK: statusUpdateSchema,
            BRATCHYK: statusUpdateSchema,
            POSHANOVANYI: statusUpdateSchema,
            EX_BRATCHYK: statusUpdateSchema
        }),
        asyncHandler(async (req: Request, res: Response) => {
            const {id} = req.params;
            const updatedPerson = await personService.updateStatus(Number(id), req.body.newStatus, req.body.date);
            res.json(updatedPerson);
        })
    );

// @route  GET api/people/roles
personRouter.route('/roles')
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
        asyncHandler(async (req: Request, res: Response) => {
            const roles = Object.keys(Role).filter((role) => {
                return isNaN(Number(role));
            });
            console.log(roles);
            res.json(roles);
        })
    );

export default personRouter;
