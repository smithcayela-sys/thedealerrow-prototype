/* ==========================================================================
   THE DEALER ROW — shared app behavior + mock data
   This is a front-end prototype: all data below is mock/sample data that
   lives in memory only (no backend). Wire this up to real APIs when ready.
   ========================================================================== */

/* ---------------- Mock data ---------------- */
/* Three distinct trust signals are kept separate everywhere this data renders — never collapsed
   into one generic rating:
   - verified   -> "Business Verified": the business/profile relationship has been verified
   - recs       -> "Recommended by N dealership professionals": verified professionals with firsthand experience
   - pct        -> "Would Use Again": aggregated firsthand recommendation data (a percentage) */
const DR_PROVIDERS = [
  { id: "midwest-recovery", name: "Midwest Recovery Group", initials: "MRG", city: "Omaha", state: "NE", radius: 100, servesText: "Serves NE, IA (100-mile radius)", serviceAreaStates: ["NE","IA"], verified: true, pct: 96, recs: 24, services: ["Repossession","Voluntary Surrender","Transport","Storage"], category: "Recovery & Collateral",
    description: "Midwest Recovery Group has served dealership and lender clients across Nebraska and Iowa for over a decade, specializing in compliant repossession, voluntary surrender pickups, and secure collateral storage.",
    quotes: [
      { name: "Jason M.", role: "Collections Manager", dealer: "Independent Dealer", state: "Texas", text: "We've used Midwest Recovery several times for out-of-state units. Reliable, communicate well, and quick turnaround." },
      { name: "Kristen L.", role: "F&I Manager", dealer: "Franchise Dealer", state: "Colorado", text: "Professional every time. They keep us updated from assignment to recovery." }
    ] },
  { id: "platinum-recovery", name: "Platinum Recovery", initials: "PR", city: "Lincoln", state: "NE", radius: 150, servesText: "Serves NE, IA (150-mile radius)", serviceAreaStates: ["NE","IA"], verified: true, pct: 94, recs: 18, services: ["Repossession","Transport","Lockout/Keys","Storage"], category: "Recovery & Collateral",
    description: "Platinum Recovery covers a 150-mile radius out of Lincoln, with a fleet built for both standard repossession and lockout/key situations.",
    quotes: [
      { name: "Derek R.", role: "General Manager", dealer: "Independent Dealer", state: "Kansas", text: "Good communication and fair pricing. Our go-to for anything near Lincoln." }
    ] },
  { id: "great-plains-recovery", name: "Great Plains Recovery", initials: "GPR", city: "Fremont", state: "NE", radius: 100, servesText: "Serves NE (100-mile radius)", serviceAreaStates: ["NE"], verified: true, pct: 92, recs: 11, services: ["Repossession","Voluntary Surrender","Transport","Inspections"], category: "Recovery & Collateral",
    description: "Great Plains Recovery is a Fremont-based agency covering the broader Nebraska market, known for thorough vehicle condition inspections at time of recovery.",
    quotes: [
      { name: "Derek R.", role: "General Manager", dealer: "Independent Dealer", state: "Kansas", text: "Covers Grand Island and the surrounding area well. Two good experiences so far." }
    ] },
  { id: "capital-asset-recovery", name: "Capital Asset Recovery", initials: "CAR", city: "Council Bluffs", state: "IA", radius: 100, servesText: "Serves NE, IA (100-mile radius)", serviceAreaStates: ["NE","IA"], verified: true, pct: 90, recs: 9, services: ["Repossession","Transport","Storage","Skip Tracing"], category: "Recovery & Collateral",
    description: "Capital Asset Recovery operates out of Council Bluffs with in-house skip tracing capability for harder-to-locate collateral.",
    quotes: [
      { name: "Melissa T.", role: "Collections Manager", dealer: "BHPH Dealer", state: "Oklahoma", text: "Their skip tracing has helped us close out a few files we'd otherwise have written off." }
    ] },
  { id: "steadfast-recovery", name: "Steadfast Recovery", initials: "SR", city: "Omaha", state: "NE", radius: 200, servesText: "Serves NE, IA, SD (200-mile radius)", serviceAreaStates: ["NE","IA","SD"], verified: true, pct: 88, recs: 7, services: ["Repossession","Voluntary Surrender","Transport","Storage"], category: "Recovery & Collateral",
    description: "Steadfast Recovery runs one of the widest coverage radii in the region out of Omaha, reaching into South Dakota for harder-to-place units.",
    quotes: [
      { name: "Jason M.", role: "Collections Manager", dealer: "Independent Dealer", state: "Texas", text: "Good option when a unit is further out than most agencies will travel." }
    ] },
  { id: "lone-star-recovery", name: "Lone Star Recovery", initials: "LSR", city: "Dallas", state: "TX", radius: 120, servesText: "Serves TX (120-mile radius)", serviceAreaStates: ["TX"], verified: true, pct: 91, recs: 15, services: ["Repossession","Lockout/Keys","Transport"], category: "Recovery & Collateral",
    description: "Lone Star Recovery is a Dallas-based agency handling repossession and lockout/key service across North Texas.",
    quotes: [
      { name: "Chris B.", role: "Inventory Manager", dealer: "Independent Dealer", state: "Texas", text: "Solid communication and they've never missed a scheduled pickup for us." }
    ] },
  { id: "texas-title-solutions", name: "Texas Title Solutions", initials: "TTS", city: "Austin", state: "TX", radius: 150, servesText: "Serves TX (150-mile radius)", serviceAreaStates: ["TX"], verified: true, pct: 95, recs: 20, services: ["Titling","Temp Tags","DMV Support"], category: "Titling & Administration",
    description: "Texas Title Solutions handles titling, temp tags, and DMV support for dealers across Texas, including out-of-state deal paperwork.",
    quotes: [
      { name: "Kristen L.", role: "F&I Manager", dealer: "Franchise Dealer", state: "Colorado", text: "They untangled a title issue on an out-of-state deal faster than we expected." }
    ] },
  { id: "rapid-auto-transport", name: "Rapid Auto Transport", initials: "RAT", city: "Nationwide", state: "US", radius: 0, servesText: "Nationwide coverage", serviceAreaStates: ["US"], verified: true, pct: 93, recs: 22, services: ["Transport","Auction Runs","Open/Enclosed"], category: "Vehicle Operations",
    description: "Rapid Auto Transport runs open and enclosed auction and dealer-to-dealer transport nationwide.",
    quotes: [
      { name: "Chris B.", role: "Inventory Manager", dealer: "Independent Dealer", state: "Texas", text: "We use them for most of our auction runs. Consistent and easy to schedule." }
    ] },
];

