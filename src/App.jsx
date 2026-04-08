import { useState, useMemo, useEffect, useRef } from "react";

const CODE = "nemea2026";

const C = {
  cream: "#FAF0E4", warmWhite: "#FDF8F0", sand: "#F5E6D3",
  rust: "#8B2500", rustLight: "#A63A1A", charcoal: "#2C2420",
  warmGray: "#8C7E73", lightGray: "#C4B5A6",
  success: "#2D6A4F", danger: "#C0392B"
};

const D = {
  raise: 10000000, holdco: 7500000,
  spFilms: [0,1,2,2,3], spBudget: [1500000,1500000,1750000,2000000,2200000],
  spMG: [600000,700000,900000,1100000,1300000],
  spHit: [.20,.22,.25,.28,.30], spMod: [.45,.45,.45,.45,.45],
  spHitTh: [2000000,2500000,3000000,3500000,4000000],
  spModTh: [500000,600000,800000,1000000,1200000],
  spIPD: [0,0,50000,100000,200000], spAnc: [40000,50000,75000,100000,125000],
  spEficine: [1000000,1000000,1200000,1400000,1400000],
  spCopro: [0,0,.10,.15,.20],
  enFilms: [0,1,1,2,2], enBudget: [3500000,3500000,4000000,4500000,5000000],
  enMG: [1200000,1400000,1800000,2200000,2600000],
  enHit: [.20,.22,.25,.30,.30], enMod: [.45,.45,.45,.45,.45],
  enHitTh: [4000000,4500000,5500000,6500000,7500000],
  enModTh: [1000000,1200000,1500000,1800000,2000000],
  enIPD: [0,0,100000,200000,350000], enAnc: [60000,80000,100000,150000,200000],
  enCanada: [.40,.42,.45,.45,.48], enUS: [0,100000,150000,200000,250000],
  enCopro: [0,.15,.20,.25,.25],
  sc: .20, pf: [.08,.08,.09,.10,.12], of: .03,
  bk: [.25,.25,.30,.30,.35], ip: .15,
  dp: [5,5,6,7,8], dc: [180000,180000,200000,225000,250000],
  ic: [50000,50000,60000,75000,80000], dr: .75,
  pay: [520000,620000,830000,920000,1050000],
  ofc: [200000,250000,280000,300000,350000],
  fest: [100000,150000,180000,200000,220000],
  leg: [150000,175000,200000,220000,240000],
  cont: [100000,80000,60000,50000,50000],
  disc: .15, lv: 300000, ipp: 75000, em: 10, dip: .70
};

