import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://www.richcalc.kr/sitemap.xml",
        host: "https://www.richcalc.kr",
    };
}
