import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async send(
    devicePushToken: string | null | undefined,
    payload: Record<string, unknown>,
  ) {
    // stub: log push. Replace with real FCM/APNs integration later.
    this.logger.log(
      `Push send to token=${devicePushToken} payload=${JSON.stringify(payload)}`,
    );
    // simulate success
    return { ok: true };
  }
}
