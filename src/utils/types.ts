export type Constructable<T extends { [key in keyof T]: any } = any> = new (...args: any[]) => T;
