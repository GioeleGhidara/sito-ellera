import { useEffect, useState } from "react";

interface Countdown {
    days: string;
    hours: string;
    mins: string;
    secs: string;
}

export function CountdownSection() {
    const [cd, setCd] = useState<Countdown>({ days: "--", hours: "--", mins: "--", secs: "--" });

    useEffect(() => {
        const tick = () => {
            const target = new Date("2026-06-14T09:00:00+02:00").getTime();
            const diff = target - Date.now();
            if (diff <= 0) { setCd({ days: "00", hours: "00", mins: "00", secs: "00" }); return; }
            const pad = (n: number) => String(n).padStart(2, "0");
            setCd({
                days: pad(Math.floor(diff / 86400000)),
                hours: pad(Math.floor((diff % 86400000) / 3600000)),
                mins: pad(Math.floor((diff % 3600000) / 60000)),
                secs: pad(Math.floor((diff % 60000) / 1000)),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div id="ebike-countdown">
            <div className="countdown-inner">
                <div className="countdown-label">Mancano</div>
                <div className="countdown-units">
                    <div className="count-unit"><div className="count-num">{cd.days}</div><div className="count-lbl">Giorni</div></div>
                    <div className="count-sep">:</div>
                    <div className="count-unit"><div className="count-num">{cd.hours}</div><div className="count-lbl">Ore</div></div>
                    <div className="count-sep">:</div>
                    <div className="count-unit"><div className="count-num">{cd.mins}</div><div className="count-lbl">Minuti</div></div>
                    <div className="count-sep">:</div>
                    <div className="count-unit"><div className="count-num">{cd.secs}</div><div className="count-lbl">Secondi</div></div>
                </div>
            </div>
        </div>
    );
}
