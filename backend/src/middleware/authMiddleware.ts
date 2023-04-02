import {NextFunction, Request, Response} from 'express';
import passport from 'passport';
import {UserService} from '../services/UserService';
import {container} from '../config/container';
import {ApiError} from '../models/ApiError';
import {ITokenPayload} from 'passport-azure-ad';
import StatusCode from 'status-code-enum';
import {User} from '../models/User';
import {RoleEnum} from '../utils/enum/Role.enum';

//Array is made to use 2 middlewares in one class
//Return array should be destructured
const userService = container.get<UserService>(UserService);

export default (...roles: string[]) => {
    const handler = async (req: Request, res: Response, next: NextFunction) => {
        const authInfo: ITokenPayload = req.authInfo!;
        const user = await userService.getUserByEmail(authInfo.preferred_username!);
        console.log(user);
        console.log(roles);
        if (roles.length > 0) {
            if (!user || !roles.includes(user.role)) {
                return res.status(StatusCode.ClientErrorUnauthorized).json({error: ApiError.notFound('Not Authorized')});
            }
            req.user = user;
        }
        return next();
    };

    return [passport.authenticate('oauth-bearer', {session: false}), handler];

};

export const newcomerAccessMiddleware = (isId: boolean) =>
    (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        const user: User = req.user!;
        const id = isId ? Number(req.params.id) : Number(req.query.personId);
        if (user.role === RoleEnum.NEWCOMER) {
            if (user.personId !== id) {
                throw ApiError.accessForbidden('Доступ заборонений для Новенького');
            }
        }
        next();
    };