/* ---------------- Location matching (Find The Row) ----------------
   Coverage matching is driven by each provider's own serviceAreaStates
   (their claimed service area), never by headquarters city/state alone —
   a provider headquartered in Omaha can still legitimately serve Grand
   Island, NE if NE is in their claimed service area. Zero real matches
   means zero results are shown; this never falls back to displaying
   unrelated providers as if they served an area they don't. */
const DR_STATE_NAMES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

/* Known cities used in this mock dataset's example markets/scenarios, so a bare city name
   (with or without a state) can resolve to the state it's actually in. */
const DR_CITY_STATE = {
  "grand island": "NE", "omaha": "NE", "lincoln": "NE", "fremont": "NE",
  "council bluffs": "IA", "dallas": "TX", "austin": "TX", "houston": "TX",
};

function drStateAbbrFromName(name) {
  const n = (name || "").trim().toLowerCase();
  if (!n) return null;
  for (const abbr in DR_STATE_NAMES) {
    if (DR_STATE_NAMES[abbr].toLowerCase() === n) return abbr;
  }
  return null;
}

/* Resolves a free-text location query ("Grand Island, NE", "Nebraska", "TX", "Omaha")
   down to a state abbreviation, or null if it can't be confidently resolved. */
function drResolveLocationState(rawQuery) {
  const q = (rawQuery || "").trim().toLowerCase();
  if (!q) return null;
  const parts = q.split(",").map((s) => s.trim()).filter(Boolean);
  const tail = parts.length > 1 ? parts[parts.length - 1] : q;
  if (DR_STATE_NAMES[tail.toUpperCase()]) return tail.toUpperCase();
  const abbrFromTail = drStateAbbrFromName(tail);
  if (abbrFromTail) return abbrFromTail;
  const abbrFromWhole = drStateAbbrFromName(q);
  if (abbrFromWhole) return abbrFromWhole;
  const cityPart = parts[0] || q;
  if (DR_CITY_STATE[cityPart]) return DR_CITY_STATE[cityPart];
  return null;
}

