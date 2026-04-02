import { MetadataRoute } from "next";

const routes = [
    "",
    "/salary-calculator",
    "/severance-calculator",
    "/freelancer-calculator",
    "/savings-calculator",
    "/loan-calculator",
    "/jeonse-calculator",
    "/dsr-calculator",
    "/pension-calculator",
    "/compound-calculator",
    "/tax-interest-calculator",
    "/inflation-calculator",
    "/exchange-calculator",
    "/guide/salary",
    "/guide/severance",
    "/guide/freelancer",
    "/guide/savings",
    "/guide/loan",
    "/guide/jeonse",
    "/guide/dsr",
    "/guide/pension",
    "/guide/compound",
    "/guide/tax-interest",
    "/guide/inflation",
    "/guide/exchange",
    "/guide/global-tax",
    "/guide/subscription",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.richcalc.kr";
    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : route.startsWith("/guide") ? 0.7 : 0.9,
    }));
}
