"use client";

import { useMemo, useState } from "react";

type SectionKey =
  | "overview"
  | "brand"
  | "foundations"
  | "components"
  | "flows"
  | "accessibility"
  | "handoff";

type IconName =
  | "home"
  | "spark"
  | "palette"
  | "blocks"
  | "route"
  | "check"
  | "code"
  | "book"
  | "bookmark"
  | "settings"
  | "close"
  | "arrow"
  | "volume"
  | "eye"
  | "refresh"
  | "calendar";

const navItems: Array<{
  key: SectionKey;
  label: string;
  kicker: string;
  icon: IconName;
}> = [
  { key: "overview", label: "Direction", kicker: "Start here", icon: "home" },
  { key: "brand", label: "Brand", kicker: "Logo & voice", icon: "spark" },
  { key: "foundations", label: "Foundations", kicker: "Tokens", icon: "palette" },
  { key: "components", label: "Components", kicker: "Building blocks", icon: "blocks" },
  { key: "flows", label: "Clickthroughs", kicker: "Product UI", icon: "route" },
  { key: "accessibility", label: "Accessibility", kicker: "Quality bar", icon: "check" },
  { key: "handoff", label: "Handoff", kicker: "Use it", icon: "code" },
];

const tokens = {
  color: {
    "brand-orange": "#FF6B00",
    "brand-orange-deep": "#9C3900",
    "ink-strong": "#1B1714",
    "ink-muted": "#675C54",
    "paper": "#FFF9F2",
    "paper-raised": "#FFFFFF",
    "paper-soft": "#F8EEE4",
    "line": "#D8CABE",
    "success": "#2F6B4F",
    "warning": "#7A5100",
    "danger": "#9D2A2A",
    "info": "#275C7D",
  },
  space: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "24px", 6: "32px", 7: "48px" },
  radius: { control: "10px", card: "16px", panel: "24px", round: "999px" },
  shadow: {
    low: "0 1px 2px rgba(27, 23, 20, .08), 0 5px 16px rgba(27, 23, 20, .06)",
    high: "0 18px 60px rgba(27, 23, 20, .18)",
  },
  motion: { fast: "120ms", standard: "180ms", deliberate: "260ms" },
};

const cssTokenText = `:root {
  --dm-brand-orange: #FF6B00;
  --dm-brand-orange-deep: #9C3900;
  --dm-ink-strong: #1B1714;
  --dm-ink-muted: #675C54;
  --dm-paper: #FFF9F2;
  --dm-paper-raised: #FFFFFF;
  --dm-paper-soft: #F8EEE4;
  --dm-line: #D8CABE;
  --dm-success: #2F6B4F;
  --dm-warning: #7A5100;
  --dm-danger: #9D2A2A;
  --dm-info: #275C7D;
  --dm-space-1: 4px;
  --dm-space-2: 8px;
  --dm-space-3: 12px;
  --dm-space-4: 16px;
  --dm-space-5: 24px;
  --dm-space-6: 32px;
  --dm-space-7: 48px;
  --dm-radius-control: 10px;
  --dm-radius-card: 16px;
  --dm-radius-panel: 24px;
  --dm-shadow-low: 0 1px 2px rgba(27,23,20,.08), 0 5px 16px rgba(27,23,20,.06);
  --dm-motion-fast: 120ms;
  --dm-motion-standard: 180ms;
  --dm-motion-deliberate: 260ms;
}`;

function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    palette: <><circle cx="12" cy="12" r="9" /><path d="M15.5 17.5c-1 1.8-4.3 1-3.3-1.3.8-1.8-1.7-2.8-3.8-3.2C4.7 12.2 4.8 7.5 8 5" /><circle cx="8.4" cy="8.3" r=".7" fill="currentColor" stroke="none" /><circle cx="12" cy="6.8" r=".7" fill="currentColor" stroke="none" /><circle cx="15.5" cy="8.4" r=".7" fill="currentColor" stroke="none" /></>,
    blocks: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" /></>,
    check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5" />,
    volume: <><path d="M5 10v4h3l4 3V7l-4 3H5Z" /><path d="M16 9a4 4 0 0 1 0 6" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M4.9 17A8 8 0 0 0 20 12M4 12A8 8 0 0 1 19.1 7" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Mark({ size = 38 }: { size?: number }) {
  return <img className="brand-mark" src="/brand/dutchmate-mark.svg" width={size} height={size} alt="" />;
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="section-lead">{children}</div>
    </header>
  );
}

function SpecCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`spec-card ${className}`}>
      <h2>{title}</h2>
      {children}
    </article>
  );
}

function DownloadLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="button button-secondary" href={href} download>
      {children}
      <Icon name="arrow" size={16} />
    </a>
  );
}

