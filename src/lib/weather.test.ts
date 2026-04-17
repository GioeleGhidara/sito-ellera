import { describe, expect, it } from "vitest";
import { CloudLightning, CloudMoon, CloudRain, Moon, Sun } from "@/lib/icons";
import { getWeatherInfo } from "./weather";

describe("getWeatherInfo", () => {
  it("maps clear sky with day/night aware icons", () => {
    expect(getWeatherInfo(0, 1)).toMatchObject({ label: "Sereno", Icon: Sun });
    expect(getWeatherInfo(0, 0)).toMatchObject({ label: "Sereno", Icon: Moon });
  });

  it("maps partial cloud cover to day/night cloud icons", () => {
    expect(getWeatherInfo(2, false)).toMatchObject({
      label: "Parzialmente nuvoloso",
      Icon: CloudMoon,
    });
  });

  it("maps rain and thunderstorm ranges correctly", () => {
    expect(getWeatherInfo(61, true)).toMatchObject({
      label: "Pioggia leggera",
      Icon: CloudRain,
    });
    expect(getWeatherInfo(96, true)).toMatchObject({
      label: "Temporale con grandine leggera",
      Icon: CloudLightning,
    });
  });

  it("falls back safely for unknown codes", () => {
    expect(getWeatherInfo(999, false)).toMatchObject({
      label: "Non disponibile",
      Icon: Moon,
    });
  });
});
