/// <reference types="nativewind/types" />

// Side-effect CSS imports (NativeWind's global stylesheet) are resolved by the
// Metro/NativeWind transformer, not by tsc. Declare them so typechecking passes.
declare module "*.css";
