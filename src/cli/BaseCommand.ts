import { Logger } from '@/core/Logger';
import { Inject } from '@/di/InjectDecorator';

export abstract class BaseCommand {
  constructor(@Inject(Logger) protected readonly logger: Logger) {}

  abstract doExecute(...args: any[]): Promise<void>;

  async execute(...args: any[]): Promise<void> {
    try {
      await this.doExecute(...args);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
      }
    }
  }
}
