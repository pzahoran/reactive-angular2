interface Failure {
    error: any;
}

interface Success<T> {
    success: T;
}

export type Result<T> = Failure | Success<T>;

export function fail<T>(error: any): Result<T> {
    return {error: error};
}

export function success<T>(value: T): Result<T> {
    return {success: value};
}

export function succeeded<T>(res: Result<T>): res is Success<T> {
    return (res as Success<T>).success !== undefined;
}