import { describe, it, expect } from "vitest";

const { getRandomContent } = require("../../services/contentService");

describe("Content Service", () => {
  it("should retrieve random Islamic content successfully", async () => {
    const content = await getRandomContent();

    expect(content).toBeDefined();
    expect(content.type).toBe("hadith");
    expect(content.content).toBeTypeOf("string");
    expect(content.content.length).toBeGreaterThan(0);
    expect(content.source).toBeTypeOf("string");
    expect(content.reference).toBeTypeOf("string");
  });
});
