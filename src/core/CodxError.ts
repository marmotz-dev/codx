export class CodxError extends Error {
  constructor(message: string, previous?: unknown) {
    super(getMessage(message, previous));

    this.name = 'CodxError';
  }
}

function getMessage(message: string, previous?: unknown) {
  if (previous) {
    if (previous instanceof Error) {
      message += `: ${previous.message}`;
    } else if (typeof previous === 'string') {
      message += `: ${previous}`;
    } else {
      message += `: ${JSON.stringify(previous)}`;
    }
  }

  return message;
}
