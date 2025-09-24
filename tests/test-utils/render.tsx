import React, { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/shared/theme-provider";

// Simple wrapper: extiende si necesitas contextos adicionales en el futuro
export function renderWithProviders(ui: ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {ui}
    </ThemeProvider>
  );
}
