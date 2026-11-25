import { stripHtml } from "../utils/stripHtml";

describe("stripHtml", () => {
  it("removes tags", () => {
    expect(stripHtml("<i>Hello</i> world")).toBe("Hello world");
  });

  it("turns paragraph tags into blank lines", () => {
    expect(stripHtml("One<p>Two")).toBe("One\n\nTwo");
  });

  it("trims the result", () => {
    expect(stripHtml("<p>Hi</p>")).toBe("Hi");
  });

  it("decodes common entities", () => {
    expect(stripHtml("Tom &amp; Jerry &#x27;s &quot;show&quot;")).toBe(
      `Tom & Jerry 's "show"`,
    );
  });

  it("does not double-decode entities", () => {
    expect(stripHtml("&amp;lt;")).toBe("&lt;");
  });
});
