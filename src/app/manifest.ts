import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resolut | IPAP",
    short_name: "IPAP",
    description:
      "An all-in-one insurance infrastructure platform that enables innovators to quickly design, launch, and scale inclusive insurance solutions. Delivers tailored insurance bundles directly to underserved individuals and informal workers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafd",
    theme_color: "#00a1ff",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["finance", "business", "insurance"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Get Quote",
        short_name: "Quote",
        description: "Get an insurance quote",
        url: "/quote-request",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your dashboard",
        url: "/dashboard",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Claims",
        short_name: "Claims",
        description: "Manage your claims",
        url: "/dashboard/claims",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
