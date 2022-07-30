import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';
import { AUTH_SERVICE } from './auth.module';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return this.authClient
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap((res) => {
          this.addUser(context, res);
        }),
        catchError((err) => {
          throw new UnauthorizedException(
            'Invalid token' + JSON.stringify(err),
          );
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authetication;
    }
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    }
    if (!authentication) {
      throw new Error('No authentication was provided');
    }
    return authentication;
  }

  private addUser(context: ExecutionContext, user: any): void {
    if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    }
  }
}
