export type Constructable<
  T extends { [key in keyof T]: unknown } = unknown
> = new (...args: unknown[]) => T;
