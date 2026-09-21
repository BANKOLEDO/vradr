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
  { id: "AEWV", icon: BriefcaseIcon },
  { id: "Student", icon: AcademicCapIcon },
  { id: "F-1", icon: AcademicCapIcon },
  { id: "J-1", icon: AcademicCapIcon },
  { id: "Business", icon: BuildingLibraryIcon },
  { id: "Transit", icon: PaperAirplaneIcon },
  { id: "Family", icon: UsersIcon },
] as const;

const VISA_GROUPS = [
  { id: "Travel", icon: MapPinIcon, types: ["Tourist", "B1", "B2", "B1/B2"] },
  { id: "Work", icon: BriefcaseIcon, types: ["Work", "H-1B", "L-1", "O-1", "AEWV"] },
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

// Full destination list for forms. The browse grid stays on tracked countries.
const DESTINATIONS: { name: string; code: string }[] = [
  ...COUNTRIES,
  { name: "Netherlands", code: "NL" }, { name: "Ireland", code: "IE" },
  { name: "Italy", code: "IT" }, { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" }, { name: "Switzerland", code: "CH" },
  { name: "Belgium", code: "BE" }, { name: "Austria", code: "AT" },
  { name: "Portugal", code: "PT" }, { name: "Greece", code: "GR" },
  { name: "Turkey", code: "TR" }, { name: "China", code: "CN" },
  { name: "Malaysia", code: "MY" }, { name: "Singapore", code: "SG" },
  { name: "New Zealand", code: "NZ" }, { name: "Mexico", code: "MX" },
  { name: "South Africa", code: "ZA" }, { name: "Kenya", code: "KE" },
];

const ORIGIN_COUNTRIES: { name: string; code: string }[] = [  { name: "Nigeria", code: "NG" }, { name: "India", code: "IN" },
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
  "H-1B": BriefcaseIcon, "L-1": BriefcaseIcon, "O-1": BriefcaseIcon, "AEWV": BriefcaseIcon,
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
  AEWV: ["Valid passport", "Job offer from an INZ-accredited employer", "Signed employment agreement (pay, hours)", "NZQA-recognised qualification or experience proof", "IELTS (most roles)", "Medical exam + police certificate", "Bank statements (settlement funds)"],
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
  AEWV: { who: "New Zealand work via an accredited employer. Green List roles fast-track residence.", steps: ["Verify employer accreditation", "Check Green List tier for your role", "Employer passes the Job Check", "File migrant check with IELTS, medical, police", "Land, sort IRD, bank, GP in week one"], qualifies: ["Accredited job offer", "Median wage met", "Role requirements (registration/IQA)"] },
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

type Tab = "search" | "my" | "tools" | "prep";

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
  const [toolTab, setToolTab] = useState<"compare" | "intelligence" | "hub" | "feeds">("compare");
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
  const clearWatchAlerts = useMutation(api.alerts.clearWatchAlerts);
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
      await clearWatchAlerts({ country, visaType });
    } else {
      await addWatch({ country, visaType });
      await createAlert({
        type: "watch",
        message: `We're now watching ${visaType} visa wait times for ${country}.`,
      });
    }
  };

  const appCount = myApps?.length ?? 0;
  const unreadCount = (myAlerts ?? []).filter((a: any) => !a.read).length;

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
            {tab === "prep" && <AcademicCapIcon width={13} height={13} />}
            {tab === "search" ? (country ? "Country deep dive" : "Live embassy data") : tab === "my" ? "Your portfolio" : tab === "prep" ? "Get ready" : "Power user tools"}
          </div>
          <h1 className="dash-hero-title">
            {tab === "search" && !country && (myCountry ? <>Leaving <span className="dash-hero-accent">{myCountry}</span></> : "Visa Wait Times")}
            {tab === "search" && country && <>{country} <span className="dash-hero-accent">visas</span></>}
            {tab === "my" && "Your Applications"}
            {tab === "tools" && "Tools"}
            {tab === "prep" && "Prep"}
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
          {tab === "prep" && (
            <p className="dash-hero-sub">SOPs, mock interviews, opportunities, and roadmaps.</p>
          )}
        </div>

        {/* Tab bar */}
        <div className="dash-tabs">
          {([
            { id: "search" as Tab, label: "Search", icon: MagnifyingGlassIcon },
            { id: "my" as Tab, label: "My Apps", icon: BriefcaseIcon, badge: appCount, alertBadge: unreadCount },
            { id: "tools" as Tab, label: "Tools", icon: ChartBarIcon },
            { id: "prep" as Tab, label: "Prep", icon: AcademicCapIcon },
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
                      <span className="dash-answer-label">Fastest way out of {myCountry} right now</span>
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
                {!countryAverages ? (
                  [0, 1, 2, 3].map((i) => <div key={i} className="dash-country-card dash-skel" />)
                ) : (myCountry ? restCards : COUNTRIES).map((c) => {
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

        {/* PREP TAB */}
        {tab === "prep" && <PrepTab />}
      </div>

      {/* Mobile bottom nav */}
      <nav className="dash-bottomnav">
        <div className="dash-bottomnav-inner">
          {([
            { id: "search" as Tab, label: "Search", icon: MagnifyingGlassIcon },
            { id: "my" as Tab, label: "My Apps", icon: BriefcaseIcon, badge: appCount, alertBadge: unreadCount },
            { id: "tools" as Tab, label: "Tools", icon: ChartBarIcon },
            { id: "prep" as Tab, label: "Prep", icon: AcademicCapIcon },
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
  const fastestType = [...latest].sort((a: any, b: any) => a.waitDays - b.waitDays)[0];
  const updatedAt = latest.map((r: any) => r.dateReported).sort().pop()?.slice(0, 10);
  const trends = [...visaTypes.keys()].map((type: string) => ({
    type,
    series: (data || [])
      .filter((r: any) => r.visaType === type)
      .sort((a: any, b: any) => a.dateReported.localeCompare(b.dateReported))
      .slice(-12)
      .map((r: any) => r.waitDays),
  })).filter((t) => t.series.length > 1);

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
          <p className="dash-country-hero-sub">
            {fastestType ? <>Fastest: {fastestType.visaType} · {fastestType.waitDays}d{updatedAt ? <> · Updated {updatedAt}</> : null}</> : "No data yet"}
          </p>
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

          {/* Wait trend */}
          {trends.length > 0 && (
            <div className="dash-section-card" style={{ marginBottom: 16 }}>
              <h4 className="dash-section-title">Wait trend</h4>
              {trends.map((t) => (
                <div key={t.type} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, minWidth: 90 }}>{t.type}</span>
                  <div className="dash-trend"><Sparkline values={t.series} width={220} height={44} /></div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.series[t.series.length - 1]}d</span>
                </div>
              ))}
            </div>
          )}

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
              options={DESTINATIONS.map((c) => ({ value: c.name, label: c.name, code: c.code }))}
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

      {myApps === undefined && (
        <div className="dash-apps-list">
          {[0, 1].map((i) => <div key={i} className="dash-app-card dash-skel" />)}
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
          { id: "feeds" as const, label: "Feeds", icon: RssIcon },
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
      {toolTab === "feeds" && <FeedsPanel />}
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

function FeedsPanel() {
  const pages = useQuery(api.feeds.latestPages, { limit: 5 });
  const sources = useQuery(api.feeds.listSources);
  const addSource = useMutation(api.feeds.addSource);
  const [feedUrl, setFeedUrl] = useState("");
  const [feedLabel, setFeedLabel] = useState("");

  return (
    <>
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

const ROADMAPS: Record<string, { steps: string[]; needs: string[]; warnings?: string[]; links?: { label: string; url: string }[] }> = {
  Study: {
    steps: ["Pick 6-10 schools: 2 safe, 3 moderate, 2 ambitious", "Book IELTS/GRE dates 6 months out", "Draft SOP and request 2-3 LORs", "Apply 8-12 months before intake", "Secure funds and apply for scholarships", "Visa interview with funds proof", "Book flights and housing after approval"],
    needs: ["School acceptance", "English test score", "Tuition + living funds", "Passport 6+ months"],
  },
  Work: {
    steps: ["Pick your route: sponsored, lottery, or talent", "Get offers from licensed sponsors", "Employer files petition or CoS, or seek endorsement", "Consulate interview", "Relocate and start"],
    needs: ["Job offer or endorsement", "Salary threshold met", "English proof (most routes)", "Clean record"],
  },
  Talent: {
    steps: ["Map evidence to 2 endorsement criteria", "Get 2-3 recommendation letters", "File endorsement", "File visa within 3 months", "ILR clock runs 3 or 5 years"],
    needs: ["Exceptional talent or promise", "Recognition evidence", "Referees outside employer"],
  },
  "NZ Work": {
    steps: ["Confirm the employer is INZ-accredited (ask for the number, check the register)", "Check your role on the Green List: Tier 1 means straight to residence", "Hunt on Seek and Trade Me Jobs, apply from Nigeria", "Employer passes the Job Check at median wage", "File your migrant check: passport, contract, IELTS, medical, police", "Land, then in week one: IRD number, bank account, GP enrolment"],
    needs: ["Accredited employer offer", "Median wage met", "IELTS (most roles)", "Medical + police clearance"],
    warnings: ["Never pay for a job offer. Real employers never charge applicants.", "Unaccredited employer means no AEWV, no matter the salary.", "Verify accreditation on the INZ register before you resign anything."],
    links: [
      { label: "Green List roles", url: "https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/green-list-roles-jobs-we-need-people-for-in-new-zealand/" },
      { label: "AEWV official guide", url: "https://www.immigration.govt.nz/visas/accredited-employer-work-visa/" },
      { label: "Seek NZ jobs", url: "https://www.seek.co.nz" },
      { label: "Trade Me Jobs", url: "https://www.trademe.co.nz/a/jobs" },
    ],
  },
  "UK Work": {
    steps: ["Pick a route: Skilled Worker (job first) or Global Talent (evidence first)", "Skilled Worker: get an offer from a licensed sponsor with a Certificate of Sponsorship", "Global Talent: get endorsed by Tech Nation or another body, no job needed", "Prove English and maintenance funds (Skilled Worker)", "Apply online, biometrics, fly"],
    needs: ["Licensed sponsor + CoS, or endorsement", "Salary threshold met", "English B1+", "Clean record"],
    warnings: ["Nobody can sell you a CoS. Fake sponsorships get visas cancelled.", "Check the sponsor licence register before signing anything.", "Global Talent needs real recognition, not just a good CV."],
    links: [
      { label: "Skilled Worker visa", url: "https://www.gov.uk/skilled-worker-visa" },
      { label: "Global Talent visa", url: "https://www.gov.uk/global-talent" },
      { label: "Sponsor register", url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers" },
    ],
  },
  "Canada Work": {
    steps: ["Pick a route: Express Entry points or employer LMIA offer", "Get credentials assessed (ECA) and sit IELTS or CELPIP", "Build an Express Entry profile and enter the pool", "Get an ITA on a high CRS draw, or a valid LMIA job offer", "Medicals, police, proof of funds, then PR"],
    needs: ["ECA + language test", "Competitive CRS or LMIA offer", "Settlement funds", "Medical + police clearance"],
    warnings: ["No agent can guarantee an ITA or a draw score.", "LMIA jobs you pay for are fraud. Employers pay for LMIAs.", "Use only the official CRS calculator to judge your score."],
    links: [
      { label: "Express Entry", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" },
      { label: "Job Bank", url: "https://www.jobbank.gc.ca" },
    ],
  },
  "Australia Work": {
    steps: ["Pick a route: Skills in Demand sponsor or skilled points visa", "Get a skills assessment for your occupation", "Secure a sponsor or lodge an expression of interest", "Prove English and meet the salary threshold", "Medicals, police, visa grant"],
    needs: ["Skills assessment", "Sponsor or points invite", "English test", "Salary threshold met"],
    warnings: ["Sponsorships for sale are scams and lead to cancellation.", "Only use registered migration agents (MARA number).", "Points cutoffs move every round. Check before paying for tests."],
    links: [
      { label: "Work in Australia", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia" },
      { label: "Skill shortages", url: "https://www.jobsandskills.gov.au" },
    ],
  },
  "Germany Work": {
    steps: ["Pick a route: EU Blue Card (degree + offer) or Opportunity Card (points)", "Get degrees recognised (Anabin statement)", "Learn German to at least A2 while job hunting", "Sign an offer, open a blocked account for proof of funds", "Apply at the embassy, land, register address (Anmeldung)"],
    needs: ["Recognised qualification", "Job offer or points total", "Blocked account funds", "Basic German helps everywhere"],
    warnings: ["Blocked accounts only via official providers (Expatrio, Fintiba, Coracle).", "No real employer asks you to pay for a contract.", "Job Seeker style routes need real funds. Don't borrow and return it."],
    links: [
      { label: "Make it in Germany", url: "https://www.make-it-in-germany.com" },
      { label: "EU Blue Card", url: "https://www.make-it-in-germany.com/en/visa-residence/types-visa/eu-blue-card" },
    ],
  },
  "US Work": {
    steps: ["Pick a route: H-1B lottery, O-1 talent, or L-1 transfer", "H-1B: employer registers you in the March lottery", "If picked: petition, LCA wage, consulate interview", "O-1: build an evidence pack (awards, press, salary) any time of year", "L-1: 1 year at a multinational abroad, then transfer"],
    needs: ["Specialty offer or talent evidence", "Degree match (H-1B)", "Petition approved before interview", "Patience with the lottery"],
    warnings: ["H-1B selection runs under 20 percent most years. Always have a plan B.", "Never pay your own H-1B fees. The employer pays by law.", "Consultants who guarantee lottery wins are lying."],
    links: [
      { label: "H-1B visas", url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations" },
      { label: "O-1 visas", url: "https://www.uscis.gov/working-in-the-united-states/o-1-visa-individuals-with-extraordinary-ability-or-achievement" },
    ],
  },
};

function PrepTab() {
  const [prepTab, setPrepTab] = useState<"sop" | "interview" | "radar" | "roads">("sop");
  return (
    <>
      <div className="dash-tools-tabs prep-subbar">
        {([
          { id: "sop" as const, label: "SOP Studio" },
          { id: "interview" as const, label: "Mock Interview" },
          { id: "radar" as const, label: "Opportunities" },
          { id: "roads" as const, label: "Roadmaps" },
        ]).map((t) => (
          <button key={t.id} onClick={() => setPrepTab(t.id)} className={`dash-tab ${prepTab === t.id ? "dash-tab-active" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      {prepTab === "sop" && <SOPPanel />}
      {prepTab === "interview" && <InterviewPanel />}
      {prepTab === "radar" && <RadarPanel />}
      {prepTab === "roads" && <RoadsPanel />}
    </>
  );
}

type LocalDraft = { id: string; country: string; visaType: string; school: string; draft: string; updatedAt: string };

function loadDrafts(): LocalDraft[] {
  try {
    return JSON.parse(localStorage.getItem("vradr_sop_drafts") || "[]");
  } catch {
    return [];
  }
}

function SOPPanel() {
  const generate = useAction(api.studio.generateSOP);
  const review = useAction(api.studio.reviewDocument);
  const [mode, setMode] = useState<"write" | "review">("write");
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("Student");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [background, setBackground] = useState("");
  const [tone, setTone] = useState("");
  const [traits, setTraits] = useState("");
  const [draft, setDraft] = useState("");
  const [doc, setDoc] = useState("");
  const [result, setResult] = useState<{ score: number; verdict: string; fixes: string[] } | null>(null);
  const [working, setWorking] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [drafts, setDrafts] = useState<LocalDraft[]>(loadDrafts);

  const persist = (next: LocalDraft[]) => {
    setDrafts(next);
    try {
      localStorage.setItem("vradr_sop_drafts", JSON.stringify(next));
    } catch {
      toast("Couldn't save. Device storage is full.");
    }
  };

  const run = async () => {
    if (!country || !background || working) return;
    setWorking(true);
    try {
      const r = await generate({ country, visaType, school: school || undefined, course: course || undefined, background, tone: tone || undefined, traits: traits || undefined });
      setDraft(r.draft);
    } catch {
      toast("Couldn't generate. AI isn't connected yet.");
    }
    setWorking(false);
  };

  const runReview = async () => {
    if (!country || !doc || working) return;
    setWorking(true);
    try {
      setResult(await review({ document: doc, country, visaType }));
    } catch {
      toast("Couldn't review. AI isn't connected yet.");
    }
    setWorking(false);
  };

  // Files never leave the device. Only extracted text is scored.
  const readFile = async (f: File) => {
    if (f.size > 500 * 1024) {
      toast("File too large. Keep it under 500KB.");
      return;
    }
    setParsing(true);
    try {
      const ext = f.name.split(".").pop()?.toLowerCase();
      let text = "";
      if (ext === "txt" || ext === "md") {
        text = await f.text();
      } else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const buf = await f.arrayBuffer();
        text = (await mammoth.extractRawText({ arrayBuffer: buf })).value;
      } else if (ext === "pdf") {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const pdf = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
        const parts: string[] = [];
        for (let i = 1; i <= Math.min(pdf.numPages, 10) && parts.join("\n").length < 6000; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          parts.push(content.items.map((it: any) => ("str" in it ? it.str : "")).join(" "));
        }
        text = parts.join("\n");
      } else {
        toast("That file type isn't supported. Use txt, md, docx, or pdf.");
        return;
      }
      text = text.trim().slice(0, 6000);
      if (!text) {
        toast("Couldn't read any text from that file.");
        return;
      }
      setDoc(text);
      setResult(null);
    } catch {
      toast("Couldn't read that file. Try pasting the text.");
    }
    setParsing(false);
  };

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">SOP Studio</h4>
        <p className="dash-hero-sub">Drafts stay on this device only. Clearing browser data or signing in on a new phone loses them.</p>
        <div className="dash-compare-chips" style={{ marginTop: 8 }}>
          {(["write", "review"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`dash-compare-chip ${mode === m ? "dash-compare-chip-active" : ""}`}>
              {m === "write" ? "Write" : "Review"}
            </button>
          ))}
        </div>
      </div>
      {mode === "write" ? (
        <>
          <div className="dash-section-card" style={{ marginBottom: 16 }}>
            <h4 className="dash-section-title">Your details</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <Select value={country} onChange={setCountry} options={DESTINATIONS.map((c) => ({ value: c.name, label: c.name, code: c.code }))} placeholder="Destination" />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <Select value={visaType} onChange={setVisaType} options={VISA_TYPES.map((v) => ({ value: v.id, label: v.id }))} />
              </div>
            </div>
        <label className="dash-field"><span>School or employer (optional)</span>
          <input className="dash-input" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. University of Toronto" />
        </label>
        <label className="dash-field"><span>Course or role (optional)</span>
          <input className="dash-input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. MSc Computer Science" />
        </label>
        <label className="dash-field"><span>Your background</span>
          <textarea className="dash-input" rows={3} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Degree, work, goals in a few lines..." />
        </label>
        <label className="dash-field"><span>How should it sound? (optional)</span>
          <input className="dash-input" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="e.g. confident and direct" />
        </label>
        <label className="dash-field"><span>What defines you? (optional)</span>
          <input className="dash-input" value={traits} onChange={(e) => setTraits(e.target.value)} placeholder="e.g. self-taught coder, community tutor" />
        </label>
            <button className="dash-compare-chip" onClick={run} style={{ opacity: working || !country || !background ? 0.4 : 1 }}>
              {working ? "Writing..." : "Draft my SOP"}
            </button>
          </div>
          {draft && (
            <div className="dash-section-card" style={{ marginBottom: 16 }}>
              <h4 className="dash-section-title">Draft (edit freely)</h4>
              <textarea className="dash-input" rows={10} value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button className="dash-compare-chip" style={{ marginTop: 8 }} onClick={() => {
                persist([{ id: `${Date.now()}`, country, visaType, school, draft, updatedAt: new Date().toISOString().slice(0, 10) }, ...drafts].slice(0, 20));
                toast("Saved on this device.");
              }}>Save on this device</button>
            </div>
          )}
          {drafts.length > 0 && (
            <div className="dash-section-card">
              <h4 className="dash-section-title">Your drafts</h4>
              <ul className="dash-docs-list">
                {drafts.map((s) => (
                  <li key={s.id} className="dash-doc-item">
                    <CheckCircleIcon width={14} height={14} className="dash-doc-check" />
                    <span style={{ flex: 1 }}>{s.visaType} to {s.country}{s.school ? ` · ${s.school}` : ""}</span>
                    <button className="dash-compare-chip" onClick={() => { setDraft(s.draft); setCountry(s.country); setVisaType(s.visaType); setSchool(s.school); }}>Open</button>
                    <button className="dash-app-delete" onClick={() => persist(drafts.filter((d) => d.id !== s.id))}><TrashIcon width={14} height={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="dash-section-card">
          <h4 className="dash-section-title">Review a document</h4>
          <p className="dash-hero-sub">Paste or upload an SOP or cover letter. Parsed on your device, only text is scored, nothing is stored.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8, marginTop: 8 }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <Select value={country} onChange={setCountry} options={DESTINATIONS.map((c) => ({ value: c.name, label: c.name, code: c.code }))} placeholder="Destination" />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <Select value={visaType} onChange={setVisaType} options={VISA_TYPES.map((v) => ({ value: v.id, label: v.id }))} />
            </div>
          </div>
          <textarea className="dash-input" rows={8} value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="Paste your document here, or upload below..." />
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
            <label className="dash-compare-chip" style={{ cursor: "pointer" }}>
              {parsing ? "Reading file..." : "Upload file"}
              <input type="file" accept=".txt,.md,.docx,.pdf" style={{ display: "none" }} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = "";
              }} />
            </label>
            <span className="dash-hero-sub">txt, md, docx, pdf · stays on your device</span>
          </div>
          <button className="dash-compare-chip" style={{ marginTop: 8, opacity: working || parsing || !country || !doc ? 0.4 : 1 }} onClick={runReview}>
            {working ? "Reviewing..." : "Score my document"}
          </button>
          {result && (
            <div style={{ marginTop: 12 }}>
              <div className="dash-avg-number">{result.score}<span className="dash-avg-unit"> / 100</span></div>
              <p className="dash-hero-sub">{result.verdict}</p>
              <div className="dash-compare-chips" style={{ marginTop: 8 }}>
                {result.fixes.map((f) => (
                  <span key={f} className="dash-compare-chip" style={{ cursor: "default" }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function InterviewPanel() {
  const getQuestions = useAction(api.studio.getQuestions);
  const doScore = useAction(api.studio.scoreAnswer);
  const save = useMutation(api.studio.saveSession);
  const sessions = useQuery(api.studio.listSessions, {});
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("Tourist");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, { score: number; feedback: string; model: string }>>({});
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState<number | null>(null);

  const start = async () => {
    if (!country || loading) return;
    setLoading(true);
    try {
      const r = await getQuestions({ country, visaType, count: 5 });
      setQuestions(r.questions);
      setAnswers({});
      setResults({});
    } catch {
      toast("Couldn't load questions. AI isn't connected yet.");
    }
    setLoading(false);
  };

  const answer = async (i: number) => {
    const text = answers[i];
    if (!text || scoring !== null) return;
    setScoring(i);
    try {
      const r = await doScore({ question: questions[i], answer: text, country, visaType });
      setResults({ ...results, [i]: r });
    } catch {
      toast("Couldn't score. AI isn't connected yet.");
    }
    setScoring(null);
  };

  const avg = Object.values(results).length
    ? Math.round(Object.values(results).reduce((s, r) => s + r.score, 0) / Object.values(results).length)
    : null;

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Mock interview</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <Select value={country} onChange={setCountry} options={DESTINATIONS.map((c) => ({ value: c.name, label: c.name, code: c.code }))} placeholder="Destination" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <Select value={visaType} onChange={setVisaType} options={VISA_TYPES.map((v) => ({ value: v.id, label: v.id }))} />
          </div>
        </div>
        <button className="dash-compare-chip" onClick={start} style={{ opacity: loading || !country ? 0.4 : 1 }}>
          {loading ? "Loading..." : "Start session"}
        </button>
        {avg !== null && <p className="dash-hero-sub" style={{ marginTop: 8 }}>Session average: <strong>{avg}</strong></p>}
      </div>
      {questions.map((q, i) => (
        <div key={i} className="dash-section-card" style={{ marginBottom: 12 }}>
          <h4 className="dash-section-title">Q{i + 1}: {q}</h4>
          <textarea className="dash-input" rows={2} value={answers[i] ?? ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })} placeholder="Answer like at the embassy..." />
          <button className="dash-compare-chip" style={{ marginTop: 8, opacity: !answers[i] || scoring !== null ? 0.4 : 1 }} onClick={() => answer(i)}>
            {scoring === i ? "Scoring..." : "Submit answer"}
          </button>
          {results[i] && (
            <div style={{ marginTop: 8 }}>
              <p className="dash-hero-sub">Score: <strong>{results[i].score}</strong> · {results[i].feedback}</p>
              <p className="dash-hero-sub">Strong answer: {results[i].model}</p>
            </div>
          )}
        </div>
      ))}
      {questions.length > 0 && avg !== null && (
        <button className="dash-compare-chip" onClick={async () => {
          await save({ country, visaType, questions, answers: questions.map((_, i) => answers[i] ?? ""), scores: questions.map((_, i) => results[i]?.score ?? 0) });
          toast("Session saved.");
        }}>Save session</button>
      )}
      {sessions && sessions.length > 0 && (
        <div className="dash-section-card" style={{ marginTop: 16 }}>
          <h4 className="dash-section-title">Past sessions</h4>
          <ul className="dash-docs-list">
            {sessions.map((s: any) => {
              const a = s.scores.length ? Math.round(s.scores.reduce((x: number, y: number) => x + y, 0) / s.scores.length) : 0;
              return (
                <li key={s._id} className="dash-doc-item">
                  <CheckCircleIcon width={14} height={14} className="dash-doc-check" />
                  <span>{s.visaType} to {s.country} · avg {a} · {s.createdAt.slice(0, 10)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function RadarPanel() {
  const [kind, setKind] = useState<"" | "scholarship" | "job">("");
  const list = useQuery(api.opportunities.list, kind ? { kind } : {});
  const seed = useMutation(api.opportunities.seedOpportunities);
  const remind = useMutation(api.opportunities.remindMe);
  const refresh = useAction(api.opportunities.refreshOne);

  const daysLeft = (d?: string) => {
    if (!d) return null;
    const n = Math.ceil((new Date(d + "T12:00:00").getTime() - Date.now()) / 86400000);
    return n < 0 ? "past" : `${n}d left`;
  };

  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Opportunities<span className="dash-swipe-hint">swipe →</span></h4>
        <div className="dash-compare-chips">
          {([{ id: "", label: "All" }, { id: "scholarship", label: "Scholarships" }, { id: "job", label: "Work routes" }] as const).map((k) => (
            <button key={k.label} onClick={() => setKind(k.id as any)} className={`dash-compare-chip ${kind === k.id ? "dash-compare-chip-active" : ""}`}>{k.label}</button>
          ))}
        </div>
      </div>
      {!list || list.length === 0 ? (
        <div className="dash-section-card">
          <p className="dash-hero-sub">No opportunities loaded yet.</p>
          <button className="dash-compare-chip" style={{ marginTop: 8 }} onClick={() => seed({})}>Load opportunities</button>
        </div>
      ) : (
        <div className="dash-apps-list">
          {list.map((o: any) => (
            <div key={o._id} className="dash-app-card">
              <div className="dash-app-info">
                <span className="dash-app-country">{o.title}</span>
                <span className="dash-app-meta">{o.country}{o.funding ? ` · ${o.funding}` : ""}{o.deadline ? ` · ${daysLeft(o.deadline) ?? o.deadline}` : ""}</span>
              </div>
              <span className="dash-status-pill">{o.kind === "job" ? "Work" : "Study"}</span>
              <div style={{ display: "flex", gap: 8, flexBasis: "100%", flexWrap: "wrap" }}>
                {o.requirements.slice(0, 3).map((r: string) => (
                  <span key={r} className="dash-compare-chip" style={{ cursor: "default" }}>{r}</span>
                ))}
                {o.deadline && (
                  <button className="dash-compare-chip" onClick={async () => { await remind({ title: o.title, deadline: o.deadline }); toast("Reminder saved."); }}>Remind me</button>
                )}
                <button className="dash-compare-chip" onClick={async () => {
                  try { await refresh({ id: o._id, url: o.url }); toast("Rechecked."); }
                  catch { toast("Couldn't recheck. Feeds aren't connected."); }
                }}>Recheck</button>
                <a className="dash-compare-chip" href={o.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>Open site</a>
              </div>
              <span className="dash-hero-sub" style={{ flexBasis: "100%" }}>Checked {o.lastChecked.slice(0, 10)} · {o.source}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function RoadsPanel() {
  const [route, setRoute] = useState("Study");
  const [step, setStep] = useState(0);
  const data = ROADMAPS[route];
  return (
    <>
      <div className="dash-section-card" style={{ marginBottom: 16 }}>
        <h4 className="dash-section-title">Pick your route</h4>
        <div className="dash-compare-chips">
          {Object.keys(ROADMAPS).map((r) => (
            <button key={r} onClick={() => { setRoute(r); setStep(0); }} className={`dash-compare-chip ${route === r ? "dash-compare-chip-active" : ""}`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="dash-section-card">
        <h4 className="dash-section-title">{route} roadmap</h4>
        <div className="dash-avg-card" style={{ marginBottom: 12 }}>
          <span className="dash-avg-label">Step {Math.min(step + 1, data.steps.length)} of {data.steps.length}</span>
          <p style={{ fontSize: 15, fontWeight: 600, margin: "4px 0 10px" }}>{data.steps[Math.min(step, data.steps.length - 1)]}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="dash-compare-chip" onClick={() => setStep(Math.max(0, step - 1))} style={{ opacity: step === 0 ? 0.4 : 1 }}>Back</button>
            <button className="dash-compare-chip" onClick={() => setStep(Math.min(data.steps.length - 1, step + 1))} style={{ opacity: step >= data.steps.length - 1 ? 0.4 : 1 }}>Next</button>
          </div>
        </div>
        <h4 className="dash-section-title">What you need</h4>
        <div className="dash-compare-chips">
          {data.needs.map((n) => (
            <span key={n} className="dash-compare-chip" style={{ cursor: "default" }}>{n}</span>
          ))}
        </div>
        {data.warnings && (
          <>
            <h4 className="dash-section-title" style={{ marginTop: 16 }}>Watch out</h4>
            <div className="dash-avg-card" style={{ borderColor: "#ef4444" }}>
              {data.warnings.map((w) => (
                <p key={w} className="dash-hero-sub" style={{ margin: "4px 0" }}>! {w}</p>
              ))}
            </div>
          </>
        )}
        {data.links && (
          <>
            <h4 className="dash-section-title" style={{ marginTop: 16 }}>Official sources</h4>
            <div className="dash-compare-chips">
              {data.links.map((l) => (
                <a key={l.url} className="dash-compare-chip" href={l.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{l.label}</a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
