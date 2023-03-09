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
import {ITokenPayload} from 'passport-azure-ad';
import {emailSchema} from '../validators/emailSchema';

const userRouter: Router = Router();

const userService = container.get<UserService>(UserService);

userRouter.route('/me')
    //Get my user
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER, RoleEnum.NEWCOMER),
        asyncHandler(async (req: Request, res: Response) => {
            const user = await userService.getUserByEmail((req.authInfo as ITokenPayload).preferred_username!);
            res.status(StatusCode.SuccessOK).json(user);
        })
    );

userRouter.route('/')
    //Get all users
    .get(
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
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
        ...authMiddleware(RoleEnum.HR, RoleEnum.USER),
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

userRouter.route('/by_email/:email')
    .get(
        ...authMiddleware(RoleEnum.HR),
        requestValidator(emailSchema, 'params'),
        asyncHandler(async (req: Request, res: Response) => {
            const user = await userService.getUserByEmail(req.params.email);
            res.status(StatusCode.SuccessOK).json(user);
        })
    );

export default userRouter;
