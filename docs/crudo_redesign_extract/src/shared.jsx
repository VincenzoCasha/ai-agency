// Shared building blocks for CRUDO mockups.
// Wordmark placeholder, mobile/desktop frames, photo placeholders,
// nav primitives, footer, sticky mobile CTA.
//
// All components below assume the locked CRUDO palette + type system from
// V1Tecnico §7 + Master Plan §17 (see :root tokens in index.html).

const C = {
  bgPrimary: 'var(--c-bg-primary)',
  bgSecondary: 'var(--c-bg-secondary)',
  bgElevated: 'var(--c-bg-elevated)',
  bgLight: 'var(--c-bg-light)',
  bgLightSoft: 'var(--c-bg-light-soft)',
  textPrimary: 'var(--c-text-primary)',
  textSecondary: 'var(--c-text-secondary)',
  textMuted: 'var(--c-text-muted)',
  textInverse: 'var(--c-text-inverse)',
  accent: 'var(--c-accent)',
  accentHover: 'var(--c-accent-hover)',
  accentSoft: 'var(--c-accent-soft)',
  gold: 'var(--c-gold)',
  success: 'var(--c-success)',
  warning: 'var(--c-warning)',
  error: 'var(--c-error)',
  line: 'var(--c-line)',
  lineStrong: 'var(--c-line-strong)',
  lineLight: 'var(--c-line-light)',
};

// ---------- Wordmark placeholder ----------
// Mimics the actual CRUDO sign DNA observed in the store: chunky rounded
// disco display + offset 3-step shadow. **PLACEHOLDER** — swap with owner's
// real logo from Drive when received. Marked here as Designer proposal.
function CrudoMark({ size = 36, inverse = false, style }) {
  return (
    <span
      className={'crudo-mark' + (inverse ? ' crudo-mark--inverse' : '')}
      data-asset="crudo-wordmark-placeholder"
      style={{ fontSize: size, display: 'inline-block', ...style }}
    >crudo</span>
  );
}

function CrudoMonogram({ size = 28, inverse = false }) {
  return (
    <span
      className={'crudo-mark' + (inverse ? ' crudo-mark--inverse' : '')}
      data-asset="crudo-monogram-placeholder"
      style={{ fontSize: size, display: 'inline-block', lineHeight: 1 }}
    >c.</span>
  );
}

// ---------- Eyebrow ----------
function Eyebrow({ children, color, style }) {
  return (
    <div className="eyebrow" style={{ color, ...style }}>{children}</div>
  );
}

// ---------- Photo placeholder ----------
function Photo({ label = 'cheese plate · 1:1', light = false, ratio, src, style, children }) {
  const cls = 'photo-ph' + (light ? ' photo-ph--light' : '');
  const aspect = ratio ? { aspectRatio: ratio } : null;
  if (src) {
    return <div style={{ ...aspect, ...style, overflow:'hidden' }}><img src={src} className="photo-real" alt="" /></div>;
  }
  return (
    <div className={cls} style={{ ...aspect, ...style }}>
      <span style={{ opacity: 0.85 }}>{children || label}</span>
    </div>
  );
}

// ---------- Mobile / Desktop frames ----------
function Mobile({ statusBarColor = 'light', children, label }) {
  return (
    <div className="mobile-frame">
      <div className="mobile-frame__screen">
        <div className="mobile-frame__notch"></div>
        <div className="mobile-statusbar">
          <span>9:41</span>
          <span style={{ display:'flex', gap:6, alignItems:'center', fontSize: 12 }}>
            <span>●●●●</span>
            <span>5G</span>
            <span>▮</span>
          </span>
        </div>
        <div className="mobile-scroll mockup">{children}</div>
      </div>
    </div>
  );
}

function Desktop({ children }) {
  return (
    <div className="desktop-frame">
      <div className="desktop-frame__bar"><i></i><i></i><i></i></div>
      <div className="desktop-frame__screen mockup">{children}</div>
    </div>
  );
}

// ---------- Mobile header (minimal) ----------
function MobileHeader({ light = false, transparent = false }) {
  const fg = light ? C.textInverse : C.textPrimary;
  const bg = transparent ? 'transparent' : (light ? C.bgLight : C.bgPrimary);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: '14px 18px 12px', background: bg, color: fg,
      borderBottom: transparent ? 'none' : `1px solid ${light ? 'rgba(26,31,20,0.08)' : C.line}` }}>
      <CrudoMark size={26} inverse={light} />
      <div style={{ display:'flex', alignItems:'center', gap: 18 }}>
        <span style={{ fontSize: 18 }}>⌕</span>
        <span style={{ fontSize: 18 }}>≡</span>
      </div>
    </div>
  );
}

