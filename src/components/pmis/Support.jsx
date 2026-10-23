import { useState } from "react";
import {
  Headphones,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  FileQuestion,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";

const STATE_NODAL_OFFICERS = [
  { state: "Maharashtra", department: "Skill Development & Entrepreneurship", email: "nodal-mh@pminternship.gov.in", phone: "022-2281-4500" },
  { state: "Uttar Pradesh", department: "Vocational Education & Skill Mission", email: "nodal-up@pminternship.gov.in", phone: "0522-230-7810" },
  { state: "Tamil Nadu", department: "Employment & Training Department", email: "nodal-tn@pminternship.gov.in", phone: "044-2250-1234" },
  { state: "Karnataka", department: "Skill Development & Livelihood", email: "nodal-ka@pminternship.gov.in", phone: "080-2225-8900" },
  { state: "Gujarat", department: "Labour, Skill Development & Employment", email: "nodal-gj@pminternship.gov.in", phone: "079-2325-1500" },
  { state: "Delhi (NCT)", department: "Training and Technical Education", email: "nodal-dl@pminternship.gov.in", phone: "011-2386-1200" },
  { state: "Rajasthan", department: "Skill, Employment & Entrepreneurship", email: "nodal-rj@pminternship.gov.in", phone: "0141-274-0020" },
  { state: "Madhya Pradesh", department: "Technical Education & Skill Development", email: "nodal-mp@pminternship.gov.in", phone: "0755-257-8900" },
];

export default function Support({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    category: "Aadhaar Seeding / DBT Issue",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [nodalSearch, setNodalSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setSubmitted(true);
  };

  const filteredNodal = STATE_NODAL_OFFICERS.filter(
    (n) =>
      n.state.toLowerCase().includes(nodalSearch.toLowerCase()) ||
      n.department.toLowerCase().includes(nodalSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-4 py-1 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 shadow-2xs">
            <Headphones className="h-4 w-4 text-orange-500" />
            <span>Official Helpdesk & Grievance Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Support & Grievance Redressal
          </h1>
          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
            Direct assistance channels for candidates, participating companies, and state coordinators under the Prime Minister&apos;s Internship Scheme.
          </p>
        </div>

        {/* 3 Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white">
              National Toll-Free Helpline
            </h3>
            <p className="text-lg font-black text-orange-600 dark:text-orange-400">
              1800-180-6724
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Toll-free across all telecom networks in India. Available Monday to Friday (9:00 AM – 6:00 PM).
            </p>
          </div>

          <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white">
              Official Email Support
            </h3>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 break-all">
              pminternship-mca@gov.in
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Responses delivered within 24–48 business hours with official ticket tracking.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white">
              Headquarters (MCA)
            </h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ministry of Corporate Affairs
            </p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              &apos;A&apos; Wing, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
            </p>
          </div>
        </div>

        {/* Support Grid: Grievance Form + 24/7 AI Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Grievance Ticket Form */}
          <div className="lg:col-span-7 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
              <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
                Submit an Online Grievance / Query
              </h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              Fill in your details below to log a priority grievance ticket directly with the PMIS technical support cell.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500/40 p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="font-display text-lg font-black text-slate-900 dark:text-white">
                  Grievance Logged Successfully!
                </h4>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Ticket Reference ID: <strong className="text-base text-slate-900 dark:text-white">{ticketId}</strong>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Our grievance officer will review your query and communicate resolution via your registered email ({formData.email || "email on file"}).
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", mobile: "", email: "", category: "Aadhaar Seeding / DBT Issue", message: "" });
                  }}
                  className="mt-2 text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Issue Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option>Aadhaar Seeding / DBT Issue</option>
                      <option>Application Submission Error</option>
                      <option>Partner Company Selection Status</option>
                      <option>Profile Qualification Update</option>
                      <option>General Scheme Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description of Issue *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue with reference IDs, bank name, or partner company details..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm py-3.5 shadow-md hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Priority Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Instant AI Assistant Box + State Coordinator Search */}
          <div className="lg:col-span-5 space-y-6">
            {/* Instant AI Guide Card */}
            <div className="rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-900 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-orange-600 dark:text-orange-400 uppercase">
                <Sparkles className="h-4 w-4" /> Instant 24/7 AI Guide
              </div>
              <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
                Need Instant Answers Without Waiting?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Disha AI is grounded on official Ministry of Corporate Affairs regulations. Ask questions about stipend rules, eligibility cutoffs, or application procedures anytime.
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event("open-disha"))}
                className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-3 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Disha AI Chat</span>
              </button>
            </div>

            {/* Operating Hours & Escalation Notice */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-500" /> Support Operating Hours
              </span>
              <p>• Monday to Friday: 9:00 AM – 6:00 PM IST</p>
              <p>• Closed on National & Gazetted Central Govt Holidays</p>
              <p>• For urgent technical issues, use the national helpline: 1800-180-6724</p>
            </div>
          </div>
        </div>

        {/* State Nodal Officers Directory */}
        <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                  State Nodal Officers Directory
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Direct contacts for regional internship nodal officers across Indian States and Union Territories.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by state..."
                value={nodalSearch}
                onChange={(e) => setNodalSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-slate-400">
                  <th className="pb-2.5 font-bold text-slate-700 dark:text-slate-300">State / UT</th>
                  <th className="pb-2.5 font-bold text-slate-700 dark:text-slate-300">Nodal Department</th>
                  <th className="pb-2.5 font-bold text-slate-700 dark:text-slate-300">Official Email</th>
                  <th className="pb-2.5 font-bold text-slate-700 dark:text-slate-300">Desk Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredNodal.map((n) => (
                  <tr key={n.state} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{n.state}</td>
                    <td className="py-2.5">{n.department}</td>
                    <td className="py-2.5 text-orange-600 dark:text-orange-400 font-bold">{n.email}</td>
                    <td className="py-2.5">{n.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
