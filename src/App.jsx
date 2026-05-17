import { useState } from "react";

const R = {
  PRODUCTION_COPY_CLEAN: {
    team: "production", strength: "strong", label: "Offshore",
    reason: "Straightforward copy amends are ideal Offshore work — fast and efficient with no creative overhead.",
    tips: ["List every change with old and new text side by side", "Reference exact location (page, panel, or field name)", "Consolidate all amends into one brief before submitting"],
  },
  PRODUCTION_COPY_BRAND: {
    team: "production", strength: "recommended", label: "Offshore",
    reason: "Copy amends suit Production, but brand-sensitive wording needs a design or brand sign-off before briefing.",
    tips: ["Get brand or design lead to approve the revised copy first", "Include the final approved copy in the brief — leave nothing open", "Note any regulatory or compliance requirements"],
  },
  PRODUCTION_ASSET: {
    team: "production", strength: "recommended", label: "Offshore",
    reason: "Like-for-like asset swaps with pre-approved imagery are well within Offshore scope.",
    tips: ["Provide the exact replacement file — don't ask them to source it", "Confirm dimensions and format requirements upfront", "Note if the asset needs masking or repositioning"],
  },
  EITHER_ASSET: {
    team: "either", strength: "flexible", label: "Either Team",
    reason: "Asset swaps that touch brand identity benefit from a design eye — weigh speed against brand risk.",
    tips: ["If brand compliance is critical → Nearshore", "If the asset is pre-approved by brand → Offshore is fine", "Include the approved asset file in the brief, not just a description"],
  },
  DESIGN_LAYOUT: {
    team: "design", strength: "strong", label: "Nearshore",
    reason: "Layout changes that affect brand or visual hierarchy need creative oversight to maintain design integrity.",
    tips: ["Brief the design lead with the client's exact request and rationale", "Share the original approved layout alongside the amend", "Flag if this contradicts previously approved design decisions"],
  },
  EITHER_LAYOUT: {
    team: "either", strength: "flexible", label: "Either Team",
    reason: "Structural layout amends sit in the middle — route based on brief clarity and turnaround needs.",
    tips: ["If the change is clearly specifiable → Production", "If it requires judgement on spacing or balance → Design", "Provide an annotated reference showing exactly what moves where"],
  },
  DESIGN_CREATIVE: {
    team: "design", strength: "strong", label: "Nearshore",
    reason: "Creative direction changes always require Nearshore involvement — this goes beyond amendment scope.",
    tips: ["Treat this as a new brief, not an amendment", "Arrange a design briefing session rather than a written amend", "Agree scope and timeline with the design lead before client comms"],
  },
  PROCESS_VERBAL: {
    team: "process", strength: "action-required", label: "Document First",
    reason: "Verbal-only amends carry real risk regardless of which team handles the work. Get them in writing before routing to anyone.",
    tips: ["Send a follow-up email summarising the verbal amends for client confirmation", "Use a marked-up PDF or annotated screenshot — even a quick one works", "Re-run this tool once the brief is confirmed in writing"],
  },
  DESIGN_NEW_STRONG: {
    team: "design", strength: "strong", label: "Nearshore",
    reason: "Net-new work requiring creative direction is core Nearshore territory.",
    tips: ["Schedule a briefing session early", "Allow time for concepts and revisions", "Involve the design lead from the outset"],
  },
  DESIGN_BRAND_DEVIATION: {
    team: "design", strength: "strong", label: "Nearshore",
    reason: "Significant style or brand changes need creative oversight.",
    tips: ["Brief the design lead on the deviation rationale", "Share existing assets as reference"],
  },
  EITHER_ADAPTATION: {
    team: "either", strength: "flexible", label: "Either Team",
    reason: "Minor adaptations with creative nuance could go either way — weigh speed vs quality needs.",
    tips: ["If fast turnaround is critical → Production", "If brand precision matters most → Design", "Consider a templated approach to speed up future work"],
  },
  PRODUCTION_BRIEF_CLEAR: {
    team: "production", strength: "strong", label: "Offshore",
    reason: "Clear, well-documented adaptations are exactly what the Offshore team is built for.",
    tips: ["Use a standardised brief template", "Attach source files and brand guidelines", "Include all specs upfront to avoid back-and-forth"],
  },
  PRODUCTION_BRIEF_PREP: {
    team: "production", strength: "recommended", label: "Offshore",
    reason: "A small investment in brief quality unlocks fast, scalable production output.",
    tips: ["Use a brief template to reduce prep time", "A short Loom video can replace a lengthy briefing call", "This investment pays off across future similar requests"],
  },
  DESIGN_BRIEF_COMPLEX: {
    team: "design", strength: "default", label: "Nearshore",
    reason: "Complex or ambiguous briefs need design involvement — but consider building clearer processes for next time.",
    tips: ["Document this brief as a template for future production use", "Explore whether a templated system could handle this work type"],
  },
  PRODUCTION_URGENT: {
    team: "production", strength: "recommended", label: "Offshore",
    reason: "Tight turnarounds favour the Offshore team's throughput — but invest in a tight brief.",
    tips: ["Prioritise brief clarity over brevity", "Set expectations on quality given the timeline", "Flag to design lead if brand risk is a concern"],
  },
  DESIGN_DEFAULT: {
    team: "design", strength: "default", label: "Nearshore",
    reason: "Work that doesn't fit a standard production pattern is best handled by the design team.",
    tips: ["Consider documenting this as a repeatable brief type for future production use"],
  },
};

