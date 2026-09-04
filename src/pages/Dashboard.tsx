import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { ThemeToggle } from "../components/ThemeToggle";
import { FadeIn } from "../components/FadeIn";
import { toast } from "../components/Toast";
import { Navbar } from "../components/Navbar";
import { Flag } from "../components/Flag";
import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PlusIcon,
  RssIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Sparkline } from "../components/Sparkline";
import { Tilt } from "../components/Tilt";
import { Select } from "../components/Select";

const VISA_TYPES = [
  { id: "Tourist", icon: MapPinIcon },
  { id: "B1", icon: BuildingLibraryIcon },
  { id: "B2", icon: MapPinIcon },
  { id: "B1/B2", icon: MapPinIcon },
  { id: "Work", icon: BriefcaseIcon },
  { id: "H-1B", icon: BriefcaseIcon },
  { id: "L-1", icon: BriefcaseIcon },
  { id: "O-1", icon: BriefcaseIcon },
  { id: "Student", icon: AcademicCapIcon },
  { id: "F-1", icon: AcademicCapIcon },
  { id: "J-1", icon: AcademicCapIcon },
  { id: "Business", icon: BuildingLibraryIcon },
  { id: "Transit", icon: PaperAirplaneIcon },
  { id: "Family", icon: UsersIcon },
] as const;

const VISA_GROUPS = [
  { id: "Travel", icon: MapPinIcon, types: ["Tourist", "B1", "B2", "B1/B2"] },
  { id: "Work", icon: BriefcaseIcon, types: ["Work", "H-1B", "L-1", "O-1"] },
  { id: "Study", icon: AcademicCapIcon, types: ["Student", "F-1", "J-1"] },
  { id: "Business", icon: BuildingLibraryIcon, types: ["Business"] },
  { id: "Transit", icon: PaperAirplaneIcon, types: ["Transit"] },
  { id: "Family", icon: UsersIcon, types: ["Family"] },
];

const COUNTRIES: { name: string; code: string }[] = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Germany", code: "DE" },
  { name: "Australia", code: "AU" },
  { name: "Japan", code: "JP" },
  { name: "France", code: "FR" },
  { name: "India", code: "IN" },
  { name: "Brazil", code: "BR" },
  { name: "South Korea", code: "KR" },
  { name: "Schengen", code: "EU" },
  { name: "UAE", code: "AE" },
  { name: "Spain", code: "ES" },
  { name: "Poland", code: "PL" },
];

const ORIGIN_COUNTRIES: { name: string; code: string }[] = [
  { name: "Nigeria", code: "NG" }, { name: "India", code: "IN" },
  { name: "Philippines", code: "PH" }, { name: "Pakistan", code: "PK" },
  { name: "Bangladesh", code: "BD" }, { name: "Kenya", code: "KE" },
  { name: "Ghana", code: "GH" }, { name: "Egypt", code: "EG" },
  { name: "South Africa", code: "ZA" }, { name: "Morocco", code: "MA" },
  { name: "Indonesia", code: "ID" }, { name: "Mexico", code: "MX" },
  { name: "Brazil", code: "BR" }, { name: "Turkey", code: "TR" },
  { name: "Ukraine", code: "UA" }, { name: "Colombia", code: "CO" },
  { name: "Argentina", code: "AR" }, { name: "Thailand", code: "TH" },
  { name: "Vietnam", code: "VN" }, { name: "China", code: "CN" },
  { name: "Japan", code: "JP" }, { name: "South Korea", code: "KR" },
  { name: "United States", code: "US" }, { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" }, { name: "Germany", code: "DE" },
  { name: "France", code: "FR" }, { name: "Australia", code: "AU" },
];

const VISA_ICONS: Record<string, typeof MapPinIcon> = {
  Tourist: MapPinIcon, Work: BriefcaseIcon, Student: AcademicCapIcon,
  Business: BuildingLibraryIcon, Transit: PaperAirplaneIcon, Family: UsersIcon,
  B1: BuildingLibraryIcon, B2: MapPinIcon, "B1/B2": MapPinIcon,
  "H-1B": BriefcaseIcon, "L-1": BriefcaseIcon, "O-1": BriefcaseIcon,
  "F-1": AcademicCapIcon, "J-1": AcademicCapIcon,
};

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "var(--status-pending-c)", bg: "var(--status-pending-bg)", label: "Pending" },
  submitted: { color: "var(--status-submitted-c)", bg: "var(--status-submitted-bg)", label: "Submitted" },
  processing: { color: "var(--status-processing-c)", bg: "var(--status-processing-bg)", label: "Processing" },
  interview: { color: "var(--status-interview-c)", bg: "var(--status-interview-bg)", label: "Interview" },
  approved: { color: "var(--status-approved-c)", bg: "var(--status-approved-bg)", label: "Approved" },
  denied: { color: "var(--status-denied-c)", bg: "var(--status-denied-bg)", label: "Denied" },
  completed: { color: "var(--status-completed-c)", bg: "var(--status-completed-bg)", label: "Completed" },
};

const DOC_CHECKLISTS: Record<string, string[]> = {
  Tourist: ["Valid passport (6+ months)", "Travel itinerary", "Hotel reservations", "Bank statements (3 months)", "Travel insurance", "Passport photos", "Employment letter"],
  Work: ["Valid passport", "Job offer letter", "Labor certification", "Resume/CV", "Educational credentials", "Bank statements", "Police clearance"],
  Student: ["Valid passport", "University acceptance letter", "Financial proof", "Academic transcripts", "Language test scores", "Statement of purpose", "Health insurance"],
  Business: ["Valid passport", "Business invitation letter", "Company registration", "Bank statements", "Travel itinerary", "Previous business travel proof"],
  Transit: ["Valid passport", "Onward flight ticket", "Transit visa for next destination", "Travel itinerary"],
  Family: ["Valid passport", "Relationship proof", "Sponsor's financial documents", "Sponsor's employment proof", "Birth/marriage certificates"],
  B1: ["Valid passport (6+ months)", "DS-160 confirmation", "Interview appointment", "Business invitation letter", "Employer letter (purpose + funding)", "Bank statements (3 months)", "Ties to home country (job, property, family)"],
  B2: ["Valid passport (6+ months)", "DS-160 confirmation", "Interview appointment", "Travel itinerary", "Hotel reservations", "Bank statements (3 months)", "Ties to home country (job, property, family)"],
  "B1/B2": ["Valid passport (6+ months)", "DS-160 confirmation", "Interview appointment", "Purpose-of-travel evidence", "Bank statements (3 months)", "Ties to home country (job, property, family)", "Previous visas / travel history"],
  "H-1B": ["Valid passport", "Approved I-129 petition (I-797 notice)", "Labor Condition Application (LCA)", "Job offer in a specialty occupation", "Degree + transcripts / credential evaluation", "Resume/CV", "Employer support letter"],
  "L-1": ["Valid passport", "Approved I-129 petition (I-797 notice)", "Proof of 1-year employment abroad", "Org chart + qualifying relationship", "Pay stubs / employment letter", "Resume/CV"],
  "O-1": ["Valid passport", "Approved I-129 petition (O classification)", "Evidence of extraordinary ability (awards, press, publications)", "Advisory opinion letter", "Contract / itinerary of events", "Resume/CV"],
  "F-1": ["Valid passport (6+ months)", "Form I-20 from SEVP school", "SEVIS fee receipt", "DS-160 confirmation", "Financial proof (tuition + living)", "Academic transcripts", "Ties to home country"],
  "J-1": ["Valid passport (6+ months)", "Form DS-2019", "SEVIS fee receipt", "DS-160 confirmation", "Program sponsor letter", "Financial proof", "Two-year home residency note (if applicable)"],
};

