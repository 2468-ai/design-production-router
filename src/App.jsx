import { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const FONT = "'Roboto', sans-serif";
const BG   = "#0F0F13";
const CARD = "#16161F";
const BORDER = "#2A2A3A";
const ORANGE = "#F26924";
const TEAL   = "#0D9488";
const AMBER  = "#B45309";
const RED    = "#DC2626";
const BLUE   = "#4CB7D0";
const TEXT_PRIMARY   = "#EEEEF5";
const TEXT_SECONDARY = "#DDDDE8";
const TEXT_MUTED     = "#8888A8";

// ─── RESULTS: ROUTING (merged Brief Routing + Work Allocation) ────────────────
const R = {
  UK_CLARIFY:       { team:"uk",      strength:"action-required", label:"Keep in UK",       reason:"The brief isn't clear enough to allocate yet. No work should move to Chennai until the brief is confirmed and fully actionable.",          tips:["Work with the requester to clarify scope and objectives","Use the handover checklist before any cross-studio transfer","Do not send half-formed briefs to Chennai"] },
  UK_CLIENT:        { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"Client-facing, strategic or sensitive work stays in the UK. Stakeholder judgement needs to remain close to the client.",                   tips:["Confirm this with the UK PM before starting","Flag any components that could be templated for future Chennai use","Keep all client comms routed through the UK studio"] },
  UK_CREATIVE:      { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"This work requires original creative thinking or new visual direction — core UK Studio territory.",                                        tips:["Schedule a briefing session early","Allow time for concepts and revisions","Involve the design lead from the outset"] },
  UK_BRAND:         { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"This work requires specialist judgement or a brand read that needs to stay in the UK studio.",                                            tips:["Document the brand or judgement rationale for future reference","Consider whether a template could reduce this need over time","Keep creative direction ownership in the UK"] },
  UK_DEVIATION:     { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"Significant style or brand changes need creative oversight and should stay with the UK studio.",                                          tips:["Brief the design lead on the deviation rationale","Share existing assets as reference","Confirm with the client before proceeding"] },
  UK_LAYOUT:        { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"Layout changes that affect brand or visual hierarchy need creative oversight to maintain design integrity.",                               tips:["Brief the design lead with the client's exact request and rationale","Share the original approved layout alongside the amend","Flag if this contradicts previously approved design decisions"] },
  UK_COMPLEX:       { team:"uk",      strength:"default",         label:"UK Studio",         reason:"Complex or ambiguous briefs need UK Studio involvement — but consider building clearer processes for next time.",                         tips:["Document this brief as a template for future Chennai use","Explore whether a templated system could handle this work type"] },
  UK_DEFAULT:       { team:"uk",      strength:"default",         label:"UK Studio",         reason:"Work that doesn't fit a standard production pattern is best handled by the UK studio.",                                                   tips:["Consider documenting this as a repeatable brief type for future Chennai use"] },
  UK_AMEND_BRAND:   { team:"uk",      strength:"recommended",     label:"UK Studio",         reason:"Copy amends suit Chennai, but brand-sensitive wording needs a UK design or brand sign-off before briefing.",                             tips:["Get brand or design lead to approve the revised copy first","Include the final approved copy in the brief — leave nothing open","Note any regulatory or compliance requirements"] },
  UK_LAYOUT_BRAND:  { team:"uk",      strength:"strong",          label:"UK Studio",         reason:"Layout changes that affect brand guidelines or visual hierarchy need UK creative oversight.",                                             tips:["Brief the design lead with the client's exact request and rationale","Share the original approved layout alongside the amend","Flag if this contradicts previously approved design decisions"] },
  UK_CREATIVE_AMEND:{ team:"uk",      strength:"strong",          label:"UK Studio",         reason:"Creative direction changes always require UK Studio involvement — this goes beyond amendment scope.",                                     tips:["Treat this as a new brief, not an amendment","Arrange a design briefing session rather than a written amend","Agree scope and timeline with the design lead before client comms"] },
  CHENNAI:          { team:"chennai", strength:"strong",          label:"Chennai Studio",    reason:"Repeatable, production-led work is exactly what Chennai is built for. Inputs are clear and scalable.",                                   tips:["Complete the handover checklist before transfer","Confirm files, assets and deadline are all in order","Chennai should confirm understanding before starting"] },
  CHENNAI_COPY:     { team:"chennai", strength:"strong",          label:"Chennai Studio",    reason:"Straightforward copy amends are ideal Chennai work — fast and efficient with no creative overhead.",                                      tips:["List every change with old and new text side by side","Reference exact location (page, panel, or field name)","Consolidate all amends into one brief before submitting"] },
  CHENNAI_ASSET:    { team:"chennai", strength:"recommended",     label:"Chennai Studio",    reason:"Like-for-like asset swaps with pre-approved imagery are well within Chennai Studio scope.",                                              tips:["Provide the exact replacement file — don't ask them to source it","Confirm dimensions and format requirements upfront","Note if the asset needs masking or repositioning"] },
  CHENNAI_CLEAR:    { team:"chennai", strength:"strong",          label:"Chennai Studio",    reason:"Clear, well-documented adaptations are exactly what Chennai Studio is built for.",                                                       tips:["Use a standardised brief template","Attach source files and brand guidelines","Include all specs upfront to avoid back-and-forth"] },
  CHENNAI_PREP:     { team:"chennai", strength:"recommended",     label:"Chennai Studio",    reason:"A small investment in brief quality unlocks fast, scalable Chennai output.",                                                             tips:["Use a brief template to reduce prep time","A short Loom video can replace a lengthy briefing call","This investment pays off across future similar requests"] },
  CHENNAI_URGENT:   { team:"chennai", strength:"recommended",     label:"Chennai Studio",    reason:"Tight turnarounds favour Chennai's throughput — but invest in a tight brief.",                                                           tips:["Prioritise brief clarity over brevity","Set expectations on quality given the timeline","Flag to design lead if brand risk is a concern"] },
  EITHER:           { team:"either",  strength:"flexible",        label:"Either Studio",     reason:"This could go either way — weigh speed vs quality needs and route based on capacity.",                                                   tips:["If fast turnaround is critical → Chennai","If brand precision matters most → UK","Consider a templated approach to speed up future work"] },
  EITHER_ASSET:     { team:"either",  strength:"flexible",        label:"Either Studio",     reason:"Asset swaps that touch brand identity benefit from a design eye — weigh speed against brand risk.",                                      tips:["If brand compliance is critical → UK Studio","If the asset is pre-approved by brand → Chennai is fine","Include the approved asset file in the brief, not just a description"] },
  EITHER_LAYOUT:    { team:"either",  strength:"flexible",        label:"Either Studio",     reason:"Structural layout amends sit in the middle — route based on brief clarity and turnaround needs.",                                        tips:["If the change is clearly specifiable → Chennai","If it requires judgement on spacing or balance → UK","Provide an annotated reference showing exactly what moves where"] },
  SHARED:           { team:"shared",  strength:"recommended",     label:"Shared Model",      reason:"Work can be split safely. UK owns direction, priority and approvals. Chennai owns rollout and production.",                              tips:["UK must complete the handover pack before transfer","Define the split clearly — what UK owns vs what Chennai delivers","Schedule a check-in point before Chennai begins production"] },
  KEEP_TOGETHER:    { team:"uk",      strength:"default",         label:"Keep in UK",        reason:"The handover risk outweighs the benefit of splitting. Keep this together to protect quality and timeline.",                              tips:["Review whether a clearer brief could enable a split next time","Document this as a learning for future allocation decisions","Consider whether templates could make this work more transferable"] },
  PROCESS_VERBAL:   { team:"process", strength:"action-required", label:"Document First",    reason:"Verbal-only amends carry real risk regardless of which studio handles the work. Get them in writing before routing to anyone.",          tips:["Send a follow-up email summarising the verbal amends for client confirmation","Use a marked-up PDF or annotated screenshot — even a quick one works","Re-run this tool once the brief is confirmed in writing"] },
};

// ─── ROUTING TREE (merged) ────────────────────────────────────────────────────
const AMEND_BRAND_COPY   = { question:"Do the copy changes affect brand tone of voice or messaging guidelines?", hint:"e.g. new claims, regulated language, brand positioning shifts", yes:R.UK_AMEND_BRAND, no:R.CHENNAI_COPY };
const AMEND_BRAND_ASSET  = { question:"Does the new asset affect brand guidelines or visual identity?",          hint:"e.g. non-brand photography, off-palette imagery, unapproved logo variant", yes:R.EITHER_ASSET, no:R.CHENNAI_ASSET };
const AMEND_BRAND_LAYOUT = { question:"Do the layout changes affect brand guidelines or visual hierarchy?",      hint:"e.g. grid structure, prominence of brand elements, spacing rules", yes:R.UK_LAYOUT_BRAND, no:R.EITHER_LAYOUT };
const AMEND_TYPE = { question:"What type of changes are being requested?", hint:"If multiple types apply, select the most complex", type:"choice", options:[
  { label:"Copy or text only",           description:"Wording, dates, prices, contact details",                                  next:AMEND_BRAND_COPY   },
  { label:"Asset or image swap",          description:"Replacing photography, icons, logos, or other visuals",                    next:AMEND_BRAND_ASSET  },
  { label:"Layout or structural changes", description:"Moving elements, resizing sections, reordering content",                   next:AMEND_BRAND_LAYOUT },
  { label:"Creative direction change",    description:"New visual concept, style shift, or major departure from approved design",  next:R.UK_CREATIVE_AMEND },
]};
const AMEND_DOCS = { question:"How are the amends documented?", hint:"Be honest — vague briefs cost more time than they save", type:"choice", options:[
  { label:"Clearly marked up",      description:"Annotated PDF, design file, or detailed written list", next:AMEND_TYPE                         },
  { label:"Partially documented",   description:"Mix of written notes and verbal context",              next:AMEND_TYPE,      docWarning:true    },
  { label:"Verbal only or unclear", description:"Discussed on a call with no written record",           next:R.PROCESS_VERBAL                   },
]};
const AMEND_ROUND = { question:"Which round of amends is this?", hint:"Count from the first client review of this specific asset", type:"choice", options:[
  { label:"1st or 2nd round",   description:"Early stage review",     next:AMEND_DOCS              },
  { label:"3rd round or later", description:"Multiple review cycles", next:AMEND_DOCS, risk:true   },
]};

// New work branch
const NEW_BRIEF_CLEAR = {
  question:"Is the brief clearly documented and self-explanatory?", hint:"Could Chennai start without a briefing call — just the written brief and files?",
  yes:R.CHENNAI_CLEAR,
  no:{ question:"Can the brief be made self-explanatory with 30 mins of prep?", hint:"Adding specs, annotated references, or a short Loom walkthrough", yes:R.CHENNAI_PREP, no:R.UK_COMPLEX }
};
const NEW_REPEATABLE = {
  question:"Is this repeatable, production-led or an adaptation of existing work?", hint:"e.g. resizes, copy swaps, asset rollouts, templated outputs",
  yes:NEW_BRIEF_CLEAR,
  no:{ question:"Does it need specialist judgement or a brand read?", hint:"e.g. creative direction, tone of voice, new visual territory",
    yes:R.UK_BRAND,
    no:{ question:"Can the work be split safely between studios?", hint:"UK owns direction and approvals, Chennai handles rollout and production", yes:R.SHARED, no:R.KEEP_TOGETHER }}
};
const NEW_WORK = {
  question:"Is this client-facing, strategic or sensitive work?", hint:"e.g. stakeholder presentations, new client relationships, brand-critical decisions",
  yes:R.UK_CLIENT,
  no:{ question:"Does it require original creative thinking or new visual direction?", hint:"e.g. concepting, layout from scratch, new brand expressions",
    yes:{ question:"Is it net-new or does it involve a significant brand or style deviation?", hint:"Not a resize, update, or adaptation of existing approved work",
      yes:R.UK_CREATIVE, no:R.UK_DEVIATION },
    no:NEW_REPEATABLE }
};

const ROUTING_TREE = {
  question:"Is this a client amendment to existing approved work?", hint:"Changes requested after client review — not a new request or project phase",
  yes:AMEND_ROUND,
  no:{ question:"Is the brief clear and confirmed?", hint:"Could the studio receiving this work start today without chasing for context, files or approvals?",
    yes:NEW_WORK, no:R.UK_CLARIFY }
};

// ─── HANDOVER CHECK TREE ─────────────────────────────────────────────────────
const HC = {
  CLARIFY_BRIEF:  { team:"stop",  strength:"action-required", label:"Clarify Brief First",     reason:"The brief isn't clear enough to hand over. Work sent to Chennai without a clear brief creates rework risk and wastes time on both sides.",     tips:["Work with the requester to confirm scope and objectives","Use the brief template to structure the handover","Do not transfer until the brief is confirmed in writing"] },
  REQUEST_ASSETS: { team:"stop",  strength:"action-required", label:"Request Assets",           reason:"Files or assets are missing. Chennai cannot start work without the source files and assets they need.",                                        tips:["List every file needed and confirm each one is available","Check LucidLink or Box for the latest approved versions","Include all links, fonts and brand assets in the handover pack"] },
  CONFIRM_TIMING: { team:"stop",  strength:"action-required", label:"Confirm Timing & Owner",   reason:"Deadline, priority or approver is unclear. Without this, Chennai cannot plan or prioritise effectively.",                                     tips:["Confirm the hard deadline and flag any dependencies","Name a single approver and confirm their availability","Agree priority level before transfer"] },
  HOLD_UK:        { team:"stop",  strength:"action-required", label:"Hold for UK Review",       reason:"There isn't enough direction for Chennai to estimate or start. The UK studio needs to review before transfer.",                               tips:["Identify what additional direction or context is needed","Schedule a brief walkthrough before handing over","Do not transfer until Chennai can confidently start"] },
  ADD_CONTEXT:    { team:"stop",  strength:"action-required", label:"Add Notes & Context",      reason:"There isn't enough context for Chennai to start without risk of misinterpretation or rework.",                                                tips:["Add written notes or a short Loom video to the handover pack","Annotate any reference files to clarify intent","Confirm context is complete before transfer"] },
  KEEP_TOGETHER:  { team:"stop",  strength:"action-required", label:"Keep Together for Now",    reason:"The risk of rework or confusion is too high. Keep this work in the UK until the risk is resolved.",                                          tips:["Identify what would need to change to make the handover safe","Review the brief, assets and context before reconsidering","Document the issue so it informs future handover decisions"] },
  READY:          { team:"ready", strength:"strong",          label:"Ready to Hand Over",       reason:"All checks passed. This work is ready to transfer to Chennai. Complete the handover pack and confirm receipt.",                               tips:["Send files, notes and brief together in one handover package","Ask Chennai to confirm understanding before starting","Agree the first check-in point and who approves the output"] },
};

const HANDOVER_TREE = {
  question:"Is the brief clear and confirmed in writing?", hint:"The receiving team should be able to start without chasing for scope or context",
  yes:{ question:"Are all files and assets ready and accessible?", hint:"Source files, images, fonts, links — everything Chennai needs to start",
    yes:{ question:"Are deadline, priority and approver clearly confirmed?", hint:"A named approver, agreed deadline, and priority level",
      yes:{ question:"Is there enough direction for Chennai to estimate and start?", hint:"They should be able to scope the work without a briefing call",
        yes:{ question:"Is there enough context to avoid misinterpretation?", hint:"Background, reference files, notes or a Loom walkthrough",
          yes:{ question:"Is there a risk of rework or confusion?", hint:"Would you be confident Chennai will interpret this correctly first time?",
            yes:HC.KEEP_TOGETHER, no:HC.READY },
          no:HC.ADD_CONTEXT },
        no:HC.HOLD_UK },
      no:HC.CONFIRM_TIMING },
    no:HC.REQUEST_ASSETS },
  no:HC.CLARIFY_BRIEF,
};

// ─── ESCALATION TREE ─────────────────────────────────────────────────────────
const ES = {
  RESOLVE:         { team:"resolve",  strength:"strong",          label:"Resolve Locally",              reason:"This issue can be resolved today within agreed guardrails. No escalation needed — resolve, record and continue delivery.",                    tips:["Fix the issue and update the workflow log","Record it so patterns can be spotted early","Continue delivery and monitor for recurrence"] },
  MONITOR:         { team:"monitor",  strength:"recommended",     label:"Agree Comms & Monitor",        reason:"Internal recovery is possible. Agree how to communicate the issue internally and monitor through to closure.",                               tips:["Agree the internal comms approach with the UK PM","Set a check-in point to confirm the issue is closed","Document the recovery for future reference"] },
  MANAGE_INTERNAL: { team:"resolve",  strength:"recommended",     label:"Manage Internally",            reason:"Client impact is low. Manage this internally without escalating to the client or leadership.",                                              tips:["Resolve the issue and record what happened","Brief the UK PM so they can monitor","Do not involve the client unless impact grows"] },
  CLIENT_COMMS:    { team:"escalate", strength:"action-required", label:"Escalate to AD + Client Comms",reason:"There is client impact. The Account Director should be briefed and client communication needs to be managed carefully.",                    tips:["Brief the AD immediately — do not communicate with the client first","Agree the client message before it goes out","Monitor through to issue closure and document the outcome"] },
  SENIOR:          { team:"senior",   strength:"action-required", label:"Senior Escalation",            reason:"This is a major delivery, commercial or relationship risk. Leadership must be involved immediately.",                                        tips:["Escalate to leadership today — do not wait","Agree a same-day recovery plan and assign a clear owner","Run a root cause review and put preventive action in place"] },
};

const ESCALATION_TREE = {
  question:"Can this issue be resolved today within agreed guardrails?", hint:"The team has the authority, files and time to fix it without involving the UK studio or the client",
  yes:ES.RESOLVE,
  no:{ question:"Has this issue been assessed for impact on time, quality or scope?", hint:"Someone has reviewed what the issue affects and how serious it is",
    yes:{ question:"Is internal recovery possible without client involvement?", hint:"The UK studio can fix or manage this without the client needing to know",
      yes:ES.MONITOR,
      no:{ question:"Is there direct impact on the client — deadline, quality or deliverable?", hint:"Would the client notice or be affected by this issue?",
        yes:{ question:"Is this a major delivery, commercial or relationship risk?", hint:"e.g. missed deadline, significant quality failure, scope dispute, loss of trust",
          yes:ES.SENIOR, no:ES.CLIENT_COMMS },
        no:ES.MANAGE_INTERNAL }},
    no:{ question:"Is this the same issue happening again?", hint:"Has this problem or a similar one occurred before on this project?",
      yes:ES.SENIOR,
      no:{ question:"Could this affect stakeholder confidence if unresolved?", hint:"Would the client or leadership lose trust if they found out later?",
        yes:ES.CLIENT_COMMS, no:ES.MANAGE_INTERNAL }}}
};

// ─── TEAM CONFIG ─────────────────────────────────────────────────────────────
const TEAM_CONFIG = {
  uk:       { color:ORANGE, bg:"#2A1A0F", border:"#7A3810", icon:"✦", accentText:ORANGE        },
  chennai:  { color:TEAL,   bg:"#0A2020", border:"#0F6060", icon:"⚡", accentText:"#0D9488"    },
  either:   { color:AMBER,  bg:"#FFFBEB", border:"#FDE68A", icon:"◈", accentText:"#92400E"    },
  shared:   { color:BLUE,   bg:"#0A1A22", border:"#1A5060", icon:"⇄", accentText:BLUE         },
  process:  { color:RED,    bg:"#1A0808", border:"#5A1010", icon:"⚠",  accentText:"#EF4444"   },
  stop:     { color:RED,    bg:"#1A0808", border:"#5A1010", icon:"⊘", accentText:"#EF4444"    },
  ready:    { color:TEAL,   bg:"#0A2020", border:"#0F6060", icon:"✓", accentText:"#0D9488"    },
  resolve:  { color:TEAL,   bg:"#0A2020", border:"#0F6060", icon:"✓", accentText:"#0D9488"    },
  monitor:  { color:BLUE,   bg:"#0A1A22", border:"#1A5060", icon:"◉", accentText:BLUE         },
  escalate: { color:AMBER,  bg:"#2A1800", border:"#7A4800", icon:"⚑", accentText:"#F59E0B"    },
  senior:   { color:RED,    bg:"#1A0808", border:"#5A1010", icon:"⚠",  accentText:"#EF4444"   },
  defer:    { color:AMBER,  bg:"#2A1800", border:"#7A4800", icon:"⏸", accentText:"#F59E0B"    },
  split:    { color:BLUE,   bg:"#0A1A22", border:"#1A5060", icon:"⇄", accentText:BLUE         },
  resource: { color:ORANGE, bg:"#2A1A0F", border:"#7A3810", icon:"＋", accentText:ORANGE       },
};

const STRENGTH_LABEL = {
  strong:"Strong recommendation", recommended:"Recommended",
  flexible:"Flexible", default:"Default", "action-required":"Action Required",
};

// ─── HANDOVER & BRIEF CHECKER — MERGED TWO-SECTION CHECKLIST ────────────────
const SECTION_BRIEF = {
  id: "brief",
  title: "Section 1 — Brief Quality",
  subtitle: "Is the brief good enough to action?",
  items: [
    { id:"wrike",    title:"Wrike brief submitted",               desc:"The brief has been formally submitted in Wrike — not sitting in a chat, email or verbal conversation." },
    { id:"scope",    title:"Scope and deliverables defined",      desc:"What needs to be produced is clearly stated — asset type, quantity, purpose and any variants. Nothing is open to interpretation." },
    { id:"files",    title:"Reference files and assets attached", desc:"All reference files, existing assets, brand guidelines and source files are attached or linked in Wrike. The studio should not need to chase for anything." },
    { id:"deadline", title:"Deadline and priority stated",        desc:"A specific delivery date is confirmed alongside a clear priority level. 'ASAP' or 'end of week' are not enough." },
    { id:"specs",    title:"Format and specs confirmed",          desc:"Output format, dimensions, file type and any technical specifications are clearly stated. The studio knows exactly what to deliver." },
  ],
};

const SECTION_HANDOVER = {
  id: "handover",
  title: "Section 2 — Handover Readiness",
  subtitle: "Is it safe to transfer to Chennai?",
  items: [
    { id:"owner",    title:"Owner and next action confirmed",  desc:"A named person is responsible for this work on the Chennai side. The first action is clearly defined and agreed before transfer." },
    { id:"allfiles", title:"All files accessible and shared",  desc:"Source files, fonts, links and assets are in LucidLink or Box. Nothing is on a local drive or behind access the Chennai team doesn't have." },
    { id:"timing",   title:"Deadline, priority and approver",  desc:"The hard deadline is confirmed. A single named approver is available. Chennai knows where this sits in the queue." },
    { id:"context",  title:"Enough context to start",          desc:"Background, annotated references or a short Loom walkthrough are included. Chennai can start without a briefing call." },
    { id:"risks",    title:"Open issues or risks noted",       desc:"Any known blockers, risks or open questions are written down and included. Nothing is being assumed or left for Chennai to figure out." },
    { id:"norework", title:"Low risk of rework or confusion",  desc:"You are confident Chennai will interpret this correctly first time. If not, add more notes before transferring." },
  ],
};

const HANDOVER_SECTIONS = [SECTION_BRIEF, SECTION_HANDOVER];

// ─── CAPACITY TRIAGE TREE ─────────────────────────────────────────────────────
const CT = {
  MONITOR:          { team:"monitor",   strength:"recommended",     label:"Monitor & Continue",            reason:"Volume is within capacity. No immediate action needed — keep an eye on intake and flag early if volume continues to rise.", tips:["Review the pipeline at your next daily check-in","Set a threshold for when to re-run this tool","Log the spike so patterns can be identified over time"] },
  DEFER:            { team:"defer",     strength:"recommended",     label:"Defer Lower-Priority Briefs",   reason:"Deferring lower-priority work protects active deadlines without escalating. Agree the deferral with the requester before acting.", tips:["Identify which briefs can move without client impact","Confirm the deferral with the requester in writing","Set a new target date and update Wrike accordingly"] },
  SPLIT:            { team:"split",     strength:"strong",          label:"Rebalance Across Studios",      reason:"Redistributing work between UK and Chennai is the most efficient way to absorb a volume spike when inputs are ready.", tips:["Run the Brief & Work Routing tool for each piece before splitting","Confirm Chennai has capacity before transferring","Complete the Handover & Brief Check for every piece that moves"] },
  DEFER_AND_SPLIT:  { team:"split",     strength:"strong",          label:"Defer Low-Priority + Rebalance",reason:"Combine deferring lower-priority work with rebalancing across studios. Together these should absorb the spike without needing to escalate.", tips:["Prioritise active deadline work and route it to the right studio first","Confirm deferrals with requesters before actioning","Monitor for 24 hours — if pressure remains, escalate to AD"] },
  RESOURCE:         { team:"resource",  strength:"action-required", label:"Request Additional Resource",   reason:"Volume cannot be absorbed through rebalancing or deferral alone. A resource request needs to be raised with the Account Director.", tips:["Document the volume spike with numbers before raising it","Flag to the AD today — not after the deadline slips","Specify what resource is needed: hours, skills, or an extra pair of hands"] },
  FLAG_AD:          { team:"escalate",  strength:"action-required", label:"Flag to Account Director",      reason:"Client deadlines are at risk and the issue cannot be resolved internally. The AD needs to be briefed now so they can manage client expectations.", tips:["Brief the AD before communicating with the client","Bring a proposed solution, not just the problem","Agree the client message together before it goes out"] },
  FLAG_AND_RESOURCE:{ team:"senior",    strength:"action-required", label:"Flag to AD + Request Resource", reason:"This is a critical capacity failure. The AD must be involved immediately and additional resource needs to be secured to protect delivery.", tips:["Escalate today — do not wait for the situation to worsen","Document the gap clearly: hours needed, skills required, timeline","Agree a same-day recovery plan with the AD"] },
};

const CAPACITY_TREE = {
  question:"Is the current volume of work within agreed studio capacity?", hint:"Compare active briefs and hours against the studio's confirmed weekly capacity",
  yes: CT.MONITOR,
  no: {
    question:"Are any client deadlines at immediate risk?", hint:"Would a client miss a delivery or approval window if nothing changes today?",
    yes: {
      question:"Can the work be rebalanced across UK and Chennai to absorb the spike?", hint:"Are there briefs ready to route to Chennai with clear inputs and a completed handover check?",
      yes: {
        question:"Does rebalancing alone protect all client deadlines?", hint:"After splitting the work, will everything still land on time?",
        yes: CT.SPLIT,
        no: CT.FLAG_AND_RESOURCE,
      },
      no: {
        question:"Can lower-priority briefs be deferred to free up capacity for urgent work?", hint:"Are there briefs in the queue that could move without affecting a client deadline?",
        yes: CT.FLAG_AD,
        no: CT.FLAG_AND_RESOURCE,
      },
    },
    no: {
      question:"Can lower-priority briefs be deferred to ease the pressure?", hint:"Are there briefs that could move without impacting any confirmed client deadline?",
      yes: {
        question:"Can the remaining volume be rebalanced across UK and Chennai?", hint:"After deferring, is there still more work than the studio can handle this week?",
        yes: CT.DEFER_AND_SPLIT,
        no: CT.DEFER,
      },
      no: {
        question:"Can the work be rebalanced across UK and Chennai?", hint:"Are briefs ready to route to Chennai with clear inputs?",
        yes: CT.SPLIT,
        no: CT.RESOURCE,
      },
    },
  },
};

// ─── TOOLS ───────────────────────────────────────────────────────────────────
const TOOLS = [
  { id:"routing",   type:"tree",     title:"Brief & Work Routing",    subtitle:"UK or Chennai?",               icon:"⇄", desc:"Route a new brief, project phase or client amendment to the right studio.", tree:ROUTING_TREE,    maxSteps:7 },
  { id:"handover",  type:"twostep",  title:"Handover & Brief Check",  subtitle:"Ready to hand over to Chennai?",icon:"✓", desc:"Check brief quality and handover readiness before anything moves to Chennai.", sections:HANDOVER_SECTIONS },
  { id:"escalation",type:"tree",     title:"Escalation",              subtitle:"How to escalate an issue?",    icon:"⚑", desc:"Decide whether and how to escalate a live delivery issue.",               tree:ESCALATION_TREE, maxSteps:5 },
  { id:"capacity",  type:"tree",     title:"Capacity Triage",         subtitle:"How to handle a volume spike?",icon:"◈", desc:"Decide how to respond when studio volume exceeds capacity.",               tree:CAPACITY_TREE,   maxSteps:5 },
];

// ─── DECISION ENGINE ─────────────────────────────────────────────────────────
function useTree(tree) {
  const [history, setHistory] = useState([{ node:tree, risk:false, docWarning:false }]);
  const current  = history[history.length-1];
  const node     = current.node;
  const isResult = !!node.team;
  const navigate = (nextNode, opts={}) => {
    const prev = history[history.length-1];
    setHistory(h=>[...h,{ node:nextNode, risk:prev.risk||!!opts.risk, docWarning:prev.docWarning||!!opts.docWarning }]);
  };
  return {
    node, isResult,
    riskFlag: current.risk,
    docWarn:  current.docWarning,
    steps:    history.length,
    answer:   (choice) => navigate(node[choice]),
    choose:   (option) => navigate(option.next,{ risk:option.risk, docWarning:option.docWarning }),
    back:     () => history.length>1 && setHistory(h=>h.slice(0,-1)),
    reset:    () => setHistory([{ node:tree, risk:false, docWarning:false }]),
  };
}

// ─── TREE VIEW ───────────────────────────────────────────────────────────────
function TreeView({ tool, onHome }) {
  const { node, isResult, riskFlag, docWarn, steps, answer, choose, back, reset } = useTree(tool.tree);
  const progress = Math.min(Math.round(((steps-1)/tool.maxSteps)*100),95);
  const cfg = isResult ? (TEAM_CONFIG[node.team]||TEAM_CONFIG.resolve) : null;

  return (
    <div style={{ width:"100%", maxWidth:620 }}>
      <button onClick={onHome} style={{ background:"transparent", border:"none", color:TEXT_MUTED, fontSize:13, cursor:"pointer", fontFamily:FONT, marginBottom:24, display:"flex", alignItems:"center", gap:6, padding:0 }}
        onMouseEnter={e=>e.currentTarget.style.color=TEXT_SECONDARY} onMouseLeave={e=>e.currentTarget.style.color=TEXT_MUTED}>
        ← All tools
      </button>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:TEXT_MUTED, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>{tool.subtitle}</div>
        <h2 style={{ fontSize:"clamp(20px,4vw,28px)", color:TEXT_PRIMARY, fontWeight:900, margin:0, letterSpacing:"-0.01em" }}>{tool.title}</h2>
      </div>
      {!isResult && (
        <div style={{ height:2, background:"#1E1E2E", borderRadius:2, marginBottom:28, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${ORANGE},${TEAL})`, borderRadius:2, transition:"width 0.4s ease" }} />
        </div>
      )}
      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"36px 40px", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
        {!isResult ? (
          <>
            <div style={{ fontSize:11, color:TEXT_MUTED, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:20 }}>Step {steps}</div>
            <p style={{ fontSize:"clamp(16px,3vw,20px)", color:TEXT_SECONDARY, margin:"0 0 10px 0", lineHeight:1.5, fontWeight:500 }}>{node.question}</p>
            {node.hint && <p style={{ fontSize:13, color:TEXT_MUTED, margin:"0 0 28px 0", lineHeight:1.6, fontWeight:300, fontStyle:"italic" }}>{node.hint}</p>}
            {node.type==="choice" ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {node.options.map((opt,i)=>(
                  <button key={i} onClick={()=>choose(opt)}
                    style={{ width:"100%", padding:"14px 18px", background:BG, border:`1px solid ${BORDER}`, borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:FONT, transition:"border-color 0.2s, background 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.background="#13101E";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=BG;}}>
                    <div style={{ fontSize:15, color:TEXT_SECONDARY, fontWeight:500, marginBottom:opt.description?4:0 }}>{opt.label}</div>
                    {opt.description && <div style={{ fontSize:12, color:TEXT_MUTED, fontWeight:300 }}>{opt.description}</div>}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {["yes","no"].map(choice=>(
                  <button key={choice} onClick={()=>answer(choice)}
                    style={{ flex:1, minWidth:120, padding:"14px 28px", background:choice==="yes"?ORANGE:"transparent", color:choice==="yes"?"#fff":TEXT_MUTED, border:choice==="yes"?`1px solid ${ORANGE}`:`1px solid ${BORDER}`, borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", transition:"all 0.2s", fontFamily:FONT }}
                    onMouseEnter={e=>{ if(choice==="no"){e.target.style.borderColor="#444";e.target.style.color=TEXT_SECONDARY;}else e.target.style.background="#D45A1A"; }}
                    onMouseLeave={e=>{ if(choice==="no"){e.target.style.borderColor=BORDER;e.target.style.color=TEXT_MUTED;}else e.target.style.background=ORANGE; }}>
                    {choice==="yes"?"Yes":"No"}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {riskFlag && (
              <div style={{ background:"#1A1008", border:"1px solid #854D0E", borderRadius:8, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"flex-start", gap:10 }}>
                <span style={{ color:"#F59E0B", fontSize:15, lineHeight:1.5, flexShrink:0 }}>⚠</span>
                <div>
                  <div style={{ color:"#F59E0B", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Late-stage amends — 3rd round or later</div>
                  <div style={{ color:"#D97706", fontSize:13, lineHeight:1.6, fontWeight:300 }}>Flag with your account lead. Repeated amend cycles often point to an upstream brief or approval issue.</div>
                </div>
              </div>
            )}
            {docWarn && (
              <div style={{ background:"#0A1818", border:"1px solid #0F766E", borderRadius:8, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"flex-start", gap:10 }}>
                <span style={{ color:TEAL, fontSize:15, lineHeight:1.5, flexShrink:0 }}>↗</span>
                <div>
                  <div style={{ color:TEAL, fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Partially documented amends</div>
                  <div style={{ color:"#5EEAD4", fontSize:13, lineHeight:1.6, fontWeight:300 }}>Confirm all changes in writing before briefing the studio.</div>
                </div>
              </div>
            )}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:8, padding:"6px 14px", marginBottom:22, marginTop:(riskFlag||docWarn)?8:0 }}>
              <span style={{ fontSize:16, color:cfg.color }}>{cfg.icon}</span>
              <span style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:cfg.accentText, fontWeight:700 }}>{STRENGTH_LABEL[node.strength]}</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,5vw,38px)", color:cfg.color, margin:"0 0 14px 0", fontWeight:900, letterSpacing:"-0.02em" }}>{node.label}</h2>
            <p style={{ fontSize:15, color:TEXT_MUTED, margin:"0 0 26px 0", lineHeight:1.7, fontWeight:300 }}>{node.reason}</p>
            <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"20px 24px", marginBottom:26 }}>
              <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:TEXT_MUTED, fontWeight:700, marginBottom:14 }}>Next steps</div>
              <ul style={{ margin:0, padding:0, listStyle:"none" }}>
                {node.tips.map((tip,i)=>(
                  <li key={i} style={{ fontSize:14, color:TEXT_MUTED, padding:"7px 0 7px 20px", borderBottom:i<node.tips.length-1?`1px solid #1E1E2E`:"none", position:"relative", lineHeight:1.6, fontWeight:300 }}>
                    <span style={{ position:"absolute", left:0, color:cfg.color, fontSize:12, top:9, fontWeight:700 }}>→</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ fontSize:12, color:TEXT_MUTED, fontWeight:300, marginBottom:22 }}>{steps-1} question{steps!==2?"s":""} answered</div>
          </>
        )}
        <div style={{ display:"flex", gap:12 }}>
          {steps>1 && <button onClick={back} style={{ padding:"10px 20px", background:"transparent", color:TEXT_MUTED, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, cursor:"pointer", fontFamily:FONT, fontWeight:500 }} onMouseEnter={e=>e.target.style.color=TEXT_SECONDARY} onMouseLeave={e=>e.target.style.color=TEXT_MUTED}>← Back</button>}
          {isResult && <button onClick={reset} style={{ padding:"10px 24px", background:"transparent", color:TEXT_MUTED, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, cursor:"pointer", fontFamily:FONT, fontWeight:500 }} onMouseEnter={e=>e.target.style.color=TEXT_SECONDARY} onMouseLeave={e=>e.target.style.color=TEXT_MUTED}>Start over</button>}
        </div>
      </div>
      {/* Logo bottom-right */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20, paddingRight:4 }}>
        <img src="/logo.png" alt="Paragon Works Global Studios" style={{ height:28, width:"auto", opacity:0.35 }} />
      </div>
    </div>
  );
}

