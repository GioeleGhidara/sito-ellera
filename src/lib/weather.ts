import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type IconType,
} from "@/lib/icons";

const WMO_LABELS: Record<number, string> = {
  0: "Sereno",
  1: "Prevalentemente sereno",
  2: "Parzialmente nuvoloso",
  3: "Coperto",
  45: "Nebbia",
  48: "Nebbia con brina",
  51: "Pioviggine leggera",
  53: "Pioviggine moderata",
  55: "Pioviggine intensa",
  56: "Pioviggine gelata leggera",
  57: "Pioviggine gelata intensa",
  61: "Pioggia leggera",
  63: "Pioggia moderata",
  65: "Pioggia intensa",
  66: "Pioggia gelata leggera",
  67: "Pioggia gelata intensa",
  71: "Neve leggera",
  73: "Neve moderata",
  75: "Neve intensa",
  77: "Granuli di neve",
  80: "Rovesci leggeri",
  81: "Rovesci moderati",
  82: "Rovesci intensi",
  85: "Rovesci di neve leggeri",
  86: "Rovesci di neve intensi",
  95: "Temporale",
  96: "Temporale con grandine leggera",
  99: "Temporale con grandine intensa",
};

export interface WeatherInfo {
  label: string;
  Icon: IconType;
  iconClassName: string;
  iconSurfaceClassName: string;
}

export const getWeatherInfo = (wmoCode: number, isDay: number | boolean): WeatherInfo => {
  const dayTime = Boolean(isDay);
  const label = WMO_LABELS[wmoCode] ?? "Non disponibile";

  switch (true) {
    case wmoCode === 0:
      return {
        label,
        Icon: dayTime ? Sun : Moon,
        iconClassName: dayTime ? "text-amber-500" : "text-indigo-200",
        iconSurfaceClassName: dayTime
          ? "bg-amber-100 ring-amber-200/80"
          : "bg-slate-900/90 ring-slate-700/80",
      };

    case wmoCode === 1 || wmoCode === 2:
      return {
        label,
        Icon: dayTime ? CloudSun : CloudMoon,
        iconClassName: dayTime ? "text-sky-600" : "text-indigo-200",
        iconSurfaceClassName: dayTime
          ? "bg-sky-100 ring-sky-200/80"
          : "bg-slate-900/90 ring-slate-700/80",
      };

    case wmoCode === 3:
      return {
        label,
        Icon: Cloud,
        iconClassName: "text-slate-500",
        iconSurfaceClassName: "bg-slate-100 ring-slate-200/80",
      };

    case wmoCode === 45 || wmoCode === 48:
      return {
        label,
        Icon: CloudFog,
        iconClassName: "text-zinc-500",
        iconSurfaceClassName: "bg-zinc-100 ring-zinc-200/80",
      };

    case wmoCode >= 51 && wmoCode <= 57:
      return {
        label,
        Icon: CloudDrizzle,
        iconClassName: "text-cyan-600",
        iconSurfaceClassName: "bg-cyan-50 ring-cyan-200/80",
      };

    case (wmoCode >= 61 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82):
      return {
        label,
        Icon: CloudRain,
        iconClassName: "text-blue-600",
        iconSurfaceClassName: "bg-blue-50 ring-blue-200/80",
      };

    case (wmoCode >= 71 && wmoCode <= 77) || wmoCode === 85 || wmoCode === 86:
      return {
        label,
        Icon: CloudSnow,
        iconClassName: "text-cyan-500",
        iconSurfaceClassName: "bg-cyan-50 ring-cyan-200/80",
      };

    case wmoCode >= 95 && wmoCode <= 99:
      return {
        label,
        Icon: CloudLightning,
        iconClassName: "text-violet-600",
        iconSurfaceClassName: "bg-violet-50 ring-violet-200/80",
      };

    default:
      return {
        label,
        Icon: dayTime ? Sun : Moon,
        iconClassName: dayTime ? "text-amber-500" : "text-slate-500",
        iconSurfaceClassName: dayTime
          ? "bg-amber-100 ring-amber-200/80"
          : "bg-slate-100 ring-slate-200/80",
      };
  }
};