/* True only when the provider's own claimed service area actually covers the resolved
   state (or the provider is genuinely nationwide) -- never based on headquarters alone. */
function drProviderServesState(p, stateAbbr) {
  if (p.state === "US") return true;
  const areas = p.serviceAreaStates || [p.state];
  return areas.includes(stateAbbr);
}

function drProviderMatchesLocation(p, locationQuery) {
  const q = (locationQuery || "").trim();
  if (!q) return true;
  if (p.state === "US") return true; // genuinely nationwide coverage
  const resolvedState = drResolveLocationState(q);
  if (resolvedState) return drProviderServesState(p, resolvedState);
  // Query didn't resolve to a known state/city: fall back only to a direct, honest
  // match against the provider's own headquarters -- never implies coverage we can't back up.
  const qLower = q.toLowerCase();
  return (
    (p.city + ", " + p.state).toLowerCase().includes(qLower) ||
    p.city.toLowerCase().includes(qLower) ||
    p.state.toLowerCase() === qLower
  );
}

/* Dealer-reported actual experience -- distinct from the provider's own claimed coverage
   above. Pulled from the firsthand quotes already attached to each provider. */
function drDealerReportedStates(p) {
  const seen = [];
  (p.quotes || []).forEach((quote) => {
    if (quote.state && seen.indexOf(quote.state) === -1) seen.push(quote.state);
  });
  return seen;
}

const DR_QUESTIONS = [
  { id: "recovery-grand-island", title: "Recovery recommendation needed near Grand Island, NE", topic: "Recovery & Collateral", location: "Nebraska", author: "Jason M.", role: "Collections Manager", dealer: "Independent Dealer", state: "Texas", time: "2 hours ago", views: 324, answers: 7, recs: 3,
    body: "Texas dealer here. We have a vehicle located near Grand Island and our normal recovery network doesn't cover the area. Has anyone personally used an agency there that you'd recommend?" },
  { id: "florida-titling", title: "Title processing recommendations in Florida?", topic: "Titling & DMV", location: "Florida", author: "Kristen L.", role: "F&I Manager", dealer: "Franchise Dealer", state: "Colorado", time: "5 hours ago", views: 210, answers: 12, recs: 5,
    body: "Looking for a reliable third-party titling company in Florida. We have some out-of-state deals and need someone we can trust. Any recommendations?" },
  { id: "bankruptcy-attorney-houston", title: "Preferred bankruptcy attorney in Houston, TX", topic: "Legal & Compliance", location: "Texas", author: "Derek R.", role: "General Manager", dealer: "Independent Dealer", state: "Kansas", time: "8 hours ago", views: 188, answers: 9, recs: 4,
    body: "We're seeing an increase in Chapter 7 and 13 filings and need a solid attorney who understands buy here pay here. Who do you use and why?" },
  { id: "gps-tracking", title: "Best GPS tracking devices for collateral?", topic: "Dealer Technology", location: "Nationwide", author: "Melissa T.", role: "Collections Manager", dealer: "BHPH Dealer", state: "Oklahoma", time: "1 day ago", views: 402, answers: 15, recs: 6,
    body: "Looking for feedback on GPS devices. What are you using, what's working well, and what should we stay away from?" },
  { id: "transport-tx-az", title: "Transport company for auction runs (TX to AZ)", topic: "Recovery & Collateral", location: "Texas", author: "Chris B.", role: "Inventory Manager", dealer: "Independent Dealer", state: "Texas", time: "1 day ago", views: 156, answers: 11, recs: 4,
    body: "Need a reliable transport company for 8–10 units heading to auction in Arizona. Who do you use and what has your experience been?" },
];

