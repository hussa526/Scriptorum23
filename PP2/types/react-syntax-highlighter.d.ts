// src/types/react-syntax-highlighter.d.ts

declare module 'react-syntax-highlighter/dist/cjs' {
    import { ComponentType } from 'react';

    // Export the necessary components
    export const Light: ComponentType<any>;
    export const Dark: ComponentType<any>;
}

types/react-syntax-highlighter.d.ts
declare module 'react-syntax-highlighter/dist/esm' {
    export * from 'react-syntax-highlighter';
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
    export * from 'react-syntax-highlighter';
}