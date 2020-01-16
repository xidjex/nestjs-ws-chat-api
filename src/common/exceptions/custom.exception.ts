export class CustomException extends Error {
  readonly name = this.constructor.name;
}
