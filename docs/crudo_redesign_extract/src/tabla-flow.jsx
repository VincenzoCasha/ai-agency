// Tabla maridaje flow — 2 variants for the maridaje selector on /tablas/:slug.
// Variant A · Inline radio (sin / blanco / tinto), reveal WhatsApp branch when wine selected
// Variant B · Modal handoff — user picks tabla, then a focused modal asks the maridaje question

function TablaFlowA() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding: '4px 0 0' }}>
        <div style={{ padding:'14px 22px 6px', fontSize: 11, color: C.textMuted }}>
          <a style={{ color: C.textMuted }}>Tablas</a> &nbsp;/&nbsp; <span style={{ color: C.textPrimary }}>Tabla 6 quesos</span>
        </div>
        <Photo label="tabla 6 quesos · 1:1" ratio="1" style={{ width:'100%' }} />
      </div>
      <div style={{ background: C.bgPrimary, padding: '20px 22px 24px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 8 }}>Tabla mediana</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 36, lineHeight: 1.0, color: C.textPrimary, margin: 0 }}>Tabla 6 quesos</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary, marginTop: 14 }}>Seis quesos curados por el owner: vaca, oveja, cabra y un azul. Acompanan pan, mermeladas y frutos secos.</p>

        <div style={{ marginTop: 22, padding: 16, background: C.bgElevated, borderRadius: 4 }}>
          <Eyebrow color={C.gold} style={{ marginBottom: 12 }}>1 · Maridaje</Eyebrow>
          <div style={{ display:'grid', gap: 8 }}>
            <Radio active label="Sin maridaje" sub="Solo la tabla. Entra en Mi tabla y se reserva online." price="38,00 €" />
            <Radio label="Maridaje vino blanco" sub="Cerramos productor y precio por WhatsApp." price="WhatsApp" wine />
            <Radio label="Maridaje vino tinto" sub="Cerramos productor y precio por WhatsApp." price="WhatsApp" wine />
          </div>
          <p style={{ fontSize: 11.5, color: C.textMuted, marginTop: 14, lineHeight: 1.55 }}>El maridaje con vino se gestiona siempre por WhatsApp en V1: el owner elige productor, region y precio contigo.</p>
        </div>

        <div style={{ marginTop: 20, display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div className="mono" style={{ fontSize: 24, color: C.textPrimary }}>38,00 €</div>
          <div className="eyebrow" style={{ color: C.textMuted }}>Pickup en tienda</div>
        </div>
        <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 14 }}>Anadir a Mi tabla</button>
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign:'center' }}>Te confirmamos por WhatsApp en menos de 24 h.</p>
      </div>
      <Footer />
    </Mobile>
  );
}

function TablaFlowAWithWine() {
  // Same screen but with wine variant selected — primary CTA flips to WhatsApp
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding: '4px 0 0' }}>
        <div style={{ padding:'14px 22px 6px', fontSize: 11, color: C.textMuted }}>
          <a style={{ color: C.textMuted }}>Tablas</a> &nbsp;/&nbsp; <span style={{ color: C.textPrimary }}>Tabla 6 quesos</span>
        </div>
        <Photo label="tabla 6 + copas · 1:1" ratio="1" />
      </div>
      <div style={{ background: C.bgPrimary, padding: '20px 22px 24px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 8 }}>Tabla mediana</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 36, lineHeight: 1.0, color: C.textPrimary, margin: 0 }}>Tabla 6 quesos</h1>

        <div style={{ marginTop: 22, padding: 16, background: C.bgElevated, borderRadius: 4 }}>
          <Eyebrow color={C.gold} style={{ marginBottom: 12 }}>1 · Maridaje</Eyebrow>
          <div style={{ display:'grid', gap: 8 }}>
            <Radio label="Sin maridaje" sub="Reserva en Mi tabla." price="38,00 €" />
            <Radio active label="Maridaje vino tinto" sub="Cerramos productor y precio por WhatsApp." price="WhatsApp" wine />
            <Radio label="Maridaje vino blanco" sub="Cerramos productor y precio por WhatsApp." price="WhatsApp" wine />
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 14, background:'rgba(184,150,104,0.08)', border:`1px solid ${C.gold}`, borderRadius: 4 }}>
          <div style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: 18, color: C.textPrimary, marginBottom: 4 }}>El owner cierra el vino contigo</div>
          <p style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55 }}>Te escribe por WhatsApp con dos opciones de tinto natural espanol que casan con esta tabla. Confirmas y te lo dejamos preparado.</p>
        </div>

        <a className="btn btn--whatsapp btn--block btn--lg" style={{ marginTop: 16 }}>◷ Continuar por WhatsApp</a>
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign:'center' }}>Mensaje prellenado · respuesta en menos de 24 h.</p>
      </div>
      <Footer />
    </Mobile>
  );
}

