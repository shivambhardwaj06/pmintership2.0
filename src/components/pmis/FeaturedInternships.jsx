import { useMemo, useState } from "react";
import { Search, MapPin, Star, GitCompareArrows, IndianRupee, Wrench, ArrowRight, BadgeCheck, CalendarClock, Building, X, ChevronDown } from "lucide-react";

// Sample data for demonstration only.
import adaniLogo from "@/assets/logos/adani.png";
import airtelLogo from "@/assets/logos/airtel.png";
import bajajautoLogo from "@/assets/logos/bajajauto.png";
import flipkartLogo from "@/assets/logos/flipkart.png";
import hcltechLogo from "@/assets/logos/hcltech.png";
import hdfcbankLogo from "@/assets/logos/hdfcbank.png";
import heromotocorpLogo from "@/assets/logos/heromotocorp.png";
import icicibankLogo from "@/assets/logos/icicibank.png";
import infosysLogo from "@/assets/logos/infosys.png";
import ltLogo from "@/assets/logos/lt.png";
import mahindraLogo from "@/assets/logos/mahindra.png";
import marutisuzukiLogo from "@/assets/logos/marutisuzuki.png";
import rilLogo from "@/assets/logos/ril.png";
import sbiLogo from "@/assets/logos/sbi.png";
import sunpharmaLogo from "@/assets/logos/sunpharma.png";
import tataLogo from "@/assets/logos/tata.png";
import tatamotorsLogo from "@/assets/logos/tatamotors.png";
import tcsLogo from "@/assets/logos/tcs.png";
import wiproLogo from "@/assets/logos/wipro.png";
import zomatoLogo from "@/assets/logos/zomato.png";

const LOGOS = [
  ["TCS", tcsLogo], ["Infosys", infosysLogo], ["Wipro", wiproLogo],
  ["HCLTech", hcltechLogo], ["Reliance Industries", rilLogo], ["Tata Group", tataLogo],
  ["Tata Motors", tatamotorsLogo], ["Mahindra & Mahindra", mahindraLogo],
  ["HDFC Bank", hdfcbankLogo], ["ICICI Bank", icicibankLogo], ["State Bank of India", sbiLogo],
  ["Bharti Airtel", airtelLogo], ["Adani Group", adaniLogo], ["Larsen & Toubro", ltLogo],
  ["Maruti Suzuki", marutisuzukiLogo], ["Hero MotoCorp", heromotocorpLogo],
  ["Bajaj Auto", bajajautoLogo], ["Sun Pharma", sunpharmaLogo], ["Zomato", zomatoLogo],
  ["Flipkart", flipkartLogo],
];
const COMPANIES = LOGOS.map((l) => l[0]);
const logoUrl = (n) => LOGOS.find((l) => l[0] === n)?.[1];
function Logo({ name, className }) {
  return (
    <span className={`grid place-items-center overflow-hidden rounded-lg border bg-card p-1.5 ${className}`}>
      <img src={logoUrl(name)} alt={`${name} logo`} className="max-h-full max-w-full object-contain" />
    </span>
  );
}