function compute(p) {
  const R = {};
  R.spP = p.spBudget.map((b,i) => p.spFilms[i]*b);
  R.enP = p.enBudget.map((b,i) => p.enFilms[i]*b);
  R.tf = p.spFilms.map((s,i) => s+p.enFilms[i]);
  R.spR = [0,0,...p.spFilms.slice(1,4)];
  R.enR = [0,0,...p.enFilms.slice(1,4)];
  R.tr = R.spR.map((s,i) => s+R.enR[i]);
  R.cf = R.tr.reduce((a,r) => { a.push((a.length ? a[a.length-1] : 0)+r); return a; }, []);
  R.tp = R.spP.map((s,i) => s+R.enP[i]);

  R.spMI = p.spEficine.map((ef,i) => Math.max(ef, p.spBudget[i]*0.30));
  R.spEq = p.spBudget.map((b,i) => Math.max(0, b-R.spMI[i]-b*p.spCopro[i]));
  R.spET = p.spHit.map((h,i) => h*p.spHitTh[i]+p.spMod[i]*p.spModTh[i]);
  R.spNR = p.spMG.map((mg,i) => mg*(1+p.spHit[i]*0.35)+R.spET[i]*(1-p.sc)+p.spIPD[i]+p.spAnc[i]);
  R.spNP = R.spNR.map((nr,i) => Math.max(0, nr-R.spEq[i]-R.spEq[i]*p.ip));
  R.spBk = R.spNP.map((np,i) => np*p.bk[i]);

  R.enCI = p.enBudget.map((b,i) => b*p.enCanada[i]);
  R.enEq = p.enBudget.map((b,i) => Math.max(0, b-R.enCI[i]-p.enUS[i]-b*p.enCopro[i]));
  R.enET = p.enHit.map((h,i) => h*p.enHitTh[i]+p.enMod[i]*p.enModTh[i]);
  R.enNR = p.enMG.map((mg,i) => mg*(1+p.enHit[i]*0.40)+R.enET[i]*(1-p.sc)+p.enIPD[i]+p.enAnc[i]);
  R.enNP = R.enNR.map((nr,i) => Math.max(0, nr-R.enEq[i]-R.enEq[i]*p.ip));
  R.enBk = R.enNP.map((np,i) => np*p.bk[i]);

  R.pF = R.tp.map((t,i) => t*p.pf[i]);
  R.oF = R.tp.map(t => t*p.of);
  R.dT = p.dp.map((d,i) => d*(p.dc[i]+p.ic[i]));
  R.dR = R.tf.map((f,i) => f*p.dc[i]*p.dr);
  R.nD = R.dT.map((d,i) => Math.max(0, d-R.dR[i]));
  R.kR = p.dp.map((d,i) => d > 0 ? 1-R.tf[i]/d : 0);
  R.sBT = R.spR.map((r,i) => r*R.spBk[i]);
  R.eBT = R.enR.map((r,i) => r*R.enBk[i]);
  R.bT = R.sBT.map((s,i) => s+R.eBT[i]);
  R.sR = R.pF.map((f,i) => f+R.oF[i]+R.dR[i]+R.bT[i]);

  R.oh = p.pay.map((py,i) => py+p.ofc[i]+p.fest[i]+p.leg[i]+p.cont[i]);
  R.tC = R.oh.map((o,i) => o+R.nD[i]);
  R.eb = R.sR.map((r,i) => r-R.tC[i]);
  R.ebM = R.sR.map((r,i) => r > 0 ? R.eb[i]/r : 0);

  R.lB = R.cf.map(f => f*p.lv);
  R.lI = R.cf.map((f,i) => f*p.ipp*i);
  R.lT = R.lB.map((b,i) => b+R.lI[i]);
  R.ev = R.lT.map((l,i) => Math.max(0, l+R.eb[i]*p.em));

  const lag = [0,0,-200000,-100000,50000];
  const spvD = [0,-500000,-800000,-700000,-500000];
  const spvRt = [0,0,350000,650000,900000];
  R.oCF = R.eb.map((e,i) => e+lag[i]);
  R.fCF = [p.holdco,...Array(4).fill(0)].map((h,i) => h+spvD[i]+spvRt[i]);
  R.nCF = R.oCF.map((o,i) => o+R.fCF[i]);
  R.ca = R.nCF.reduce((a,c) => { a.push((a.length ? a[a.length-1] : 0)+c); return a; }, []);

  R.st = R.ca.map((c,i) => c+[0,0,-500000,-400000,-300000][i]+[0,0,-350000,-450000,-550000][i]-R.oh[i]*0.2);
  R.mS = Math.min(...R.st);

  R.di = R.oCF.map(o => Math.max(0,o)*p.dip);
  R.spvR = spvRt;
  R.ex = [0,0,0,0,R.ev[4]];
  R.iCF = [-p.raise,0,0,0,0].map((e,i) => e+R.di[i]+R.spvR[i]+R.ex[i]);
  R.iCum = R.iCF.reduce((a,c) => { a.push((a.length ? a[a.length-1] : 0)+c); return a; }, []);

  let irr = 0.1;
  for (let it = 0; it < 100; it++) {
    let npv = 0, dnpv = 0;
    for (let t = 0; t < 5; t++) {
      npv += R.iCF[t] / Math.pow(1+irr, t+1);
      dnpv -= (t+1) * R.iCF[t] / Math.pow(1+irr, t+2);
    }
    const n = irr - npv/dnpv;
    if (Math.abs(n-irr) < .0001) { irr = n; break; }
    irr = n;
  }
  R.irr = isFinite(irr) && irr > -1 ? irr : null;

  let npv = 0;
  for (let t = 0; t < 5; t++) npv += R.iCF[t] / Math.pow(1+p.disc, t+1);
  R.npv = npv;

  const tb = R.di.reduce((a,b) => a+b,0) + R.spvR.reduce((a,b) => a+b,0) + R.ex[4];
  R.moic = tb / p.raise;
  R.moicNE = (p.raise + R.di.reduce((a,b) => a+b,0) + R.spvR.reduce((a,b) => a+b,0)) / p.raise;
  return R;
}

const fmt = (v) => {
  if (v == null) return "—";
  const a = Math.abs(v);
  if (a >= 1e6) return `${v<0?"(":""}$${(a/1e6).toFixed(1)}M${v<0?")":""}`;
  if (a >= 1e3) return `${v<0?"(":""}$${(a/1e3).toFixed(0)}K${v<0?")":""}`;
  return `$${v.toFixed(0)}`;
};
const pct = (v) => v == null ? "—" : `${(v*100).toFixed(1)}%`;
const mul = (v) => `${v.toFixed(2)}x`;
const Y = ["Y1","Y2","Y3","Y4","Y5"];

