/**
 * Legacy Crew Tools Hub
 * Edit the TOOLS array only.
 * Each item should point to the tool's live URL (GitHub Pages or elsewhere).
 */

const TOOLS = [
  {
    name: "Radio Interview Question Generator",
    division: "Entertainment",
    type: "Artist Prep",
    description: "Generate radio-ready questions by category. Useful for host prep and artist media training.",
    url: "PASTE_TOOL_URL_HERE",
    repo: "PASTE_REPO_URL_HERE"
  },
  // Add more tools here
  // {
  //   name: "Naming Convention Helper",
  //   division: "Production",
  //   type: "Ops",
  //   description: "Build compliant file names from form fields (ORDER#_DDMMYYYY_CLIENT + customer name).",
  //   url: "https://...",
  //   repo: "https://github.com/..."
  // },
];

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const search = document.getElementById("search");

const manageLink = document.getElementById("manageLink");
manageLink.href = `${location.origin}${location.pathname}`.replace(/index\.html?$/,"") + "tools.js";

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function render(list){
  grid.innerHTML = "";
  count.textContent = String(list.length);

  if (!list.length) {
    grid.innerHTML = `<div class="desc">No matches. Clear search to show all tools.</div>`;
    return;
  }

  for (const t of list){
    const name = escapeHtml(t.name);
    const desc = escapeHtml(t.description || "");
    const division = escapeHtml(t.division || "—");
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

function filterTools(q){
  const s = q.trim().toLowerCase();
  if (!s) return TOOLS;

  return TOOLS.filter(t => {
    const hay = [
      t.name, t.division, t.type, t.description
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(s);
  });
}

search.addEventListener("input", () => {
  render(filterTools(search.value));
});

render(TOOLS);

// Request generator
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
