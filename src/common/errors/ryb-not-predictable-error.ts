export class RybNotPredictableError extends Error {
  constructor(message = 'Something went wrong') {
    super(message)
  }
}