const JOBS = [
  { id: 1, company: "Sudhakar Omkaram & Co.", role: "Finance and Accounts Intern", sector: "Consulting Services", field: "Finance & Accounting", state: "Karnataka", district: "Bengaluru", stipend: true, skill: false, deadline: "12 Nov 2026" },
  { id: 2, company: "Armoured Vehicles Nigam", role: "Quality Control and Assurance", sector: "Aviation & Defence", field: "Quality Control", state: "Madhya Pradesh", district: "Jabalpur", stipend: true, skill: true, deadline: "18 Nov 2026" },
  { id: 3, company: "Armoured Vehicles Nigam", role: "Human Resource HR", sector: "Aviation & Defence", field: "Human Resources", state: "Madhya Pradesh", district: "Jabalpur", stipend: true, skill: true, deadline: "18 Nov 2026" },
  { id: 4, company: "Armoured Vehicles Nigam", role: "Sales and Manufacturing", sector: "Aviation & Defence", field: "Sales & Marketing", state: "Madhya Pradesh", district: "Katni", stipend: true, skill: true, deadline: "20 Nov 2026" },
  { id: 5, company: "Armoured Vehicles Nigam", role: "Supply Chain Management", sector: "Aviation & Defence", field: "Supply Chain", state: "Madhya Pradesh", district: "Jabalpur", stipend: true, skill: true, deadline: "22 Nov 2026" },
  { id: 6, company: "Whirlpool", role: "Production Line Trainee", sector: "Consumer Durables", field: "Manufacturing", state: "Maharashtra", district: "Pune", stipend: true, skill: true, deadline: "25 Nov 2026" },
  { id: 7, company: "Federal Bank", role: "Branch Banking Associate", sector: "Banking & Finance", field: "Finance & Accounting", state: "Kerala", district: "Ernakulam", stipend: true, skill: false, deadline: "28 Nov 2026" },
];

const initials = (n) => n.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
const uniq = (k) => [...new Set(JOBS.map((j) => j[k]))].sort();

function Filter({ label, value, options, onChange }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border bg-card pl-3 pr-9 text-sm text-foreground">
        <option value="">{label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
    </label>
  );
}