const VISA_GUIDE: Record<string, { who: string; steps: string[]; qualifies: string[] }> = {
  B1: { who: "Short business visits: meetings, conferences, contract talks. No US employment.", steps: ["Fill DS-160", "Pay the fee", "Book the interview", "Attend with business evidence", "Receive passport with visa"], qualifies: ["Clear business purpose", "Trip is short and funded", "Strong home ties"] },
  B2: { who: "Tourism, family visits, medical treatment. No work, no study.", steps: ["Fill DS-160", "Pay the fee", "Book the interview", "Show itinerary + funds", "Receive passport with visa"], qualifies: ["Genuine visitor intent", "Funds for the trip", "Strong home ties"] },
  "B1/B2": { who: "Combined business + tourism visa, usually 10-year multiple entry.", steps: ["Fill DS-160", "Pay the fee", "Book the interview", "Cover both purposes", "Receive passport with visa"], qualifies: ["Mixed or flexible travel plans", "Travel history helps", "Strong home ties"] },
  "H-1B": { who: "Specialty-occupation work for a US employer sponsor. Lottery + petition.", steps: ["Get a US job offer", "Employer files LCA", "Employer files I-129 petition", "Consular interview with I-797", "Enter and start work"], qualifies: ["Bachelor's+ in a related field", "Employer willing to sponsor", "Role is a specialty occupation"] },
  "L-1": { who: "Intra-company transfer for managers or specialized staff.", steps: ["1 year with the company abroad", "Employer files I-129", "Consular interview", "Enter and start role"], qualifies: ["Manager/executive or specialist", "Qualifying company relationship", "1-year continuous employment"] },
  "O-1": { who: "Extraordinary ability in sciences, arts, sports, or business.", steps: ["Gather ability evidence", "Get advisory opinion", "Employer files I-129", "Consular interview"], qualifies: ["Awards, press, or top salary proof", "Sustained acclaim", "US work lined up"] },
  "F-1": { who: "Full-time study at a US school. Work limited to campus/OPT.", steps: ["Get accepted + I-20", "Pay SEVIS fee", "Fill DS-160", "Interview with funds proof", "Enter before program start"], qualifies: ["SEVP-school acceptance", "Funds for tuition + living", "Non-immigrant intent"] },
  "J-1": { who: "Exchange programs: scholars, interns, au pairs, trainees.", steps: ["Get DS-2019 from sponsor", "Pay SEVIS fee", "Fill DS-160", "Interview", "Enter on program dates"], qualifies: ["Approved sponsor program", "Funds + insurance", "Check 2-year home rule"] },
  Tourist: { who: "Short leisure visits. Rules vary by country.", steps: ["Check entry rules", "Prepare funds + itinerary proof", "Apply or enter visa-free", "Travel"], qualifies: ["Valid passport", "Trip funds", "Return ticket"] },
  Work: { who: "Employment abroad, usually needs a sponsor first.", steps: ["Get a job offer", "Employer sponsors permit", "Apply with contract", "Interview / biometrics"], qualifies: ["Job offer", "Matching skills", "Clean record"] },
  Student: { who: "Full-time study abroad.", steps: ["Get accepted", "Prove funds", "Apply with acceptance letter", "Interview"], qualifies: ["School acceptance", "Tuition + living funds", "Study intent"] },
  Business: { who: "Business travel without local employment.", steps: ["Invitation letter", "Apply with business proof", "Travel"], qualifies: ["Business purpose", "Company backing"] },
  Transit: { who: "Passing through en route elsewhere.", steps: ["Onward ticket", "Apply if required", "Transit"], qualifies: ["Confirmed onward travel"] },
  Family: { who: "Joining or visiting family abroad.", steps: ["Relationship proof", "Sponsor documents", "Apply", "Interview"], qualifies: ["Provable relationship", "Sponsor support"] },
};

const PEAK_SEASONS: Record<string, string> = {
  "United States": "June-August (summer tourism), September (fall intake)",
  "United Kingdom": "June-September (tourism), September (student intake)",
  "Canada": "May-August (tourism), January/September (student intake)",
  "Germany": "June-August (tourism), October (winter semester)",
  "Australia": "December-February (summer), July (semester start)",
  "Japan": "March-May (cherry blossom), October-November (autumn)",
  "France": "June-August (peak tourism), September (back to school)",
  "India": "October-December (tourism season), July-August (monsoon avoid)",
  "Brazil": "December-March (summer), February (carnival)",
  "South Korea": "March-May (spring), September-November (autumn)",
  "Schengen": "June-August (peak tourism), apply 3+ months early",
  "UAE": "November-March (cooler weather), avoid June-August",
};

const SUCCESS_TIPS: Record<string, string[]> = {
  "United States": ["Apply 3-6 months in advance", "Show strong ties to home country", "Prepare for consular interview", "Bring complete documentation"],
  "United Kingdom": ["Apply online through official portal", "Provide proof of financial means", "Include detailed travel plan", "Show return flight booking"],
  "Canada": ["Use the online application portal", "Include biometrics promptly", "Provide police clearance", "Show sufficient funds"],
  default: ["Apply well in advance", "Prepare all required documents", "Show financial stability", "Demonstrate ties to home country", "Be honest in application"],
};

function riskLevel(days: number) {
  if (days <= 10) return { label: "Fast", cls: "risk-fast", color: "#16a34a", bg: "rgba(22,163,74,0.28)" };
  if (days <= 25) return { label: "Moderate", cls: "risk-medium", color: "#d97706", bg: "rgba(217,119,6,0.28)" };
  return { label: "Slow", cls: "risk-slow", color: "#dc2626", bg: "rgba(220,38,38,0.28)" };
}

type Tab = "search" | "my" | "tools" | "inbox";

const DESTINATION_MAP: Record<string, string[]> = {
  NG: ["United States", "United Kingdom", "Canada", "Germany"],
  IN: ["United States", "Canada", "United Kingdom", "Germany"],
  PH: ["United States", "Canada", "United Kingdom", "Japan"],
  PK: ["United Kingdom", "United States", "Canada", "UAE"],
  BD: ["United States", "United Kingdom", "Canada", "Japan"],
  KE: ["United States", "United Kingdom", "Canada", "Germany"],
  GH: ["United Kingdom", "United States", "Canada", "Germany"],
  EG: ["United States", "United Kingdom", "Canada", "Germany"],
  ZA: ["United Kingdom", "United States", "Canada", "Germany"],
  MA: ["France", "United States", "Canada", "Spain"],
  ID: ["United States", "Australia", "Japan", "Canada"],
  MX: ["United States", "Canada", "United Kingdom", "Schengen"],
  BR: ["United States", "Canada", "United Kingdom", "France"],
  TR: ["Germany", "United States", "United Kingdom", "France"],
  UA: ["Germany", "Poland", "United States", "Canada"],
  CO: ["United States", "Canada", "United Kingdom", "Schengen"],
  AR: ["United States", "Canada", "United Kingdom", "Schengen"],
  TH: ["Japan", "United States", "United Kingdom", "Canada"],
  VN: ["Japan", "United States", "South Korea", "Canada"],
  CN: ["United States", "Canada", "United Kingdom", "Australia"],
  JP: ["United States", "United Kingdom", "Canada", "Australia"],
  KR: ["United States", "Canada", "Japan", "United Kingdom"],
  US: ["Schengen", "United Kingdom", "Japan", "Canada"],
  GB: ["Schengen", "United States", "Australia", "Canada"],
  CA: ["United States", "United Kingdom", "Schengen", "Japan"],
  DE: ["United States", "Canada", "Japan", "Australia"],
  FR: ["United States", "Canada", "United Kingdom", "Japan"],
  AU: ["United States", "United Kingdom", "Japan", "Schengen"],
  XX: ["United States", "United Kingdom", "Canada", "Australia"],
};

const ORIGIN_CODES: Record<string, string> = {
  Nigeria: "NG", India: "IN", Philippines: "PH", Pakistan: "PK",
  Bangladesh: "BD", Kenya: "KE", Ghana: "GH", Egypt: "EG",
  "South Africa": "ZA", Morocco: "MA", Indonesia: "ID", Mexico: "MX",
  Brazil: "BR", Turkey: "TR", Ukraine: "UA", Colombia: "CO",
  Argentina: "AR", Thailand: "TH", Vietnam: "VN", China: "CN",
  Japan: "JP", "South Korea": "KR", "United States": "US",
  "United Kingdom": "GB", Canada: "CA", Germany: "DE", France: "FR",
  Australia: "AU", Other: "XX",
};

