export class RybNoChangesError extends Error {
  private readonly status = 'NO_CHANGES'

  constructor(message = 'No changes') {
    super(message)
  }

  getStatus() {
    return this.status
  }
}