function Bar({ values, color = C.rust }) {
  const max = Math.max(...values.map(Math.abs), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 60 }}>
          <div style={{ width: "100%", borderRadius: 3, height: Math.max(3, (Math.abs(v)/max)*54), background: v < 0 ? C.danger : color, opacity: .85, transition: "height 0.5s ease" }} />
        </div>
      ))}
    </div>
  );
}

function Sli({ label, value, min, max, step, onChange, format = "pct" }) {
  const d = format === "pct" ? `${(value*100).toFixed(0)}%` : format === "usd" ? fmt(value) : format === "x" ? `${value}x` : value;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.warmGray, marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ color: C.charcoal, fontWeight: 600 }}>{d}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.rust, height: 3, cursor: "pointer" }} />
    </div>
  );
}

function KPI({ label, value, sub, warn, large }) {
  return (
    <div style={{ background: C.warmWhite, border: `1px solid ${C.sand}`, borderRadius: 10, padding: large ? "18px 16px" : "14px 14px" }}>
      <div style={{ fontSize: 9, color: C.warmGray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: large ? 28 : 22, fontWeight: 300, color: warn ? C.danger : C.charcoal, lineHeight: 1, letterSpacing: -.5, fontFamily: "'Playfair Display',Georgia,serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.warmGray, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function WF({ items }) {
  const max = Math.max(...items.map(i => Math.abs(i.value)), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 100, fontSize: 11, color: C.warmGray, textAlign: "right", flexShrink: 0 }}>{item.label}</div>
          <div style={{ flex: 1, height: 18 }}>
            <div style={{ width: `${Math.max(2, (Math.abs(item.value)/max)*100)}%`, height: "100%", borderRadius: 3, background: item.color || C.rust, opacity: .75, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ width: 70, fontSize: 11, color: C.charcoal, textAlign: "right" }}>{fmt(item.value)}</div>
        </div>
      ))}
    </div>
  );
}

function BarLabels({ values, labels, formatter }) {
  const f = formatter || fmt;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
      {labels.map((y, i) => (
        <div key={y} style={{ flex: 1, textAlign: "center", fontSize: 10 }}>
          <div style={{ color: C.lightGray }}>{y}</div>
          <div style={{ color: values[i] >= 0 ? C.charcoal : C.danger, fontWeight: 500 }}>{f(values[i])}</div>
        </div>
      ))}
    </div>
  );
}

