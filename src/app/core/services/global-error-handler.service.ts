import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {

  constructor() { super(); }
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    } else { super.handleError(error); }
  }
}
