import StatusCode from 'status-code-enum';

export class ApiError extends Error {

    private readonly _code : number;

    constructor(code: number, message: string) {
        super();
        this._code = code;
        this.message = message;
    }

    get code(): number {
        return this._code;
    }

    static badRequest(msg: string) {
        return new ApiError(StatusCode.ClientErrorBadRequest, msg);
    }

    static notFound(msg: string) {
        return new ApiError(StatusCode.ClientErrorNotFound, msg);
    }

    static accessForbidden(msg: string) {
        return new ApiError(StatusCode.ClientErrorForbidden, msg);
    }

    static internal(msg: string) {
        return new ApiError(StatusCode.ServerErrorInternal, msg);
    }
}
