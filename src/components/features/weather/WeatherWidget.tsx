import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Moon, Thermometer, Wind, Zap } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatAlertDateTime,
  formatAlertLevel,
  formatTimeUntil,
  hasArpalTimingData,
  isActiveAlertLevel,
  resolveZoneAlertState,
  type AlertLevel,
  type ArpalData,
  type ZoneAlert,
} from "@/lib/arpal";
import { getWeatherInfo } from "@/lib/weather";
import { supabase } from "@/integrations/supabase/client";
import { ROUTES } from "@/lib/routes";
import { triggerHaptic, HAPTIC_PATTERNS } from "@/lib/haptics";

const LAT = 44.3671;
const LON = 8.4611;
// 1. Aggiornata la chiave di cache per invalidare i vecchi dati a 3 giorni
const WEATHER_CACHE_KEY = "ellera_weather_cache_v5";
const ARPAL_CACHE_KEY = "ellera_arpal_cache_v3";
const ARPAL_CACHE_TTL = 15 * 60 * 1000;

const DAY_SLOTS: { hour: number; label: string }[] = [
  { hour: 8, label: "Mattina" },
  { hour: 12, label: "Mezzogiorno" },
  { hour: 16, label: "Pomeriggio" },
  { hour: 20, label: "Sera" },
];

interface CurrentWeather {
  temp: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number;
  uvIndex: number;
}

interface HourlySlot {
  label: string;
  hour: number;
  temp: number;
  weatherCode: number;
  precipitationProbability: number;
  uvIndex: number;
  windSpeed: number;
  isDay: boolean;
}

interface DayGroup {
  label: string;
  datePrefix: string;
  slots: HourlySlot[];
}

interface WeatherState {
  current: CurrentWeather | null;
  days: DayGroup[];
  loading: boolean;
  error: string | null;
}

interface WeatherCachePayload {
  current: CurrentWeather;
  days: DayGroup[];
  updatedAt: number;
}

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const roundValue = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
};

const getUvClass = (uv: number) => {
  if (uv >= 11) return "text-red-600";
  if (uv >= 8) return "text-orange-600";
  if (uv >= 6) return "text-amber-600";
  if (uv >= 3) return "text-lime-600";
  return "text-emerald-600";
};

const getDayLabel = (dateStr: string, index: number): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const ddmm = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
  if (index === 0) return `Oggi ${ddmm}`;
  if (index === 1) return `Domani ${ddmm}`;
  const weekday = date
    .toLocaleDateString("it-IT", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
  return `${weekday} ${ddmm}`;
};

const readWeatherCache = (): WeatherCachePayload | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WeatherCachePayload>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.current ||
      !Array.isArray(parsed.days) ||
      typeof parsed.updatedAt !== "number"
    ) return null;
    return parsed as WeatherCachePayload;
  } catch {
    return null;
  }
};

const writeWeatherCache = (payload: WeatherCachePayload) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(payload)); } catch { /* noop */ }
};

const readArpalCache = (): ArpalData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ARPAL_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { data?: ArpalData; updatedAt?: number };
    if (!parsed?.data || typeof parsed.updatedAt !== "number") return null;
    if (Date.now() - parsed.updatedAt >= ARPAL_CACHE_TTL) return null;
    if (!hasArpalTimingData(parsed.data)) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

const writeArpalCache = (data: ArpalData) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      ARPAL_CACHE_KEY,
      JSON.stringify({ data, updatedAt: Date.now() }),
    );
  } catch {
    // noop
  }
};

const COMPACT_ALERT_TEXT_CLASS: Record<
  Exclude<AlertLevel, "sconosciuto">,
  { light: string; dark: string }
> = {
  verde: { light: "text-emerald-700", dark: "text-emerald-300" },
  gialla: { light: "text-amber-700", dark: "text-amber-300" },
  arancione: { light: "text-orange-700", dark: "text-orange-300" },
  rossa: { light: "text-red-700", dark: "text-red-300" },
};

