// Temporary ambient declarations to suppress TS errors in editor when
// `node_modules` (react/next) are not installed in this environment.
// These are minimal shims for development convenience only — install
// real dependencies (`npm install`) and remove this file afterwards.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
  type PropsWithChildren<P> = P & { children?: ReactNode };
  type FC<P = {}> = (props: PropsWithChildren<P>) => any;
  type ComponentType<P = {}> = FC<P>;
}

declare module 'react' {
  export type ReactNode = React.ReactNode;
  export type PropsWithChildren<P> = React.PropsWithChildren<P>;
  export type FC<P = {}> = React.FC<P>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export const Fragment: any;
  export function useState<T = any>(initial?: T): [T, (v: any) => void];
  export function useEffect(...args: any[]): any;
  const React: {
    FC: React.FC<any>;
    Fragment: any;
  } & any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export function jsxDEV(type: any, props?: any, key?: any): any;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}
