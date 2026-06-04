// Home — 3 directions × mobile + 1 desktop variant of chosen direction.
// Direction A · Editorial Dark · serif italic hero, dark dominant
// Direction B · Cream Forward · cream/light dominant, dark accents, more shop-feel
// Direction C · Wordmark Hero · the chunky logo as the hero anchor

function HomeMobileA() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      {/* hero */}
      <div style={{ background: C.bgPrimary, padding: '20px 22px 28px', position:'relative' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 18 }}>Tienda de quesos · Madrid</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 44, lineHeight: 0.98, letterSpacing:'-0.02em', color: C.textPrimary, margin: 0 }}>
          Quesos de<br/>autor para<br/>llevarte a casa.
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: C.textSecondary, marginTop: 18, marginBottom: 18 }}>
          Ortega y Gasset 81. Rotamos seleccion cada mes. Reserva tu tabla y la recogemos confirmacion en menos de 24 horas.
        </p>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn btn--primary" style={{ flex: 1 }}>Ver tablas</button>
          <button className="btn btn--secondary" style={{ flex: 1 }}>Esta temporada</button>
        </div>
      </div>
      {/* esta temporada */}
      <div style={{ background: C.bgSecondary, padding: '28px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <Eyebrow color={C.gold}>Esta temporada · Mayo</Eyebrow>
          <a style={{ fontSize: 12, color: C.accent, textDecoration:'underline' }}>Ver 14 →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <ProductCard name="Idiazabal" region="Pais Vasco · DOP" price="6,80" />
          <ProductCard name="Garrotxa" region="Catalunya · cabra" price="5,40" stock="low" />
          <ProductCard name="Torta Casar" region="Extremadura · DOP" price="9,20" />
          <ProductCard name="Roncal" region="Navarra · DOP" price="7,40" />
        </div>
      </div>
      {/* tablas teaser */}
      <div style={{ background: C.bgPrimary, padding: '32px 22px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 10 }}>Tablas y cajas · 3 / 6 / 8 quesos</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, lineHeight: 1.0, color: C.textPrimary, margin: '0 0 16px' }}>
          La forma facil<br/>de llevarte<br/>queso a casa.
        </h2>
        <Photo label="tabla 6 quesos · 4:5" ratio="4/5" style={{ marginBottom: 14 }} />
        <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55, marginBottom: 14 }}>Curacion del owner. Variante con maridaje de vino blanco o tinto via WhatsApp.</p>
        <button className="btn btn--secondary btn--block">Ver tablas</button>
      </div>
      {/* eventos teaser */}
      <div style={{ background: C.bgLight, color: C.textInverse, padding: '32px 22px' }}>
        <Eyebrow color="rgba(26,31,20,0.55)" style={{ marginBottom: 10 }}>Eventos · Mayo y Junio</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 30, lineHeight: 1.04, color: C.textInverse, margin: '0 0 14px' }}>Vente a comer<br/>queso en directo.</h2>
        <div style={{ borderTop:'1px solid rgba(26,31,20,0.14)' }}>
          <EventCard date="29 MAY" title="Spritz and Cheese with Mikks" meta="Viernes · 19:00 · 17 €" dark={false} />
          <EventCard date="06 JUN" title="Bodegas Telperion at CRUDO" meta="Viernes · 19:30 · 25 €" dark={false} />
        </div>
        <a className="btn btn--secondary-light btn--block" style={{ marginTop: 18 }}>Ver agenda</a>
      </div>
      {/* IG strip */}
      <div style={{ background: C.bgSecondary, padding: '28px 22px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 12 }}>@crudomov</Eyebrow>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 6 }}>
          {Array.from({length:4}).map((_,i)=>(
            <Photo key={i} label="" style={{ aspectRatio:'1' }} />
          ))}
        </div>
      </div>
      {/* visit block */}
      <div style={{ background: C.bgPrimary, padding: '32px 22px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 10 }}>Visitanos</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 28, lineHeight: 1.05, color: C.textPrimary, margin: '0 0 14px' }}>Calle Jose Ortega<br/>y Gasset 81</h2>
        <Photo label="map · 16:9" ratio="16/9" style={{ marginBottom: 14 }} />
        <div style={{ fontSize: 13, lineHeight: 1.7, color: C.textSecondary }}>
          Lun–Vie 17:30 · 22:30<br/>
          Sab 12:30 · 22:00<br/>
          Dom 12:30 · 20:00
        </div>
      </div>
      <Footer />
      <StickyCta count={0} />
    </Mobile>
  );
}

function HomeMobileB() {
  // Direction B · Cream forward — store-warmth dominant, dark used as accent.
  return (
    <Mobile statusBarColor="light">
      <MobileHeader light />
      <div style={{ background: C.bgLight, color: C.textInverse, padding: '24px 22px 36px' }}>
        <Eyebrow color="rgba(26,31,20,0.55)" style={{ marginBottom: 16 }}>Tienda de quesos · Madrid</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 50, lineHeight: 0.95, letterSpacing:'-0.02em', color: C.textInverse, margin: 0 }}>Quesos<br/>artesanos<br/>de barrio.</h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(26,31,20,0.7)', marginTop: 20, marginBottom: 20 }}>
          Una seleccion mensual, tablas para llevar y eventos en la barra. Salamanca, Madrid.
        </p>
        <Photo light label="store interior · 16:9" ratio="16/9" style={{ marginBottom: 20 }} />
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn btn--primary" style={{ flex: 1 }}>Ver tablas</button>
          <button className="btn btn--secondary-light" style={{ flex: 1 }}>Esta temporada</button>
        </div>
      </div>
      <div style={{ background: C.bgPrimary, padding: '28px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <Eyebrow color={C.gold}>Esta temporada · Mayo</Eyebrow>
          <a style={{ fontSize: 12, color: C.accent }}>Ver 14 →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <ProductCard name="Mahon" region="Menorca · DOP" price="5,90" />
          <ProductCard name="Cabrales" region="Asturias · azul" price="8,40" />
          <ProductCard name="Tetilla" region="Galicia · DOP" price="4,80" stock="low" />
          <ProductCard name="Manchego" region="Mancha · DOP" price="6,20" />
        </div>
      </div>
      <div style={{ background: C.bgLightSoft, color: C.textInverse, padding: '32px 22px' }}>
        <Eyebrow color="rgba(26,31,20,0.55)" style={{ marginBottom: 10 }}>Tablas · 3 / 6 / 8 quesos</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, lineHeight: 1.0, color: C.textInverse, margin: '0 0 16px' }}>Reservas tu tabla.<br/>Recoges en tienda.</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {['3','6','8'].map(n=>(
            <div key={n} style={{ background:'#fff', padding: 14, borderRadius: 2 }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize: 36, fontWeight: 500, lineHeight: 1, color: C.textInverse }}>{n}</div>
              <div style={{ fontSize: 11, color:'rgba(26,31,20,0.55)', marginTop: 4 }}>quesos</div>
              <div className="mono" style={{ fontSize: 11, marginTop: 8, color: C.accent }}>desde {n==='3'?'22':n==='6'?'38':'52'},00 €</div>
            </div>
          ))}
        </div>
        <a className="btn btn--secondary-light btn--block">Ver detalle</a>
      </div>
      <div style={{ background: C.bgPrimary, padding: '32px 22px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 10 }}>Eventos · 29 may, 30 may, 06 jun</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 30, lineHeight: 1.04, color: C.textPrimary, margin: '0 0 12px' }}>Spritz, queso<br/>y un poco de Mikks.</h2>
        <div style={{ borderTop:`1px solid ${C.line}` }}>
          <EventCard date="29 MAY" title="Spritz and Cheese with Mikks" meta="Viernes · 17 €" />
          <EventCard date="06 JUN" title="Bodegas Telperion at CRUDO" meta="Viernes · 25 €" />
        </div>
      </div>
      <div style={{ background: C.bgLight, color: C.textInverse, padding: '28px 22px' }}>
        <Eyebrow color="rgba(26,31,20,0.55)" style={{ marginBottom: 10 }}>Visitanos</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 24, lineHeight: 1.1, color: C.textInverse, margin: '0 0 12px' }}>Ortega y Gasset 81 · Madrid</h2>
        <Photo light label="map · 16:9" ratio="16/9" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 13, lineHeight: 1.7, color:'rgba(26,31,20,0.7)' }}>
          Lun–Vie 17:30 · 22:30 &nbsp;·&nbsp; Sab 12:30 · 22:00 &nbsp;·&nbsp; Dom 12:30 · 20:00
        </div>
      </div>
      <Footer />
      <StickyCta count={0} dark={false} />
    </Mobile>
  );
}

