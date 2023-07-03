import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// because vitest does not inject globals,
// we have to manually clean up after react-testing-library
afterEach(() => {
  cleanup();
});