// ---------- Desktop header ----------
function DesktopHeader({ light = false }) {
  const fg = light ? C.textInverse : C.textPrimary;
  const bg = light ? C.bgLight : C.bgPrimary;
  const linkStyle = { color: fg, textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: '0.01em' };
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: '20px 56px', background: bg, color: fg,
      borderBottom: `1px solid ${light ? 'rgba(26,31,20,0.10)' : C.line}` }}>
      <div style={{ display:'flex', alignItems:'center', gap: 40 }}>
        <CrudoMark size={32} inverse={light} />
      </div>
      <nav style={{ display:'flex', gap: 32 }}>
        <a style={linkStyle} href="#">Temporada</a>
        <a style={linkStyle} href="#">Tablas</a>
        <a style={linkStyle} href="#">Eventos</a>
        <a style={linkStyle} href="#">Celebra con nosotros</a>
        <a style={linkStyle} href="#">Sobre</a>
        <a style={linkStyle} href="#">Contacto</a>
      </nav>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <span style={{ fontSize: 13, color: light ? 'rgba(26,31,20,0.6)' : C.textMuted }}>ES · EN</span>
        <a className="btn btn--sm" href="#" style={{ background: light ? 'transparent' : 'transparent', color: fg, border: `1px solid ${fg}` }}>Mi tabla · 0</a>
      </div>
    </div>
  );
}

// ---------- Footer ----------
function Footer({ variant = 'dark' }) {
  const dark = variant !== 'light';
  const bg = dark ? C.bgSecondary : C.bgLightSoft;
  const fg = dark ? C.textPrimary : C.textInverse;
  const muted = dark ? C.textMuted : 'rgba(26,31,20,0.55)';
  const line = dark ? C.line : 'rgba(26,31,20,0.10)';
  return (
    <div style={{ background: bg, color: fg, padding: '40px 24px 28px', borderTop: `1px solid ${line}` }}>
      <div style={{ marginBottom: 24 }}>
        <CrudoMark size={40} inverse={!dark} />
      </div>
      <Eyebrow color={muted} style={{ marginBottom: 8 }}>Tienda</Eyebrow>
      <div style={{ fontFamily:'var(--font-display)', fontSize: 16, marginBottom: 4 }}>Calle Jose Ortega y Gasset 81</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize: 16, marginBottom: 16 }}>28006 Madrid</div>
      <Eyebrow color={muted} style={{ marginBottom: 8 }}>Horario</Eyebrow>
      <div style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
        Lun–Vie 17:30 · 22:30<br/>
        Sab 12:30 · 22:00<br/>
        Dom 12:30 · 20:00
      </div>
      <Eyebrow color={muted} style={{ marginBottom: 8 }}>Newsletter</Eyebrow>
      <div style={{ display:'flex', gap: 6, marginBottom: 24 }}>
        <input placeholder="tu@correo.com" style={{ flex:1, background: dark ? C.bgPrimary : '#fff', color: fg, border:`1px solid ${line}`, padding:'10px 12px', borderRadius: 2, fontSize: 13 }} />
        <button className="btn btn--primary btn--sm">Suscribirme</button>
      </div>
      <div style={{ borderTop: `1px solid ${line}`, paddingTop: 16, fontSize: 11, color: muted, lineHeight: 1.7 }}>
        CRUDO QUESOS S.L.U · CIF B-19953694<br/>
        Calle de Jose Ortega y Gasset 81, 28006 Madrid<br/>
        <span style={{ opacity: 0.7 }}>Aviso legal · Privacidad · Cookies</span>
      </div>
    </div>
  );
}

// ---------- Sticky mobile CTA bar ----------
function StickyCta({ count = 0, dark = true }) {
  return (
    <div style={{
      position:'absolute', left: 12, right: 12, bottom: 14,
      display:'flex', gap: 8,
      background: dark ? 'rgba(37,36,32,0.92)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(18px)',
      padding: 8, borderRadius: 4,
      border: `1px solid ${dark ? C.line : 'rgba(26,31,20,0.10)'}`,
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      zIndex: 30,
    }}>
      <a className="btn btn--whatsapp" style={{ flex:1 }}>
        <span style={{ fontSize: 15 }}>◷</span> WhatsApp
      </a>
      <a className="btn btn--primary" style={{ flex:1 }}>
        Mi tabla · {count}
      </a>
    </div>
  );
}

// ---------- Title block (eyebrow + serif H1) ----------
function TitleBlock({ eyebrow, title, kicker, italic, color = C.textPrimary, mutedColor = C.textMuted, size = 44 }) {
  return (
    <div>
      {eyebrow && <Eyebrow color={mutedColor} style={{ marginBottom: 14 }}>{eyebrow}</Eyebrow>}
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight: italic ? 500 : 500,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size, lineHeight: 1.02, letterSpacing:'-0.015em',
        color, margin: 0 }}>
        {title}
      </h1>
      {kicker && <p style={{ marginTop: 14, color: mutedColor, fontSize: 14, lineHeight: 1.55, maxWidth: '52ch' }}>{kicker}</p>}
    </div>
  );
}

