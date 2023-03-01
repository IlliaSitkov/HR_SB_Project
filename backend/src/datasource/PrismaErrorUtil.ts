import {injectable} from 'inversify';
import {PrismaErrorCode} from './PrismaErrorCode';

@injectable()
export class PrismaErrorUtil {

    isNotFound(e: any) {
        return e.code === PrismaErrorCode.RecordNotFound
            || e.code === PrismaErrorCode.DependencyNotFound
            || e.name === 'NotFoundError';
    }

    isUniqueConstraintViolation(e: any) {
        return e.code === PrismaErrorCode.UniqueConstraintViolation;
    }

    isRelationViolation(e: any){
        return e.code === PrismaErrorCode.RelationViolation;
    }
}