interface WeatherWidgetProps {
  variant?: "compact" | "forecast";
}

const ALERT_BADGE_CLASS: Record<
  Exclude<AlertLevel, "sconosciuto">,
  { light: string; dark: string }
> = {
  verde: {
    light: "bg-emerald-300 text-emerald-950 ring-emerald-400/80",
    dark: "bg-emerald-400 text-emerald-950 ring-emerald-300/70",
  },
  gialla: {
    light: "bg-amber-300 text-amber-950 ring-amber-400/80",
    dark: "bg-amber-300 text-amber-950 ring-amber-400/80",
  },
  arancione: {
    light: "bg-orange-400 text-white ring-orange-500/80",
    dark: "bg-orange-400 text-white ring-orange-400/80",
  },
  rossa: {
    light: "bg-red-500 text-white ring-red-500/80",
    dark: "bg-red-500 text-white ring-red-400/80",
  },
};

const useZoneBAlert = (enabled: boolean) => {
  const [zoneAlert, setZoneAlert] = useState<ZoneAlert | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const cached = readArpalCache();
    if (cached?.zones?.B) {
      setZoneAlert(cached.zones.B);
      // Se la cache è valida (controllata dentro readArpalCache), non facciamo nulla.
      // readArpalCache restituisce null se scaduta (TTL 15min).
      return;
    }

    let mounted = true;

    const fetchAlert = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("arpal-allerta");
        if (error) throw new Error(error.message);
        if (!result?.success || !result.data?.zones?.B) {
          throw new Error(result?.error ?? "Dati allerta non disponibili");
        }

        const nextData = result.data as ArpalData;
        if (!mounted) return;

        writeArpalCache(nextData);
        setZoneAlert(nextData.zones.B);
      } catch {
        if (!mounted) return;
        setZoneAlert(null);
      }
    };

    fetchAlert();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return zoneAlert;
};

