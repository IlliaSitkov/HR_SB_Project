import {Request, Response, Router} from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {RoleEnum} from '../utils/enum/Role.enum';
import asyncHandler from 'express-async-handler';
import {container} from '../config/container';
import {UserService} from '../services/UserService';
import StatusCode from 'status-code-enum';
import {requestValidator} from '../middleware/requestMiddleware';
import {addUserSchema, updateUserSchema} from '../validators/userSchema';
import {User} from '../models/User';
import {idSchema} from '../validators/idSchema';

const userRouter: Router = Router();

const userService = container.get<UserService>(UserService);

userRouter.route('/')
    //Get all users
    .get(
        ...authMiddleware(RoleEnum.HR),
        asyncHandler(async (req: Request, res: Response) => {
            const users = await userService.getAll();
            res.status(StatusCode.SuccessOK).json(users);
        })
    )
    //Add user
    .post(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(addUserSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const user: User = await userService.add(req.body);
            res.status(StatusCode.SuccessOK).json(user);
        })
    );

userRouter.route('/:id')
    //Update a user
    .put(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        requestValidator(updateUserSchema, 'body'),
        asyncHandler(async (req: Request, res: Response) => {
            const user = await userService.update({id: +req.params.id, ...req.body});
            res.status(StatusCode.SuccessOK).json(user);
        })
    )
    //Get user
    .get(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const user = await userService.getById(+req.params.id);
            if(user) {
                res.status(StatusCode.SuccessOK).json(user);
            } else {
                res.status(StatusCode.ClientErrorNotFound).send('User not found');
            }
        })
    )
    //Add user
    .delete(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(idSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const user: User = await userService.deleteById(+req.params.id);
            res.status(StatusCode.SuccessOK).json(user);
        })
    );

export default userRouter;