const DR_THREAD_ANSWERS = [
  { name: "Kristen L.", initials: "KM", role: "F&I Manager", dealer: "Franchise Dealer", state: "Colorado", time: "3 hours ago",
    body: "We've used Midwest Recovery several times for units in the Grand Island area. They're reliable, communicate well, and usually have quick turnaround times. No issues on our end.",
    provider: { name: "Midwest Recovery Group", initials: "MRG", area: "Omaha, NE", servesText: "Serves NE, IA (including Grand Island)", pct: 96 }, helpful: 12 },
  { name: "Derek R.", initials: "DR", role: "General Manager", dealer: "Independent Dealer", state: "Kansas", time: "4 hours ago",
    body: "Great Plains Recovery covers Grand Island and the surrounding areas. We've used them twice and had a good experience both times. Professional and kept us updated the whole time.",
    provider: { name: "Great Plains Recovery", initials: "GPR", area: "Fremont, NE", servesText: "Serves NE (including Grand Island)", pct: 92 }, helpful: 8 },
  { name: "Melissa T.", initials: "MT", role: "Collections Manager", dealer: "BHPH Dealer", state: "Oklahoma", time: "5 hours ago",
    body: "Grand Island can be a little tricky depending on how far outside of town the unit is. I'd verify mileage before assigning. Some Omaha agencies charge extended coverage if it's outside their standard radius. We usually confirm upfront to avoid surprises.",
    provider: null, helpful: 6 },
];

const DR_INVITATIONS = [
  { name: "Midwest Recovery Group", initials: "MRG", type: "Service Provider", email: "info@midwestrecovery.com", status: "Joined", date: "Aug 28, 2026" },
  { name: "Jessica R.", initials: "JR", type: "Dealership Professional", email: "jessica@dealership.com", status: "Pending", date: "Sep 1, 2026" },
  { name: "Premier Dealer Law", initials: "P", type: "Service Provider", email: "info@premierlaw.com", status: "Pending", date: "Aug 30, 2026" },
  { name: "Marcus T.", initials: "MT", type: "Industry Professional", email: "marcus@autoconsulting.com", status: "Declined", date: "Aug 25, 2026" },
  { name: "Lone Star Towing", initials: "LST", type: "Service Provider", email: "contact@lonestartowing.com", status: "Joined", date: "Aug 20, 2026" },
];

/* ---------------- Icon helper (feather-style inline svgs) ---------------- */
const DR_ICONS = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
};

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initChoiceCards();
  initToggleCards();
  initStarRatings();
  initCharCounters();
  markActiveNav();
  initComingSoon();
  initAvatarMenu();
  initSaveButtons();
  if (document.body.dataset.page === "myrow") renderSavedProvidersFromStorage();
});

/* ---------------- Save to My Row (client-side only, no backend) ----------------
   Prototype persistence: a provider's saved/unsaved state lives in this browser's
   localStorage only. It is device/browser-specific by design for this milestone —
   there is no account, backend, or database behind it yet. */
const DR_SAVED_KEY = "dr_saved_provider_ids";

