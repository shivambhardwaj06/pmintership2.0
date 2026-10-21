const API = "https://pminternship.mca.gov.in/mca-api/files/get-file-by-path?path=";
const CDN = "https://pminternship.mca.gov.in/mca-api/files/cdn?path=partner-companies/";

export const NAV = [
  { label: "Home", href: "https://pminternship.mca.gov.in/" },
  {
    label: "Guidelines",
    groups: [
      {
        title: "Partner Companies",
        links: [
          { label: "PMIS Partner Companies", href: CDN + "PMISPartnerCompanies.pdf" },
          { label: "Eligible Companies – Category A (List B)", href: CDN + "CategoryA_ListB.pdf" },
          { label: "Eligible Companies – Category A (List C)", href: CDN + "CategoryA_ListC.pdf" },
        ],
      },
      {
        title: "Guidelines",
        links: [
          { label: "Addendum to Guidelines", href: API + "y6jzi%2ByKwm" },
          { label: "Guidelines (English)", href: API + "WEIFjtlmlj0z" },
          { label: "Guidelines (Hindi)", href: API + "hxlPbedV%2Fi" },
        ],
      },
      {
        title: "SOP",
        links: [
          { label: "Nomination of companies by States/UT", href: API + "QxkusmgEV6Yq" },
          { label: "Onboarding GCCs", href: API + "FY6H3UnwWN7T" },
          { label: "Onboarding MSME", href: API + "dHXd902%2B67" },
          { label: "Onboarding Prof. Associations / Institutes", href: API + "h%2FDc0Cic2m" },
          { label: "Onboarding SEZs", href: API + "VeBkB9ooEWH9" },
          { label: "Onboarding Statutory Authorities", href: API + "dJcSRTOxs0rI" },
        ],
      },
    ],
  },
  {
    label: "FAQs",
    groups: [
      {
        title: "Frequently Asked Questions",
        links: [
          { label: "FAQ for Candidates", href: API + "qz3QVc6S2tvV" },
          { label: "FAQ for Candidates (Hindi)", href: API + "TY2yKPgvjpsK" },
          { label: "FAQ for Companies", href: API + "zRcbZFm5z248" },
          { label: "FAQ for States", href: API + "TTSWTkht1gKJ" },
        ],
      },
    ],
  },
  {
    label: "Manuals",
    groups: [
      {
        title: "Candidates",
        links: [
          { label: "Candidate User Manual", href: API + "8q6yrzCyBShF" },
          { label: "Candidate User Manual (Hindi)", href: API + "iAat8BLnsoxf" },
        ],
      },
      {
        title: "Industry",
        links: [
          { label: "Company Landing Page", href: API + "pqsPCe73%2BY" },
          { label: "Internship Posting (Regular/Camp)", href: API + "2TfLhgodAwtp" },
          { label: "Selection, Joining & Post Joining", href: API + "fhlOVIvwCaGl" },
        ],
      },
    ],
  },
  {
    label: "Guidance Videos",
    groups: [
      {
        title: "English",
        links: [
          { label: "How to apply for internships", href: "https://youtu.be/d9Ed5M12vYs" },
          { label: "Check & apply for Aadhaar Seeding", href: "https://youtu.be/gpTRgqshxek" },
          { label: "How to complete your profile", href: "https://youtu.be/ypNVMhJ9-tI" },
          { label: "How to find internships", href: "https://youtu.be/-bRvoiE5OZo" },
        ],
      },
      {
        title: "Hindi",
        links: [
          { label: "How to apply for internships", href: "https://youtu.be/udvIDJy4jqQ" },
          { label: "Check & apply for Aadhaar Seeding", href: "https://youtu.be/Hq-w9a7jD5k" },
          { label: "How to complete your profile", href: "https://youtu.be/sWUNJS1g5Bg" },
          { label: "How to find internships", href: "https://youtu.be/buighz42WJ8" },
        ],
      },
    ],
  },
  { label: "Gallery", href: "#gallery-block" },
  { label: "Benefits", href: "#eligibility-criteria" },
  { label: "Compendium", href: "#compendium" },
  { label: "Mobile App", href: "#mobile-app" },
  {
    label: "Support",
    groups: [
      {
        title: "Get help",
        links: [
          { label: "Call Center: 1800 11 6090", href: "tel:1800116090" },
          { label: "pminternship@mca.gov.in", href: "mailto:pminternship@mca.gov.in" },
          { label: "pmisindustrysupport@mca.gov.in", href: "mailto:pmisindustrysupport@mca.gov.in" },
        ],
      },
    ],
  },
];