const AMEND_BRAND_COPY   = { id: "amend-brand-copy",   question: "Do the copy changes affect brand tone of voice or messaging guidelines?", hint: "e.g. new claims, regulated language, brand positioning shifts", yes: R.PRODUCTION_COPY_BRAND, no: R.PRODUCTION_COPY_CLEAN };
const AMEND_BRAND_ASSET  = { id: "amend-brand-asset",  question: "Does the new asset affect brand guidelines or visual identity?",          hint: "e.g. non-brand photography, off-palette imagery, unapproved logo variant", yes: R.EITHER_ASSET, no: R.PRODUCTION_ASSET };
const AMEND_BRAND_LAYOUT = { id: "amend-brand-layout", question: "Do the layout changes affect brand guidelines or visual hierarchy?",      hint: "e.g. grid structure, prominence of brand elements, spacing rules", yes: R.DESIGN_LAYOUT, no: R.EITHER_LAYOUT };

const AMEND_TYPE = {
  id: "amend-type", question: "What type of changes are being requested?", hint: "If multiple types apply, select the most complex", type: "choice",
  options: [
    { label: "Copy or text only",           description: "Wording, dates, prices, contact details",                                  next: AMEND_BRAND_COPY   },
    { label: "Asset or image swap",          description: "Replacing photography, icons, logos, or other visuals",                    next: AMEND_BRAND_ASSET  },
    { label: "Layout or structural changes", description: "Moving elements, resizing sections, reordering content",                   next: AMEND_BRAND_LAYOUT },
    { label: "Creative direction change",    description: "New visual concept, style shift, or major departure from approved design",  next: R.DESIGN_CREATIVE  },
  ],
};
const AMEND_DOCS = {
  id: "amend-docs", question: "How are the amends documented?", hint: "Be honest — vague briefs cost more time than they save", type: "choice",
  options: [
    { label: "Clearly marked up",      description: "Annotated PDF, design file, or detailed written list", next: AMEND_TYPE                          },
    { label: "Partially documented",   description: "Mix of written notes and verbal context",              next: AMEND_TYPE,       docWarning: true   },
    { label: "Verbal only or unclear", description: "Discussed on a call with no written record",           next: R.PROCESS_VERBAL                   },
  ],
};
const AMEND_ROUND = {
  id: "amend-round", question: "Which round of amends is this?", hint: "Count from the first client review of this specific asset", type: "choice",
  options: [
    { label: "1st or 2nd round",   description: "Early stage review",     next: AMEND_DOCS              },
    { label: "3rd round or later", description: "Multiple review cycles", next: AMEND_DOCS, risk: true  },
  ],
};
const NEW_WORK = {
  id: "new-creative", question: "Does the work require original creative thinking or new visual direction?", hint: "e.g. concepting, layout from scratch, new brand expressions",
  yes: { id: "q2", question: "Is this a net-new asset or campaign?", hint: "Not a resize, update, or adaptation of existing work",
    yes: R.DESIGN_NEW_STRONG,
    no:  { id: "q3", question: "Does it involve a significant brand or style deviation from the original?", hint: "e.g. new market, updated brand guidelines, different audience tone",
      yes: R.DESIGN_BRAND_DEVIATION, no: R.EITHER_ADAPTATION } },
  no:  { id: "q4", question: "Is the work an adaptation, resize, or update of an existing approved asset?", hint: "e.g. resizing a banner, swapping copy, updating a date or offer",
    yes: { id: "q5", question: "Is the brief clearly documented and self-explanatory?", hint: "Could a new team member execute it with no verbal explanation?",
      yes: R.PRODUCTION_BRIEF_CLEAR,
      no:  { id: "q6", question: "Can the brief be made self-explanatory with 30 mins of prep?", hint: "Adding specs, annotated references, or a short Loom walkthrough",
        yes: R.PRODUCTION_BRIEF_PREP, no: R.DESIGN_BRIEF_COMPLEX } },
    no:  { id: "q7", question: "Is there a hard deadline within 24 hours?", hint: "Genuinely urgent — not just preferred speed",
      yes: R.PRODUCTION_URGENT, no: R.DESIGN_DEFAULT } },
};

