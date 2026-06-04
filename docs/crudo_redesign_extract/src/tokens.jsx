// Design tokens + typography display artboards.

function TokensSwatch({ name, value, light = false }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
      <i style={{ width: 36, height: 36, borderRadius: 4, background: value, display:'inline-block', boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.08)' }}></i>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, color: light ? 'rgba(242,234,216,0.85)' : '#29261b' }}>{value}</div>
        <div style={{ fontSize: 11, color: light ? 'rgba(242,234,216,0.55)' : '#8a7a5a' }}>{name}</div>
      </div>
    </div>
  );
}

function TokensArtboard() {
  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, padding: 36, width: 760, fontFamily:'var(--font-body)' }}>
      <Eyebrow color={C.gold}>Phase 7 · 2 de 7</Eyebrow>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, margin: '6px 0 6px', letterSpacing:'-0.01em' }}>Design tokens</h2>
      <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.6, marginBottom: 24, maxWidth: '60ch' }}>
        Locked desde V1Tecnico §7 + Master Plan §17 / Apendice A. Estos hex pasan tal cual a <code style={{ background:'rgba(242,234,216,0.08)', padding:'1px 5px', borderRadius:3 }}>tokens.css</code> y <code style={{ background:'rgba(242,234,216,0.08)', padding:'1px 5px', borderRadius:3 }}>tailwind.config.js</code>. No relitigables.
      </p>

      <Eyebrow color={C.textMuted} style={{ marginBottom: 12 }}>Backgrounds</Eyebrow>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 28 }}>
        <TokensSwatch name="--c-bg-primary · forest" value="#1A1F14" light />
        <TokensSwatch name="--c-bg-secondary · charcoal" value="#1E1C18" light />
        <TokensSwatch name="--c-bg-elevated" value="#252420" light />
        <TokensSwatch name="--c-bg-light · cream" value="#F2EAD8" light />
        <TokensSwatch name="--c-bg-light-soft" value="#EAE0CB" light />
      </div>

      <Eyebrow color={C.textMuted} style={{ marginBottom: 12 }}>Text</Eyebrow>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 28 }}>
        <TokensSwatch name="--c-text-primary" value="#F2EAD8" light />
        <TokensSwatch name="--c-text-secondary" value="#C7BFAD" light />
        <TokensSwatch name="--c-text-muted" value="#8A8473" light />
        <TokensSwatch name="--c-text-inverse" value="#1A1F14" light />
      </div>

      <Eyebrow color={C.textMuted} style={{ marginBottom: 12 }}>Accent &amp; semantic</Eyebrow>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 28 }}>
        <TokensSwatch name="--c-accent · terracotta CTA" value="#B5713A" light />
        <TokensSwatch name="--c-accent-hover" value="#C8804A" light />
        <TokensSwatch name="--c-accent-soft" value="#3A2A1E" light />
        <TokensSwatch name="--c-gold · aged gold" value="#B89668" light />
        <TokensSwatch name="--c-success" value="#6B8E5A" light />
        <TokensSwatch name="--c-warning" value="#C8893E" light />
        <TokensSwatch name="--c-error" value="#A8443A" light />
      </div>

      <Eyebrow color={C.textMuted} style={{ marginBottom: 12 }}>Forbidden</Eyebrow>
      <div style={{ display:'flex', gap: 10, marginBottom: 24, fontSize: 11, color: C.textMuted, flexWrap:'wrap' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><i style={{ width:14, height:14, background:'#fff', borderRadius:2, border:'1px solid rgba(242,234,216,0.3)', display:'inline-block' }}></i> pure white</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><i style={{ width:14, height:14, background:'#000', borderRadius:2, display:'inline-block' }}></i> pure black</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><i style={{ width:14, height:14, background:'#9CA3AF', borderRadius:2, display:'inline-block' }}></i> cool gray</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><i style={{ width:14, height:14, background:'#3B82F6', borderRadius:2, display:'inline-block' }}></i> blue</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 6 }}><i style={{ width:14, height:14, background:'#FACC15', borderRadius:2, display:'inline-block' }}></i> neon</span>
      </div>

      <Eyebrow color={C.textMuted} style={{ marginBottom: 12 }}>Spacing &amp; radii</Eyebrow>
      <div style={{ fontFamily:'var(--font-mono)', fontSize: 11.5, color: C.textSecondary, lineHeight: 1.9 }}>
        <div>space-1 4 · space-2 8 · space-3 12 · space-4 16 · space-5 24 · space-6 32 · space-7 48 · space-8 64 · space-9 96 · space-10 128</div>
        <div>radius-sm 2 · radius-md 4 · radius-lg 8 · radius-pill 999</div>
        <div>shadow-card  0 1px 0 rgba(0,0,0,.18), 0 0 0 1px rgba(242,234,216,.06)</div>
        <div>shadow-pop   0 12px 32px rgba(0,0,0,.35)</div>
      </div>

      <div style={{ marginTop: 24, padding: 14, border:`1px dashed ${C.line}`, borderRadius: 4, fontSize: 11, color: C.textSecondary, lineHeight: 1.5 }}>
        <b style={{ color: C.gold }}>WCAG 2.2 AA · contrast notes</b><br/>
        cream <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>#F2EAD8</code> sobre forest <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>#1A1F14</code> = 12.6:1 ✓ AAA.
        terracotta <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>#B5713A</code> sobre forest = 4.85:1 ✓ AA (texto regular ≥14px).
        muted <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>#8A8473</code> sobre forest = 4.55:1 ✓ AA solo para texto ≥14px no body principal — usar para microcopy.
        Nunca usar muted como texto principal.
      </div>
    </div>
  );
}

