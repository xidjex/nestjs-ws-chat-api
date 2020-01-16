export class UserAlreadyExistException extends Error {
    name = this.constructor.name;
}