function TablaFlowB() {
  // Variant B · modal handoff
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding: '4px 0 0', filter:'brightness(0.55)' }}>
        <div style={{ padding:'14px 22px 6px', fontSize: 11, color: C.textMuted }}>
          <a style={{ color: C.textMuted }}>Tablas</a> &nbsp;/&nbsp; <span>Tabla 8 quesos</span>
        </div>
        <Photo label="tabla 8 quesos · 1:1" ratio="1" />
        <div style={{ padding: '20px 22px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, color: C.textPrimary, margin: 0 }}>Tabla 8 quesos</h1>
        </div>
      </div>
      <div style={{ position:'absolute', inset: 0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'flex-end' }}>
        <div style={{ background: C.bgSecondary, width:'100%', borderRadius:'14px 14px 0 0', padding: '20px 22px 28px', borderTop:`1px solid ${C.gold}` }}>
          <div style={{ width: 40, height: 4, background: C.line, borderRadius: 2, margin:'0 auto 18px' }}></div>
          <Eyebrow color={C.gold} style={{ marginBottom: 8 }}>Antes de continuar</Eyebrow>
          <h2 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: 28, fontWeight: 500, color: C.textPrimary, margin:'0 0 8px', lineHeight: 1.05 }}>Tu tabla, ¿con vino?</h2>
          <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55, marginBottom: 18 }}>Si quieres maridaje, el owner cierra productor y precio por WhatsApp. Si prefieres solo la tabla, la reservas online y la recoges en tienda.</p>

          <div style={{ display:'grid', gap: 10 }}>
            <button className="btn btn--primary btn--block btn--lg" style={{ justifyContent:'space-between' }}>
              <span>Solo la tabla · 52,00 €</span><span>→</span>
            </button>
            <button className="btn btn--whatsapp btn--block btn--lg" style={{ justifyContent:'space-between' }}>
              <span>◷ Con vino blanco · WhatsApp</span><span>→</span>
            </button>
            <button className="btn btn--whatsapp btn--block btn--lg" style={{ justifyContent:'space-between' }}>
              <span>◷ Con vino tinto · WhatsApp</span><span>→</span>
            </button>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 14, textAlign:'center' }}>Variantes con vino siempre via WhatsApp · owner override §0.2</p>
        </div>
      </div>
    </Mobile>
  );
}

function Radio({ active, label, sub, price, wine }) {
  return (
    <label style={{ display:'flex', gap: 12, padding: 12, border:`1px solid ${active ? C.gold : C.line}`, borderRadius: 4, background: active ? 'rgba(184,150,104,0.08)' : 'transparent', cursor:'pointer' }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, border:`1.5px solid ${active ? C.gold : C.lineStrong}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0, marginTop: 2 }}>
        {active && <span style={{ width: 8, height: 8, borderRadius: 999, background: C.gold }}></span>}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{label}</span>
          <span className="mono" style={{ fontSize: 12, color: wine ? '#25D366' : C.textPrimary }}>{price}</span>
        </div>
        <div style={{ fontSize: 11.5, color: C.textMuted, lineHeight: 1.45 }}>{sub}</div>
      </div>
    </label>
  );
}

window.TablaFlowA = TablaFlowA;
window.TablaFlowAWithWine = TablaFlowAWithWine;
window.TablaFlowB = TablaFlowB;