function drGetSavedIds() {
  try {
    const raw = localStorage.getItem(DR_SAVED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function drIsSaved(id) {
  return drGetSavedIds().includes(id);
}

function drSetSavedIds(ids) {
  try { localStorage.setItem(DR_SAVED_KEY, JSON.stringify(ids)); } catch (e) { /* storage unavailable — fail silently, demo-only */ }
}

/* Adds or removes a provider id from the saved list; returns the new saved state (bool) */
function drToggleSaved(id) {
  const ids = drGetSavedIds();
  const idx = ids.indexOf(id);
  let nowSaved;
  if (idx === -1) { ids.push(id); nowSaved = true; }
  else { ids.splice(idx, 1); nowSaved = false; }
  drSetSavedIds(ids);
  return nowSaved;
}

function drProviderById(id) {
  return DR_PROVIDERS.find((p) => p.id === id) || null;
}

/* Wires every [data-save-id] button on the page (Find results + Provider Profile).
   Safe to call repeatedly after re-rendering a list — already-wired buttons are skipped
   so a click never fires the toggle more than once. */
function initSaveButtons() {
  document.querySelectorAll("[data-save-id]").forEach((btn) => {
    const id = btn.dataset.saveId;
    drPaintSaveButton(btn, drIsSaved(id));
    if (btn.dataset.saveWired === "true") return;
    btn.dataset.saveWired = "true";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const nowSaved = drToggleSaved(id);
      drPaintSaveButton(btn, nowSaved);
      const provider = drProviderById(id);
      const name = provider ? provider.name : "Provider";
      drToast(nowSaved ? `${name} saved to My Row.` : `${name} removed from My Row.`);
      // keep any other Save button for the same provider on this page (e.g. card + profile) in sync
      document.querySelectorAll(`[data-save-id="${id}"]`).forEach((other) => {
        if (other !== btn) drPaintSaveButton(other, nowSaved);
      });
    });
  });
}

function drPaintSaveButton(btn, saved) {
  if (saved) {
    btn.classList.add("is-saved");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved to My Row`;
  } else {
    btn.classList.remove("is-saved");
    btn.textContent = "Save to My Row";
  }
}

/* ---------------- My Row: render localStorage-saved providers (My Row only) ----------------
   The five providers already in the page's static HTML represent the account's existing saved
   history and are left exactly as designed. Anything saved via the new Find flow in this browser
   is appended below them, and only the saved-count text/stat reflects the total. */
function renderSavedProvidersFromStorage() {
  const list = document.getElementById("savedList");
  const countStat = document.getElementById("savedCountStat");
  const showingText = document.getElementById("savedShowingText");
  if (!list) return;

  const STATIC_SAVED_COUNT = 5;
  const STATIC_TOTAL_COUNT = 32;
  const ids = drGetSavedIds();

  // Clear any previously-rendered dynamic cards before re-rendering (keeps this idempotent)
  list.querySelectorAll("[data-dynamic-saved-card]").forEach((el) => el.remove());

  ids.forEach((id) => {
    const p = drProviderById(id);
    if (!p) return;
    const card = document.createElement("div");
    card.className = "result-card";
    card.setAttribute("data-dynamic-saved-card", "true");
    card.setAttribute("data-name", `${p.name} ${p.city} ${p.state} ${p.services.join(" ")}`);
    card.style.padding = "14px 16px";
    card.innerHTML = `
      <div class="result-logo" style="width:44px;height:44px;font-size:10px;">${p.initials}</div>
      <div class="result-meta">
        <div class="result-title-row"><h3 style="font-size:15px;"><a href="provider-profile.html?id=${p.id}">${p.name}</a></h3>${p.verified ? '<span class="badge badge-verified" style="padding:2px 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></span>' : ""}</div>
        <div class="result-sub" style="margin:2px 0;">${p.city}, ${p.state} &middot; ${p.services.join(" &middot; ")}</div>
      </div>
      <div class="flex gap-8" style="align-items:center;flex-shrink:0;">
        <button class="btn btn-sm" style="background:var(--green-50);color:var(--green-700);" data-save-id="${p.id}"></button>
      </div>`;
    list.appendChild(card);
  });

  const n = ids.length;
  if (countStat) countStat.textContent = String(STATIC_TOTAL_COUNT + n);
  if (showingText) showingText.textContent = `Showing ${STATIC_SAVED_COUNT + n} of ${STATIC_TOTAL_COUNT + n} saved providers`;

  // wire the freshly-created Save/Saved buttons (initSaveButtons already ran once at boot)
  list.querySelectorAll("[data-dynamic-saved-card] [data-save-id]").forEach((btn) => {
    const id = btn.dataset.saveId;
    drPaintSaveButton(btn, true);
    btn.dataset.saveWired = "true";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      drToggleSaved(id);
      const provider = drProviderById(id);
      drToast(`${provider ? provider.name : "Provider"} removed from My Row.`);
      renderSavedProvidersFromStorage();
      document.querySelectorAll(`[data-save-id="${id}"]`).forEach((other) => drPaintSaveButton(other, false));
    });
  });
}

/* ---------------- Coming soon toast (for modules outside current build scope) ---------------- */
function drToast(message) {
  let toast = document.querySelector(".dr-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "dr-toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

function initComingSoon() {
  document.querySelectorAll("[data-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const label = el.dataset.soon && el.dataset.soon !== "true" ? el.dataset.soon : "This feature";
      drToast(`${label} is coming soon.`);
    });
  });
}

function initAvatarMenu() {
  const btn = document.querySelector("[data-avatar-toggle]");
  const menu = document.querySelector(".avatar-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  document.addEventListener("click", () => menu.classList.remove("open"));
  menu.addEventListener("click", (e) => e.stopPropagation());
}

function initMobileMenu() {
  const btn = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".mobile-menu-backdrop");
  if (!btn) return;
  const close = () => { sidebar && sidebar.classList.remove("open"); backdrop && backdrop.classList.remove("open"); };
  btn.addEventListener("click", () => {
    if (sidebar) { sidebar.classList.toggle("open"); }
    if (backdrop) { backdrop.classList.toggle("open"); }
    else {
      // no sidebar on this page (e.g. public pages) -> toggle a simple dropdown nav if present
      const dd = document.querySelector("[data-mobile-nav]");
      if (dd) dd.classList.toggle("open");
    }
  });
  if (backdrop) backdrop.addEventListener("click", close);
}

function initChoiceCards() {
  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    const cards = group.querySelectorAll(".choice-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        const evt = new CustomEvent("choiceChange", { detail: card.dataset.value });
        group.dispatchEvent(evt);
      });
    });
  });
}

function initToggleCards() {
  document.querySelectorAll("[data-toggle-group]").forEach((group) => {
    const cards = group.querySelectorAll(".toggle-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });
  });
}

function initStarRatings() {
  document.querySelectorAll("[data-star-rating]").forEach((wrap) => {
    const stars = wrap.querySelectorAll("svg");
    let current = parseInt(wrap.dataset.value || "4", 10);
    const paint = (n) => stars.forEach((s, i) => s.classList.toggle("on", i < n));
    paint(current);
    stars.forEach((s, i) => {
      s.addEventListener("click", () => { current = i + 1; wrap.dataset.value = current; paint(current); });
      s.addEventListener("mouseenter", () => paint(i + 1));
    });
    wrap.addEventListener("mouseleave", () => paint(current));
  });
}

function initCharCounters() {
  document.querySelectorAll("[data-char-count]").forEach((ta) => {
    const max = parseInt(ta.dataset.charCount, 10);
    const counter = document.querySelector(`[data-char-count-for="${ta.id}"]`);
    if (!counter) return;
    const update = () => { counter.textContent = `${ta.value.length}/${max}`; };
    ta.addEventListener("input", update);
    update();
  });
}

function markActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(`.main-nav a[data-page], .sidebar-nav a[data-page]`).forEach((a) => {
    if (a.dataset.page === page) a.classList.add("active");
  });
}

/* Simple client-side filter used on Find + My Row + Ask The Row (demo only) */
function drFilterList(inputSelector, itemSelector, textAttr) {
  const input = document.querySelector(inputSelector);
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(itemSelector).forEach((el) => {
      const text = (textAttr ? el.dataset[textAttr] : el.textContent).toLowerCase();
      el.style.display = text.includes(q) ? "" : "none";
    });
  });
}
