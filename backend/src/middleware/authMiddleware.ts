import {NextFunction, Response} from 'express';
import passport from 'passport';
import {UserService} from '../services/UserService';
import {container} from '../config/container';
import {ApiError} from '../models/ApiError';
import {ITokenPayload} from 'passport-azure-ad';
import StatusCode from 'status-code-enum';
import {RoleEnum} from "../utils/enum/Role.enum";

//Array is made to use 2 middlewares in one class
//Return array should be destructured
const userService = container.get<UserService>(UserService);

export default (...roles: string[]) => {
    const handler = async ({authInfo}: { authInfo: ITokenPayload }, res: Response, next: NextFunction) => {
        const user = await userService.getUserByEmail(authInfo.preferred_username!);
        console.log(user);
        console.log(roles);
        if (!user || !roles.includes(user.role)) {
            return res.status(StatusCode.ClientErrorUnauthorized).json({error: ApiError.notFound('Not Authorized')});
        }

        return next();
    };

    return [passport.authenticate('oauth-bearer', {session: false}), handler];

};