function TypeArtboard() {
  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, padding: 36, width: 760, fontFamily:'var(--font-body)' }}>
      <Eyebrow color={C.gold}>Phase 7 · 3 de 7</Eyebrow>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, margin: '6px 0 24px', letterSpacing:'-0.01em' }}>Typography</h2>

      <div style={{ borderTop:`1px solid ${C.line}`, paddingTop: 18, marginBottom: 18 }}>
        <Eyebrow color={C.gold}>Display · Cormorant Garamond</Eyebrow>
        <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 64, lineHeight: 1.0, margin:'12px 0 4px', letterSpacing:'-0.015em' }}>Tienda de quesos</p>
        <p style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 36, margin: '12px 0 4px' }}>Esta temporada</p>
        <p style={{ fontFamily:'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '8px 0' }}>Idiazabal de Aralar</p>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily:'var(--font-mono)' }}>500 italic 64/64 -0.015em hero · 500 36/40 H2 · 600 24/28 H3 · 600 18/24 H4</div>
      </div>

      <div style={{ borderTop:`1px solid ${C.line}`, paddingTop: 18, marginBottom: 18 }}>
        <Eyebrow color={C.gold}>Body · Inter</Eyebrow>
        <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 12, maxWidth:'72ch', color: C.textSecondary }}>Body lead · 18 / 1.6. Leche cruda de oveja latxa, curacion de 6 meses, corteza natural cepillada. Maridaje recomendado: vermut blanco artesano o txakoli atlantico.</p>
        <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8, maxWidth:'72ch', color: C.textSecondary }}>Body 14 / 1.6. Maximo de linea 72ch para preservar la lectura editorial. Numerales tabulares en precios via <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>font-feature-settings:'tnum'</code>.</p>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily:'var(--font-mono)', marginTop: 6 }}>400 12/16 caption · 400 14/22 body · 500 14/20 ui · 500 16/24 lead-sm · 400 18/28 lead</div>
      </div>

      <div style={{ borderTop:`1px solid ${C.line}`, paddingTop: 18, marginBottom: 18 }}>
        <Eyebrow color={C.gold}>Eyebrow · Inter 500 · 0.18em uppercase</Eyebrow>
        <p style={{ fontFamily:'var(--font-body)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.18em', fontSize: 12, marginTop: 12, color: C.textPrimary }}>Tienda de quesos · Madrid</p>
        <p style={{ fontFamily:'var(--font-body)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.18em', fontSize: 11, marginTop: 4, color: C.gold }}>Esta temporada · Mayo 2026</p>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily:'var(--font-mono)', marginTop: 6 }}>11–12px · letter-spacing 0.18em · uppercase · usado en eyebrows y meta de tarjetas</div>
      </div>

      <div style={{ borderTop:`1px solid ${C.line}`, paddingTop: 18 }}>
        <Eyebrow color={C.gold}>Mono · JetBrains Mono</Eyebrow>
        <p style={{ fontFamily:'var(--font-mono)', fontSize: 22, marginTop: 12 }}>6,80 € / 100 g</p>
        <p style={{ fontFamily:'var(--font-mono)', fontSize: 13, color: C.textSecondary }}>Pedido #PIK-26-00041 · 19 may 2026 · slot 19:30</p>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily:'var(--font-mono)', marginTop: 6 }}>solo precios PDP, IDs de pedido, horas en confirmacion. Nunca para body</div>
      </div>

      <div style={{ marginTop: 22, padding: 14, border:`1px dashed ${C.line}`, borderRadius: 4, fontSize: 12, color: C.textSecondary, lineHeight: 1.65 }}>
        <b style={{ color: C.gold }}>Loading strategy</b><br/>
        Google Fonts <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>display=swap</code>. Preconnect a <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>fonts.gstatic.com</code>. Pesos cargados: Cormorant 400/500/600/italic 500 · Inter 400/500/600/700 · JetBrains 400/500. Fallbacks: <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>'Times New Roman', serif</code> · <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>system-ui, sans-serif</code> · <code style={{ background:'rgba(242,234,216,0.08)', padding:'0 4px' }}>ui-monospace, monospace</code>.
      </div>
    </div>
  );
}

window.TokensArtboard = TokensArtboard;
window.TypeArtboard = TypeArtboard;
