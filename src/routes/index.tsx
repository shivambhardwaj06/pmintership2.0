import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/pmis/Landing.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PM Internship Scheme | Ministry of Corporate Affairs" },
      { name: "description", content: "Paid internships in India's top companies under the Prime Minister Internship Scheme." },
      { property: "og:title", content: "PM Internship Scheme | Ministry of Corporate Affairs" },
      { property: "og:description", content: "Paid internships in India's top companies under the Prime Minister Internship Scheme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
