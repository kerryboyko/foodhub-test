import { describe, it, expect } from "vitest";
import { helloWorld } from "./hello";

describe("helloWorld", () => {
  it("should return a greeting message", () => {
    const result = helloWorld("World");
    expect(result).toBe("Hello World!");
  });
});