// ─── TWO-STEP CHECKLIST VIEW ─────────────────────────────────────────────────
function TwoStepView({ tool, onHome }) {
  const [checked, setChecked] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const sections = tool.sections;
  const current  = sections[activeSection];
  const isLast   = activeSection === sections.length - 1;

  const sectionDone = (sec) => sec.items.every(i => checked[i.id]);
  const allDone     = sections.every(sectionDone);
  const currentDone = sectionDone(current);

  const totalItems = sections.reduce((n, s) => n + s.items.length, 0);
  const doneItems  = Object.values(checked).filter(Boolean).length;
  const progress   = Math.round((doneItems / totalItems) * 100);

  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const reset  = () => { setChecked({}); setActiveSection(0); };

  return (
    <div style={{ width:"100%", maxWidth:620 }}>
      <button onClick={onHome} style={{ background:"transparent", border:"none", color:TEXT_MUTED, fontSize:13, cursor:"pointer", fontFamily:FONT, marginBottom:24, display:"flex", alignItems:"center", gap:6, padding:0 }}
        onMouseEnter={e=>e.currentTarget.style.color=TEXT_SECONDARY} onMouseLeave={e=>e.currentTarget.style.color=TEXT_MUTED}>
        ← All tools
      </button>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:TEXT_MUTED, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>{tool.subtitle}</div>
        <h2 style={{ fontSize:"clamp(20px,4vw,28px)", color:TEXT_PRIMARY, fontWeight:900, margin:0, letterSpacing:"-0.01em" }}>{tool.title}</h2>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:"#1E1E2E", borderRadius:2, marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${progress}%`, background: allDone ? TEAL : `linear-gradient(90deg,${ORANGE},${TEAL})`, borderRadius:2, transition:"width 0.4s ease" }} />
      </div>

      {/* Section tabs */}
      {!allDone && (
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {sections.map((sec, i) => {
            const done = sectionDone(sec);
            const active = i === activeSection;
            return (
              <button key={sec.id} onClick={() => setActiveSection(i)}
                style={{ flex:1, padding:"10px 14px", background: active ? CARD : BG, border:`1px solid ${active ? ORANGE : done ? TEAL : BORDER}`, borderRadius:10, cursor:"pointer", fontFamily:FONT, textAlign:"center", transition:"all 0.2s" }}>
                <div style={{ fontSize:11, color: done ? TEAL : active ? ORANGE : TEXT_MUTED, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  {done ? "✓ " : ""}{i === 0 ? "Brief Quality" : "Handover Readiness"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ background:CARD, border:`1px solid ${allDone ? TEAL : BORDER}`, borderRadius:16, padding:"36px 40px", boxShadow:"0 24px 60px rgba(0,0,0,0.5)", transition:"border-color 0.3s" }}>

        {!allDone ? (
          <>
            <div style={{ fontSize:11, color:TEXT_MUTED, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>
              {current.items.filter(i => checked[i.id]).length} of {current.items.length} complete
            </div>
            <p style={{ fontSize:"clamp(15px,3vw,18px)", color:TEXT_SECONDARY, margin:"0 0 6px 0", lineHeight:1.5, fontWeight:500 }}>{current.title}</p>
            <p style={{ fontSize:13, color:TEXT_MUTED, margin:"0 0 24px 0", lineHeight:1.6, fontWeight:300, fontStyle:"italic" }}>{current.subtitle}</p>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {current.items.map(item => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  style={{ width:"100%", padding:"14px 16px", background: checked[item.id] ? "#0A2020" : BG, border:`1px solid ${checked[item.id] ? TEAL : BORDER}`, borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:FONT, transition:"all 0.2s", display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${checked[item.id] ? TEAL : "#3A3A50"}`, background: checked[item.id] ? TEAL : "transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all 0.2s" }}>
                    {checked[item.id] && <span style={{ color:"#fff", fontSize:12, fontWeight:900, lineHeight:1 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:14, color: checked[item.id] ? TEAL : TEXT_SECONDARY, fontWeight:600, marginBottom:3, transition:"color 0.2s" }}>{item.title}</div>
                    <div style={{ fontSize:12, color:TEXT_MUTED, fontWeight:300, lineHeight:1.6 }}>{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Next section button */}
            {currentDone && !isLast && (
              <button onClick={() => setActiveSection(s => s + 1)}
                style={{ marginTop:20, width:"100%", padding:"14px", background:ORANGE, border:`1px solid ${ORANGE}`, borderRadius:10, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:FONT, transition:"background 0.2s", letterSpacing:"0.03em" }}
                onMouseEnter={e=>e.target.style.background="#D45A1A"} onMouseLeave={e=>e.target.style.background=ORANGE}>
                Continue to Section 2 →
              </button>
            )}
          </>
        ) : (
          <>
            {/* All done */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0A2020", border:`1px solid #0F6060`, borderRadius:8, padding:"6px 14px", marginBottom:22 }}>
              <span style={{ fontSize:16, color:TEAL }}>✓</span>
              <span style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#0D9488", fontWeight:700 }}>All checks passed</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,5vw,36px)", color:TEAL, margin:"0 0 14px 0", fontWeight:900, letterSpacing:"-0.02em" }}>Ready to Hand Over</h2>
            <p style={{ fontSize:15, color:TEXT_MUTED, margin:"0 0 26px 0", lineHeight:1.7, fontWeight:300 }}>
              Both sections complete. The brief is ready and the handover pack is confirmed. Send everything to Chennai and ask them to confirm receipt before starting.
            </p>

            {/* Section summaries */}
            {sections.map((sec, si) => (
              <div key={sec.id} style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"18px 22px", marginBottom:12 }}>
                <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:TEAL, fontWeight:700, marginBottom:12 }}>{sec.title}</div>
                <ul style={{ margin:0, padding:0, listStyle:"none" }}>
                  {sec.items.map((item, i) => (
                    <li key={item.id} style={{ fontSize:13, color:TEXT_MUTED, padding:"5px 0 5px 18px", borderBottom:i<sec.items.length-1?`1px solid #1E1E2E`:"none", position:"relative", lineHeight:1.6, fontWeight:300 }}>
                      <span style={{ position:"absolute", left:0, color:TEAL, fontSize:11, top:7, fontWeight:700 }}>→</span>{item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ background:"#0A2020", border:`1px solid #0F6060`, borderRadius:10, padding:"16px 20px", marginTop:16, marginBottom:24 }}>
              <div style={{ fontSize:13, color:"#5EEAD4", fontWeight:300, lineHeight:1.7 }}>
                <strong style={{ color:TEAL, fontWeight:700 }}>Next:</strong> Send files, brief and notes together in one package. Ask Chennai to confirm understanding before starting. Agree the first check-in point and who signs off the output.
              </div>
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:12, marginTop: allDone ? 0 : (currentDone && !isLast ? 12 : 24) }}>
          <button onClick={reset} style={{ padding:"10px 20px", background:"transparent", color:TEXT_MUTED, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, cursor:"pointer", fontFamily:FONT, fontWeight:500 }}
            onMouseEnter={e=>e.target.style.color=TEXT_SECONDARY} onMouseLeave={e=>e.target.style.color=TEXT_MUTED}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20, paddingRight:4 }}>
        <img src="/logo.png" alt="Paragon Works Global Studios" style={{ height:28, width:"auto", opacity:0.35 }} />
      </div>
    </div>
  );
}



