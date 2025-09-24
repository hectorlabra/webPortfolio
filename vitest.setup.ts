import "@testing-library/jest-dom";
import React from "react";
// Expose React globally for components expecting it (test environment)
// @ts-ignore
global.React = React;

// Polyfills or globals extras (si son necesarios en el futuro)
if (typeof window !== "undefined" && !window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
