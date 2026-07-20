export class Result<T, E = Error> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
    public readonly isSuccess: boolean = true,
  ) {}

  public static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined, true);
  }

  public static fail<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error, false);
  }

  public getValueOrThrow(): T {
    if (!this.isSuccess) {
      throw this.error instanceof Error
        ? this.error
        : new Error(String(this.error));
    }
    return this.value!;
  }

  public getErrorOrThrow(): E {
    if (this.isSuccess) {
      throw new Error("Cannot get error from a successful Result.");
    }
    return this.error!;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

class Left<L, R> {
  readonly value: L;
  constructor(value: L) {
    this.value = value;
  }
  isLeft(): this is Left<L, R> {
    return true;
  }
  isRight(): this is Right<L, R> {
    return false;
  }
}

class Right<L, R> {
  readonly value: R;
  constructor(value: R) {
    this.value = value;
  }
  isLeft(): this is Left<L, R> {
    return false;
  }
  isRight(): this is Right<L, R> {
    return true;
  }
}

export const left = <L, R>(l: L): Either<L, R> => new Left(l);
export const right = <L, R>(r: R): Either<L, R> => new Right(r);
export type { Left, Right };