const TREE = {
  id: "start", question: "Is this a client amendment to existing approved work?",
  hint: "Changes requested after client review — not a new brief or original work",
  yes: AMEND_ROUND, no: NEW_WORK,
};

// Original colours preserved — only accent swapped to Paragon Works orange
const teamConfig = {
  design:     { color: "#F26924", bg: "#2A1A0F", border: "#7A3810", icon: "✦", accentText: "#F26924" },
  production: { color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", icon: "⚡", accentText: "#0F766E" },
  either:     { color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", icon: "◈", accentText: "#92400E" },
  process:    { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "⚠",  accentText: "#991B1B" },
};

const strengthLabel = {
  strong: "Strong recommendation", recommended: "Recommended",
  flexible: "Flexible", default: "Default", "action-required": "Action Required",
};

export default function App() {
  const [history, setHistory] = useState([{ node: TREE, risk: false, docWarning: false }]);

  const current  = history[history.length - 1];
  const node     = current.node;
  const riskFlag = current.risk;
  const docWarn  = current.docWarning;
  const isResult = !!node.team;

  const navigate = (nextNode, opts = {}) => {
    const prev = history[history.length - 1];
    setHistory(h => [...h, { node: nextNode, risk: prev.risk || !!opts.risk, docWarning: prev.docWarning || !!opts.docWarning }]);
  };
  const answer = (choice) => navigate(node[choice]);
  const choose = (option) => navigate(option.next, { risk: option.risk, docWarning: option.docWarning });
  const back   = () => history.length > 1 && setHistory(h => h.slice(0, -1));
  const reset  = () => setHistory([{ node: TREE, risk: false, docWarning: false }]);

  const progress = Math.min(Math.round(((history.length - 1) / 6) * 100), 95);
  const cfg = isResult ? teamConfig[node.team] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0F0F13", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Roboto', sans-serif" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 620 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B6B80", marginBottom: 12, fontWeight: 500 }}>
            Delivery PM Decision Tool
          </div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", color: "#EEEEF5", margin: 0, fontWeight: 900, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            Nearshore or Offshore?
          </h1>
        </div>

        {/* Progress */}
        {!isResult && (
          <div style={{ width: "100%", maxWidth: 600, height: 2, background: "#1E1E2E", borderRadius: 2, marginBottom: 36, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #F26924, #0D9488)", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        )}

        {/* Card */}
        <div style={{ width: "100%", maxWidth: 600, background: "#16161F", border: "1px solid #2A2A3A", borderRadius: 16, padding: "36px 40px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

          {!isResult ? (
            <>
              <div style={{ fontSize: 11, color: "#8888A8", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
                Step {history.length}
              </div>
              <p style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#DDDDE8", margin: "0 0 10px 0", lineHeight: 1.5, fontWeight: 500 }}>
                {node.question}
              </p>
              {node.hint && (
                <p style={{ fontSize: 13, color: "#8888A8", margin: "0 0 28px 0", lineHeight: 1.6, fontWeight: 300, fontStyle: "italic" }}>
                  {node.hint}
                </p>
              )}

              {node.type === "choice" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {node.options.map((option, i) => (
                    <button key={i} onClick={() => choose(option)}
                      style={{ width: "100%", padding: "14px 18px", background: "#0F0F13", border: "1px solid #2A2A3A", borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "'Roboto', sans-serif", transition: "border-color 0.2s, background 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#F26924"; e.currentTarget.style.background = "#13101E"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A3A"; e.currentTarget.style.background = "#0F0F13"; }}>
                      <div style={{ fontSize: 15, color: "#DDDDE8", fontWeight: 500, marginBottom: option.description ? 4 : 0 }}>{option.label}</div>
                      {option.description && <div style={{ fontSize: 12, color: "#8888A8", fontWeight: 300 }}>{option.description}</div>}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {["yes", "no"].map(choice => (
                    <button key={choice} onClick={() => answer(choice)}
                      style={{ flex: 1, minWidth: 120, padding: "14px 28px", background: choice === "yes" ? "#F26924" : "transparent", color: choice === "yes" ? "#fff" : "#8888A8", border: choice === "yes" ? "1px solid #F26924" : "1px solid #2A2A3A", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.2s", fontFamily: "'Roboto', sans-serif" }}
                      onMouseEnter={e => { if (choice === "no") { e.target.style.borderColor = "#444"; e.target.style.color = "#DDDDE8"; } else e.target.style.background = "#D45A1A"; }}
                      onMouseLeave={e => { if (choice === "no") { e.target.style.borderColor = "#2A2A3A"; e.target.style.color = "#8888A8"; } else e.target.style.background = "#F26924"; }}>
                      {choice === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {riskFlag && (
                <div style={{ background: "#1A1008", border: "1px solid #854D0E", borderRadius: 8, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#F59E0B", fontSize: 15, lineHeight: 1.5, flexShrink: 0 }}>⚠</span>
                  <div>
                    <div style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Late-stage amends — 3rd round or later</div>
                    <div style={{ color: "#D97706", fontSize: 13, lineHeight: 1.6, fontWeight: 300 }}>Flag with your account lead. Repeated amend cycles often point to an upstream brief or approval issue worth addressing with the client.</div>
                  </div>
                </div>
              )}
              {docWarn && (
                <div style={{ background: "#0A1818", border: "1px solid #0F766E", borderRadius: 8, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#0D9488", fontSize: 15, lineHeight: 1.5, flexShrink: 0 }}>↗</span>
                  <div>
                    <div style={{ color: "#0D9488", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Partially documented amends</div>
                    <div style={{ color: "#5EEAD4", fontSize: 13, lineHeight: 1.6, fontWeight: 300 }}>Confirm all changes in writing before briefing the team. Verbal context is easily lost or misremembered.</div>
                  </div>
                </div>
              )}

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8, padding: "6px 14px", marginBottom: 22, marginTop: (riskFlag || docWarn) ? 8 : 0 }}>
                <span style={{ fontSize: 16, color: cfg.color }}>{cfg.icon}</span>
                <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: cfg.accentText, fontWeight: 700 }}>{strengthLabel[node.strength]}</span>
              </div>

              <h2 style={{ fontSize: "clamp(26px, 5vw, 38px)", color: cfg.color, margin: "0 0 14px 0", fontWeight: 900, letterSpacing: "-0.02em" }}>
                {node.label}
              </h2>
              <p style={{ fontSize: 15, color: "#8888A8", margin: "0 0 26px 0", lineHeight: 1.7, fontWeight: 300 }}>
                {node.reason}
              </p>

              <div style={{ background: "#0F0F13", border: "1px solid #2A2A3A", borderRadius: 10, padding: "20px 24px", marginBottom: 26 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8888A8", fontWeight: 700, marginBottom: 14 }}>Next steps</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {node.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: 14, color: "#8888A8", padding: "7px 0 7px 20px", borderBottom: i < node.tips.length - 1 ? "1px solid #1E1E2E" : "none", position: "relative", lineHeight: 1.6, fontWeight: 300 }}>
                      <span style={{ position: "absolute", left: 0, color: cfg.color, fontSize: 12, top: 9, fontWeight: 700 }}>→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ fontSize: 12, color: "#8888A8", fontWeight: 300, marginBottom: 22 }}>
                {history.length - 1} question{history.length !== 2 ? "s" : ""} answered
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            {history.length > 1 && (
              <button onClick={back}
                style={{ padding: "10px 20px", background: "transparent", color: "#8888A8", border: "1px solid #2A2A3A", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Roboto', sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}
                onMouseEnter={e => e.target.style.color = "#DDDDE8"}
                onMouseLeave={e => e.target.style.color = "#8888A8"}>
                ← Back
              </button>
            )}
            {isResult && (
              <button onClick={reset}
                style={{ padding: "10px 24px", background: "transparent", color: "#8888A8", border: "1px solid #2A2A3A", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Roboto', sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}
                onMouseEnter={e => e.target.style.color = "#DDDDE8"}
                onMouseLeave={e => e.target.style.color = "#8888A8"}>
                Start over
              </button>
            )}
          </div>
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: "#8888A8", textAlign: "center", maxWidth: 500, lineHeight: 1.7, fontWeight: 300 }}>
          A well-written brief is the single biggest factor in Offshore team success.
        </p>
      </div>
    </>
  );
}
