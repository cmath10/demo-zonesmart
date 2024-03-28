export default class UnauthorizedHttpError extends Error {
  constructor (message: string) {
    super(message)
  }
}
