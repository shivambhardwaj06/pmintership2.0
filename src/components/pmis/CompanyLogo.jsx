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

const KNOWN_LOGOS = {
  "Tata Consultancy Services": tcsLogo,
  "Infosys": infosysLogo,
  "Wipro": wiproLogo,
  "HCLTech": hcltechLogo,
  "HDFC Bank": hdfcbankLogo,
  "ICICI Bank": icicibankLogo,
  "State Bank of India": sbiLogo,
  "Bharti Airtel": airtelLogo,
  "Adani Power": adaniLogo,
  "Larsen & Toubro": ltLogo,
  "Mahindra & Mahindra": mahindraLogo,
  "Maruti Suzuki": marutisuzukiLogo,
  "Reliance Industries": rilLogo,
  "Reliance Retail": rilLogo,
  "Reliance Jio": rilLogo,
  "Sun Pharmaceutical Industries": sunpharmaLogo,
  "Tata Motors": tatamotorsLogo,
  "Tata Steel": tataLogo,
  "Tata Projects": tataLogo,
  "Tata Communications": tataLogo,
  "Tata Power": tataLogo,
  "Hero MotoCorp": heromotocorpLogo,
  "Bajaj Auto": bajajautoLogo,
  "Bajaj Finance": bajajautoLogo,
  "Flipkart": flipkartLogo,
  "Zomato": zomatoLogo,
};

// Distinctive color palettes for other top Indian corporate brands
const BRAND_COLORS = {
  "Coal India": "from-amber-700 to-zinc-900 text-amber-100",
  "NMDC": "from-red-700 to-rose-950 text-white",
  "Hindustan Zinc": "from-blue-700 to-slate-900 text-white",
  "Vedanta": "from-cyan-800 to-slate-950 text-cyan-100",
  "Hindustan Unilever": "from-blue-600 to-indigo-900 text-white",
  "ITC": "from-amber-600 to-amber-950 text-white",
  "Nestlé India": "from-sky-700 to-slate-900 text-white",
  "Dabur": "from-emerald-700 to-green-950 text-white",
  "Britannia Industries": "from-red-600 to-rose-900 text-white",
  "Indian Oil Corporation": "from-orange-600 to-blue-900 text-white",
  "ONGC": "from-red-700 to-zinc-900 text-white",
  "GAIL": "from-blue-700 to-cyan-950 text-white",
  "BPCL": "from-yellow-600 to-blue-950 text-white",
  "HPCL": "from-red-700 to-blue-950 text-white",
  "Siemens India": "from-teal-600 to-slate-950 text-white",
  "ABB India": "from-red-600 to-zinc-900 text-white",
  "Deloitte India": "from-emerald-600 to-zinc-950 text-white",
  "EY India": "from-yellow-500 to-zinc-900 text-zinc-900 font-extrabold",
  "KPMG India": "from-blue-700 to-indigo-950 text-white",
  "PwC India": "from-orange-600 to-amber-950 text-white",
  "Grant Thornton Bharat": "from-purple-700 to-indigo-950 text-white",
  "Apollo Hospitals": "from-rose-600 to-red-950 text-white",
  "Fortis Healthcare": "from-emerald-600 to-teal-950 text-white",
  "Max Healthcare": "from-cyan-700 to-blue-950 text-white",
  "Narayana Health": "from-red-600 to-slate-900 text-white",
  "Hindustan Aeronautics Limited": "from-sky-700 to-blue-950 text-white",
  "Bharat Electronics Limited": "from-blue-800 to-indigo-950 text-white",
  "NTPC": "from-blue-700 to-cyan-950 text-white",
  "Power Grid Corporation of India": "from-emerald-700 to-slate-900 text-white",
  "Delhivery": "from-red-600 to-zinc-900 text-white",
  "Ashok Leyland": "from-blue-800 to-slate-950 text-white",
  "Ola Electric": "from-zinc-900 to-zinc-700 text-yellow-400",
  "Ather Energy": "from-zinc-900 to-cyan-950 text-cyan-300",
  "Blue Dart": "from-blue-700 to-yellow-600 text-white",
  "Titan Company": "from-amber-700 to-slate-900 text-amber-200",
  "Croma": "from-teal-700 to-zinc-900 text-white",
  "Asian Paints": "from-red-600 to-amber-700 text-white",
};

export default function CompanyLogo({ name, company, className = "h-12 w-12" }) {
  const effectiveName = String(name || company || "Company").trim() || "Company";
  const imgSrc = KNOWN_LOGOS[effectiveName] || (name ? KNOWN_LOGOS[name] : null) || (company ? KNOWN_LOGOS[company] : null);

  if (imgSrc) {
    return (
      <div className={`flex items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xs ${className}`}>
        <img
          src={imgSrc}
          alt={`${effectiveName} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // Initials generator
  const words = effectiveName.split(/\s+/).filter((w) => /^[A-Za-z0-9]/.test(w));
  const initials = words.length >= 2
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : effectiveName.slice(0, 2).toUpperCase();
  const colorTheme = BRAND_COLORS[effectiveName] || "from-primary to-primary/80 text-primary-foreground";

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br font-display font-bold shadow-xs select-none ${colorTheme} ${className}`}
      title={effectiveName}
    >
      <span className="text-xs sm:text-sm tracking-tight">{initials}</span>
    </div>
  );
}