function originCode(name: string) {
  return ORIGIN_CODES[name] || "XX";
}

export default function Dashboard() {
  const { signOut } = useAuthActions();
  const identityEmail = useQuery(api.users.getIdentityEmail);
  const profile = useQuery(api.users.getProfile);
  const [tab, setTab] = useState<Tab>("search");
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("");
  const [visaGroup, setVisaGroup] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareCountries, setCompareCountries] = useState<string[]>(["United States", "Canada", "United Kingdom"]);
  const [compareCommitted, setCompareCommitted] = useState<string[]>(["United States", "Canada", "United Kingdom"]);
  const [compareVisaType, setCompareVisaType] = useState("");
  const [showAddApp, setShowAddApp] = useState(false);
  const [newApp, setNewApp] = useState({ country: "", visaType: "Tourist", applicationDate: new Date().toISOString().split("T")[0] });
  const [toolTab, setToolTab] = useState<"compare" | "intelligence" | "hub">("compare");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState<"profile" | "export" | "delete" | null>(null);

  const searchResults = useQuery(api.visa.search, searchQuery.length > 0 ? { query: searchQuery } : "skip");
  const countryData = useQuery(api.visa.getByCountry, country ? { country } : "skip");
  const compareData = useQuery(api.visa.compare, { countries: compareCommitted, visaType: compareVisaType || undefined });
  const [heldCompare, setHeldCompare] = useState<any[] | undefined>(undefined);
  if (compareData && compareData.length > 0) {
    if (heldCompare !== compareData) setHeldCompare(compareData);
  }
  const compareShown = compareData && compareData.length > 0 ? compareData : heldCompare;

  const myCountry = profile?.country ?? "";
  const myFlagCode = originCode(myCountry);
  const forYou = DESTINATION_MAP[myFlagCode] || DESTINATION_MAP.XX;
  const forYouCards = forYou
    .map((name) => COUNTRIES.find((c) => c.name === name))
    .filter((c): c is { name: string; code: string } => !!c);
  const usedForYou = myCountry ? forYouCards.map((c) => c.name) : [];
  const fastest = useQuery(api.visa.getFastestFor, usedForYou.length ? { countries: usedForYou } : "skip");
  const restCards = COUNTRIES.filter((c) => !forYou.includes(c.name));
  const sparklines = useQuery(
    api.visa.getSparklines,
    { countries: (myCountry ? restCards : COUNTRIES).map((c) => c.name) }
  );
  const countryAverages = useQuery(api.visa.getCountryAverages);
  const avgFor = (name: string) => countryAverages?.[name] ?? 0;
  const activeGroup = VISA_GROUPS.find((g) => g.id === visaGroup);
  const activeTypes = visaType ? [visaType] : activeGroup ? activeGroup.types : [];
  const typeAverages = useQuery(api.visa.getTypeAverages, activeTypes.length ? { types: activeTypes } : "skip");
  const cardAvg = (name: string) => (activeTypes.length ? (typeAverages?.[name] ?? avgFor(name)) : avgFor(name));

  const createProfile = useMutation(api.users.createProfile);

  useEffect(() => {
    const pendingCountry = localStorage.getItem("vradr_signup_country");
    if (pendingCountry && (!profile || !profile.country)) {
      createProfile({ country: pendingCountry });
      localStorage.removeItem("vradr_signup_country");
    }
  }, [profile, createProfile]);

  useEffect(() => {
    const t = setTimeout(() => setCompareCommitted(compareCountries), 450);
    return () => clearTimeout(t);
  }, [compareCountries]);

  useEffect(() => {
    if (!showSettings) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dash-gear")) setShowSettings(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showSettings]);

  const myApps = useQuery(api.applications.listByUser);
  const myAlerts = useQuery(api.alerts.listByUser);
  const watchlist = useQuery(api.watchlist.listByUser);
  const trackApp = useMutation(api.applications.track);
  const removeApp = useMutation(api.applications.remove);
  const updateAppStatus = useMutation(api.applications.updateStatus);
  const markAlertRead = useMutation(api.alerts.markRead);
  const markAllAlertsRead = useMutation(api.alerts.markAllRead);
  const addWatch = useMutation(api.watchlist.add);
  const removeWatch = useMutation(api.watchlist.remove);
  const createAlert = useMutation(api.alerts.create);
  const updateProfile = useMutation(api.users.updateProfile);
  const exportMyData = useMutation(api.users.exportMyData);
  const deleteAllMyData = useMutation(api.users.deleteAllMyData);

  const watchingKey = (country: string, visaType: string) =>
    `${country}::${visaType}`;
  const watchedSet = new Set(
    (watchlist ?? []).map((w: any) => watchingKey(w.country, w.visaType))
  );

  const toggleWatch = async (country: string, visaType: string) => {
    const existing = (watchlist ?? []).find(
      (w: any) => w.country === country && w.visaType === visaType
    );
    if (existing) {
      await removeWatch({ id: existing._id });
    } else {
      await addWatch({ country, visaType });
      await createAlert({
        type: "watch",
        message: `We're now watching ${visaType} visa wait times for ${country}.`,
      });
    }
  };

  const appCount = myApps?.length ?? 0;

  return (
    <div className="dash-wrap">
      <Navbar variant="dashboard" right={
        <>
          <span className="tag">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
            Live
          </span>
          <ThemeToggle />
          <div className="dash-gear">
            <button onClick={() => setShowSettings((s) => !s)} className={`dash-nav-icon-btn dash-gear-btn ${showSettings ? "active" : ""}`} title="Settings">
              <Cog6ToothIcon width={16} height={16} />
            </button>
            {showSettings && (
              <div className="dash-settings-menu">
                <button onClick={() => { setSettingsMenu("profile"); setShowSettings(false); }}>
                  <UserIcon width={14} height={14} /> Profile
                </button>
                <button onClick={() => { setSettingsMenu("export"); setShowSettings(false); }}>
                  <ArrowDownTrayIcon width={14} height={14} /> Export data
                </button>
                <button className="danger" onClick={() => { setSettingsMenu("delete"); setShowSettings(false); }}>
                  <KeyIcon width={14} height={14} /> Delete account
                </button>
              </div>
            )}
          </div>
          <button onClick={() => signOut()} className="dash-nav-icon-btn"><ArrowRightOnRectangleIcon width={16} height={16} /></button>
        </>
      } />

      <div className="dash-content">
        {/* Hero header */}
        <div className="dash-hero">
          <div className="dash-hero-eyebrow">
            {tab === "search" && (country ? <GlobeAltIcon width={13} height={13} /> : <MagnifyingGlassIcon width={13} height={13} />)}
            {tab === "my" && <BellIcon width={13} height={13} />}
            {tab === "tools" && <ChartBarIcon width={13} height={13} />}
            {tab === "inbox" && <EnvelopeIcon width={13} height={13} />}
            {tab === "search" ? (country ? "Country deep dive" : "Live embassy data") : tab === "my" ? "Your portfolio" : tab === "inbox" ? "Mail + feeds" : "Power user tools"}
          </div>
          <h1 className="dash-hero-title">
            {tab === "search" && !country && (myCountry ? <>Visas from <span className="dash-hero-accent">{myCountry}</span></> : "Visa Wait Times")}
            {tab === "search" && country && <>{country} <span className="dash-hero-accent">visas</span></>}
            {tab === "my" && "Your Applications"}
            {tab === "tools" && "Tools"}
            {tab === "inbox" && "Inbox"}
          </h1>
          {tab === "search" && !country && !myCountry && (
            <p className="dash-hero-sub">Pick a country below to see live embassy wait times. Sign up with your country for a personalized view.</p>
          )}
          {tab === "search" && country && (
            <p className="dash-hero-sub">Real-time processing estimate, visa-type breakdown, and success guidance for {country}.</p>
          )}
          {tab === "my" && (
            <p className="dash-hero-sub">Track applications and get notified the moment wait times change.</p>
          )}
          {tab === "tools" && (
            <p className="dash-hero-sub">Compare countries, scan intelligence, and organize your documents.</p>
          )}
          {tab === "inbox" && (
            <p className="dash-hero-sub">App inbox powered by AgentMail, fed by Firecrawl scrapes.</p>
          )}
        </div>

        {/* Tab bar */}
        <div className="dash-tabs">
          {([
            { id: "search" as Tab, label: "Search", icon: MagnifyingGlassIcon },
            { id: "my" as Tab, label: "My Apps", icon: BriefcaseIcon, badge: appCount },
            { id: "tools" as Tab, label: "Tools", icon: ChartBarIcon },
            { id: "inbox" as Tab, label: "Inbox", icon: EnvelopeIcon },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`dash-tab ${tab === t.id ? "dash-tab-active" : ""}`}>
              <t.icon width={15} height={15} />
              {t.label}
              {"badge" in t && <span className="dash-tab-badge">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* SEARCH TAB — no country selected */}
        {tab === "search" && !country && (
          <>
            {/* Quick search */}
            <div className="dash-search-wrap">
              <MagnifyingGlassIcon width={18} height={18} className="dash-search-icon" />
              <input
                type="text"
                placeholder="Search a country or visa type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dash-search-input"
              />
            </div>

            {/* Search results */}
            {searchResults && searchResults.length > 0 && (
              <div className="dash-search-results">
                {searchResults.filter((r: any) => !activeTypes.length || activeTypes.includes(r.visaType)).slice(0, 8).map((r: any) => {
                  const risk = riskLevel(r.waitDays);
                  const Icon = VISA_ICONS[r.visaType] || GlobeAltIcon;
                  return (
                    <button key={r._id} className="dash-search-result" onClick={() => { setCountry(r.country); setSearchQuery(""); }}>
                      <div className="dash-search-result-left">
                        <Icon width={16} height={16} />
                        <div>
                          <span className="dash-search-result-country">{r.country}</span>
                          <span className="dash-search-result-type">{r.visaType}</span>
                        </div>
                      </div>
                      <div className="dash-search-result-right">
                        <span className={`risk-badge ${risk.cls}`}>{risk.label}</span>
                        <span className="dash-search-result-days">{r.waitDays}d</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ONE BIG ANSWER — real-time */}
            {myCountry && fastest && (
              <>
                <div className="dash-answer">
                  <span className="dash-answer-live"><span className="dash-answer-dot" /> Live</span>
                  <div className="dash-answer-row">
                    <Flag code={COUNTRIES.find((c) => c.name === fastest.country)?.code ?? "us"} className="dash-answer-flag" />
                    <div className="dash-answer-text">
                      <span className="dash-answer-label">Fastest from {myCountry} right now</span>
                      <div className="dash-answer-line">
                        <span className="dash-answer-country">{fastest.country}</span>
                        <span className="dash-answer-type">{fastest.visaType} visa</span>
                      </div>
                    </div>
                    <div className="dash-answer-days">{fastest.waitDays}<span> days</span></div>
                  </div>
                </div>

                {/* Your window — predictive sentence */}
                <WindowCard
                  country={fastest.country}
                  visaType={fastest.visaType}
                  waitDays={fastest.waitDays}
                  watched={watchedSet.has(watchingKey(fastest.country, fastest.visaType))}
                  onWatch={() => toggleWatch(fastest.country, fastest.visaType)}
                />
              </>
            )}

            {/* Popular for you — swipeable */}
            {myCountry && forYouCards.length > 0 && (
              <div className="dash-popular">
                <h3 className="dash-grid-label">Top destinations for you</h3>
                <div className="dash-popular-scroll">
                  {forYouCards.map((c) => (
                    <button key={c.name} className="dash-popular-item" onClick={() => setCountry(c.name)}>
                      <Flag code={c.code} className="dash-popular-flag" />
                      <span className="dash-popular-name">{c.name}</span>
                      <ArrowRightIcon width={15} height={15} className="dash-popular-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Visa type filter: groups, then sub-pills */}
            <div className="dash-filters">
              {VISA_GROUPS.map((g) => (
                <button key={g.id} onClick={() => { setVisaGroup(visaGroup === g.id ? "" : g.id); setVisaType(""); }} className={`dash-filter ${visaGroup === g.id ? "dash-filter-active" : ""}`}>
                  <g.icon width={13} height={13} />{g.id}
                </button>
              ))}
            </div>
            {activeGroup && activeGroup.types.length > 1 && (
              <div className="dash-filters">
                {activeGroup.types.map((t) => {
                  const SubIcon = VISA_ICONS[t] || GlobeAltIcon;
                  return (
                    <button key={t} onClick={() => setVisaType(visaType === t ? "" : t)} className={`dash-filter ${visaType === t ? "dash-filter-active" : ""}`}>
                      <SubIcon width={13} height={13} />{t}
                    </button>
                  );
                })}
              </div>
            )}

            {/* All countries — always shown */}
            <div className="dash-browse">
              <div className="dash-browse-head">
                <div className="dash-browse-title">
                  <GlobeAltIcon width={16} height={16} />
                  <span>{myCountry ? "Browse all countries" : "All countries"}</span>
                </div>
                <span className="dash-browse-count">{COUNTRIES.length} countries</span>
              </div>
              <div className="dash-countries-grid">
                {(myCountry ? restCards : COUNTRIES).map((c) => {
                  const watched = watchedSet.has(watchingKey(c.name, "Tourist"));
                  const risk = riskLevel(cardAvg(c.name));
                  return (
                    <Tilt
                      key={c.name}
                      className="dash-country-card"
                      onClick={() => setCountry(c.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="dash-country-top">
                        <Flag code={c.code} className="dash-country-flag" />
                        <span className="dash-country-name">{c.name}</span>
                        <span className={`dash-watch-btn dash-country-watch ${watched ? "watched" : ""}`} onClick={(e: any) => { e.stopPropagation(); toggleWatch(c.name, "Tourist"); }}>
                          <HeartIcon width={13} height={13} fill={watched ? "#ef4444" : "none"} />
                        </span>
                      </div>
                      <div className="dash-country-bottom">
                        <div className="dash-country-spark">
                          <Sparkline values={sparklines?.[c.name] ?? undefined} color={risk.color} width={56} height={16} />
                        </div>
                        <ArrowRightIcon width={14} height={14} className="dash-country-arrow" />
                      </div>
                    </Tilt>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* SEARCH TAB — country selected */}
        {tab === "search" && country && (
          <CountryDetail
            country={country}
            data={countryData}
            onBack={() => setCountry("")}
            watchedSet={watchedSet}
            watchingKey={watchingKey}
            toggleWatch={toggleWatch}
          />
        )}

        {/* MY APPS TAB */}
        {tab === "my" && (
          <MyAppsTab
            showAddApp={showAddApp}
            setShowAddApp={setShowAddApp}
            newApp={newApp}
            setNewApp={setNewApp}
            myApps={myApps}
            myAlerts={myAlerts}
            trackApp={trackApp}
            removeApp={removeApp}
            updateStatus={updateAppStatus}
            markAlertRead={markAlertRead}
            markAllAlertsRead={markAllAlertsRead}
          />
        )}

        {/* TOOLS TAB */}
        {tab === "tools" && (
          <ToolsTab
            toolTab={toolTab}
            setToolTab={setToolTab}
            compareCountries={compareCountries}
            setCompareCountries={setCompareCountries}
            compareVisaType={compareVisaType}
            setCompareVisaType={setCompareVisaType}
            compareData={compareShown}
          />
        )}

        {/* INBOX TAB */}
        {tab === "inbox" && <InboxTab />}
      </div>

      {/* Mobile bottom nav */}
      <nav className="dash-bottomnav">
        <div className="dash-bottomnav-inner">
          {([
            { id: "search" as Tab, label: "Search", icon: MagnifyingGlassIcon },
            { id: "my" as Tab, label: "My Apps", icon: BriefcaseIcon, badge: appCount },
            { id: "tools" as Tab, label: "Tools", icon: ChartBarIcon },
            { id: "inbox" as Tab, label: "Inbox", icon: EnvelopeIcon },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`dash-bottomnav-btn ${tab === t.id ? "active" : ""}`}
            >
              <t.icon width={18} height={18} />
              <span className="dash-bottomnav-label">
              {t.label}
              {"badge" in t && <span className="dash-bottomnav-badge">{t.badge}</span>}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {settingsMenu === "profile" && (
        <ProfileModal profile={profile} email={identityEmail} onClose={() => setSettingsMenu(null)} updateProfile={updateProfile} />
      )}
      {settingsMenu === "export" && (
        <ExportModal onClose={() => setSettingsMenu(null)} exportMyData={exportMyData} />
      )}
      {settingsMenu === "delete" && (
        <DeleteModal onClose={() => setSettingsMenu(null)} deleteAllMyData={deleteAllMyData} />
      )}
    </div>
  );
}

/* ─── Modal shell — compact, fits viewport ─── */
function Modal({ title, icon, onClose, children }: any) {
  return (
    <div className="dash-modal-backdrop" onClick={onClose}>
      <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dash-modal-head">
          <div className="dash-modal-title">{icon} {title}</div>
          <button onClick={onClose} className="dash-modal-close"><XMarkIcon width={16} height={16} /></button>
        </div>
        <div className="dash-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── Profile modal ─── */
function ProfileModal({ profile, email, onClose, updateProfile }: any) {
  const [name, setName] = useState(profile?.name ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setCountry(profile.country ?? "");
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, country });
      setSavedMsg("Profile saved.");
      setTimeout(() => setSavedMsg(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Profile" icon={<UserIcon width={16} height={16} />} onClose={onClose}>
      <label className="dash-field">
        <span>Email</span>
        <input className="dash-input" value={email ?? profile?.email ?? ""} disabled />
      </label>
      <label className="dash-field">
        <span>Display name</span>
        <input className="dash-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </label>
      <label className="dash-field">
        <span>Home country</span>
        <Select
          value={country}
          onChange={(v) => setCountry(v)}
          options={[{ value: "", label: "Not set" }, ...ORIGIN_COUNTRIES.map((c) => ({ value: c.name, label: c.name, code: c.code }))]}
          placeholder="Select country"
        />
      </label>
      <div className="dash-save-row">
        <button onClick={save} className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        {savedMsg && <span className="dash-saved-msg"><CheckCircleIcon width={14} height={14} /> {savedMsg}</span>}
      </div>
    </Modal>
  );
}

/* ─── Export modal ─── */
function ExportModal({ onClose, exportMyData }: any) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vradr-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal title="Export your data" icon={<ArrowDownTrayIcon width={16} height={16} />} onClose={onClose}>
      <p className="dash-settings-note">Download a portable copy of everything tied to this account: your applications, alerts, watchlist, and profile, as a JSON file.</p>
      <div className="dash-settings-actions">
        <button onClick={handleExport} className="btn btn-primary" disabled={exporting}>
          <ArrowDownTrayIcon width={14} height={14} /> {exporting ? "Exporting…" : "Export my data"}
        </button>
        {done && <span className="dash-saved-msg"><CheckCircleIcon width={14} height={14} /> Download started.</span>}
      </div>
    </Modal>
  );
}

/* ─── Delete modal ─── */
function DeleteModal({ onClose, deleteAllMyData }: any) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteAllMyData();
      onClose();
      setTimeout(() => { window.location.href = "/"; }, 300);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete account" icon={<KeyIcon width={16} height={16} />} onClose={onClose}>
      <p className="dash-settings-note">This permanently wipes your applications, alerts, watchlist, and profile. This action cannot be undone.</p>
      <div className="dash-settings-actions">
        <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
          <TrashIcon width={14} height={14} /> {deleting ? "Deleting…" : confirming ? "Tap again to confirm" : "Delete my data"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Your window — predictive card ─── */
function WindowCard({ country, visaType, waitDays, watched, onWatch }: any) {
  const risk = riskLevel(waitDays);
  const pct = Math.min(1, waitDays / 60);
  const circumference = 2 * Math.PI * 30;
  const late = waitDays > 25;
  const sentence = late
    ? `${country}'s ${visaType} visa is running <em>~${waitDays} days</em>. Experienced drops in ${seasonHint(waitDays)} — plan your application window now.`
    : `${country} is processing ${visaType} visas in about <em>${waitDays} days</em>. That holds for the next few weeks — a good time to apply.`;

  return (
    <div className="dash-window fade-up">
      <div className="dash-window-ring" style={{ "--risk": risk.color, "--risk-glow": risk.bg } as React.CSSProperties}>
        <svg viewBox="0 0 68 68">
          <circle className="track" cx="34" cy="34" r="30" />
          <circle
            className="bar"
            cx="34" cy="34" r="30"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
          />
        </svg>
        <span className="glow" />
        <span className="num">{waitDays}</span>
      </div>
      <div className="dash-window-text">
        <span className="dash-window-kicker">Your window</span>
        <p className="dash-window-prediction" dangerouslySetInnerHTML={{ __html: sentence }} />
        <p className="dash-window-meta">Based on live embassy reports{watched ? " · you're watching this" : ""}</p>
        <button className="dash-window-cta" onClick={onWatch}>
          {watched ? "Watching" : "Watch this"}
          <HeartIcon width={14} height={14} fill={watched ? "currentColor" : "none"} style={{ marginLeft: 2 }} />
        </button>
      </div>
    </div>
  );
}

function seasonHint(days: number) {
  if (days >= 30) return "summer and early autumn";
  if (days >= 20) return "mid-autumn";
  return "the current season";
}
function CountryDetail({ country, data, onBack, watchedSet, watchingKey, toggleWatch }: any) {
  const code = COUNTRIES.find((c) => c.name === country)?.code ?? "us";
  const predict = useAction(api.predictions.predictWaitTime);
  const [prediction, setPrediction] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // One latest record per visaType for clean per-type cards.
  const visaTypes = (data || []).reduce((acc: any, r: any) => {
    const cur = acc.get(r.visaType);
    if (!cur || r.dateReported > cur.dateReported) acc.set(r.visaType, r);
    return acc;
  }, new Map<string, any>());
  const latest = [...visaTypes.values()];

  const runPrediction = async () => {
    if (!latest.length || predicting) return;
    setPredicting(true);
    try {
      const top = [...latest].sort((a, b) => a.waitDays - b.waitDays)[0];
      const history = (data || [])
        .filter((r: any) => r.visaType === top.visaType)
        .slice(-8)
        .map((r: any) => ({ waitDays: r.waitDays, dateReported: r.dateReported, source: r.source }));
      setPrediction(await predict({ country, visaType: top.visaType, historicalData: history }));
    } catch {
      setPrediction({ error: true });
    }
    setPredicting(false);
  };

  return (
    <FadeIn>
      <button onClick={onBack} className="dash-back-btn">
        <ArrowLeftIcon width={16} height={16} /> All countries
      </button>

      {/* Country hero */}
      <div className="dash-country-hero">
        <Flag code={code} className="dash-country-hero-flag" />
        <div>
          <h2 className="dash-country-hero-name">{country}</h2>
          <p className="dash-country-hero-sub">{latest.length} visa types tracked</p>
        </div>
      </div>

      {/* Average processing — big accent card */}
      <div className="dash-detail-grid">
        <div className="dash-col-main">
          {latest && latest.length > 0 && (() => {
            const avg = Math.round(latest.reduce((a: number, t: any) => a + t.waitDays, 0) / latest.length);
            const risk = riskLevel(avg);
            return (
              <div className="dash-avg-card">
                <span className="dash-avg-label">Average processing time</span>
                <div className="dash-avg-number">{avg}<span className="dash-avg-unit"> days</span></div>
                <span className="dash-avg-desc" style={{ color: risk.color }}>
                  {risk.label} — {avg <= 10 ? "one of the fastest globally" : avg <= 25 ? "typical processing time" : "expect a longer wait, plan ahead"}
                </span>
              </div>
            );
          })()}

          {/* AI wait prediction (OpenAI) */}
          <div className="dash-section-card" style={{ marginBottom: 16 }}>
            <h4 className="dash-section-title">AI prediction</h4>
            {!prediction ? (
              <button className="dash-compare-chip" onClick={runPrediction} style={{ opacity: predicting ? 0.4 : 1 }}>
                {predicting ? "Predicting..." : "Predict wait time"}
              </button>
            ) : prediction.error ? (
              <p className="dash-hero-sub">Prediction unavailable right now.</p>
            ) : (
              <>
                <div className="dash-avg-number">{prediction.predictedDays}<span className="dash-avg-unit"> days</span></div>
                <p className="dash-hero-sub">{prediction.trend} trend · {prediction.confidence} confidence</p>
                <p className="dash-hero-sub">{prediction.reasoning}</p>
              </>
            )}
          </div>

          {/* Visa type cards */}
          {latest && latest.length > 0 && (
            <div className="dash-visa-grid">
          {latest.map((t: any, idx: number) => {
            const risk = riskLevel(t.waitDays);
            const Icon = VISA_ICONS[t.visaType] || GlobeAltIcon;
            const watched = watchedSet.has(watchingKey(country, t.visaType));
            return (
              <div key={t._id} className={`dash-visa-card fade-up fade-up-${(idx % 5) + 1}`}>
                <div className="dash-visa-card-header">
                  <div className="dash-visa-card-icon"><Icon width={16} height={16} /></div>
                  <span className={`risk-badge risk-badge-compact ${risk.cls}`}>{risk.label}</span>
                  <span className={`dash-watch-btn ${watched ? "watched" : ""}`} onClick={(e: any) => { e.stopPropagation(); toggleWatch(country, t.visaType); }}>
                    <HeartIcon width={14} height={14} fill={watched ? "#ef4444" : "none"} />
                  </span>
                </div>
                <span className="dash-visa-card-type">{t.visaType}</span>
                <div className="dash-visa-card-days">{t.waitDays}<span>d</span></div>
              </div>
            );
          })}
        </div>
      )}

        </div>

        {/* Tips — right column */}
        <aside className="dash-col-aside">
          <div className="dash-section-card">
            <h4 className="dash-section-title"><CheckCircleIcon width={15} height={15} /> Tips for {country}</h4>
            <ul className="dash-tips-list">
              {(SUCCESS_TIPS[country] || SUCCESS_TIPS.default).map((tip, i) => (
                <li key={i} className="dash-tip">{tip}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </FadeIn>
  );
}

/* ─── My Apps Tab ─── */
const STATUS_FLOW = ["pending", "submitted", "processing", "interview", "approved"];

function MyAppsTab({ showAddApp, setShowAddApp, newApp, setNewApp, myApps, myAlerts, trackApp, removeApp, updateStatus, markAlertRead, markAllAlertsRead }: any) {
  const waits = useQuery(api.applications.getAppWaits, myApps?.length ? { pairs: myApps.map((a: any) => ({ country: a.country, visaType: a.visaType })) } : "skip");
  const waitFor = (country: string, visaType: string) => waits?.find((w: any) => w.country === country && w.visaType === visaType)?.waitDays;
  const done = (myApps ?? []).filter((a: any) => a.status === "approved").length;
  const active = (myApps ?? []).filter((a: any) => !["approved", "denied", "completed"].includes(a.status)).length;

  return (
    <FadeIn>
      <div className="dash-section-header">
        <h2 className="dash-section-heading">Applications</h2>
        <button onClick={() => setShowAddApp(!showAddApp)} className="dash-action-btn">
          <PlusIcon width={14} height={14} /> Track New
        </button>
      </div>

      {(myApps ?? []).length > 0 && (
        <div className="dash-stat-row">
          <div className="dash-avg-card">
            <span className="dash-avg-label">In progress</span>
            <div className="dash-avg-number">{active}</div>
          </div>
          <div className="dash-avg-card">
            <span className="dash-avg-label">Approved</span>
            <div className="dash-avg-number">{done}</div>
          </div>
        </div>
      )}

      {showAddApp && (
        <div className="dash-add-form">
          <div className="dash-add-fields">
            <Select
              value={newApp.country}
              onChange={(v) => setNewApp({ ...newApp, country: v })}
              options={COUNTRIES.map((c) => ({ value: c.name, label: c.name, code: c.code }))}
              placeholder="Country"
            />
            <Select
              value={newApp.visaType}
              onChange={(v) => setNewApp({ ...newApp, visaType: v })}
              options={VISA_TYPES.map((v) => ({ value: v.id, label: v.id }))}
            />
            <input type="date" value={newApp.applicationDate} onChange={(e) => setNewApp({ ...newApp, applicationDate: e.target.value })} className="dash-select" />
          </div>
          <div className="dash-add-actions">
            <button disabled={!newApp.country} onClick={async () => {
              await trackApp({ country: newApp.country, visaType: newApp.visaType, applicationDate: newApp.applicationDate });
              setShowAddApp(false);
              setNewApp({ country: "", visaType: "Tourist", applicationDate: new Date().toISOString().split("T")[0] });
            }} className="dash-action-btn">Track</button>
            <button onClick={() => setShowAddApp(false)} className="dash-cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {(!myApps || myApps.length === 0) && !showAddApp && (
        <div className="dash-empty">
          <GlobeAltIcon width={40} height={40} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          <p className="dash-empty-title">No applications yet</p>
          <p className="dash-empty-sub">Track your first visa to get live countdowns and overdue alerts.</p>
          <button onClick={() => setShowAddApp(true)} className="dash-action-btn" style={{ marginTop: 12 }}>
            <PlusIcon width={14} height={14} /> Track your first application
          </button>
        </div>
      )}

      {myApps && myApps.length > 0 && (
        <div className="dash-apps-list">
          {myApps.map((app: any) => {
            const s = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
            const daysSince = Math.floor((Date.now() - new Date(app.applicationDate).getTime()) / 86400000);
            const code = COUNTRIES.find((c) => c.name === app.country)?.code ?? "us";
            const wait = waitFor(app.country, app.visaType);
            const next = STATUS_FLOW[STATUS_FLOW.indexOf(app.status) + 1];
            const overdue = wait !== undefined && daysSince > wait;
            return (
              <div key={app._id} className="dash-app-card" style={overdue ? { borderColor: "#ef4444" } : undefined}>
                <Flag code={code} className="dash-app-flag" />
                <div className="dash-app-info">
                  <span className="dash-app-country">{app.country}</span>
                  <span className="dash-app-meta">{app.visaType} · Applied {daysSince}d ago{wait !== undefined && (overdue ? ` · ${daysSince - wait}d overdue` : ` · ~${wait - daysSince}d left`)}</span>
                </div>
                <span className="dash-status-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                {next && <button onClick={() => updateStatus({ id: app._id, status: next })} className="dash-compare-chip">Advance</button>}
                <button onClick={() => removeApp({ id: app._id })} className="dash-app-delete"><TrashIcon width={14} height={14} /></button>
                {wait !== undefined && (
                  <div className="dash-compare-bar"><i style={{ width: `${Math.min(100, Math.round((daysSince / Math.max(wait, 1)) * 100))}%`, background: overdue ? "#ef4444" : undefined }} /></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {myAlerts && myAlerts.length > 0 && (
        <div className="dash-section" style={{ marginTop: 40 }}>
          <div className="dash-section-header">
            <h3 className="dash-section-heading" style={{ fontSize: 20 }}>Alerts</h3>
            <button onClick={() => markAllAlertsRead()} className="dash-link-btn">Mark all read</button>
          </div>
          <div className="dash-alerts-list">
            {myAlerts.map((alert: any) => (
              <div key={alert._id} className="dash-alert-card" style={{ opacity: alert.read ? 0.5 : 1 }} onClick={() => !alert.read && markAlertRead({ id: alert._id })}>
                <BellIcon width={14} height={14} className="dash-alert-icon" />
                <span className="dash-alert-msg">{alert.message}</span>
                {!alert.read && <span className="dash-alert-dot" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </FadeIn>
  );
}

/* ─── Tools Tab ─── */
function ToolsTab({ toolTab, setToolTab, compareCountries, setCompareCountries, compareVisaType, setCompareVisaType, compareData }: any) {
  return (
    <FadeIn>
      <div className="dash-tools-tabs">
        {([
          { id: "compare" as const, label: "Compare", icon: ChartBarIcon },
          { id: "intelligence" as const, label: "Intelligence", icon: ShieldCheckIcon },
          { id: "hub" as const, label: "Documents", icon: BookOpenIcon },
        ]).map((t) => (
          <button key={t.id} onClick={() => setToolTab(t.id)} className={`dash-tab ${toolTab === t.id ? "dash-tab-active" : ""}`}>
            <t.icon width={14} height={14} />{t.label}
          </button>
        ))}
      </div>

      {toolTab === "compare" && (
        <ComparePanel
          compareCountries={compareCountries}
          setCompareCountries={setCompareCountries}
          compareVisaType={compareVisaType}
          setCompareVisaType={setCompareVisaType}
          compareData={compareData}
        />
      )}
      {toolTab === "intelligence" && <IntelligencePanel />}
      {toolTab === "hub" && <HubPanel />}
    </FadeIn>
  );
}

function ComparePanel({ compareCountries, setCompareCountries, compareVisaType, setCompareVisaType, compareData }: any) {
  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Select countries to compare<span className="dash-swipe-hint">swipe →</span></h4>
        <div className="dash-compare-chips">
          {COUNTRIES.map((c) => {
            const active = compareCountries.includes(c.name);
            return (
              <button key={c.name} onClick={() => setCompareCountries(active ? compareCountries.filter((x: string) => x !== c.name) : [...compareCountries, c.name])} className={`dash-compare-chip ${active ? "dash-compare-chip-active" : ""}`}>
                <Flag code={c.code} className="dash-compare-chip-flag" />{c.name}
              </button>
            );
          })}
        </div>
        <div className="dash-compare-chips" style={{ marginTop: 12 }}>
          <button onClick={() => setCompareVisaType("")} className={`dash-compare-chip ${!compareVisaType ? "dash-compare-chip-active" : ""}`}>All types</button>
          {VISA_TYPES.map((v) => (
            <button key={v.id} onClick={() => setCompareVisaType(compareVisaType === v.id ? "" : v.id)} className={`dash-compare-chip ${compareVisaType === v.id ? "dash-compare-chip-active" : ""}`}>{v.id}</button>
          ))}
        </div>
      </div>
      {compareData && compareData.length > 0 && (
        <>
          <div className="dash-avg-card" style={{ marginBottom: 12 }}>
            <span className="dash-avg-label">Fastest pick</span>
            <div className="dash-avg-number">{compareData[0].country}<span className="dash-avg-unit"> · {compareData[0].avgWait}d avg</span></div>
          </div>
          <div className="dash-compare-list">
            {compareData.map((c: any, i: number) => {
              const risk = riskLevel(c.avgWait);
              const code = COUNTRIES.find((x) => x.name === c.country)?.code ?? "us";
              const max = Math.max(...compareData.map((x: any) => x.avgWait), 1);
              const gap = c.avgWait - compareData[0].avgWait;
              return (
                <div key={c.country} className={`dash-compare-card ${i === 0 ? "dash-compare-card-top" : ""}`}>
                  <div className="dash-compare-rank" style={i === 0 ? { color: "var(--accent)" } : {}}>{i + 1}</div>
                  <Flag code={code} className="dash-compare-flag" />
                  <span className="dash-compare-name">{c.country}</span>
                  <div className="dash-compare-right">
                    <span className="dash-compare-days">{c.avgWait}<span>d avg</span></span>
                    <span className={`risk-badge ${risk.cls}`}>{i === 0 ? "Fastest" : `+${gap}d`}</span>
                  </div>
                  <div className="dash-compare-bar"><i style={{ width: `${Math.round((c.avgWait / max) * 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function IntelligencePanel() {
  const [selected, setSelected] = useState("United States");
  const averages = useQuery(api.visa.getCountryAverages);
  const sources = useQuery(api.feeds.listSources);
  const pages = useQuery(api.feeds.latestPages, { limit: 10 });

  const avg = averages?.[selected];
  const month = new Date().toLocaleString("en", { month: "long" });
  const peak = PEAK_SEASONS[selected] ?? "";
  const verdict = avg === undefined ? null : avg <= 12
    ? { t: "Apply now", d: `${avg}d average. No reason to wait.` }
    : peak.toLowerCase().includes(month.toLowerCase())
      ? { t: "Peak season", d: `${avg}d average and it is ${month}. Apply early with complete docs.` }
      : { t: "Prepare now", d: `${avg}d average. Get docs ready ahead of the rush.` };
  const lastScrape = (() => {
    const urls = new Set((sources ?? []).filter((s: any) => s.country === selected).map((s: any) => s.url));
    const hit = (pages ?? []).find((p: any) => urls.has(p.url));
    return hit ? hit.scrapedAt.slice(0, 10) : null;
  })();

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Select a country<span className="dash-swipe-hint">swipe →</span></h4>
        <div className="dash-compare-chips">
          {COUNTRIES.map((c) => (
            <button key={c.name} onClick={() => setSelected(c.name)} className={`dash-compare-chip ${selected === c.name ? "dash-compare-chip-active" : ""}`}>
              <Flag code={c.code} className="dash-compare-chip-flag" />{c.name}
            </button>
          ))}
        </div>
      </div>
      {verdict && (
        <div className="dash-avg-card" style={{ marginBottom: 16 }}>
          <span className="dash-avg-label">{selected} · {month}</span>
          <div className="dash-avg-number" style={{ fontSize: 26 }}>{verdict.t}</div>
          <span className="dash-avg-desc">{verdict.d}</span>
        </div>
      )}
      <div className="dash-intel-list">
        {[
          { id: "peak", icon: CalendarIcon, label: "Peak Seasons", body: <p className="dash-intel-text">{PEAK_SEASONS[selected] || "No data available."}</p> },
          { id: "policy", icon: ShieldCheckIcon, label: "Monitoring", body: <p className="dash-intel-text">{lastScrape ? `Embassy pages last scraped ${lastScrape}.` : "Feed monitoring starts with the next scrape."} {avg !== undefined && `${avg}d current average.`}</p> },
          { id: "success", icon: CheckCircleIcon, label: "Success Tips", body: <ul className="dash-tips-list">{(SUCCESS_TIPS[selected] || SUCCESS_TIPS.default).map((tip, i) => <li key={i} className="dash-tip">{tip}</li>)}</ul> },
        ].map((item) => (
          <div key={item.id} className="dash-intel-card">
            <div className="dash-intel-header">
              <div className="dash-intel-label"><item.icon width={16} height={16} />{item.label}</div>
            </div>
            <div className="dash-intel-body">{item.body}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function HubPanel() {
  const [group, setGroup] = useState("Travel");
  const [selected, setSelected] = useState("Tourist");
  const [travelDate, setTravelDate] = useState("");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const stats = useQuery(api.visa.getTypeStats, { type: selected });

  const pick = (t: string) => { setSelected(t); setTravelDate(""); setStep(0); setDone([]); };
  const guide = VISA_GUIDE[selected];
  const docs = DOC_CHECKLISTS[selected] ?? [];
  const steps = guide?.steps ?? [];

  const applyBy = (() => {
    if (!travelDate || !stats) return null;
    const d = new Date(travelDate + "T12:00:00");
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() - (stats.current + 14));
    return d.toISOString().slice(0, 10);
  })();

  const activeTypes = VISA_GROUPS.find((g) => g.id === group)?.types ?? [];

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Select visa type<span className="dash-swipe-hint">swipe →</span></h4>
        <div className="dash-compare-chips">
          {VISA_GROUPS.map((g) => (
            <button key={g.id} onClick={() => { setGroup(g.id); pick(g.types[0]); }} className={`dash-compare-chip ${group === g.id ? "dash-compare-chip-active" : ""}`}>{g.id}</button>
          ))}
        </div>
        {activeTypes.length > 1 && (
          <div className="dash-compare-chips" style={{ marginTop: 8 }}>
            {activeTypes.map((t) => (
              <button key={t} onClick={() => pick(t)} className={`dash-compare-chip ${selected === t ? "dash-compare-chip-active" : ""}`}>{t}</button>
            ))}
          </div>
        )}
      </div>
      <div className="dash-section-card">
        <h4 className="dash-section-title"><BookOpenIcon width={15} height={15} /> {selected} Visa · Live</h4>
        {stats ? (
          <div className="dash-avg-card" style={{ marginBottom: 12 }}>
            <span className="dash-avg-label">Processing right now · {stats.countries} countries · updated {stats.updatedAt}</span>
            <div className="dash-avg-number">{stats.current}<span className="dash-avg-unit"> days avg</span></div>
            <span className="dash-avg-desc">
              {stats.delta === 0 ? "Steady vs usual" : stats.delta > 0 ? `▲ ${stats.delta}d slower than usual` : `▼ ${-stats.delta}d faster than usual`}
            </span>
          </div>
        ) : (
          <p className="dash-hero-sub">No live data for {selected} yet. Check back after the next feed scrape.</p>
        )}
        {guide && <p className="dash-hero-sub">{guide.who}</p>}

        <h4 className="dash-section-title" style={{ marginTop: 16 }}>When should you apply?</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input type="date" className="dash-input" style={{ maxWidth: 180 }} value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          {applyBy && stats && (
            <span className="dash-hero-sub">Apply by <strong>{applyBy}</strong> to travel {travelDate} ({stats.current}d wait + 14d buffer).</span>
          )}
        </div>

        <h4 className="dash-section-title" style={{ marginTop: 16 }}>Your documents ({done.length}/{docs.length})</h4>
        <div className="dash-compare-chips">
          {docs.map((doc) => {
            const has = done.includes(doc);
            return (
              <button key={doc} onClick={() => setDone(has ? done.filter((d) => d !== doc) : [...done, doc])}
                className={`dash-compare-chip ${has ? "dash-compare-chip-active" : ""}`}>
                {has && <CheckCircleIcon width={13} height={13} />}{doc}
              </button>
            );
          })}
        </div>

        {steps.length > 0 && (
          <>
            <h4 className="dash-section-title" style={{ marginTop: 16 }}>Application process</h4>
            <div className="dash-avg-card">
              <span className="dash-avg-label">Step {Math.min(step + 1, steps.length)} of {steps.length}</span>
              <p style={{ fontSize: 15, fontWeight: 600, margin: "4px 0 10px" }}>{steps[Math.min(step, steps.length - 1)]}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="dash-compare-chip" onClick={() => setStep(Math.max(0, step - 1))} style={{ opacity: step === 0 ? 0.4 : 1 }}>Back</button>
                <button className="dash-compare-chip" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} style={{ opacity: step >= steps.length - 1 ? 0.4 : 1 }}>Next</button>
              </div>
            </div>
          </>
        )}

        {guide && (
          <>
            <h4 className="dash-section-title" style={{ marginTop: 16 }}>Who qualifies</h4>
            <div className="dash-compare-chips">
              {guide.qualifies.map((q) => (
                <span key={q} className="dash-compare-chip" style={{ cursor: "default" }}>{q}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function InboxTab() {
  const messages = useQuery(api.inbox.listMessages, { limit: 30 });
  const markRead = useMutation(api.inbox.markRead);
  const sendEmail = useAction(api.inbox.sendEmail);
  const pages = useQuery(api.feeds.latestPages, { limit: 5 });
  const sources = useQuery(api.feeds.listSources);
  const addSource = useMutation(api.feeds.addSource);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [feedUrl, setFeedUrl] = useState("");
  const [feedLabel, setFeedLabel] = useState("");
  const [mailSearch, setMailSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const markAllRead = useMutation(api.inbox.markAllRead);

  const thread = useQuery(api.inbox.listMessages, threadId ? { limit: 30, threadId } : "skip");

  const send = async () => {
    if (!to || !subject || !body) return;
    setSending(true);
    try {
      await sendEmail({ to, subject, text: body });
      setTo(""); setSubject(""); setBody("");
    } catch {
      toast("Couldn't send. Email isn't connected yet.");
    }
    setSending(false);
  };

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title"><EnvelopeIcon width={15} height={15} /> Inbox</h4>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <input className="dash-input" style={{ flex: 2, minWidth: 140 }} value={mailSearch} onChange={(e) => setMailSearch(e.target.value)} placeholder="Search mail..." />
          <button className={`dash-compare-chip ${unreadOnly ? "dash-compare-chip-active" : ""}`} onClick={() => setUnreadOnly(!unreadOnly)}>Unread</button>
          <button className="dash-compare-chip" onClick={() => markAllRead({})}>Mark all read</button>
        </div>
        {!messages || messages.length === 0 ? (
          <p className="dash-hero-sub">No mail yet. Emails to your inbox will appear here.</p>
        ) : (
          <ul className="dash-docs-list">
            {messages
              .filter((m: any) => (!unreadOnly || !m.read) && (!mailSearch || `${m.subject ?? ""} ${m.from}`.toLowerCase().includes(mailSearch.toLowerCase())))
              .map((m: any) => (
              <li key={m._id} className="dash-doc-item" style={{ cursor: "pointer", fontWeight: m.read ? 400 : 600 }}
                onClick={() => { setThreadId(m.threadId); if (!m.read) markRead({ id: m._id }); }}>
                <EnvelopeIcon width={14} height={14} className="dash-doc-check" />
                <span>{m.direction === "out" ? "→ " : ""}{m.subject || "(no subject)"} <span style={{ opacity: 0.6 }}>· {m.from} · {m.receivedAt.slice(0, 10)}</span></span>
              </li>
            ))}
          </ul>
        )}
        {threadId && thread && (
          <div style={{ marginTop: 12 }}>
            <h4 className="dash-section-title">Thread</h4>
            {thread.slice().reverse().map((m: any) => (
              <p key={m._id} style={{ fontSize: 13, margin: "6px 0" }}><strong>{m.from}:</strong> {m.text?.slice(0, 300)}</p>
            ))}
            <button className="dash-compare-chip" onClick={() => setThreadId(null)}>Close thread</button>
          </div>
        )}
      </div>

      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title"><PaperAirplaneIcon width={15} height={15} /> Compose</h4>
        <label className="dash-field"><span>To</span>
          <input className="dash-input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.com" />
        </label>
        <label className="dash-field"><span>Subject</span>
          <input className="dash-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        </label>
        <label className="dash-field"><span>Message</span>
          <input className="dash-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message..." />
        </label>
        <button className="dash-compare-chip" onClick={send} style={{ opacity: sending || !to || !subject || !body ? 0.4 : 1 }}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="dash-section-card">
        <h4 className="dash-section-title"><RssIcon width={15} height={15} /> Data feeds (Firecrawl)</h4>
        {(!pages || pages.length === 0) && <p className="dash-hero-sub">No scrapes yet. Add a source below; the cron scrapes active sources every 12h.</p>}
        {pages && pages.length > 0 && (
          <ul className="dash-docs-list">
            {pages.map((p: any) => (
              <li key={p._id} className="dash-doc-item">
                <CheckCircleIcon width={14} height={14} className="dash-doc-check" />
                <span>{p.title || p.url} <span style={{ opacity: 0.6 }}>· {p.scrapedAt.slice(0, 10)}</span></span>
              </li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <input className="dash-input" style={{ flex: 2, minWidth: 180 }} value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https:// source URL" />
          <input className="dash-input" style={{ flex: 1, minWidth: 120 }} value={feedLabel} onChange={(e) => setFeedLabel(e.target.value)} placeholder="Label" />
          <button className="dash-compare-chip" onClick={() => { if (feedUrl && feedLabel) { addSource({ url: feedUrl, label: feedLabel }); setFeedUrl(""); setFeedLabel(""); } }}>
            <PlusIcon width={13} height={13} /> Add
          </button>
        </div>
        {sources && sources.length > 0 && (
          <p className="dash-hero-sub" style={{ marginTop: 8 }}>{sources.filter((s: any) => s.active).length} active source(s).</p>
        )}
      </div>
    </>
  );
}