function HomeScreen({ onSelect }) {
  return (
    <div style={{ width:"100%", maxWidth:620 }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <img src="/logo.png" alt="Paragon Works Global Studios" style={{ height:52, width:"auto", marginBottom:32, opacity:0.95 }} />
        <h1 style={{ fontSize:"clamp(24px,4vw,34px)", color:TEXT_PRIMARY, fontWeight:900, margin:"0 0 12px 0", letterSpacing:"-0.02em" }}>Delivery Decision Tools</h1>
        <p style={{ fontSize:15, color:TEXT_MUTED, fontWeight:300, lineHeight:1.7, maxWidth:460, margin:"0 auto" }}>Select a tool to route your work, check a handover, or manage an escalation.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {TOOLS.map(tool=>(
          <button key={tool.id} onClick={()=>onSelect(tool)}
            style={{ width:"100%", padding:"22px 28px", background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, cursor:"pointer", textAlign:"left", fontFamily:FONT, transition:"border-color 0.2s, background 0.2s", display:"flex", alignItems:"center", gap:20 }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.background="#13101E";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=CARD;}}>
            <div style={{ fontSize:26, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", background:BG, borderRadius:10, flexShrink:0, color:ORANGE }}>{tool.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, color:TEXT_PRIMARY, fontWeight:700, marginBottom:4 }}>{tool.title}</div>
              <div style={{ fontSize:13, color:TEXT_MUTED, fontWeight:300 }}>{tool.desc}</div>
            </div>
            <div style={{ fontSize:20, color:BORDER, flexShrink:0 }}>›</div>
          </button>
        ))}
      </div>
      <p style={{ marginTop:32, fontSize:12, color:TEXT_MUTED, textAlign:"center", lineHeight:1.7, fontWeight:300 }}>
        Delivering the future of agile, connected and collaborative workplaces
      </p>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:${FONT};background:${BG};}`}</style>
      <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", fontFamily:FONT }}>
        {activeTool
          ? activeTool.type === "twostep"
            ? <TwoStepView tool={activeTool} onHome={()=>setActiveTool(null)} />
            : <TreeView tool={activeTool} onHome={()=>setActiveTool(null)} />
          : <HomeScreen onSelect={setActiveTool} />}
      </div>
      <SpeedInsights />
    </>
  );
}