function HomeMobileC() {
  // Direction C · Wordmark hero — chunky CRUDO mark as the hero anchor.
  return (
    <Mobile statusBarColor="dark">
      <div style={{ background: C.bgPrimary, padding: '14px 18px', display:'flex', justifyContent:'flex-end', gap: 18, color: C.textPrimary }}>
        <span style={{ fontSize: 18 }}>⌕</span>
        <span style={{ fontSize: 18 }}>≡</span>
      </div>
      <div style={{ background: C.bgPrimary, padding: '4px 18px 28px', textAlign:'center', position:'relative' }}>
        <CrudoMark size={140} style={{ marginTop: 12 }} />
        <Eyebrow color={C.gold} style={{ marginTop: 22 }}>Tienda de quesos · Madrid · Desde 2023</Eyebrow>
        <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: 24, lineHeight: 1.2, color: C.textSecondary, margin: '14px 0 22px' }}>Quesos artesanos espanoles<br/>cortados al peso, todos los dias.</p>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn btn--primary" style={{ flex: 1 }}>Ver tablas</button>
          <button className="btn btn--secondary" style={{ flex: 1 }}>Esta temporada</button>
        </div>
      </div>
      <div style={{ background: C.bgLight, color: C.textInverse, padding: '24px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <Eyebrow color="rgba(26,31,20,0.55)">Esta temporada</Eyebrow>
          <a style={{ fontSize: 12, color: C.accent, textDecoration:'underline' }}>Ver 14 →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <ProductCard dark={false} name="Idiazabal" region="Pais Vasco · DOP" price="6,80" />
          <ProductCard dark={false} name="Garrotxa" region="Catalunya · cabra" price="5,40" />
        </div>
      </div>
      <div style={{ background: C.bgPrimary, padding: '32px 22px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 10 }}>Tablas</Eyebrow>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1.05, color: C.textPrimary, margin: '0 0 16px' }}>Tres formatos.<br/>Mismo cuidado.</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap: 10 }}>
          {[{n:'3', p:'22'},{n:'6', p:'38'},{n:'8', p:'52'}].map(t=>(
            <div key={t.n} style={{ display:'flex', alignItems:'center', gap: 14, padding: 14, background: C.bgElevated, borderRadius: 2 }}>
              <div style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: 44, fontWeight: 500, lineHeight: 1, color: C.gold, width: 56 }}>{t.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize: 18, color: C.textPrimary }}>Tabla {t.n} quesos</div>
                <div className="mono" style={{ fontSize: 12, color: C.textMuted }}>desde {t.p},00 €</div>
              </div>
              <span style={{ color: C.accent, fontSize: 18 }}>→</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.bgPrimary, padding: '28px 22px', borderTop:`1px solid ${C.line}` }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 10 }}>Eventos</Eyebrow>
        <div>
          <EventCard date="29 MAY" title="Spritz and Cheese with Mikks" meta="Viernes · 17 €" />
          <EventCard date="06 JUN" title="Bodegas Telperion at CRUDO" meta="Viernes · 25 €" />
        </div>
      </div>
      <Footer />
      <StickyCta count={0} />
    </Mobile>
  );
}