const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    current: null,
    days: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      // 1. Controllo cache prima di tutto (TTL 15 minuti per il meteo)
      const cached = readWeatherCache();
      const CACHE_TTL = 15 * 60 * 1000;
      
      if (cached && (Date.now() - cached.updatedAt < CACHE_TTL)) {
        setState({ current: cached.current, days: cached.days, loading: false, error: null });
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

        // 2. Richiediamo 5 giorni di previsione all'API
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
          `&hourly=temperature_2m,weather_code,precipitation_probability,uv_index,wind_speed_10m` +
          `&forecast_days=5` +
          `&timezone=Europe%2FRome`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Errore API meteo");
        const data = await res.json() as Record<string, unknown>;

        const currentRaw = data.current as Record<string, unknown>;
        const hourly = data.hourly as Record<string, (number | string)[]>;
        const hourlyTimes = hourly.time as string[];

        const currentTime = currentRaw.time as string | undefined;
        const currentHourlyIndex = Math.max(0, hourlyTimes.indexOf(currentTime ?? ""));
        const currentHour = new Date().getHours();

        const current: CurrentWeather = {
          temp: roundValue(currentRaw.temperature_2m),
          windSpeed: roundValue(currentRaw.wind_speed_10m),
          humidity: roundValue(currentRaw.relative_humidity_2m),
          weatherCode: roundValue(currentRaw.weather_code),
          isDay: currentRaw.is_day === 1,
          precipitationProbability: roundValue((hourly.precipitation_probability as number[])[currentHourlyIndex], 0),
          uvIndex: roundValue((hourly.uv_index as number[])[currentHourlyIndex], 0),
        };

        const todayPrefix = (currentTime ?? new Date().toISOString()).slice(0, 10);

        const addDays = (base: string, n: number) => {
          const [y, m, d] = base.split("-").map(Number);
          const date = new Date(y, m - 1, d + n);
          return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");
        };

        // 3. Generiamo un array dinamico di 5 giorni
        const datePrefixes = Array.from({ length: 5 }, (_, i) => addDays(todayPrefix, i));

        const buildSlot = (
          datePrefix: string,
          hour: number,
          label: string
        ): HourlySlot | null => {
          const target = `${datePrefix}T${String(hour).padStart(2, "0")}:00`;
          const idx = hourlyTimes.indexOf(target);
          if (idx < 0) return null;
          return {
            label,
            hour,
            temp: roundValue((hourly.temperature_2m as number[])[idx]),
            weatherCode: roundValue((hourly.weather_code as number[])[idx]),
            precipitationProbability: roundValue((hourly.precipitation_probability as number[])[idx], 0),
            uvIndex: roundValue((hourly.uv_index as number[])[idx], 0),
            windSpeed: roundValue((hourly.wind_speed_10m as number[])[idx], 0),
            isDay: hour >= 7 && hour < 20,
          };
        };

        const days: DayGroup[] = datePrefixes
          .map((datePrefix, dayIndex) => {
            const isToday = dayIndex === 0;

            const activeSlotHour = [...DAY_SLOTS]
              .reverse()
              .find((s) => s.hour <= currentHour)?.hour;

            const visibleSlots = DAY_SLOTS.filter(
              ({ hour }) => !isToday || hour >= (activeSlotHour ?? 0)
            );

            const firstHourToday = isToday ? visibleSlots[0]?.hour : null;

            const slots = visibleSlots
              .map(({ hour, label }) => {
                const slotLabel =
                  isToday && hour === firstHourToday
                    ? `Adesso (${label.toLowerCase()})`
                    : label;
                return buildSlot(datePrefix, hour, slotLabel);
              })
              .filter((s): s is HourlySlot => s !== null);

            return { label: getDayLabel(datePrefix, dayIndex), datePrefix, slots };
          })
          .filter((day) => day.slots.length > 0);

        writeWeatherCache({ current, days, updatedAt: Date.now() });
        setState({ current, days, loading: false, error: null });
      } catch {
        // Se l'API fallisce, proviamo comunque la cache anche se scaduta come ultima spiaggia
        if (cached) {
          setState({ current: cached.current, days: cached.days, loading: false, error: null });
          return;
        }
        setState((prev) => ({ ...prev, loading: false, error: "Dati meteo non disponibili" }));
      }
    };

    fetchWeather();
  }, []);

  return state;
};