function Direction() {
  return (
    <>
      <SectionIntro eyebrow="DutchMate design system · v1.1" title="A calm companion for learning in the wild.">
        <p>
          DutchMate should feel like a thoughtful Dutch-speaking friend beside the page: quick when
          you only need meaning, structured when you are ready to practise, and never noisy about
          progress it cannot honestly prove.
        </p>
      </SectionIntro>

      <section className="hero-principle">
        <div>
          <Pill tone="brand">North star</Pill>
          <h2>Read → Notice → Practise → Keep</h2>
          <p>
            Translation starts the loop. Short contextual retrieval turns it into learning. Saved
            words and chunks return only when they have a useful reason to return.
          </p>
        </div>
        <div className="rail-demo" aria-label="Learning loop">
          {["Read", "Notice", "Practise", "Keep"].map((item, index) => (
            <div key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="three-grid">
        <SpecCard title="Fun, without theatre">
          <p>
            Warm copy, small moments of delight, and tactile controls. No points, lives, confetti,
            fake fluency scores, or guilt-driven streaks.
          </p>
        </SpecCard>
        <SpecCard title="Educational by construction">
          <p>
            Curated content, active recall, controlled transformation, immediate correction, and
            separate recognition and recall evidence.
          </p>
        </SpecCard>
        <SpecCard title="Friendly to real reading">
          <p>
            One next action, fast exits, no forced typing, no extra tabs, and practice that returns
            the learner to the webpage quickly.
          </p>
        </SpecCard>
      </div>

      <section className="decision-table">
        <div className="table-head">
          <span>Product decision</span>
          <span>System rule</span>
        </div>
        {[
          ["Preservation contract", "This system restyles and unifies DutchMate one-to-one. Existing UI remains; clickthrough-only concepts are proposals. Removals, relocations, and new features require separate approval."],
          ["Primary navigation", "Today · Lessons · Saved. Learning mechanics never become extra top-level tabs."],
          ["Popup boundary", "390 × 600 px, fixed. Focused work hides navigation and keeps a clear Exit."],
          ["Settings boundary", "Popup Settings contains only frequent review preferences. All extension configuration remains on the browser Options page."],
          ["Learning generation", "Deterministic and curated in v1. No runtime LLM dependency."],
          ["Progress language", "Describe observed actions and secure skills; do not imply proficiency from clicks."],
          ["Multilingual support", "Dutch leads. English and Telugu help without competing with the target language."],
          ["Privacy", "Local-first learning records; no account required; no stored browsing history."],
        ].map(([decision, rule]) => (
          <div className="table-row" key={decision}>
            <strong>{decision}</strong>
            <span>{rule}</span>
          </div>
        ))}
      </section>

      <div className="coverage-strip">
        <strong>System coverage</strong>
        <span>Brand</span><span>Tokens</span><span>Components</span><span>Popup</span>
        <span>Tooltip</span><span>Options</span><span>Clickthroughs</span><span>A11y</span>
      </div>
    </>
  );
}

function Brand() {
  return (
    <>
      <SectionIntro eyebrow="01 · Brand" title="Recognisable at 16 pixels. Warm at every size.">
        <p>
          The mark is a DutchMate “D” built as a speech card: language, reading, and a helpful
          companion in one compact shape. The orange tile keeps continuity with the current product.
        </p>
      </SectionIntro>

      <div className="brand-showcase">
        <article className="brand-board brand-board-light">
          <img src="/brand/dutchmate-lockup.svg" alt="DutchMate logo on warm paper" />
          <p>Primary lockup · warm or white backgrounds</p>
        </article>
        <article className="brand-board brand-board-dark">
          <div className="reverse-lockup"><Mark size={56} /><span>Dutch<span>Mate</span></span></div>
          <p>Reverse lockup · dark backgrounds</p>
        </article>
      </div>

      <div className="two-grid">
        <SpecCard title="Mark construction">
          <div className="mark-sizes">
            {[64, 48, 32, 24, 16].map((size) => (
              <div key={size}><Mark size={size} /><span>{size}px</span></div>
            ))}
          </div>
          <ul className="rules-list">
            <li>Minimum digital size: 16 × 16 px.</li>
            <li>Clear space: one quarter of the mark width.</li>
            <li>Keep the orange tile, dark D, and paper counter together.</li>
            <li>Do not recolour, outline, rotate, or add a drop shadow to the mark.</li>
          </ul>
        </SpecCard>
        <SpecCard title="Asset package">
          <div className="download-stack">
            <DownloadLink href="/brand/dutchmate-mark.svg">Download mark SVG</DownloadLink>
            <DownloadLink href="/brand/dutchmate-wordmark.svg">Download wordmark SVG</DownloadLink>
            <DownloadLink href="/brand/dutchmate-lockup.svg">Download lockup SVG</DownloadLink>
          </div>
          <p className="quiet-note">
            Use the mark for browser toolbar icons and favicons. Use the lockup in product headers,
            store assets, and documentation.
          </p>
        </SpecCard>
      </div>

      <div className="two-grid">
        <SpecCard title="Iconography">
          <div className="icon-grid">
            {(["home", "book", "bookmark", "calendar", "eye", "volume", "refresh", "settings", "close", "check", "arrow", "spark"] as IconName[]).map((icon) => (
              <div className="icon-cell" key={icon}>
                <Icon name={icon} size={22} />
                <span>{icon}</span>
              </div>
            ))}
          </div>
          <p className="quiet-note">24 px canvas · 1.8 px rounded stroke · no filled decorative icon sets.</p>
        </SpecCard>
        <SpecCard title="Voice & writing">
          <div className="voice-pairs">
            <div><span>Use</span><strong>“Try once more”</strong><small>Clear, human, recoverable.</small></div>
            <div><span>Avoid</span><strong>“Incorrect!”</strong><small>Judgement without help.</small></div>
            <div><span>Use</span><strong>“3 words ready”</strong><small>Observed and honest.</small></div>
            <div><span>Avoid</span><strong>“You’re fluent!”</strong><small>Unsupported proficiency claim.</small></div>
          </div>
        </SpecCard>
      </div>

      <SpecCard title="Brand character">
        <div className="character-axis">
          {[
            ["Friendly", "not childish", 78],
            ["Editorial", "not academic", 66],
            ["Playful", "not gamified", 54],
            ["Confident", "not loud", 62],
          ].map(([left, right, value]) => (
            <div key={String(left)}>
              <div><strong>{left}</strong><span>{right}</span></div>
              <i><b style={{ width: `${value}%` }} /></i>
            </div>
          ))}
        </div>
      </SpecCard>
    </>
  );
}

function Foundations() {
  const colors = Object.entries(tokens.color);
  return (
    <>
      <SectionIntro eyebrow="02 · Foundations" title="Warm paper, strong ink, one unmistakable orange.">
        <p>
          Bright orange is a brand accent and tactile surface—not body text. Deep orange handles
          accessible text accents. Warm neutrals reduce glare and give Dutch reading content a calm,
          editorial setting.
        </p>
      </SectionIntro>

      <SpecCard title="Semantic colour">
        <div className="swatch-grid">
          {colors.map(([name, value]) => (
            <div className="swatch" key={name}>
              <div style={{ background: value }} />
              <strong>{name.replaceAll("-", " ")}</strong>
              <code>{value}</code>
            </div>
          ))}
        </div>
        <p className="quiet-note">
          Never use Brand Orange as small text on paper. Use Orange Deep for text, or Ink Strong on
          an orange-filled control.
        </p>
      </SpecCard>

      <div className="two-grid">
        <SpecCard title="Typography">
          <div className="type-specimens">
            <div className="type-display"><span>Display · 48/50</span><strong>Een kleine stap.</strong></div>
            <div className="type-h1"><span>Heading 1 · 32/36</span><strong>Practise in context</strong></div>
            <div className="type-h2"><span>Heading 2 · 22/28</span><strong>Ik wil graag…</strong></div>
            <div className="type-body"><span>Body · 16/24</span><p>Dutch leads. Helper languages stay visually quieter until needed.</p></div>
            <div className="type-telugu"><span>Telugu helper · 16/26</span><p>నేను అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను.</p></div>
          </div>
          <p className="quiet-note">
            UI: Nunito Sans / ui-rounded. Learning text: Noto Sans / system sans. Telugu: Noto Sans Telugu.
          </p>
        </SpecCard>

        <SpecCard title="Spacing, radius & depth">
          <div className="space-scale">
            {Object.entries(tokens.space).map(([name, value]) => (
              <div key={name}><span>{name}</span><i style={{ width: value }} /><code>{value}</code></div>
            ))}
          </div>
          <div className="radius-row">
            {Object.entries(tokens.radius).map(([name, value]) => (
              <div key={name} style={{ borderRadius: value }}><span>{name}</span><code>{value}</code></div>
            ))}
          </div>
          <p className="quiet-note">One low shadow for floating cards; borders and paper layers carry most structure.</p>
        </SpecCard>
      </div>

      <div className="two-grid">
        <SpecCard title="Learning states">
          <div className="state-list">
            <div><Pill>New</Pill><span>Seen but not yet tested</span></div>
            <div><Pill tone="warning">Learning</Pill><span>Needs supported retrieval</span></div>
            <div><Pill tone="brand">Familiar</Pill><span>Recognised in recent encounters</span></div>
            <div><Pill tone="success">Secure</Pill><span>Repeated evidence over time</span></div>
          </div>
          <p className="quiet-note">Names describe evidence. They are not CEFR proficiency claims.</p>
        </SpecCard>
        <SpecCard title="Motion">
          <div className="motion-list">
            <div><strong>120 ms</strong><span>Hover, press, colour</span></div>
            <div><strong>180 ms</strong><span>Reveal, expand, tab change</span></div>
            <div><strong>260 ms</strong><span>Focused card entrance</span></div>
          </div>
          <p className="quiet-note">
            Use motion to explain state change. Respect reduced-motion preferences and never animate failure.
          </p>
        </SpecCard>
      </div>
    </>
  );
}

function Components() {
  const [switchOn, setSwitchOn] = useState(true);
  const [choice, setChoice] = useState("Dutch");
  return (
    <>
      <SectionIntro eyebrow="03 · Components" title="Tactile, legible, and compact without feeling cramped.">
        <p>
          Every control works in the fixed extension popup, at 200% zoom, with keyboard focus, and
          on touch. Components use shared semantic tokens rather than one-off colours.
        </p>
      </SectionIntro>

      <div className="two-grid">
        <SpecCard title="Buttons">
          <div className="component-column">
            <button className="button button-primary">Start Daily Five <Icon name="arrow" size={16} /></button>
            <button className="button button-secondary">Show meaning</button>
            <button className="button button-quiet">Not now</button>
            <button className="button button-danger">Clear saved items</button>
            <button className="button button-primary" disabled>Checking…</button>
          </div>
          <p className="quiet-note">Minimum target: 44 × 44 px. One primary action per card or step.</p>
        </SpecCard>

        <SpecCard title="Inputs">
          <div className="component-column">
            <label className="field-label">Source language
              <select value={choice} onChange={(event) => setChoice(event.target.value)}>
                <option>Dutch</option><option>Auto detect</option><option>English</option><option>Telugu</option>
              </select>
            </label>
            <label className="switch-row">
              <span><strong>Hover translation</strong><small>Show meaning after a short pause</small></span>
              <button className={`switch ${switchOn ? "is-on" : ""}`} role="switch" aria-checked={switchOn} onClick={() => setSwitchOn(!switchOn)}><i /></button>
            </label>
            <label className="check-row"><input type="checkbox" defaultChecked /> Keep English helper visible</label>
          </div>
        </SpecCard>
      </div>

      <div className="three-grid">
        <SpecCard title="Learning card">
          <div className="mini-learning-card">
            <Pill tone="brand">Recall</Pill>
            <h3>Ik wil graag…</h3>
            <p>Use this to make a polite request.</p>
            <div><span>EN</span><strong>I would like…</strong></div>
          </div>
        </SpecCard>
        <SpecCard title="Feedback">
          <div className="feedback feedback-success"><Icon name="check" /><div><strong>That order works.</strong><span>Now read the complete sentence once.</span></div></div>
          <div className="feedback feedback-try"><Icon name="refresh" /><div><strong>Try once more.</strong><span>Keep the finite verb in position two.</span></div></div>
        </SpecCard>
        <SpecCard title="Progress">
          <div className="progress-label"><span>Daily Five</span><strong>3 of 5</strong></div>
          <div className="progress-track"><i style={{ width: "60%" }} /></div>
          <div className="skill-evidence"><strong>6 of 8</strong><span>foundation skills secure</span></div>
        </SpecCard>
      </div>

      <SpecCard title="Component coverage">
        <div className="component-matrix">
          {[
            ["Navigation", "Tabs, focused header, section rail, back/exit", "Popup · Site"],
            ["Actions", "Primary, secondary, quiet, danger, icon", "All surfaces"],
            ["Learning", "Prompt, helper meaning, feedback, progress, mastery", "Popup · Tooltip"],
            ["Content", "Story line, pattern highlight, word/chunk, lesson row", "Popup"],
            ["Forms", "Select, checkbox, radio, switch, range, disclosure", "Options"],
            ["System", "Toast, empty, loading, error, offline, focus", "All surfaces"],
          ].map(([family, pieces, surfaces]) => (
            <div key={family}><strong>{family}</strong><span>{pieces}</span><Pill>{surfaces}</Pill></div>
          ))}
        </div>
      </SpecCard>
    </>
  );
}

function PopupPrototype() {
  type PopupScreen = "today" | "review" | "lessons" | "lesson" | "saved" | "settings";
  type ActivityPeriod = "week" | "month" | "year";
  const [screen, setScreen] = useState<PopupScreen>("today");
  const [activityPeriod, setActivityPeriod] = useState<ActivityPeriod>("week");
  const [lessonStage, setLessonStage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(1);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const focused = screen === "review" || screen === "lesson";
  const sentenceTokens = ["Ik", "wil", "graag", "een", "afspraak", "maken."];
  const weekActivity = [
    { day: "M", date: 27, count: 3, level: "active" },
    { day: "T", date: 28, count: 5, level: "high" },
    { day: "W", date: 29, count: 2, level: "active today" },
    { day: "T", date: 30, count: 0, level: "idle" },
    { day: "F", date: 31, count: 0, level: "idle" },
    { day: "S", date: 1, count: 0, level: "idle" },
    { day: "S", date: 2, count: 0, level: "idle" },
  ];
  const monthActivity = [0, 3, 1, 0, 5, 2, 0, 0, 4, 1, 0, 2, 0, 0, 3, 5, 1, 0, 0, 2, 4, 0, 1, 0, 3, 0, 2, 3, 5, 2, 0];
  const yearActivity = Array.from({ length: 365 }, (_, index) => (index * 7 + index % 5) % 6);

  function exitFocused() {
    setScreen(screen === "lesson" ? "lessons" : "today");
    setRevealed(false);
  }

  function nextReview() {
    if (reviewIndex >= 5) {
      setScreen("today");
      setReviewIndex(1);
    } else {
      setReviewIndex(reviewIndex + 1);
    }
    setRevealed(false);
  }

  const today = (
    <div className="dm-popup-content dm-today">
      <div className="dm-next-card">
        <span className="dm-kicker">Ready now · about 4 min</span>
        <h3>Start your Daily Five.</h3>
        <p>Practise useful words and one grammar pattern in context.</p>
        <button className="dm-primary" onClick={() => setScreen("review")}>Start Daily Five <Icon name="arrow" size={15} /></button>
      </div>
      <section className={`dm-activity dm-activity-${activityPeriod}`} aria-label="Learning activity">
        <div className="dm-activity-head">
          <strong>{activityPeriod === "week" ? "This week" : activityPeriod === "month" ? "This month" : "This year"}</strong>
          <div className="dm-period-tabs" aria-label="Activity period">
            {(["week", "month", "year"] as ActivityPeriod[]).map((period) => (
              <button
                className={activityPeriod === period ? "active" : ""}
                aria-pressed={activityPeriod === period}
                onClick={() => setActivityPeriod(period)}
                key={period}
              >
                {period === "week" ? "Week" : period === "month" ? "Month" : "Year"}
              </button>
            ))}
          </div>
        </div>
        <div className="dm-period-controls">
          <button aria-label={`Previous ${activityPeriod}`}>‹</button>
          <span>{activityPeriod === "week" ? "27 Jul–2 Aug 2026" : activityPeriod === "month" ? "July 2026" : "2026"}</span>
          <button aria-label={`Next ${activityPeriod}`}>›</button>
        </div>
        {activityPeriod === "week" && (
          <div className="dm-week-grid">
            {weekActivity.map((item) => (
              <button
                className={`dm-activity-day ${item.level}`}
                aria-label={`${item.day} ${item.date}: ${item.count} recorded activities`}
                title={`${item.count} recorded activities`}
                key={`${item.day}-${item.date}`}
              >
                <small>{item.day}</small><span>{item.date}</span><b>{item.count}</b>
              </button>
            ))}
          </div>
        )}
        {activityPeriod === "month" && (
          <>
            <div className="dm-month-weekdays">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
            <div className="dm-month-grid">
              {monthActivity.map((count, index) => (
                <button
                  className={`dm-activity-day ${count >= 4 ? "high" : count > 0 ? "active" : "idle"} ${index === 28 ? "today" : ""}`}
                  aria-label={`July ${index + 1}: ${count} recorded activities`}
                  title={`${count} recorded activities`}
                  key={index}
                >
                  <span>{index + 1}</span><b>{count}</b>
                </button>
              ))}
            </div>
          </>
        )}
        {activityPeriod === "year" && (
          <>
            <div className="dm-year-labels"><span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span></div>
            <div className="dm-year-grid" aria-label="Compact yearly activity heatmap">
              {yearActivity.map((count, index) => (
                <span
                  className={count >= 4 ? "high" : count > 0 ? "active" : "idle"}
                  aria-label={`Day ${index + 1}: ${count} recorded activities`}
                  title={`Day ${index + 1}: ${count} recorded activities`}
                  key={index}
                />
              ))}
            </div>
          </>
        )}
        <div className="dm-activity-legend"><span>Less</span><i className="idle" /><i className="active" /><i className="high" /><span>More</span></div>
        <small className="dm-activity-note">Numbers are recorded reviews, saved items, and lessons—not a proficiency score.</small>
      </section>
      <div className="dm-minute">
        <div><span className="dm-kicker">Grammar minute</span><strong>Polite requests with “graag”</strong><small>A0 · one pattern · 60 sec</small></div>
        <button aria-label="Start grammar minute" onClick={() => { setScreen("lesson"); setLessonStage(2); }}><Icon name="arrow" /></button>
      </div>
      <div className="dm-evidence">
        <div><strong>14</strong><span>recognition · familiar</span></div>
        <div><strong>8</strong><span>recall · learning</span></div>
      </div>
      <p className="dm-local">Learning stays on this device. No account required.</p>
    </div>
  );

  const review = (
    <div className="dm-popup-content dm-focus">
      <div className="dm-progress"><span>Recall</span><strong>{reviewIndex} of 5</strong><i><b style={{ width: `${reviewIndex * 20}%` }} /></i></div>
      <article className="dm-review-card">
        <span className="dm-kicker">Say it in Dutch</span>
        <p className="dm-context">You are calling the GP. You want to make an appointment.</p>
        {revealed ? (
          <>
            <h3>Ik wil graag een afspraak maken.</h3>
            <div className="dm-meaning"><span>English</span><strong>I would like to make an appointment.</strong></div>
            <div className="dm-meaning telugu"><span>Telugu</span><strong>నేను అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను.</strong></div>
          </>
        ) : (
          <button className="dm-reveal" onClick={() => setRevealed(true)}><Icon name="eye" /> Show answer</button>
        )}
      </article>
      {revealed && <div className="dm-rating"><button onClick={nextReview}>Again</button><button className="dm-primary" onClick={nextReview}>Got it</button></div>}
    </div>
  );

  const lessons = (
    <div className="dm-popup-content">
      <div className="dm-screen-title"><span className="dm-kicker">Practical Dutch</span><h3>Lessons</h3><p>Short stories teach patterns inside useful situations.</p></div>
      <div className="dm-subtabs"><button className="active">Stories</button><button>Grammar path</button></div>
      <button className="dm-lesson-row featured" onClick={() => { setScreen("lesson"); setLessonStage(0); }}>
        <span>01</span><div><strong>Een afspraak maken</strong><small>GP call · A1 · 4 min</small></div><Pill tone="brand">Continue</Pill>
      </button>
      <button className="dm-lesson-row" onClick={() => { setScreen("lesson"); setLessonStage(0); }}>
        <span>02</span><div><strong>Koffie bestellen</strong><small>Café · A0 · 3 min</small></div><Pill>Ready</Pill>
      </button>
      <button className="dm-lesson-row" disabled>
        <span>03</span><div><strong>Een pakket ophalen</strong><small>Post office · A1</small></div><Pill>After 02</Pill>
      </button>
      <div className="dm-foundation"><span>Foundation path</span><strong>6 of 8 skills secure</strong><i><b style={{ width: "75%" }} /></i></div>
    </div>
  );

  const story = [
    ["Goedemorgen. Waarmee kan ik u helpen?", "Good morning. How can I help you?"],
    ["Ik wil graag een afspraak maken met de huisarts.", "I would like to make an appointment with the GP."],
    ["Wanneer kunt u langskomen?", "When can you come in?"],
    ["Dinsdagmiddag, als het kan.", "Tuesday afternoon, if possible."],
  ];

  const lessonPanels = [
    <div className="dm-lesson-body" key="read">
      <span className="dm-kicker">Read · the situation</span><h3>Een afspraak maken</h3>
      {story.map(([nl, en], index) => <div className="dm-story-line" key={nl}><span>{index + 1}</span><p>{nl}<small>{index === 1 ? en : "Show help"}</small></p></div>)}
      <button className="dm-primary" onClick={() => setLessonStage(1)}>Go to Notice <Icon name="arrow" size={15} /></button>
    </div>,
    <div className="dm-lesson-body" key="notice">
      <span className="dm-kicker">Notice · one useful pattern</span><h3>“Ik wil graag…”</h3>
      <p className="dm-explainer">Use <mark>graag</mark> to make a request sound natural and polite.</p>
      <div className="dm-contrast"><span>Direct</span><p>Ik wil een afspraak.</p><span>Natural</span><p>Ik wil <mark>graag</mark> een afspraak maken.</p></div>
      <div className="dm-tip"><strong>English bridge</strong><span>“I would like…” often maps naturally to “Ik wil graag…”</span></div>
      <button className="dm-primary" onClick={() => setLessonStage(2)}>Try it <Icon name="arrow" size={15} /></button>
    </div>,
    <div className="dm-lesson-body" key="practise">
      <span className="dm-kicker">Practise · build the sentence</span><h3>I would like to make an appointment.</h3>
      <div className="dm-answer-line">{selectedTokens.length ? selectedTokens.join(" ") : <span>Choose the Dutch words in order</span>}</div>
      <div className="dm-token-grid">
        {sentenceTokens.map((token) => <button key={token} disabled={selectedTokens.includes(token)} onClick={() => setSelectedTokens([...selectedTokens, token])}>{token}</button>)}
      </div>
      <div className="dm-inline-actions"><button onClick={() => { setSelectedTokens([]); setGrammarChecked(false); }}>Reset</button><button className="dm-primary" onClick={() => setGrammarChecked(true)} disabled={selectedTokens.length !== sentenceTokens.length}>Check</button></div>
      {grammarChecked && <div className={`dm-feedback ${selectedTokens.join(" ") === sentenceTokens.join(" ") ? "correct" : ""}`}><strong>{selectedTokens.join(" ") === sentenceTokens.join(" ") ? "That order works." : "Try once more."}</strong><span>{selectedTokens.join(" ") === sentenceTokens.join(" ") ? "The finite verb stays in position two." : "Start with “Ik wil graag…”"}</span></div>}
      {grammarChecked && selectedTokens.join(" ") === sentenceTokens.join(" ") && <button className="dm-primary" onClick={() => setLessonStage(3)}>Go to Keep <Icon name="arrow" size={15} /></button>}
    </div>,
    <div className="dm-lesson-body" key="keep">
      <span className="dm-kicker">Keep · choose what returns</span><h3>What should come back?</h3>
      <p className="dm-explainer">Everything useful is selected. Remove anything you do not want to practise.</p>
      {[
        ["ik wil graag…", "I would like…"],
        ["de afspraak", "the appointment"],
        ["een afspraak maken", "make an appointment"],
      ].map(([nl, en]) => <label className="dm-candidate" key={nl}><input type="checkbox" defaultChecked /><span><strong>{nl}</strong><small>{en}</small></span></label>)}
      <button className="dm-primary" onClick={() => setScreen("today")}>Keep 3 for review</button>
    </div>,
  ];

  const lesson = (
    <div className="dm-popup-content dm-focus dm-lesson">
      <div className="dm-lesson-rail">{["Read", "Notice", "Practise", "Keep"].map((label, index) => <button key={label} className={lessonStage === index ? "active" : ""} onClick={() => setLessonStage(index)}><span>{index + 1}</span>{label}</button>)}</div>
      {lessonPanels[lessonStage]}
    </div>
  );

  const saved = (
    <div className="dm-popup-content">
      <div className="dm-screen-title"><span className="dm-kicker">Your collection</span><h3>Saved</h3><p>Words and meaningful chunks you intentionally kept.</p></div>
      <button className="dm-primary">Quiz 5 saved items</button>
      {[
        ["01", "afspraak", "appointment", "Familiar"],
        ["02", "langskomen", "come by", "Learning"],
        ["03", "als het kan", "if possible", "New"],
        ["04", "graag", "gladly / please", "Secure"],
      ].map(([n, nl, en, state]) => <button className="dm-saved-row" key={nl}><span>{n}</span><div><strong>{nl}</strong><small>EN · {en}</small></div><Pill>{state}</Pill></button>)}
      <button className="dm-options-link">Export or import in Options</button>
    </div>
  );

  const settings = (
    <div className="dm-popup-content">
      <div className="dm-screen-title"><span className="dm-kicker">Settings</span><h3>Review preferences</h3><p>Only frequent learning controls belong in the popup.</p></div>
      <label className="dm-setting"><span><strong>Show page context</strong><small>Include the source sentence during review</small></span><input type="checkbox" defaultChecked /></label>
      <label className="dm-setting"><span><strong>Daily review badge</strong><small>Show the number of due saved items</small></span><input type="checkbox" defaultChecked /></label>
      <button className="dm-primary">Open Options page</button>
      <p className="dm-settings-boundary">Languages, translation behaviour, provider controls, privacy, cache, import/export, and destructive data actions stay on the full Options page.</p>
      <p className="dm-local">Settings and learning records stay in browser storage.</p>
    </div>
  );

  const panels: Record<PopupScreen, React.ReactNode> = { today, review, lessons, lesson, saved, settings };
  return (
    <div className="dm-popup" aria-label="Interactive DutchMate popup">
      <header className="dm-popup-header">
        <div><Mark size={30} /><strong>DutchMate</strong></div>
        {focused ? <button onClick={exitFocused}>Exit</button> : <button onClick={() => setScreen(screen === "settings" ? "today" : "settings")}><Icon name="settings" size={16} /> Settings</button>}
      </header>
      {!focused && screen !== "settings" && <nav className="dm-tabs">
        {(["today", "lessons", "saved"] as PopupScreen[]).map((tab) => <button className={screen === tab ? "active" : ""} key={tab} onClick={() => setScreen(tab)}>{tab}</button>)}
      </nav>}
      {panels[screen]}
    </div>
  );
}

function TooltipPrototype() {
  const [state, setState] = useState<"translation" | "mission" | "result">("translation");
  const [placed, setPlaced] = useState<string[]>([]);
  const fragments = ["een afspraak", "Ik wil graag", "maken"];
  const isCorrect = placed.join(" ") === "Ik wil graag een afspraak maken";
  return (
    <div className="webpage-demo">
      <div className="fake-article">
        <span className="fake-label">Example webpage</span>
        <h3>Een afspraak bij de huisarts</h3>
        <p>
          U kunt de praktijk bellen tussen acht en tien uur. Zeg duidelijk:{" "}
          <mark>Ik wil graag een afspraak maken</mark> en vertel kort waarvoor u komt.
        </p>
        <p>Neem uw identiteitsbewijs en zorgpas mee naar de afspraak.</p>
      </div>
      <div className="context-tether" />
      <aside className="dm-tooltip">
        <header><div><Mark size={26} /><strong>{state === "translation" ? "Translation" : "Context mission"}</strong></div><button aria-label="Close"><Icon name="close" /></button></header>
        {state === "translation" && <>
          <span className="dm-kicker">Dutch · selected text</span>
          <h3>Ik wil graag een afspraak maken</h3>
          <div className="tooltip-meaning"><span>EN</span><strong>I would like to make an appointment.</strong></div>
          <div className="tooltip-meaning telugu"><span>TE</span><strong>నేను అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను.</strong></div>
          <div className="tooltip-actions"><button>Save</button><button className="dm-primary" onClick={() => setState("mission")}>Practise this</button></div>
        </>}
        {state === "mission" && <>
          <span className="dm-kicker">Put the Dutch back</span>
          <p className="mission-context">Zeg duidelijk: <b>__________</b> en vertel kort waarvoor u komt.</p>
          <div className="mission-answer">{placed.length ? placed.join(" ") : "Your answer appears here"}</div>
          <div className="mission-fragments">{fragments.map((fragment) => <button key={fragment} disabled={placed.includes(fragment)} onClick={() => setPlaced([...placed, fragment])}>{fragment}</button>)}</div>
          <div className="tooltip-actions"><button onClick={() => setPlaced([])}>Reset</button><button className="dm-primary" disabled={placed.length !== 3} onClick={() => setState("result")}>Check</button></div>
        </>}
        {state === "result" && <>
          <div className={`mission-result ${isCorrect ? "correct" : ""}`}><Icon name={isCorrect ? "check" : "refresh"} /><div><strong>{isCorrect ? "Correct" : "Try again"}</strong><span>{isCorrect ? "The word order matches the page." : "The original was: Ik wil graag een afspraak maken."}</span></div></div>
          <p className="mission-context">Zeg duidelijk: <mark>Ik wil graag een afspraak maken</mark> en vertel kort waarvoor u komt.</p>
          <button className="dm-primary full" onClick={() => { setState(isCorrect ? "translation" : "mission"); setPlaced([]); }}>{isCorrect ? "Back to page" : "Replay"}</button>
        </>}
      </aside>
    </div>
  );
}

function OptionsPrototype() {
  const [enabled, setEnabled] = useState(true);
  const [hover, setHover] = useState(true);
  const [telugu, setTelugu] = useState(true);
  const [delay, setDelay] = useState(450);
  return (
    <div className="options-prototype">
      <header><div><Mark size={42} /><div><strong>DutchMate</strong><span>Options</span></div></div><Pill tone="success">Saved locally</Pill></header>
      <div className="options-layout">
        <nav>{["General", "Languages", "Translation", "Learning & data", "Privacy"].map((item, index) => <button className={index === 0 ? "active" : ""} key={item}>{item}</button>)}</nav>
        <main>
          <span className="dm-kicker">General</span><h3>Make DutchMate fit your reading.</h3><p>Changes save automatically to this browser.</p>
          <label className="option-row"><span><strong>Enable DutchMate</strong><small>Show translation tools on supported webpages.</small></span><button className={`switch ${enabled ? "is-on" : ""}`} role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)}><i /></button></label>
          <label className="option-row"><span><strong>Hover translation</strong><small>Translate a word after a short pause.</small></span><button className={`switch ${hover ? "is-on" : ""}`} role="switch" aria-checked={hover} onClick={() => setHover(!hover)}><i /></button></label>
          <label className="option-row"><span><strong>Telugu helper</strong><small>Show Telugu beside English when available.</small></span><button className={`switch ${telugu ? "is-on" : ""}`} role="switch" aria-checked={telugu} onClick={() => setTelugu(!telugu)}><i /></button></label>
          <label className="range-row"><span><strong>Hover delay</strong><small>Long enough to avoid accidental lookups.</small></span><div><output>{delay} ms</output><input type="range" min="150" max="1000" step="50" value={delay} onChange={(event) => setDelay(Number(event.target.value))} /></div></label>
          <div className="privacy-note"><Icon name="bookmark" /><p><strong>Private by default</strong><span>Settings and learning records stay in browser storage. DutchMate does not keep browsing history.</span></p></div>
        </main>
      </div>
    </div>
  );
}

function Flows() {
  const [surface, setSurface] = useState<"popup" | "tooltip" | "options">("popup");
  return (
    <>
      <SectionIntro eyebrow="04 · Clickthroughs" title="Use the product, not just the palette.">
        <p>
          These reference surfaces are interactive. They define hierarchy, copy, states, exits, and
          the relationship between translation, practice, lessons, and saved learning. They are not
          permission to replace the existing product: repository behavior remains authoritative
          unless this specification names an explicit change. Concepts not yet in the repository
          are future proposals, not automatic additions during the visual retrofit.
        </p>
      </SectionIntro>
      <div className="surface-tabs" role="tablist" aria-label="Product surfaces">
        {[
          ["popup", "Toolbar popup", "Today · Lessons · Saved"],
          ["tooltip", "Context coaching", "Translate · Practise · Return"],
          ["options", "Options page", "Settings · data · privacy"],
        ].map(([key, title, note]) => (
          <button key={key} className={surface === key ? "active" : ""} onClick={() => setSurface(key as typeof surface)}>
            <strong>{title}</strong><span>{note}</span>
          </button>
        ))}
      </div>
      <div className={`prototype-stage stage-${surface}`}>
        <div className="prototype-note">
          <Pill tone="brand">Interactive reference</Pill>
          <h2>{surface === "popup" ? "390 × 600 popup" : surface === "tooltip" ? "Webpage-first coaching" : "Calm full-page settings"}</h2>
          <p>{surface === "popup"
            ? "Try Today, start the Daily Five, open Lessons, complete the four-stage rail, browse Saved, and open Settings."
            : surface === "tooltip"
              ? "Start with the selected translation, choose Practise this, rebuild the sentence, and return to the page."
              : "Toggle preferences and adjust the delay. The page uses the same tokens and component language as the popup."}</p>
          <ul>
            <li>44 px minimum targets</li>
            <li>Visible keyboard focus</li>
            <li>One primary action per state</li>
            <li>Reduced motion supported</li>
          </ul>
        </div>
        <div className="prototype-canvas">
          {surface === "popup" ? <PopupPrototype /> : surface === "tooltip" ? <TooltipPrototype /> : <OptionsPrototype />}
        </div>
      </div>
    </>
  );
}

function Accessibility() {
  return (
    <>
      <SectionIntro eyebrow="05 · Accessibility" title="Accessibility is part of the learning quality.">
        <p>
          A learner should be able to translate and practise with keyboard, touch, zoom, reduced
          motion, or a screen reader without losing context or receiving weaker feedback.
        </p>
      </SectionIntro>
      <div className="two-grid">
        <SpecCard title="Non-negotiable interaction rules">
          <div className="checklist">
            {[
              "44 × 44 px targets for primary controls and lesson choices.",
              "3 px high-contrast focus ring with 2 px offset.",
              "Focused flows keep a visible Exit and restore focus safely.",
              "Escape closes the webpage coaching card.",
              "No drag-only, colour-only, hover-only, or audio-only interaction.",
              "State changes and corrections use a polite live announcement.",
              "200% zoom and narrow widths preserve reading order.",
              "Reduced motion removes transitions without hiding state.",
            ].map((item) => <div key={item}><Icon name="check" size={17} /><span>{item}</span></div>)}
          </div>
        </SpecCard>
        <SpecCard title="Contrast roles">
          <div className="contrast-list">
            {[
              ["Ink / Paper", "#1B1714 / #FFF9F2", "15.9:1", "AAA"],
              ["Muted / Paper", "#675C54 / #FFF9F2", "6.2:1", "AA"],
              ["Deep Orange / Paper", "#9C3900 / #FFF9F2", "7.0:1", "AAA"],
              ["Ink / Brand Orange", "#1B1714 / #FF6B00", "6.5:1", "AA"],
            ].map(([role, pair, ratio, grade]) => <div key={role}><span><strong>{role}</strong><code>{pair}</code></span><b>{ratio}</b><Pill tone="success">{grade}</Pill></div>)}
          </div>
          <p className="quiet-note">Ratios are rounded reference values; production changes must be re-tested.</p>
        </SpecCard>
      </div>
      <SpecCard title="Surface QA matrix">
        <div className="qa-table">
          <div className="qa-head"><span>Surface</span><span>Keyboard</span><span>Zoom</span><span>Screen reader</span><span>Touch</span></div>
          {[
            ["Popup", "Tab order + arrows", "200%", "Tabs + live updates", "44 px"],
            ["Daily Five", "Reveal + ratings", "200%", "Prompt + result", "No swipe"],
            ["Lesson", "Rail + choices", "200%", "Stage announced", "No drag"],
            ["Tooltip mission", "Focus in/out + Esc", "200%", "Result announced", "Page scrolls"],
            ["Options", "Native controls", "400%", "Labels + status", "Responsive"],
          ].map((row) => <div className="qa-row" key={row[0]}>{row.map((cell, index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>)}
        </div>
      </SpecCard>
    </>
  );
}

function Handoff() {
  const [copied, setCopied] = useState(false);
  const jsonText = useMemo(() => JSON.stringify(tokens, null, 2), []);
  function download(name: string, value: string, type: string) {
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }
  async function copyCss() {
    await navigator.clipboard.writeText(cssTokenText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <>
      <SectionIntro eyebrow="06 · Handoff" title="A design reference that can go straight into implementation.">
        <p>
          Use semantic tokens first, shared components second, and surface-specific layout rules
          last. This prevents the popup, tooltip, Options page, and public website from drifting again.
        </p>
      </SectionIntro>
      <div className="two-grid">
        <SpecCard title="Production tokens">
          <div className="code-preview"><code>{cssTokenText}</code></div>
          <div className="inline-buttons">
            <button className="button button-primary" onClick={copyCss}>{copied ? "Copied" : "Copy CSS variables"}</button>
            <button className="button button-secondary" onClick={() => download("dutchmate-tokens.json", jsonText, "application/json")}>Download JSON</button>
          </div>
        </SpecCard>
        <SpecCard title="Implementation sequence">
          <ol className="sequence-list">
            <li><span>1</span><div><strong>Foundations</strong><small>Add tokens, fonts, focus, and motion rules.</small></div></li>
            <li><span>2</span><div><strong>Shared primitives</strong><small>Buttons, tabs, cards, fields, progress, feedback.</small></div></li>
            <li><span>3</span><div><strong>Popup shell</strong><small>Today, Lessons, Saved, focused work, quick settings.</small></div></li>
            <li><span>4</span><div><strong>Tooltip & Options</strong><small>Apply one visual language without changing contracts.</small></div></li>
            <li><span>5</span><div><strong>Regression QA</strong><small>Keyboard, zoom, browsers, state persistence, package checks.</small></div></li>
          </ol>
        </SpecCard>
      </div>
      <SpecCard title="Source-of-truth mapping">
        <div className="mapping-table">
          {[
            ["Brand assets", "/public/brand/", "Toolbar icon, popup header, options, store assets"],
            ["Semantic colours", "tokens.color", "All backgrounds, text, borders, feedback"],
            ["Popup contract", "390 × 600", "Today · Lessons · Saved + focused states"],
            ["Lesson model", "Read → Notice → Practise → Keep", "Curated stories and grammar minutes"],
            ["Context mission", "Translate → Practise → Return", "Selection tooltip only; no extra provider call"],
            ["Evidence language", "New · Learning · Familiar · Secure", "Recognition and recall remain separate"],
          ].map(([system, source, use]) => <div key={system}><strong>{system}</strong><code>{source}</code><span>{use}</span></div>)}
        </div>
      </SpecCard>
      <div className="handoff-callout">
        <Mark size={52} />
        <div><strong>Ready for DutchMate implementation</strong><span>Brand, foundations, components, product flows, accessibility, and downloadable assets are covered.</span></div>
        <DownloadLink href="/brand/dutchmate-lockup.svg">Logo package</DownloadLink>
      </div>
    </>
  );
}

export default function Home() {
  const [active, setActive] = useState<SectionKey>("overview");
  const sections: Record<SectionKey, React.ReactNode> = {
    overview: <Direction />,
    brand: <Brand />,
    foundations: <Foundations />,
    components: <Components />,
    flows: <Flows />,
    accessibility: <Accessibility />,
    handoff: <Handoff />,
  };
  const activeIndex = navItems.findIndex((item) => item.key === active);
  const next = navItems[activeIndex + 1];
  function chooseSection(section: SectionKey) {
    setActive(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <aside className="site-sidebar">
        <button className="site-brand" onClick={() => chooseSection("overview")}>
          <Mark size={42} />
          <span><strong>DutchMate</strong><small>Design system</small></span>
        </button>
        <nav aria-label="Design system sections">
          {navItems.map((item, index) => (
            <button key={item.key} className={active === item.key ? "active" : ""} onClick={() => chooseSection(item.key)} aria-current={active === item.key ? "page" : undefined}>
              <Icon name={item.icon} />
              <span><small>{String(index + 1).padStart(2, "0")} · {item.kicker}</small><strong>{item.label}</strong></span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note"><span>Product boundary</span><strong>Deterministic · local-first · no fake learning</strong></div>
      </aside>

      <header className="mobile-header">
        <button className="site-brand" onClick={() => chooseSection("overview")}><Mark size={34} /><span><strong>DutchMate</strong><small>Design system</small></span></button>
        <select aria-label="Choose design system section" value={active} onChange={(event) => chooseSection(event.target.value as SectionKey)}>
          {navItems.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}
        </select>
      </header>

      <main className="site-main">
        <div className="main-toolbar">
          <span>Interactive specification</span>
          <Pill tone="success">Complete v1</Pill>
        </div>
        <div className="content-wrap">{sections[active]}</div>
        {next && <button className="next-section" onClick={() => chooseSection(next.key)}>
          <span>Next section</span><strong>{next.label}</strong><Icon name="arrow" />
        </button>}
        <footer><img src="/brand/dutchmate-lockup.svg" alt="DutchMate" /><span>Learn Dutch while reading, with English and Telugu by your side.</span></footer>
      </main>
    </div>
  );
}
