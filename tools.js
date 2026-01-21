/**
 * Legacy Crew Tools Hub
 * Edit the TOOLS array to add/remove tools.
 * Each tool points to a live URL (GitHub Pages or elsewhere).
 *
 * Division is an ARRAY to support multi-division tools:
 *   division: ["APS", "VPS"]
 */

const TOOLS = [
  {
    name: "Radio Show Prepper",
    division: ["Entertainment"],
    type: "Artist Prep",
    description:
      "Generate radio-ready interview questions by category for hosts and artists. Used for interview prep, media training, and live show flow.",
    url: "https://704prod.github.io/radio-show-prepper/",
    repo: "https://github.com/704prod/radio-show-prepper",
  },
  {
    name: "Artist Calendar Helper",
    division: ["Entertainment"],
    type: "Scheduling",
    description:
      "Plan, visualize, and organize artist schedules, releases, and events in a clean calendar-focused workflow.",
    url: "https://704prod.github.io/artist-calendar-helper/",
    repo: "https://github.com/704prod/artist-calendar-helper",
  },
  {
  name: "Artist Training Planner",
  division: ["Entertainment","APS","VPS","BIS"],
  type: "Training",
  description: "Division-mapped artist training checklist + session plan generator with copy/export.",
  url: "https://704prod.github.io/artist-training-planner/",
  repo: "https://github.com/704prod/artist-training-planner"
},
];

// Allowed filters (controls the chip order)
const DIVISION_FILTERS = ["All", "APS", "VPS", "BIS", "Entertainment"];

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const search = document.getElementById("search");

const manageLink = document.getElementById("manageLink");
// points to the tools.js itself (for quick editing reference)
manageLink.href =
  `${location.origin}${location.pathname}`.replace(/index\.html?$/, "") + "tools.js";

let activeDivision = "All";

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render(list) {
  grid.innerHTML = "";
  count.textContent = String(list.length);

  if (!list.length) {
    grid.innerHTML = `<div class="desc">No matches. Clear search or change division filter.</div>`;
    return;
  }

  for (const t of list) {
    const name = escapeHtml(t.name);
    const desc = escapeHtml(t.description || "");

    const division = escapeHtml(
      Array.isArray(t.division) ? t.division.join(", ") : t.division || "—"
    );

    const type = escapeHtml(t.type || "—");

    const url = t.url || "#";
    const repo = t.repo || "#";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-top">
        <h3>${name}</h3>
        <span class="tag">${division} • ${type}</span>
      </div>
      <div class="desc">${desc}</div>
      <div class="card-actions">
        <a class="btn primary" href="${url}" target="_blank" rel="noreferrer">Open Tool</a>
        <a class="small" href="${repo}" target="_blank" rel="noreferrer">Repo</a>
      </div>
    `;
    grid.appendChild(card);
  }
}

function toolHasDivision(tool, division) {
  if (division === "All") return true;

  const dv = tool.division;

  if (Array.isArray(dv)) {
    return dv.map((x) => String(x).toLowerCase()).includes(division.toLowerCase());
  }

  // backward compatibility if any tool still uses a string
  return String(dv || "").toLowerCase() === division.toLowerCase();
}

function filterTools(q, division) {
  const s = (q || "").trim().toLowerCase();

  return TOOLS.filter((t) => {
    if (!toolHasDivision(t, division)) return false;

    if (!s) return true;

    const hay = [
      t.name,
      Array.isArray(t.division) ? t.division.join(" ") : t.division,
      t.type,
      t.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(s);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Division filter UI (chips) - injected under the header
// ─────────────────────────────────────────────────────────────────────────────

function injectDivisionChips() {
  const header = document.querySelector(".header");
  if (!header) return;

  const wrap = document.createElement("div");
  wrap.className = "chips-wrap";
  wrap.innerHTML = `
    <div class="chips" role="tablist" aria-label="Division filters">
      ${DIVISION_FILTERS.map(
        (d) => `
        <button class="chip" data-division="${escapeHtml(d)}" role="tab" aria-selected="${
          d === activeDivision
        }">
          ${escapeHtml(d)}
        </button>
      `
      ).join("")}
    </div>
  `;

  header.insertAdjacentElement("afterend", wrap);

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;

    activeDivision = btn.getAttribute("data-division") || "All";

    // update selected states
    wrap.querySelectorAll(".chip").forEach((b) => {
      const isActive = b.getAttribute("data-division") === activeDivision;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-selected", String(isActive));
    });

    render(filterTools(search.value, activeDivision));
  });

  // set initial active class
  wrap.querySelectorAll(".chip").forEach((b) => {
    const isActive = b.getAttribute("data-division") === activeDivision;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-selected", String(isActive));
  });
}

search.addEventListener("input", () => {
  render(filterTools(search.value, activeDivision));
});

injectDivisionChips();
render(filterTools("", activeDivision));

// ─────────────────────────────────────────────────────────────────────────────
// Request generator
// ─────────────────────────────────────────────────────────────────────────────

const reqName = document.getElementById("reqName");
const reqDesc = document.getElementById("reqDesc");
const reqUsers = document.getElementById("reqUsers");
const requestOut = document.getElementById("requestOut");

document.getElementById("genRequest").addEventListener("click", () => {
  const name = (reqName.value || "").trim();
  const desc = (reqDesc.value || "").trim();
  const users = (reqUsers.value || "").trim();

  const out = [
    "TOOL REQUEST — Legacy Crew Tools Hub",
    "",
    `Name: ${name || "[name]"}`,
    `Target users: ${users || "[who will use it]"}`,
    "",
    "Requirements:",
    `- ${desc ? desc.replace(/\n+/g, "\n- ") : "[describe what it should do]"}`,
    "",
    "Notes:",
    "- Must be usable in-browser (GitHub Pages).",
    "- Must include a 'Back to Tools Hub' link.",
    "- Must declare division(s): APS / VPS / BIS / Entertainment.",
  ].join("\n");

  requestOut.textContent = out;
});

document.getElementById("copyRequest").addEventListener("click", async () => {
  const text = requestOut.textContent || "";
  if (!text.trim()) return;
  await navigator.clipboard.writeText(text);
});

document.getElementById("clearRequest").addEventListener("click", () => {
  reqName.value = "";
  reqDesc.value = "";
  reqUsers.value = "";
  requestOut.textContent = "";
});
