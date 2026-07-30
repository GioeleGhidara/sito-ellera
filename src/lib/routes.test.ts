import { describe, expect, it } from "vitest";
import {
  ROUTES,
  eventDetailPath,
  newsDetailPath,
  serviziSectionPath,
  tradizioneDetailPath,
} from "./routes";

describe("ROUTES", () => {
  it("defines every path as an absolute, non-empty route", () => {
    Object.entries(ROUTES).forEach(([key, path]) => {
      expect(path.startsWith("/"), `${key} should start with "/"`).toBe(true);
    });
  });

  it("has no two route keys pointing at the same path", () => {
    const paths = Object.values(ROUTES);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });
});

describe("path builders", () => {
  it("builds tradizione detail paths under /tradizioni", () => {
    expect(tradizioneDetailPath("streghe-di-ellera")).toBe("/tradizioni/streghe-di-ellera");
  });

  it("builds news detail paths under /news", () => {
    expect(newsDetailPath("albi-trail-ebike-fest-2026")).toBe("/news/albi-trail-ebike-fest-2026");
  });

  it("builds event detail paths under /eventi", () => {
    expect(eventDetailPath("caruggi-e-lanterne")).toBe("/eventi/caruggi-e-lanterne");
  });

  it("builds servizi section anchors", () => {
    expect(serviziSectionPath("bus")).toBe("/servizi#bus");
    expect(serviziSectionPath("mangiare")).toBe("/servizi#mangiare");
    expect(serviziSectionPath("negozi")).toBe("/servizi#negozi");
  });
});
