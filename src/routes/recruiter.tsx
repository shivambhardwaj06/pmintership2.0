import { createFileRoute } from "@tanstack/react-router";
import RecruiterPortal from "@/components/pmis/RecruiterPortal.jsx";

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Corporate Recruiter Portal | PM Internship Scheme (PMIS)" },
      { name: "description", content: "Corporate Recruiter Portal for partner companies under PM Internship Scheme to manage vacancies, evaluate candidate resumes, and update application status." },
      { property: "og:title", content: "Corporate Recruiter Portal | PM Internship Scheme" },
      { property: "og:description", content: "Corporate Recruiter Portal for partner companies under PM Internship Scheme to manage vacancies, evaluate candidate resumes, and update application status." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RecruiterPortal,
});