export default function FeaturedInternships() {
  const [q, setQ] = useState("");
  const [f, setF] = useState({ state: "", district: "", sector: "", field: "" });
  const [sel, setSel] = useState(1);
  const [pins, setPins] = useState([]);
  const [cmp, setCmp] = useState([]);
  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const list = useMemo(() => JOBS.filter((j) => Object.entries(f).every(([k, v]) => !v || j[k] === v))
    .sort((a, b) => pins.includes(b.id) - pins.includes(a.id)), [f, pins]);
  const job = list.find((j) => j.id === sel) || list[0];
  const companies = COMPANIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  const active = Object.values(f).some(Boolean);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Top companies */}
      <div className="glass-panel mb-16 overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron">Partner companies</p>
            <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">Paid internships in top companies</h2>
          </div>
          <label className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company"
              className="h-10 w-full rounded-full border bg-background pl-9 pr-4 text-sm" />
          </label>
        </div>
        {q ? (
          <div className="flex flex-wrap gap-2 p-5">
            {companies.length ? companies.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-sm font-semibold text-primary">
                <Logo name={c} className="h-6 w-6" /> {c}
              </span>
            )) : <p className="text-sm text-muted-foreground">No company found.</p>}
          </div>
        ) : (
          <div className="group relative overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee flex w-max gap-4 group-hover:[animation-play-state:paused]">
              {[...COMPANIES, ...COMPANIES].map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
                  <Logo name={c} className="h-9 w-16" />
                  <span className="whitespace-nowrap text-sm font-semibold text-primary">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured internships */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-saffron">Handpicked for you</p>
          <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">Featured Internships</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarClock className="h-4 w-4" /> Check application deadlines carefully</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-lg bg-saffron px-5 py-2.5 text-sm font-bold text-saffron-foreground shadow-soft sm:self-auto">
          <BadgeCheck className="h-4 w-4" /> Check Eligibility
        </button>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border bg-secondary/50 p-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]">
        <Filter label="All States" value={f.state} options={uniq("state")} onChange={(v) => setF({ ...f, state: v })} />
        <Filter label="All Districts" value={f.district} options={uniq("district")} onChange={(v) => setF({ ...f, district: v })} />
        <Filter label="All Sectors" value={f.sector} options={uniq("sector")} onChange={(v) => setF({ ...f, sector: v })} />
        <Filter label="All Fields" value={f.field} options={uniq("field")} onChange={(v) => setF({ ...f, field: v })} />
        <button disabled={!active} onClick={() => setF({ state: "", district: "", sector: "", field: "" })}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-destructive disabled:opacity-40">
          <X className="h-4 w-4" /> Clear
        </button>
      </div>

      {list.length === 0 ? (
        <p className="glass-panel rounded-3xl p-10 text-center text-muted-foreground">No internships match these filters.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* List */}
          <ul className="space-y-2 lg:max-h-[30rem] lg:overflow-y-auto lg:pr-1">
            {list.map((j) => {
              const on = job.id === j.id;
              return (
                <li key={j.id}>
                  <button onClick={() => setSel(j.id)} aria-pressed={on}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${on ? "border-saffron bg-card shadow-soft" : "bg-card/60 hover:bg-card"}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg font-display text-sm font-bold ${on ? "bg-saffron text-saffron-foreground" : "bg-secondary text-primary"}`}>{initials(j.company)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-primary">{j.role}</span>
                      <span className="block truncate text-xs text-muted-foreground">{j.company} · {j.state}</span>
                    </span>
                    {pins.includes(j.id) && <Star className="h-4 w-4 shrink-0 fill-saffron text-saffron" />}
                    <ArrowRight className={`h-4 w-4 shrink-0 ${on ? "text-saffron" : "text-muted-foreground"}`} />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Detail */}
          <article className="relative overflow-hidden rounded-2xl bg-primary p-7 text-primary-foreground shadow-banner">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron/15" />
            <div className="relative flex items-start justify-between gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-card font-display text-lg font-bold text-primary">{initials(job.company)}</span>
              <div className="flex gap-2">
                <button onClick={() => toggle(pins, setPins, job.id)} aria-pressed={pins.includes(job.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 px-3 py-1.5 text-xs font-semibold">
                  <Star className={`h-3.5 w-3.5 ${pins.includes(job.id) ? "fill-saffron text-saffron" : ""}`} /> {pins.includes(job.id) ? "Pinned" : "Pin"}
                </button>
                <button onClick={() => toggle(cmp, setCmp, job.id)} aria-pressed={cmp.includes(job.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cmp.includes(job.id) ? "border-saffron bg-saffron text-saffron-foreground" : "border-primary-foreground/25"}`}>
                  <GitCompareArrows className="h-3.5 w-3.5" /> Compare
                </button>
              </div>
            </div>
            <p className="relative mt-6 text-xs font-bold uppercase tracking-widest text-saffron">{job.company}</p>
            <h3 className="relative mt-1 font-display text-2xl font-bold sm:text-3xl">{job.role}</h3>
            <dl className="relative mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs opacity-70">Sector</dt><dd className="font-semibold">{job.sector}</dd></div>
              <div><dt className="text-xs opacity-70">Field</dt><dd className="font-semibold">{job.field}</dd></div>
              <div><dt className="text-xs opacity-70">Location</dt><dd className="flex items-center gap-1 font-semibold"><MapPin className="h-3.5 w-3.5 text-saffron" />{job.district}, {job.state}</dd></div>
              <div><dt className="text-xs opacity-70">Apply by</dt><dd className="font-semibold">{job.deadline}</dd></div>
            </dl>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {job.stipend && <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold"><IndianRupee className="h-3.5 w-3.5 text-saffron" /> Monthly stipend</span>}
              {job.skill && <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold"><Wrench className="h-3.5 w-3.5 text-saffron" /> Skill training</span>}
            </div>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-saffron px-5 py-2.5 text-sm font-bold text-saffron-foreground">View Details <ArrowRight className="h-4 w-4" /></button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/25 px-5 py-2.5 text-sm font-semibold"><MapPin className="h-4 w-4" /> Distance from you</button>
            </div>
          </article>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {cmp.length > 0 ? `${cmp.length} selected to compare` : "Pin internships to keep them at the top."}
          <span className="ml-2 text-[11px]">· Sample listings for demonstration.</span>
        </p>
        <a href="#" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
          <Building className="h-4 w-4" /> Explore More Internships
        </a>
      </div>
    </section>
  );
}
