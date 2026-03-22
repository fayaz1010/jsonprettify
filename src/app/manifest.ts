import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JSON Prettify",
    short_name: "JSON Prettify",
    description:
      "Free online JSON formatter, validator, minifier and converter. Fast, private (client-side only), no data sent to servers.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#3B82F6",
    orientation: "any",
    categories: ["developer tools", "utilities", "productivity"],
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
