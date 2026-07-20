import { Result } from "../utils/Result";
import { AppError } from "../errors/AppError";

export interface NavigationGuard {
  canActivate(route: string): Promise<Result<boolean, AppError>>;
}

export class AuthGuardPlaceholder implements NavigationGuard {
  public async canActivate(_route: string): Promise<Result<boolean, AppError>> {
    // Placeholder guard allowing all transitions for now
    return Result.ok(true);
  }
}
