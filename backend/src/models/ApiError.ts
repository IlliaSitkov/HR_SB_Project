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
        return new ApiError(400, msg);
    }

    static notFound(msg: string) {
        return new ApiError(404, msg);
    }

    static internal(msg: string) {
        return new ApiError(500, msg);
    }
}