// ── LANDING ──
function Landing({ onEnter }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  const fade = (delay) => ({ opacity: vis ? 1 : 0, transition: `opacity 1s ease ${delay}s` });
  const slideUp = (delay) => ({ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: `all 1.2s cubic-bezier(.16,1,.3,1) ${delay}s` });

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.charcoal }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@200;300;400;500;600&family=Source+Serif+4:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ padding: "40px 28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, ...fade(0.2) }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: C.rust, textTransform: "uppercase" }}>2026</span>
          <span style={{ fontSize: 10, letterSpacing: 2, color: C.warmGray, textTransform: "uppercase" }}>Business Proposal</span>
        </div>

        <div style={slideUp(0.3)}>
          <h1 style={{ fontSize: 52, fontWeight: 300, margin: 0, letterSpacing: 8, color: C.rust, lineHeight: 1, fontFamily: "'Playfair Display',serif", textTransform: "uppercase" }}>NEMEA</h1>
        </div>

        <div style={{ marginTop: 12, ...fade(0.6) }}>
          <div style={{ fontSize: 13, letterSpacing: 5, color: C.charcoal, textTransform: "uppercase", fontWeight: 500 }}>IP Studio First</div>
        </div>
        <div style={{ marginTop: 6, marginBottom: 32, ...fade(0.8) }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: C.warmGray, textTransform: "uppercase", fontStyle: "italic" }}>Author Driven Cinema. Global Ambition.</div>
        </div>
        <div style={{ width: 50, height: 2, background: C.rust, marginBottom: 32, ...fade(1) }} />
      </div>

      <div style={{ padding: "0 28px 32px", ...fade(1) }}>
        <h2 style={{ fontSize: 28, fontWeight: 300, color: C.rust, margin: "0 0 16px", fontFamily: "'Playfair Display',serif" }}>Purpose</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: C.charcoal, fontFamily: "'Source Serif 4',Georgia,serif", marginBottom: 14 }}>
          Nemea was born from the need to protect and amplify singular voices in a landscape increasingly shaped by algorithms, formats, and speed. At a time when content is abundant but meaning is scarce, Nemea develops stories with authorship, perspective, and lasting cultural wealth.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: C.warmGray, fontFamily: "'Source Serif 4',Georgia,serif", marginBottom: 14 }}>
          We believe cinema still has the power to shape identity and memory — especially when it emerges from specific places, languages, and lived experiences.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: C.warmGray, fontFamily: "'Source Serif 4',Georgia,serif" }}>
          Nemea is not built to chase trends. It exists to build a body of work. Stories that resonate beyond release, and a library of IP that grows in value over time.
        </p>
      </div>

      <div style={{ background: C.charcoal, padding: "24px 28px", ...fade(1.2) }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
          {[{ n: "$10M", l: "Raise" }, { n: "14", l: "Films / 5 Yrs" }, { n: "3", l: "Countries" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, letterSpacing: -1, fontFamily: "'Playfair Display',serif" }}>{s.n}</div>
              <div style={{ fontSize: 9, color: C.lightGray, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 28px", ...fade(1.3) }}>
        <h2 style={{ fontSize: 24, fontWeight: 300, color: C.rust, margin: "0 0 20px", textAlign: "center", fontFamily: "'Playfair Display',serif" }}>Two-Branch Strategy</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.warmWhite, border: `1px solid ${C.sand}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>NEMEA Spanish</div>
            <div style={{ fontSize: 9, letterSpacing: 1, color: C.rust, textTransform: "uppercase", marginBottom: 10 }}>LATAM Audiences</div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: C.warmGray, margin: 0 }}>Culturally resonant stories centered on immigrant experiences, migration, family, and transnational lives.</p>
          </div>
          <div style={{ background: C.warmWhite, border: `1px solid ${C.sand}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>NEMEA Global</div>
            <div style={{ fontSize: 9, letterSpacing: 1, color: C.rust, textTransform: "uppercase", marginBottom: 10 }}>US / Intl Markets</div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: C.warmGray, margin: 0 }}>Premium English content harnessing the 68M-strong US Hispanic community — the fastest-growing demographic.</p>
          </div>
        </div>
      </div>

      <div style={{ background: C.warmWhite, padding: "28px", borderTop: `1px solid ${C.sand}`, ...fade(1.4) }}>
        <h2 style={{ fontSize: 22, fontWeight: 300, color: C.rust, margin: "0 0 14px", fontFamily: "'Playfair Display',serif" }}>IP as a Strategic Asset</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: C.charcoal, fontFamily: "'Source Serif 4',serif", marginBottom: 12 }}>
          Every project is owned or co-owned by Nemea. Each film generates underlying assets — scripts, story worlds, characters, and formats — building long-term catalog value.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          {["Licensing","IP Sales","Remakes & Sequels","SVOD Sales","Theatrical","Int'l Sales","Studio Deals","Grants","Product Placement","Ancillary"].map(s => (
            <span key={s} style={{ fontSize: 10, padding: "5px 10px", border: `1px solid ${C.lightGray}`, borderRadius: 4, color: C.charcoal }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px", ...fade(1.5) }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: C.rust, textTransform: "uppercase", marginBottom: 6 }}>Corporate Structure</div>
        <h2 style={{ fontSize: 18, fontWeight: 400, margin: "0 0 16px", fontFamily: "'Playfair Display',serif" }}>Delaware C-Corp · Tri-Country Ops</h2>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ background: C.rust, color: C.cream, padding: "12px 16px", borderRadius: 8, display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>DELAWARE C-CORP</div>
          <div style={{ fontSize: 10, color: C.warmGray, marginTop: 4 }}>Parent · IP Holder · Investor-Facing</div>
          <div style={{ width: 1, height: 20, background: C.lightGray, margin: "8px auto" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ n: "NEMEA BC", s: "PSTC + Federal" }, { n: "NEMEA MX", s: "EFICINE or Prod." }, { n: "SPV LLC", s: "US Credits" }].map((e, i) => (
              <div key={i} style={{ border: `1px solid ${C.rust}`, borderRadius: 6, padding: "10px 6px" }}>
                <div style={{ fontWeight: 600, fontSize: 9 }}>{e.n}</div>
                <div style={{ color: C.warmGray, fontSize: 8 }}>{e.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 28px", textAlign: "center", ...fade(1.7) }}>
        <p style={{ fontSize: 13, color: C.warmGray, fontFamily: "'Source Serif 4',serif", lineHeight: 1.7, fontStyle: "italic", marginBottom: 24 }}>
          Creating the next generation of timeless stories that redefine the cultural and commercial landscape of global entertainment.
        </p>
        <button onClick={onEnter} style={{ padding: "16px 0", width: "100%", maxWidth: 360, background: C.rust, border: "none", color: C.cream, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 8 }}>
          Access Financial Model →
        </button>
        <div style={{ marginTop: 16, fontSize: 10, color: C.lightGray }}>Confidential · Monte Himalaya 910, CDMX</div>
      </div>
    </div>
  );
}

// ── GATE ──
function Gate({ onSuccess }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const go = () => { if (code.toLowerCase().trim() === CODE) onSuccess(); else { setErr(true); setTimeout(() => setErr(false), 2000); } };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.charcoal, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 28px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", width: "100%", maxWidth: 340 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.rust, textTransform: "uppercase", marginBottom: 24 }}>Nemea Pictures</div>
        <h2 style={{ fontSize: 22, fontWeight: 300, margin: "0 0 8px", fontFamily: "'Playfair Display',serif" }}>Investor Access</h2>
        <p style={{ fontSize: 13, color: C.warmGray, marginBottom: 28 }}>Enter your access code</p>
        <input ref={ref} type="password" placeholder="Access code" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && go()}
          style={{ width: "100%", padding: "14px 18px", fontSize: 14, background: C.warmWhite, border: `1px solid ${err ? C.danger : C.sand}`, borderRadius: 8, color: C.charcoal, outline: "none", letterSpacing: 2, textAlign: "center", boxSizing: "border-box" }} />
        {err && <div style={{ fontSize: 12, color: C.danger, marginTop: 10 }}>Invalid code</div>}
        <button onClick={go} style={{ marginTop: 14, padding: "14px 0", width: "100%", background: C.rust, border: "none", color: C.cream, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", borderRadius: 8 }}>Enter</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──
function Dash() {
  const [tab, setTab] = useState("overview");
  const [scenario, setScenario] = useState("base");
  const [exitMul, setExitMul] = useState(10);
  const [hitAdj, setHitAdj] = useState(0);
  const [mgAdj, setMgAdj] = useState(0);
  const [coproAdj, setCoproAdj] = useState(0);
  const [feeAdj, setFeeAdj] = useState(0);
  const [libVal, setLibVal] = useState(300000);

  const params = useMemo(() => {
    const p = JSON.parse(JSON.stringify(D));
    // Scenario adjustments
    if (scenario === "conservative") {
      p.spHit = p.spHit.map(h => Math.max(.10, h - 0.05));
      p.enHit = p.enHit.map(h => Math.max(.10, h - 0.05));
      p.spMG = p.spMG.map(s => Math.round(s * 0.80));
      p.enMG = p.enMG.map(s => Math.round(s * 0.80));
      p.spHitTh = p.spHitTh.map(t => Math.round(t * 0.75));
      p.enHitTh = p.enHitTh.map(t => Math.round(t * 0.75));
      p.em = 6;
    } else if (scenario === "optimistic") {
      p.spHit = p.spHit.map(h => Math.min(.45, h + 0.08));
      p.enHit = p.enHit.map(h => Math.min(.45, h + 0.08));
      p.spMG = p.spMG.map(s => Math.round(s * 1.25));
      p.enMG = p.enMG.map(s => Math.round(s * 1.25));
      p.spHitTh = p.spHitTh.map(t => Math.round(t * 1.20));
      p.enHitTh = p.enHitTh.map(t => Math.round(t * 1.20));
      p.spFilms = [0,1,2,3,4];
      p.enFilms = [0,1,2,2,3];
      p.em = 12;
    }
    // Slider adjustments (on top of scenario)
    p.spHit = p.spHit.map(h => Math.min(.50, Math.max(.05, h+hitAdj)));
    p.enHit = p.enHit.map(h => Math.min(.50, Math.max(.05, h+hitAdj)));
    p.spMG = p.spMG.map(s => Math.round(s*(1+mgAdj)));
    p.enMG = p.enMG.map(s => Math.round(s*(1+mgAdj)));
    if (scenario === "base") p.em = exitMul;
    p.spCopro = p.spCopro.map(c => Math.min(.40, Math.max(0, c+coproAdj)));
    p.enCopro = p.enCopro.map(c => Math.min(.40, Math.max(0, c+coproAdj)));
    p.pf = p.pf.map(f => Math.min(.18, Math.max(.05, f+feeAdj)));
    p.lv = libVal;
    return p;
  }, [scenario, exitMul, hitAdj, mgAdj, coproAdj, feeAdj, libVal]);

  const R = useMemo(() => compute(params), [params]);
  const cd = { background: C.warmWhite, border: `1px solid ${C.sand}`, borderRadius: 10, padding: 16, marginBottom: 14 };
  const sl = { fontSize: 9, color: C.warmGray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 };

  const teamRoles = [
    { r: "CEO / Head of Studio", g: "Core", c: [150000,158000,165000,175000,185000] },
    { r: "Head of Development", g: "Core", c: [120000,125000,135000,145000,155000] },
    { r: "Biz Affairs / Legal", g: "Core", c: [130000,135000,140000,150000,160000] },
    { r: "Finance / Controller", g: "Core", c: [60000,65000,70000,75000,80000] },
    { r: "Head of Spanish Content", g: "Spanish", c: [0,90000,95000,100000,110000] },
    { r: "Creative Exec (MX)", g: "Spanish", c: [0,0,45000,50000,55000] },
    { r: "Prod Coord (MX)", g: "Spanish", c: [0,28000,30000,56000,60000] },
    { r: "Head of Global Media", g: "Global", c: [0,0,140000,150000,160000] },
    { r: "Creative Exec (EN)", g: "Global", c: [0,55000,60000,65000,120000] },
    { r: "Head of Sales", g: "Global", c: [0,0,100000,110000,120000] },
    { r: "Prod Exec (BC)", g: "Global", c: [0,0,65000,70000,75000] },
    { r: "Assistants", g: "Global", c: [60000,64000,68000,72000,99000] },
  ];
  const teamTots = [0,1,2,3,4].map(i => teamRoles.reduce((s,r) => s+r.c[i], 0));
  const hc = [6,7,10,11,13];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.charcoal, padding: "16px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@200;300;400;500&family=Source+Serif+4:wght@300;400&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 300, letterSpacing: 3, color: C.rust, fontFamily: "'Playfair Display',serif" }}>NEMEA</span>
          <span style={{ fontSize: 10, color: C.warmGray, marginLeft: 8, letterSpacing: 1 }}>FINANCIAL MODEL</span>
        </div>
        <span style={{ fontSize: 10, color: C.rust }}>{fmt(params.raise)}</span>
      </div>
      <div style={{ height: 2, background: `linear-gradient(90deg, ${C.rust}, transparent 60%)`, marginBottom: 14, opacity: .4 }} />

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { k: "conservative", l: "Conservative", color: "#D4A017" },
          { k: "base", l: "Base Case", color: C.rust },
          { k: "optimistic", l: "Upside", color: C.success },
        ].map(s => (
          <button key={s.k} onClick={() => setScenario(s.k)} style={{
            flex: 1, padding: "10px 0", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderRadius: 6,
            border: `1px solid ${scenario === s.k ? s.color : C.sand}`,
            background: scenario === s.k ? `${s.color}15` : "transparent",
            color: scenario === s.k ? s.color : C.lightGray, transition: "all 0.2s",
          }}>{s.l}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.sand}` }}>
        {[{ k: "overview", l: "Overview" }, { k: "branches", l: "Branches" }, { k: "cash", l: "Cash" }, { k: "team", l: "Team" }, { k: "levers", l: "Levers" }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            flex: 1, padding: "9px 0", background: "transparent", border: "none",
            borderBottom: tab === t.k ? `2px solid ${C.rust}` : "2px solid transparent",
            color: tab === t.k ? C.charcoal : C.lightGray, fontSize: 10, letterSpacing: .5, cursor: "pointer"
          }}>{t.l}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <KPI label="IRR" value={R.irr ? pct(R.irr) : "N/A"} sub="5-year" large />
            <KPI label="MOIC" value={mul(R.moic)} sub="w/ exit" large />
            <KPI label="MOIC" value={mul(R.moicNE)} sub="no exit" large />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <KPI label="NPV" value={fmt(R.npv)} />
            <KPI label="EV Year 5" value={fmt(R.ev[4])} />
            <KPI label="Yr5 EBITDA" value={fmt(R.eb[4])} sub={`${pct(R.ebM[4])} margin`} />
            <KPI label="Stress Min" value={fmt(R.mS)} warn={R.mS < 500000} sub={R.mS < 500000 ? "BELOW FLOOR" : "Safe"} />
          </div>
          <div style={cd}>
            <div style={sl}>EBITDA by Year</div>
            <Bar values={R.eb} />
            <BarLabels values={R.eb} labels={Y} />
          </div>
          <div style={cd}>
            <div style={sl}>Production Slate</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {Y.map((y, i) => (
                <div key={y} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: C.lightGray }}>{y}</div>
                  <div style={{ fontSize: 16, fontWeight: 300, fontFamily: "'Playfair Display',serif" }}>{R.tf[i]}</div>
                  <div style={{ fontSize: 9, color: C.warmGray }}>{params.spFilms[i]}sp {params.enFilms[i]}en</div>
                </div>
              ))}
            </div>
          </div>
          <div style={cd}>
            <div style={sl}>Revenue Composition (Yr5)</div>
            <WF items={[
              { label: "Prod Fees", value: R.pF[4], color: C.rust },
              { label: "OH Fees", value: R.oF[4], color: C.rustLight },
              { label: "Dev Recoup", value: R.dR[4], color: C.warmGray },
              { label: "SP Backend", value: R.sBT[4], color: C.success },
              { label: "EN Backend", value: R.eBT[4], color: "#1a6b4f" },
              { label: "Costs", value: -R.tC[4], color: C.danger },
            ]} />
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={sl}>Investor Cumulative</div>
            <Bar values={R.iCum} color="#6B4C8A" />
            <BarLabels values={R.iCum} labels={Y} />
          </div>
        </>
      )}

      {tab === "branches" && (
        <>
          <div style={cd}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 20, background: C.rust, borderRadius: 2 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>NEMEA Spanish</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <KPI label="Yr3 Rev/Film" value={fmt(R.spNR[2])} />
              <KPI label="Yr3 SPV Eq." value={fmt(R.spEq[2])} />
              <KPI label="Yr5 Rev/Film" value={fmt(R.spNR[4])} />
              <KPI label="Yr5 SPV Eq." value={fmt(R.spEq[4])} />
            </div>
            <WF items={[
              { label: "Budget", value: params.spBudget[4], color: C.warmGray },
              { label: "EFICINE", value: -R.spMI[4], color: "#D4A017" },
              { label: "Co-Pro", value: -params.spBudget[4]*params.spCopro[4], color: "#B8860B" },
              { label: "SPV Eq.", value: R.spEq[4], color: C.danger },
              { label: "Net Rev", value: R.spNR[4], color: C.rust },
              { label: "Backend", value: R.spBk[4], color: C.success },
            ]} />
            <div style={{ fontSize: 11, color: C.warmGray, marginTop: 10, fontStyle: "italic" }}>
              EFICINE ({fmt(R.spMI[4])}) — non-stackable with production incentive
            </div>
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 20, background: C.charcoal, borderRadius: 2 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>NEMEA Global Media</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <KPI label="Yr3 Rev/Film" value={fmt(R.enNR[2])} />
              <KPI label="Yr3 SPV Eq." value={fmt(R.enEq[2])} />
              <KPI label="Yr5 Rev/Film" value={fmt(R.enNR[4])} />
              <KPI label="Yr5 SPV Eq." value={fmt(R.enEq[4])} />
            </div>
            <WF items={[
              { label: "Budget", value: params.enBudget[4], color: C.warmGray },
              { label: "Canada", value: -R.enCI[4], color: "#C41E3A" },
              { label: "US Credit", value: -params.enUS[4], color: "#1B4B82" },
              { label: "Co-Pro", value: -params.enBudget[4]*params.enCopro[4], color: "#B8860B" },
              { label: "SPV Eq.", value: R.enEq[4], color: C.danger },
              { label: "Net Rev", value: R.enNR[4], color: C.rust },
              { label: "Backend", value: R.enBk[4], color: C.success },
            ]} />
            <div style={{ fontSize: 11, color: C.warmGray, marginTop: 10, fontStyle: "italic" }}>
              Canada BC PSTC + Federal covers {pct(params.enCanada[4])} = {fmt(R.enCI[4])}/film
            </div>
          </div>
        </>
      )}

      {tab === "cash" && (
        <>
          <div style={cd}>
            <div style={sl}>Cash Balance</div>
            <Bar values={R.ca} color={C.success} />
            <BarLabels values={R.ca} labels={Y} />
          </div>
          <div style={cd}>
            <div style={sl}>Stress Test (worst case)</div>
            <Bar values={R.st} color="#D4A017" />
            <BarLabels values={R.st} labels={Y} />
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, fontSize: 11,
              background: R.mS > 500000 ? "rgba(45,106,79,.08)" : "rgba(192,57,43,.08)",
              color: R.mS > 500000 ? C.success : C.danger }}>
              Min: {fmt(R.mS)} — {R.mS > 500000 ? "ABOVE $500K FLOOR" : "NEEDS BRIDGE"}
            </div>
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={sl}>P&L Summary</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.sand}` }}>
                  <th style={{ textAlign: "left", padding: "6px 2px", color: C.warmGray }}></th>
                  {Y.map(y => <th key={y} style={{ textAlign: "right", padding: "6px 2px", color: C.warmGray }}>{y}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { l: "Revenue", v: R.sR },
                  { l: "Costs", v: R.tC.map(c => -c) },
                  { l: "EBITDA", v: R.eb, b: true },
                  { l: "Margin", v: R.ebM, f: "pct" },
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.sand}40` }}>
                    <td style={{ padding: "5px 2px", color: C.warmGray, fontWeight: row.b ? 600 : 400 }}>{row.l}</td>
                    {row.v.map((v, i) => (
                      <td key={i} style={{ textAlign: "right", padding: "5px 2px", color: row.f === "pct" ? C.warmGray : (v < 0 ? C.danger : C.charcoal), fontWeight: row.b ? 600 : 400 }}>
                        {row.f === "pct" ? pct(v) : fmt(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "team" && (
        <>
          <div style={cd}>
            <div style={sl}>Studio Payroll — Three Jurisdictions</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 440 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.sand}` }}>
                    <th style={{ textAlign: "left", padding: "5px 4px", color: C.warmGray }}>Role</th>
                    {Y.map(y => <th key={y} style={{ textAlign: "right", padding: "5px 2px", color: C.warmGray }}>{y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {teamRoles.map((r, ri) => {
                    const prev = ri > 0 ? teamRoles[ri-1].g : "";
                    const showHeader = r.g !== prev;
                    const groupLabel = r.g === "Core" ? "Core Team (Delaware)" : r.g === "Spanish" ? "NEMEA Spanish (CDMX)" : "NEMEA Global (LA/Vancouver)";
                    return (
                      <tbody key={ri}>
                        {showHeader && (
                          <tr>
                            <td colSpan={6} style={{ padding: "8px 4px 3px", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.rust, fontWeight: 600 }}>{groupLabel}</td>
                          </tr>
                        )}
                        <tr style={{ borderBottom: `1px solid ${C.sand}30` }}>
                          <td style={{ padding: "4px 4px", color: C.charcoal, whiteSpace: "nowrap" }}>{r.r}</td>
                          {r.c.map((v, i) => (
                            <td key={i} style={{ textAlign: "right", padding: "4px 2px", color: v > 0 ? C.charcoal : C.lightGray }}>{v > 0 ? fmt(v) : "—"}</td>
                          ))}
                        </tr>
                      </tbody>
                    );
                  })}
                  <tr style={{ borderTop: `2px solid ${C.rust}30` }}>
                    <td style={{ padding: "6px 4px", fontWeight: 600, color: C.charcoal }}>Total</td>
                    {teamTots.map((t, i) => <td key={i} style={{ textAlign: "right", padding: "6px 2px", fontWeight: 600, color: C.charcoal }}>{fmt(t)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <KPI label="Yr1 Team" value={`${hc[0]} people`} sub={fmt(teamTots[0])} />
            <KPI label="Yr5 Team" value={`${hc[4]} people`} sub={fmt(teamTots[4])} />
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={sl}>Headcount Growth</div>
            <Bar values={hc} />
            <BarLabels values={hc} labels={Y} formatter={v => v} />
          </div>
        </>
      )}

      {tab === "levers" && (
        <>
          <div style={cd}>
            <div style={sl}>Sensitivity Controls</div>
            <Sli label="Hit Probability" value={hitAdj} min={-.15} max={.20} step={.01} onChange={setHitAdj} />
            <Sli label="Streaming MG" value={mgAdj} min={-.30} max={.50} step={.05} onChange={setMgAdj} />
            <Sli label="Exit Multiple" value={exitMul} min={4} max={15} step={1} onChange={setExitMul} format="x" />
            <Sli label="Co-Pro Equity" value={coproAdj} min={-.15} max={.20} step={.01} onChange={setCoproAdj} />
            <Sli label="Producer Fee" value={feeAdj} min={-.03} max={.06} step={.01} onChange={setFeeAdj} />
            <Sli label="Library $/Title" value={libVal} min={100000} max={600000} step={25000} onChange={setLibVal} format="usd" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <KPI label="IRR" value={R.irr ? pct(R.irr) : "N/A"} large />
            <KPI label="MOIC" value={mul(R.moic)} sub="with exit" large />
            <KPI label="NPV" value={fmt(R.npv)} />
            <KPI label="No-Exit" value={mul(R.moicNE)} />
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={sl}>Dev Pipeline</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.sand}` }}>
                  <th style={{ textAlign: "left", padding: "5px 2px", color: C.warmGray }}></th>
                  {Y.map(y => <th key={y} style={{ textAlign: "right", padding: "5px 2px", color: C.warmGray }}>{y}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { l: "Produced", v: R.tf, f: v => v },
                  { l: "Dev Projects", v: params.dp, f: v => v },
                  { l: "Kill Rate", v: R.kR, f: pct },
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.sand}30` }}>
                    <td style={{ padding: "4px 2px", color: C.warmGray }}>{row.l}</td>
                    {row.v.map((v, i) => <td key={i} style={{ textAlign: "right", padding: "4px 2px", color: C.charcoal }}>{row.f(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 9, color: C.lightGray, letterSpacing: 1 }}>
        NEMEA PICTURES — CONFIDENTIAL — IP STUDIO FIRST
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  if (page === "landing") return <Landing onEnter={() => setPage("gate")} />;
  if (page === "gate") return <Gate onSuccess={() => setPage("dash")} />;
  return <Dash />;
}
