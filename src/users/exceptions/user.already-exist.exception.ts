export class UserAlreadyExistException extends Error {
  constructor(...params) {
    super(...params);

    this.name = 'UserAlreadyExistException';
  }
}
