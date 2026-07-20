type DependencyFactory = () => unknown;

export class Container {
  private static instance: Container;
  private readonly registry = new Map<
    string,
    {
      factory: DependencyFactory;
      isSingleton: boolean;
      value?: unknown;
    }
  >();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register(token: string, value: unknown): void {
    this.registry.set(token, {
      factory: () => value,
      isSingleton: true,
      value,
    });
  }

  public singleton(token: string, factory: DependencyFactory): void {
    this.registry.set(token, {
      factory,
      isSingleton: true,
    });
  }

  public factory(token: string, factory: DependencyFactory): void {
    this.registry.set(token, {
      factory,
      isSingleton: false,
    });
  }

  public resolve<T>(token: string): T {
    const registration = this.registry.get(token);
    if (!registration) {
      throw new Error(`Dependency for token "${token}" is not registered.`);
    }

    if (registration.isSingleton) {
      if (registration.value === undefined) {
        registration.value = registration.factory();
      }
      return registration.value as T;
    }

    return registration.factory() as T;
  }

  public clear(): void {
    this.registry.clear();
  }
}
