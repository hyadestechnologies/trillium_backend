import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import {
  IS_PUBLIC_KEY,
  IS_OPTIONAL_KEY,
} from 'src/decorators/public-decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if the api is optional (declared with `@Optional`) req.user will be valorized with
    // the user id and username if authentication token is provided, false otherwise
    if (isOptional) {
      return user;
    }
    return super.handleRequest(err, user, info, context);
  }
}
