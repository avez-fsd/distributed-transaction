import CustomException from "./custom.exception";

export default class NotFoundException extends CustomException {
  constructor(message: string, requestId?: string, spSessionId?: string) {
    super(message, requestId, spSessionId, 404, false);
  }
}
