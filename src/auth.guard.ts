import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  /**
   * The valid API token for authentication
   * By default, set to 'token123' if not provided in environment variables
   * If you want to change it, set the API_TOKEN environment variable in the .env file
   */
  private readonly validToken = process.env.API_TOKEN || 'token123';

  validateRequest(token: string | undefined): boolean {
    return token !== undefined && token === `${this.validToken}`;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    return this.validateRequest(token);
  }
}