const WeatherWidget = ({ variant = "compact" }: WeatherWidgetProps) => {
  const { current, days, loading, error } = useWeather();
  const zoneBAlert = useZoneBAlert(variant === "compact");
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (variant !== "compact" || !zoneBAlert) return;

    const hasRelevantTime =
      Boolean(zoneBAlert.currentEndsAt && isActiveAlertLevel(zoneBAlert.currentLevel ?? zoneBAlert.level)) ||
      Boolean(zoneBAlert.nextStartsAt && isActiveAlertLevel(zoneBAlert.nextLevel));
    if (!hasRelevantTime) return;

    const intervalId = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(intervalId);
  }, [variant, zoneBAlert]);

  const resolvedAlert = resolveZoneAlertState(zoneBAlert, nowMs);
  const effectiveAlertLevel = resolvedAlert?.level ?? null;
  const hasActiveAlert = isActiveAlertLevel(effectiveAlertLevel);
  const hasUpcomingAlert = !hasActiveAlert && isActiveAlertLevel(resolvedAlert?.nextLevel ?? null);
  const compactAlertLevel = hasActiveAlert
    ? effectiveAlertLevel
    : hasUpcomingAlert
      ? resolvedAlert?.nextLevel ?? null
      : null;
  const compactAlertTime = hasActiveAlert
    ? formatAlertDateTime(resolvedAlert?.endsAt)
    : hasUpcomingAlert
      ? formatAlertDateTime(resolvedAlert?.nextStartsAt)
      : null;
  const compactAlertCountdown = hasActiveAlert
    ? formatTimeUntil(resolvedAlert?.endsAt, nowMs)
    : hasUpcomingAlert
      ? formatTimeUntil(resolvedAlert?.nextStartsAt, nowMs)
      : null;

  // ── Compact (Landing hero) ──────────────────────────────────────────────
  if (variant === "compact") {
    if (loading) {
      return (
        <div className="inline-flex items-center gap-2 md:gap-3 bg-card/60 backdrop-blur-sm border border-white/30 rounded-full px-2 py-1.5 md:px-3 md:py-2 shadow-sm">
          <Skeleton className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-muted/40" />
          <div className="flex flex-col gap-1 md:gap-1.5">
            <Skeleton className="w-8 h-3 md:w-10 md:h-3.5 bg-muted/40" />
            <Skeleton className="w-12 h-2 md:w-14 md:h-2.5 bg-muted/40" />
          </div>
          <div className="hidden sm:flex border-l border-border/40 pl-3 gap-2">
            <Skeleton className="w-16 h-3 bg-muted/30" />
            <Skeleton className="w-12 h-3 bg-muted/30" />
          </div>
        </div>
      );
    }

    if (error || !current) return null;

    const info = getWeatherInfo(current.weatherCode, current.isDay);
    const Icon = info.Icon;

    return (
      <Link
        to={ROUTES.meteo}
        onClick={() => triggerHaptic(HAPTIC_PATTERNS.LIGHT)}
        aria-label={`Meteo Ellera: ${current.temp} gradi, ${info.label}. Clicca per i dettagli e allerte ARPAL.`}
        className="inline-block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -1, scale: 1.01 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 md:gap-3 rounded-full border px-2 py-1.5 md:px-3 md:py-2 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md ${current.isDay
            ? "bg-card/70 border-white/40"
            : "bg-slate-950/70 border-slate-700/70 text-slate-50"
            }`}
        >
          <span className={`inline-flex h-7 w-7 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full ring-1 ${info.iconSurfaceClassName}`}>
            <Icon className={`w-4 h-4 md:w-5 md:h-5 ${info.iconClassName}`} aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className={`text-[13px] md:text-sm font-semibold leading-none ${current.isDay ? "text-foreground" : "text-slate-50"}`}>
              {current.temp}°C
            </span>
            <span className={`mt-0.5 md:mt-1 text-[10px] md:text-[11px] leading-none ${current.isDay ? "text-muted-foreground" : "text-slate-300"}`}>
              {info.label}
            </span>
          </div>

          <span className={`hidden sm:inline text-xs border-l pl-3 ${current.isDay ? "text-muted-foreground border-border" : "text-slate-300 border-slate-700"}`}>
            <Wind className="w-3.5 h-3.5 inline mr-1" />{current.windSpeed} km/h
          </span>
          {current.precipitationProbability > 0 && (
            <span className={`hidden sm:inline text-xs border-l pl-3 ${current.isDay ? "text-muted-foreground border-border" : "text-slate-300 border-slate-700"}`}>
              <Droplets className="w-3.5 h-3.5 inline mr-1" />{current.precipitationProbability}%
            </span>
          )}
          {compactAlertLevel && compactAlertLevel !== "sconosciuto" && (
            <span
              className={`inline-flex items-center gap-2 border-l pl-3 ${
                current.isDay ? "border-border" : "border-slate-700"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ${
                  current.isDay
                    ? ALERT_BADGE_CLASS[compactAlertLevel].light
                    : ALERT_BADGE_CLASS[compactAlertLevel].dark
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
              </span>
              <span
                className={`text-[11px] font-semibold leading-none ${
                  current.isDay
                    ? COMPACT_ALERT_TEXT_CLASS[compactAlertLevel].light
                    : COMPACT_ALERT_TEXT_CLASS[compactAlertLevel].dark
                }`}
              >
                <span className="sr-only">
                  {hasActiveAlert
                    ? `Allerta ${formatAlertLevel(compactAlertLevel)} in corso${
                        compactAlertTime ? ` fino alle ${compactAlertTime}` : ""
                      }`
                    : `Allerta ${formatAlertLevel(compactAlertLevel)} prevista${
                        compactAlertTime ? ` dalle ${compactAlertTime}` : ""
                      }`}
                </span>
                <span className="hidden sm:inline">
                  {hasActiveAlert
                    ? `${formatAlertLevel(compactAlertLevel)}${
                        compactAlertTime ? ` fino alle ${compactAlertTime}` : ""
                      }`
                    : compactAlertTime
                      ? `${formatAlertLevel(compactAlertLevel)} dalle ${compactAlertTime}`
                      : formatAlertLevel(compactAlertLevel)}
                </span>
                {compactAlertCountdown && (
                  <span className="hidden md:inline text-[10px] font-medium opacity-80">
                    {` ${compactAlertCountdown}`}
                  </span>
                )}
              </span>
            </span>
          )}
        </motion.div>
      </Link>
    );
  }

  // ── Forecast (AlbiTrailArea - 5 giorni) ────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-3 overflow-x-hidden">
          {[0, 1, 2, 3, 4].map((d) => (
            <div key={d} className="min-w-[220px] flex-1">
              <Skeleton className="w-24 h-4 mb-4 mx-auto bg-muted/30" />
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border/40 rounded-xl p-3 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0 bg-muted/40" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="w-12 h-2 bg-muted/30" />
                      <Skeleton className="w-10 h-3 bg-muted/30" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="w-8 h-2 ml-auto bg-muted/30" />
                      <Skeleton className="w-8 h-2 ml-auto bg-muted/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || days.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "Dati meteo non disponibili"}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-heading font-bold text-foreground">
        <Thermometer className="w-5 h-5 text-primary" />
        Meteo Ellera - Prossimi 5 giorni
      </h2>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 lg:grid lg:grid-cols-5 lg:overflow-visible lg:snap-none lg:pb-0 lg:mx-0 lg:px-0 lg:gap-4 scrollbar-hide">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day.datePrefix}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: dayIndex * 0.08 }}
            className="min-w-[220px] snap-center lg:min-w-0 rounded-2xl border border-border bg-card/50 p-3 flex flex-col gap-2"
          >
            {/* Header giorno */}
            <h4 className="text-sm font-heading font-bold text-foreground text-center pb-1 border-b border-border/60">
              {day.label}
            </h4>

            {/* Slot impilati verticalmente */}
            {day.slots.map((slot, i) => {
              const slotInfo = getWeatherInfo(slot.weatherCode, slot.isDay);
              const SlotIcon = slotInfo.Icon;

              return (
                <motion.div
                  key={`${day.datePrefix}-${slot.hour}`}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: dayIndex * 0.08 + i * 0.05 }}
                  className="flex items-center gap-2 rounded-xl bg-background/80 border border-border/60 px-2.5 py-2 hover:shadow-warm transition-shadow"
                >
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${slotInfo.iconSurfaceClassName}`}>
                    <SlotIcon className={`w-4 h-4 ${slotInfo.iconClassName}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground leading-none mb-0.5 truncate">{slot.label}</p>
                    <p className="text-sm font-bold text-foreground leading-none">{slot.temp}°C</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className={`text-[9px] flex items-center gap-0.5 text-muted-foreground ${slot.windSpeed > 0 ? "" : "invisible"}`}>
                      <Wind className="w-2.5 h-2.5" />{slot.windSpeed} km/h
                    </span>
                    <span className={`text-[9px] flex items-center gap-0.5 ${slot.precipitationProbability > 0 ? "text-muted-foreground" : "invisible"}`}>
                      <Droplets className="w-2.5 h-2.5 text-primary" />{slot.precipitationProbability}%
                    </span>
                    <span className={`text-[9px] flex items-center gap-0.5 ${getUvClass(slot.uvIndex)}`}>
                      <Zap className="w-2.5 h-2.5" />UV {slot.uvIndex}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