// ---------- ProductCard (cheese) ----------
function ProductCard({ name = 'Idiazabal', region = 'Pais Vasco · DOP', price = '6,80', unit = '/ 100 g', stock = 'ok', dark = true, photoSrc }) {
  const fg = dark ? C.textPrimary : C.textInverse;
  const muted = dark ? C.textMuted : 'rgba(26,31,20,0.55)';
  const bg = dark ? C.bgElevated : '#fff';
  const stockTag =
    stock === 'low' ? <span className="tag tag--warning">Pocas unidades</span> :
    stock === 'out' ? <span className="tag tag--neutral" style={{ opacity: 0.7 }}>Agotado</span> :
    null;
  return (
    <div style={{ background: bg, color: fg, borderRadius: 2, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', aspectRatio:'1', width:'100%' }}>
        <Photo src={photoSrc} label={`queso · 1:1`} style={{ width:'100%', height:'100%' }} />
        {stockTag && <div style={{ position:'absolute', top: 10, left: 10 }}>{stockTag}</div>}
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        <div className="eyebrow" style={{ color: muted, fontSize: 9.5, marginBottom: 6 }}>{region}</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize: 22, fontWeight: 500, lineHeight: 1.05, marginBottom: 8 }}>{name}</div>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <span className="mono" style={{ fontSize: 13, color: fg }}>{price} €<span style={{ color: muted, fontWeight: 400 }}> {unit}</span></span>
          <span style={{ fontSize: 16, color: C.accent }}>+</span>
        </div>
      </div>
    </div>
  );
}

// ---------- TablaCard ----------
function TablaCard({ size = '6 quesos', subtitle = 'Tabla mediana', priceFrom = '38', dark = true }) {
  const fg = dark ? C.textPrimary : C.textInverse;
  const muted = dark ? C.textMuted : 'rgba(26,31,20,0.55)';
  const bg = dark ? C.bgElevated : '#fff';
  return (
    <div style={{ background: bg, color: fg, borderRadius: 2, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', aspectRatio:'4/5', width:'100%' }}>
        <Photo label={`tabla ${size}`} style={{ width:'100%', height:'100%' }} />
      </div>
      <div style={{ padding: '16px 16px 18px' }}>
        <div className="eyebrow" style={{ color: muted, marginBottom: 6 }}>{subtitle}</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize: 26, fontWeight: 500, lineHeight: 1.05, marginBottom: 4 }}>{size}</div>
        <div className="mono" style={{ fontSize: 12, color: muted, marginBottom: 10 }}>desde {priceFrom},00 €</div>
        <div style={{ display:'flex', gap: 6, fontSize: 11, color: muted, marginBottom: 12 }}>
          <span className="tag tag--neutral">Sin maridaje</span>
          <span className="tag tag--gold">Con vino</span>
        </div>
        <div style={{ fontSize: 12.5, color: muted, lineHeight: 1.5 }}>Seleccion del owner. Variantes con vino blanco o tinto via WhatsApp.</div>
      </div>
    </div>
  );
}

// ---------- EventCard ----------
function EventCard({ date = '29 MAY', title = 'Spritz and Cheese with Mikks', meta = 'Viernes · 19:00 · 17 €', dark = true }) {
  const fg = dark ? C.textPrimary : C.textInverse;
  const muted = dark ? C.textMuted : 'rgba(26,31,20,0.55)';
  return (
    <div style={{ display:'flex', gap: 16, padding: '14px 0', borderTop: `1px solid ${dark ? C.line : 'rgba(26,31,20,0.12)'}` }}>
      <div style={{ width: 64, flexShrink: 0 }}>
        <div className="mono" style={{ fontSize: 12, color: C.gold, letterSpacing: '0.04em' }}>{date}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize: 20, fontWeight: 500, color: fg, lineHeight: 1.15, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: muted }}>{meta}</div>
      </div>
      <div style={{ alignSelf:'center', color: muted, fontSize: 16 }}>→</div>
    </div>
  );
}

// ---------- Section card wrapper for canvas ----------
function Card({ children, padding = 32, width, background = '#fff', color = '#29261b' }) {
  return (
    <div className="doc-card" style={{ padding, width, background, color }}>{children}</div>
  );
}

Object.assign(window, {
  C, CrudoMark, CrudoMonogram, Eyebrow, Photo, Mobile, Desktop,
  MobileHeader, DesktopHeader, Footer, StickyCta, TitleBlock,
  ProductCard, TablaCard, EventCard, Card,
});