function HomeDesktopA() {
  return (
    <Desktop>
      <DesktopHeader />
      {/* hero */}
      <div style={{ background: C.bgPrimary, padding: '48px 56px 56px', display:'grid', gridTemplateColumns:'1.05fr 1fr', gap: 56, alignItems:'center' }}>
        <div>
          <Eyebrow color={C.gold} style={{ marginBottom: 22 }}>Tienda de quesos · Madrid</Eyebrow>
          <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 96, lineHeight: 0.94, letterSpacing:'-0.025em', color: C.textPrimary, margin: 0 }}>
            Quesos de autor<br/>para llevarte<br/>a casa.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: C.textSecondary, marginTop: 26, maxWidth:'52ch' }}>
            Ortega y Gasset 81. Una seleccion artesana espanola que rota cada mes. Reserva tu tabla y la recogemos confirmacion en menos de 24 horas dentro de nuestro horario de apertura.
          </p>
          <div style={{ display:'flex', gap: 12, marginTop: 28 }}>
            <button className="btn btn--primary btn--lg">Ver tablas</button>
            <button className="btn btn--secondary btn--lg">Esta temporada</button>
          </div>
        </div>
        <div>
          <Photo label="hero · cheese plate 4:5 tungsten" ratio="4/5" />
        </div>
      </div>
      {/* esta temporada */}
      <div style={{ background: C.bgSecondary, padding: '56px 56px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 24 }}>
          <div>
            <Eyebrow color={C.gold}>Esta temporada · Mayo 2026</Eyebrow>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 40, color: C.textPrimary, margin: '8px 0 0' }}>14 quesos para este mes</h2>
          </div>
          <a className="btn btn--secondary btn--sm">Ver todos →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          <ProductCard name="Idiazabal" region="Pais Vasco · DOP" price="6,80" />
          <ProductCard name="Garrotxa" region="Catalunya · cabra" price="5,40" stock="low" />
          <ProductCard name="Torta del Casar" region="Extremadura · DOP" price="9,20" />
          <ProductCard name="Roncal" region="Navarra · DOP" price="7,40" />
        </div>
      </div>
    </Desktop>
  );
}

window.HomeMobileA = HomeMobileA;
window.HomeMobileB = HomeMobileB;
window.HomeMobileC = HomeMobileC;
window.HomeDesktopA = HomeDesktopA;
