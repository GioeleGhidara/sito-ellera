import { next, rewrite } from "@vercel/edge";

export const config = {
    matcher: [
        "/((?!coming-soon\\.html|_vercel|images/|loghi/|icons/|tracks/|vendor/|google.*\\.html|sitemap\\.xml|robots\\.txt|.*\\.(?:ico|png|svg|jpg|jpeg|webp|pdf|woff2?|css|js)).*)"
    ],
};

const COOKIE_NAME = "ellera_access";

export default function middleware(request: Request) {
    const ua = request.headers.get('user-agent') || '';
    if (ua.toLowerCase().includes('googlebot')) {
        return next(); // lascia passare
    }

    const token = process.env.SECRET_TOKEN;
    if (!token) return next(); // nessun token configurato → accesso libero

    const url = new URL(request.url);
    const cookie = request.headers.get("cookie") ?? "";
    const hasAccess = cookie.includes(`${COOKIE_NAME}=${token}`);

    if (hasAccess) return next();

    const pass = url.searchParams.get("pass");
    if (pass === token) {
        const res = next();
        res.headers.set(
            "Set-Cookie",
            `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
        );
        return res;
    }

    return rewrite(new URL("/coming-soon.html", request.url));
}