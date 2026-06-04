// CRUDO · Rediseño visual con manual Piscolabis
// Cinzel display (uppercase) + Barlow body + JetBrains Mono prices
// Bone cream bg, coral CTAs, vino borders, terracota eyebrows, soft pink + petrol accents

// ---------- Shared atoms ----------

// Real CRUDO logo (Piscolabis · color V1) — stacked retro "cru/do"
// in coral pink with red + cream + petrol offset layers.
function Wordmark({ size = 44, style }) {
  return (
    <img
      src="assets/crudo-logo.png"
      alt="CRUDO"
      style={{
        height: size,
        width: 'auto',
        display: 'block',
        ...style,
      }}
    />
  );
}

// Single-line CSS wordmark — same retro stacked-shadow DNA as the real logo
// but on one line so it fits cleanly inside top nav bars. Uses Bagel Fat One
// (chunky rounded display) with a 3-layer text-shadow stack.
function WordmarkInline({ size = 30, dark = false, style }) {
  return (
    <span
      className={'wordmark-inline' + (dark ? ' wordmark-inline--dark' : '')}
      style={{ fontSize: size, ...style }}
      aria-label="CRUDO"
    >crudo</span>
  );
}

function EyebrowPill({ children, tone = 'terra' }) {
  const bg = tone === 'terra' ? 'var(--c-terra)' : tone === 'vino' ? 'var(--c-vino)' : 'var(--c-petrol)';
  return <span className="eyebrow-pill" style={{ background: bg }}>{children}</span>;
}

function EyebrowLine({ children, color }) {
  return <div className="eyebrow-line" style={color ? { color } : null}>{children}</div>;
}

function Photo({ label = 'foto · 1:1', ratio, light = false, src, style, children }) {
  if (src) {
    return (
      <div style={{ aspectRatio: ratio, overflow:'hidden', position:'relative', borderRadius: 'inherit', ...style }}>
        <img src={src} alt={label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      </div>
    );
  }
  return (
    <div className={'photo' + (light ? ' photo--light' : '')} style={{ aspectRatio: ratio, ...style }}>
      <span>{children || label}</span>
    </div>
  );
}

function PriceMono({ value = '6,80', unit = '/ 100g', size = 16, color = 'var(--c-ink)' }) {
  return (
    <span className="mono" style={{ fontSize: size, color, fontWeight: 500 }}>
      {value} €<span style={{ color:'var(--c-vino)', fontWeight: 400, marginLeft: 2 }}> {unit}</span>
    </span>
  );
}

// ---------- Phone & Browser shells ----------

function Phone({ children, statusColor = 'dark' }) {
  return (
    <div className="phone">
      <div className="phone__screen">
        <div className="phone__notch"></div>
        <div className={'statusbar' + (statusColor === 'light' ? ' statusbar--light' : '')}>
          <span>9:41</span>
          <span style={{ display:'flex', gap:6, alignItems:'center', fontSize: 12 }}>
            <span>●●●●</span><span>5G</span><span>▮</span>
          </span>
        </div>
        <div className="scroll mockup">{children}</div>
      </div>
    </div>
  );
}

function Browser({ url = 'crudoquesos.es', children }) {
  return (
    <div className="browser">
      <div className="browser__bar">
        <i></i><i></i><i></i>
        <div style={{ width: 8 }}></div>
        <div className="browser__addr">{url}</div>
        <div style={{ width: 60 }}></div>
      </div>
      <div className="browser__screen mockup">{children}</div>
    </div>
  );
}

// ---------- Mobile nav (top bar) ----------

function MobileNav({ active }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 18px',
      background: 'var(--c-bone)',
      borderBottom: '1px solid var(--c-vino-line)',
    }}>
      <WordmarkInline size={28} />
      <div style={{ display:'flex', alignItems:'center', gap: 6, color:'var(--c-ink)' }}>
        <button className="btn btn--sm" style={{ background:'transparent', color:'var(--c-vino)', padding:'8px 10px', fontWeight: 600 }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>≡</span>
        </button>
      </div>
    </div>
  );
}

// ---------- Sticky bottom CTA (mobile) ----------

function StickyMobileCTA({ primary = 'Reservar plaza', whatsapp = true }) {
  return (
    <div style={{
      position:'absolute', left: 12, right: 12, bottom: 14,
      display:'flex', gap: 8, padding: 8,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter:'blur(14px)',
      border:'1px solid var(--c-vino-line)',
      borderRadius: 6,
      boxShadow: '0 10px 28px rgba(108,64,80,0.18)',
      zIndex: 30,
    }}>
      {whatsapp && (
        <a className="btn btn--whatsapp" style={{ flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.71a9.94 9.94 0 0 0 5.79 1.59h.01c5.46 0 9.91-4.45 9.91-9.97 0-2.66-1.03-5.16-2.91-7.04A9.81 9.81 0 0 0 12.04 2zm0 18.14h-.01a8.16 8.16 0 0 1-4.15-1.14l-.3-.18-3.07 1.04 1.05-3-.2-.32a8.18 8.18 0 0 1-1.25-4.33c0-4.51 3.68-8.18 8.2-8.18 2.19 0 4.24.85 5.79 2.4a8.15 8.15 0 0 1 2.4 5.78c0 4.51-3.68 8.18-8.2 8.18zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.25-.63.79-.78.95-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.39.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.42.06-.65.31-.22.25-.85.83-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.58.18 1.12.16 1.54.1.47-.07 1.46-.59 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28z"/></svg>
          WhatsApp
        </a>
      )}
      <a className="btn btn--primary" style={{ flex: 1.4 }}>{primary}</a>
    </div>
  );
}

// ============================================================
// SCREEN 1 · HOME (mobile)
// ============================================================

function HomeMobile() {
  return (
    <Phone>
      <MobileNav active="Home" />

      {/* Hero — bone cream, editorial. Eyebrow + headline ink + CTAs + foto */}
      <div style={{ padding:'28px 22px 8px' }}>
        <EyebrowPill>Tienda de quesos · Madrid</EyebrowPill>
        <h1 className="display" style={{
          fontSize: 36,
          color: 'var(--c-ink)',
          margin: '14px 0 12px',
          letterSpacing: 0.5,
        }}>
          Quesos<br/>artesanos<br/>de barrio.
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color:'var(--c-vino)', margin:'0 0 18px', maxWidth: 320 }}>
          Una selección mensual de pequeños productores españoles. Tablas para llevar y catas en barra en Salamanca, Madrid.
        </p>
        <div style={{ display:'flex', gap: 8, marginBottom: 22 }}>
          <a className="btn btn--primary" style={{ flex: 1 }}>Ver catálogo</a>
          <a className="btn btn--outline" style={{ flex: 1 }}>Eventos</a>
        </div>
        <Photo ratio="16/10" src="assets/photo-eventos-hero.jpg" label="HERO · barra crudo · 16:10" style={{ borderRadius: 6, marginBottom: 4 }} />
      </div>

      {/* Próximos eventos */}
      <div style={{ padding:'40px 22px 12px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <EyebrowLine>Próximos eventos</EyebrowLine>
          <a style={{ fontSize: 12.5, color:'var(--c-vino)', fontWeight: 600 }}>Agenda →</a>
        </div>
        <div className="card" style={{ padding: 16, marginBottom: 10 }}>
          <div style={{ display:'flex', gap: 14, alignItems:'center' }}>
            <div style={{ width: 56, textAlign:'center', flexShrink: 0 }}>
              <div className="display" style={{ fontSize: 22, color:'var(--c-terra)', lineHeight: 1 }}>29</div>
              <div className="eyebrow-line" style={{ fontSize: 10, marginTop: 2 }}>MAY</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 16, color:'var(--c-ink)', lineHeight: 1.15 }}>Spritz &amp; Cheese with Mikks</div>
              <div style={{ fontSize: 12, color:'var(--c-vino)', marginTop: 4 }}>Viernes · 19:00 · 17 €</div>
            </div>
            <span style={{ color:'var(--c-coral)', fontSize: 18 }}>→</span>
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display:'flex', gap: 14, alignItems:'center' }}>
            <div style={{ width: 56, textAlign:'center', flexShrink: 0 }}>
              <div className="display" style={{ fontSize: 22, color:'var(--c-terra)', lineHeight: 1 }}>06</div>
              <div className="eyebrow-line" style={{ fontSize: 10, marginTop: 2 }}>JUN</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 16, color:'var(--c-ink)', lineHeight: 1.15 }}>Bodegas Telperion at Crudo</div>
              <div style={{ fontSize: 12, color:'var(--c-vino)', marginTop: 4 }}>Viernes · 19:30 · 25 €</div>
            </div>
            <span style={{ color:'var(--c-coral)', fontSize: 18 }}>→</span>
          </div>
        </div>
      </div>

      {/* Quesos de temporada */}
      <div style={{ padding:'32px 22px 12px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <div>
            <EyebrowLine>Esta temporada · Mayo</EyebrowLine>
            <h2 className="display" style={{ fontSize: 26, color:'var(--c-ink)', margin:'6px 0 0' }}>Quesos del mes</h2>
          </div>
          <a style={{ fontSize: 12.5, color:'var(--c-vino)', fontWeight: 600 }}>Ver 14 →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <CheeseCard name="Idiazábal" region="País Vasco · DOP" price="6,80" tag="cream" tagLabel="Oveja" />
          <CheeseCard name="Garrotxa" region="Catalunya · cabra" price="5,40" tag="coral-soft" tagLabel="Cabra" />
          <CheeseCard name="Torta Casar" region="Extremadura · DOP" price="9,20" tag="cream" tagLabel="Oveja" />
          <CheeseCard name="Cabrales" region="Asturias · azul" price="8,40" tag="petrol" tagLabel="Azul" />
        </div>
      </div>

      {/* Categorías chips */}
      <div style={{ padding:'24px 22px 0' }}>
        <EyebrowLine>Categorías</EyebrowLine>
      </div>
      <div style={{ padding:'12px 22px 24px', display:'flex', flexWrap:'wrap', gap: 8 }}>
        {['Oveja','Cabra','Vaca','Mixto','Azul','Leche cruda','DOP','Madurado','Frescos'].map(c => (
          <span key={c} className="tag tag--vino-out" style={{ padding:'8px 14px', fontSize: 11.5 }}>{c}</span>
        ))}
      </div>

      {/* Visita */}
      <div style={{ background: 'var(--c-bone-soft)', padding:'32px 22px 36px' }}>
        <EyebrowLine>Visítanos</EyebrowLine>
        <h2 className="display" style={{ fontSize: 26, color:'var(--c-ink)', margin:'6px 0 12px' }}>Calle Ortega y Gasset 81</h2>
        <Photo ratio="16/9" label="MAPA · Salamanca, Madrid" style={{ borderRadius: 6, marginBottom: 14, height: 160 }} />
        <div style={{ fontSize: 13.5, color:'var(--c-vino)', lineHeight: 1.7, marginBottom: 16 }}>
          <strong style={{ color:'var(--c-ink)' }}>Lun–Vie</strong> 17:30 — 22:30<br/>
          <strong style={{ color:'var(--c-ink)' }}>Sábado</strong> 12:30 — 22:00<br/>
          <strong style={{ color:'var(--c-ink)' }}>Domingo</strong> 12:30 — 20:00
        </div>
        <a className="btn btn--primary btn--block btn--lg">Cómo llegar</a>
      </div>

      {/* Spacer for sticky cta */}
      <div style={{ height: 80 }}></div>

      <StickyMobileCTA primary="Reservar mesa" />
    </Phone>
  );
}

function CheeseCard({ name, region, price, tag = 'cream', tagLabel = 'Oveja' }) {
  return (
    <div className="card" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', aspectRatio:'1' }}>
        <Photo src="assets/photo-cheese-card.jpg" style={{ width:'100%', height:'100%' }} label="queso · 1:1" />
        <span className={'tag tag--' + tag} style={{ position:'absolute', top: 8, left: 8 }}>{tagLabel}</span>
      </div>
      <div style={{ padding:'12px 13px 14px' }}>
        <div className="eyebrow-line" style={{ fontSize: 9.5, color:'var(--c-vino)', opacity: 0.78, marginBottom: 5 }}>{region}</div>
        <div className="display" style={{ fontSize: 16, color:'var(--c-ink)', marginBottom: 10, letterSpacing: 0.5 }}>{name}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <PriceMono value={price} unit="/100g" size={13} />
          <button style={{
            width: 26, height: 26, borderRadius: '50%',
            background:'var(--c-coral)', color:'#fff', border:0, fontSize: 14,
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 2 · EVENTOS (mobile)
// ============================================================

function EventosMobile() {
  return (
    <Phone>
      <MobileNav active="Eventos" />

      {/* Hero — bone cream, eyebrow + Cinzel headline ink + foto banner */}
      <div style={{ padding:'24px 22px 18px' }}>
        <EyebrowPill>Eventos</EyebrowPill>
        <h1 className="display" style={{ fontSize: 32, color:'var(--c-ink)', margin:'14px 0 12px', letterSpacing: 0.5 }}>
          Catas, talleres<br/>y bodegas<br/>invitadas.
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color:'var(--c-vino)', margin:'0 0 16px', maxWidth: 320 }}>
          Eventos pequeños alrededor de la barra. Reserva online y paga en CRUDO al llegar.
        </p>
        <Photo ratio="16/9" src="assets/photo-home-hero.jpg" label="HERO · servicio en barra · 16:9" style={{ borderRadius: 6 }} />
      </div>

      {/* Próximos eventos */}
      <div style={{ padding:'28px 22px 10px' }}>
        <EyebrowLine>Mayo y Junio 2026</EyebrowLine>
        <h2 className="display" style={{ fontSize: 22, color:'var(--c-ink)', margin:'8px 0 18px' }}>Agenda</h2>

        <EventCard
          dateD="29" dateM="MAY" day="Viernes" time="19:00"
          title="Spritz &amp; Cheese with Mikks"
          desc="Una tarde con Mikks en la barra: spritz de vermut blanco artesano y un quesito."
          price="17 €" plazas="25 plazas · 15 + 10"
          tag={{ tone:'coral-soft', label:'Cata · 2h' }}
        />
        <EventCard
          dateD="30" dateM="MAY" day="Sábado" time="12:30"
          title="Spritz, Lemonade &amp; Grilled Cheese"
          desc="Brunch en barra. Grilled cheese y bebida desde 10 €."
          price="desde 10 €" plazas="Sin reserva"
          tag={{ tone:'cream', label:'Brunch' }}
        />
        <EventCard
          dateD="06" dateM="JUN" day="Viernes" time="19:30"
          title="Bodegas Telperion at CRUDO"
          desc="Cata maridada con los vinos de Telperion. 5 quesos, 4 vinos."
          price="25 €" plazas="15 plazas"
          tag={{ tone:'petrol', label:'Cata maridaje' }}
        />
        <EventCard
          dateD="14" dateM="JUN" day="Sábado" time="11:00"
          title="Taller de cortes &amp; degustación"
          desc="Aprende a cortar cada tipo de pasta. Práctica + degustación con vino."
          price="35 €" plazas="10 plazas"
          tag={{ tone:'terra', label:'Taller' }}
        />
      </div>

      {/* Privatizaciones */}
      <div style={{ background: 'var(--c-coral-soft)', padding:'40px 22px 36px', marginTop: 16 }}>
        <EyebrowPill>Privatizaciones</EyebrowPill>
        <h2 className="display" style={{ fontSize: 28, color:'var(--c-ink)', margin:'14px 0 12px', letterSpacing: 0.5 }}>
          Si tienes un evento<br/>y quieres hacerlo<br/>en CRUDO, escríbenos.
        </h2>
        <p style={{ fontSize: 13.5, color:'#5b1f37', lineHeight: 1.6, marginBottom: 18 }}>
          Cumpleaños, reuniones de empresa, despedidas. Cerramos el local para grupos de 10 a 30 personas. Te respondemos por WhatsApp en menos de 24 h.
        </p>
        <a className="btn btn--ink btn--block btn--lg">Pedir presupuesto</a>
        <a className="btn btn--whatsapp btn--block" style={{ marginTop: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.71a9.94 9.94 0 0 0 5.79 1.59h.01c5.46 0 9.91-4.45 9.91-9.97 0-2.66-1.03-5.16-2.91-7.04A9.81 9.81 0 0 0 12.04 2z"/></svg>
          WhatsApp directo
        </a>
      </div>

      <div style={{ height: 80 }}></div>
      <StickyMobileCTA primary="Reservar plaza" />
    </Phone>
  );
}

function EventCard({ dateD, dateM, day, time, title, desc, price, plazas, tag }) {
  return (
    <div className="card" style={{ padding: 18, marginBottom: 12 }}>
      <div style={{ display:'flex', gap: 16 }}>
        <div style={{
          width: 64, flexShrink: 0,
          background:'var(--c-bone-soft)',
          borderRadius: 4,
          padding:'10px 0',
          textAlign:'center',
          border:'1px solid var(--c-vino-line)',
          height: 'fit-content',
        }}>
          <div className="display" style={{ fontSize: 26, color:'var(--c-terra)', lineHeight: 1 }}>{dateD}</div>
          <div className="eyebrow-line" style={{ fontSize: 10, marginTop: 4 }}>{dateM}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display:'flex', gap: 6, marginBottom: 8 }}>
            <span className={'tag tag--' + tag.tone}>{tag.label}</span>
          </div>
          <h3 className="display" style={{ fontSize: 18, color:'var(--c-ink)', margin:'0 0 6px', letterSpacing: 0.3, lineHeight: 1.15 }} dangerouslySetInnerHTML={{__html: title}} />
          <div style={{ fontSize: 12, color:'var(--c-vino)', marginBottom: 8 }}>{day} · {time}</div>
          <p style={{ fontSize: 13, color:'#3a3530', lineHeight: 1.5, margin: 0 }}>{desc}</p>
        </div>
      </div>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        marginTop: 14, paddingTop: 12, borderTop:'1px solid var(--c-vino-line)',
      }}>
        <div>
          <div className="mono" style={{ fontSize: 15, color:'var(--c-ink)', fontWeight: 500 }}>{price}</div>
          <div style={{ fontSize: 11, color:'var(--c-vino)', marginTop: 2 }}>{plazas}</div>
        </div>
        <a className="btn btn--primary btn--sm">Reservar</a>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 3 · CATÁLOGO (mobile)
// ============================================================

function CatalogoMobile() {
  const filters = ['Todos','Oveja','Cabra','Vaca','Mixto','Azul','Cruda'];
  const [active, setActive] = React.useState('Todos');

  const cheeses = [
    { name:'Idiazábal', region:'País Vasco · DOP', price:'6,80', tag:'cream', tagLabel:'Oveja' },
    { name:'Garrotxa', region:'Catalunya · cabra', price:'5,40', tag:'coral-soft', tagLabel:'Cabra' },
    { name:'Torta Casar', region:'Extremadura · DOP', price:'9,20', tag:'cream', tagLabel:'Oveja' },
    { name:'Roncal', region:'Navarra · DOP', price:'7,40', tag:'cream', tagLabel:'Oveja' },
    { name:'Manchego', region:'La Mancha · DOP', price:'6,20', tag:'cream', tagLabel:'Oveja' },
    { name:'Tetilla', region:'Galicia · DOP', price:'4,80', tag:'terra', tagLabel:'Vaca' },
    { name:'Mahón', region:'Menorca · DOP', price:'5,90', tag:'terra', tagLabel:'Vaca' },
    { name:'Cabrales', region:'Asturias · azul', price:'8,40', tag:'petrol', tagLabel:'Azul' },
  ];

  return (
    <Phone>
      <MobileNav active="Catálogo" />

      <div style={{ padding:'24px 22px 8px' }}>
        <EyebrowLine>Catálogo · Mayo 2026</EyebrowLine>
        <h1 className="display" style={{ fontSize: 32, color:'var(--c-ink)', margin:'8px 0 8px', letterSpacing: 0.5 }}>
          14 quesos<br/>en tienda
        </h1>
        <p style={{ fontSize: 13.5, color:'var(--c-vino)', lineHeight: 1.55, marginBottom: 14 }}>
          Rotamos selección cada mes con productores artesanos españoles. Se cortan al peso en tienda.
        </p>
      </div>

      {/* Filtros */}
      <div style={{ padding:'8px 22px 14px', display:'flex', gap: 6, overflowX:'auto' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              flexShrink: 0,
              padding:'9px 16px',
              borderRadius: 999,
              fontSize: 12.5, fontWeight: 600,
              color: active === f ? '#fff' : 'var(--c-ink)',
              background: active === f ? 'var(--c-vino)' : 'transparent',
              border: '1px solid ' + (active === f ? 'var(--c-vino)' : 'var(--c-vino-line-2)'),
              cursor:'pointer',
              fontFamily:'var(--f-body)',
              whiteSpace:'nowrap',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Sort row */}
      <div style={{ padding:'4px 22px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize: 12, color:'var(--c-vino)' }}>14 quesos</span>
        <button style={{ background:'transparent', border:0, fontSize: 12.5, color:'var(--c-vino)', fontWeight: 600, cursor:'pointer' }}>
          Ordenar: Recomendado ▾
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding:'0 22px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {cheeses.map(c => <CheeseCard key={c.name} {...c} />)}
        </div>
      </div>

      {/* CTA inline */}
      <div style={{ padding:'12px 22px 36px' }}>
        <div className="card" style={{ padding: 20, background:'var(--c-cream)', border:'1px solid rgba(255,200,100,0.5)' }}>
          <EyebrowLine style={{ color:'var(--c-terra)' }}>¿No sabes cuál llevar?</EyebrowLine>
          <h3 className="display" style={{ fontSize: 20, color:'var(--c-ink)', margin:'8px 0 10px' }}>
            Te lo elegimos.
          </h3>
          <p style={{ fontSize: 13, color:'#5b3a0e', lineHeight: 1.55, marginBottom: 14 }}>
            Cuéntanos cuántos sois y qué os gusta y te montamos una tabla con los quesos del mes.
          </p>
          <a className="btn btn--ink btn--block">Pedir selección por WhatsApp</a>
        </div>
      </div>

      <div style={{ height: 80 }}></div>
      <StickyMobileCTA primary="Mi tabla · 0" />
    </Phone>
  );
}

// ============================================================
// SCREEN 4 · CONTACTO (mobile)
// ============================================================

function ContactoMobile() {
  return (
    <Phone>
      <MobileNav active="Contacto" />

      {/* Mapa hero */}
      <div style={{
        position:'relative',
        height: 240,
        background:
          'linear-gradient(160deg, #efe8d6 0%, #e8dec8 60%, #d8c8a8 100%)',
        borderBottom:'1px solid var(--c-vino-line)',
      }}>
        {/* Stylized streets */}
        <svg width="100%" height="100%" viewBox="0 0 400 240" style={{ position:'absolute', inset: 0 }}>
          <g stroke="rgba(108,64,80,0.20)" strokeWidth="2" fill="none">
            <path d="M-10,60 L410,80" />
            <path d="M-10,140 L410,160" />
            <path d="M80,-10 L100,250" />
            <path d="M220,-10 L240,250" />
            <path d="M320,-10 L340,250" />
          </g>
          <g stroke="rgba(108,64,80,0.10)" strokeWidth="1" fill="none">
            <path d="M-10,30 L410,40" />
            <path d="M-10,200 L410,220" />
            <path d="M160,-10 L170,250" />
          </g>
        </svg>
        {/* Pin */}
        <div style={{
          position:'absolute', top: '46%', left: '50%', transform:'translate(-50%,-100%)',
          display:'flex', flexDirection:'column', alignItems:'center',
        }}>
          <div style={{
            background:'var(--c-coral)', color:'#fff',
            padding:'8px 14px', borderRadius: 4,
            fontFamily:'var(--f-display)', fontWeight: 800, fontSize: 12,
            letterSpacing:'0.08em', textTransform:'uppercase',
            boxShadow:'0 6px 16px rgba(238,118,156,0.45)',
          }}>CRUDO</div>
          <div style={{
            width: 0, height: 0,
            borderLeft:'7px solid transparent',
            borderRight:'7px solid transparent',
            borderTop:'10px solid var(--c-coral)',
          }} />
          <div style={{
            width: 14, height: 14, borderRadius:'50%',
            background:'var(--c-coral)', marginTop:-2,
            boxShadow:'0 0 0 4px rgba(238,118,156,0.25)',
          }} />
        </div>
      </div>

      <div style={{ padding:'24px 22px 10px' }}>
        <EyebrowLine>Contacto</EyebrowLine>
        <h1 className="display" style={{ fontSize: 30, color:'var(--c-ink)', margin:'8px 0 14px', letterSpacing: 0.5 }}>
          Pásate o<br/>escríbenos.
        </h1>

        {/* Quick actions */}
        <a className="btn btn--whatsapp btn--block btn--lg" style={{ marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.71a9.94 9.94 0 0 0 5.79 1.59h.01c5.46 0 9.91-4.45 9.91-9.97 0-2.66-1.03-5.16-2.91-7.04A9.81 9.81 0 0 0 12.04 2zm0 18.14h-.01a8.16 8.16 0 0 1-4.15-1.14l-.3-.18-3.07 1.04 1.05-3-.2-.32a8.18 8.18 0 0 1-1.25-4.33c0-4.51 3.68-8.18 8.2-8.18 2.19 0 4.24.85 5.79 2.4a8.15 8.15 0 0 1 2.4 5.78c0 4.51-3.68 8.18-8.2 8.18z"/></svg>
          WhatsApp · +34 6XX XXX XXX
        </a>
        <a className="btn btn--outline btn--block" style={{ marginBottom: 16 }}>hola@crudoquesos.es</a>
      </div>

      {/* Horario card */}
      <div style={{ padding:'8px 22px 18px' }}>
        <div className="card" style={{ padding: 18 }}>
          <EyebrowLine>Horario</EyebrowLine>
          <div style={{ marginTop: 12, display:'grid', gridTemplateColumns:'1fr auto', rowGap: 10, columnGap: 10, fontSize: 13.5 }}>
            <span style={{ color:'var(--c-ink)', fontWeight: 600 }}>Lunes — Viernes</span><span className="mono" style={{ color:'var(--c-vino)' }}>17:30 — 22:30</span>
            <span style={{ color:'var(--c-ink)', fontWeight: 600 }}>Sábado</span><span className="mono" style={{ color:'var(--c-vino)' }}>12:30 — 22:00</span>
            <span style={{ color:'var(--c-ink)', fontWeight: 600 }}>Domingo</span><span className="mono" style={{ color:'var(--c-vino)' }}>12:30 — 20:00</span>
          </div>
          <hr className="hr-vino" style={{ margin:'14px 0' }} />
          <EyebrowLine>Dirección</EyebrowLine>
          <p style={{ fontFamily:'var(--f-display)', fontWeight: 600, fontSize: 16, color:'var(--c-ink)', margin:'8px 0 4px', letterSpacing: 0.3 }}>
            Calle Ortega y Gasset 81
          </p>
          <p style={{ fontSize: 13, color:'var(--c-vino)', margin: 0 }}>28006 Madrid · Salamanca</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding:'12px 22px 32px' }}>
        <EyebrowLine>O escríbenos por aquí</EyebrowLine>
        <h2 className="display" style={{ fontSize: 22, color:'var(--c-ink)', margin:'10px 0 16px' }}>Formulario</h2>
        <div style={{ display:'grid', gap: 12 }}>
          <Field label="Nombre" placeholder="Lara Martín" />
          <Field label="Email" placeholder="tu@correo.com" />
          <Field label="Asunto" placeholder="Mayoristas · Privatización · Otro" select />
          <Field label="Cuéntanos" placeholder="¿En qué te ayudamos?" textarea />
        </div>
        <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 16 }}>Enviar consulta</button>
        <p style={{ fontSize: 11.5, color:'var(--c-vino)', marginTop: 10, textAlign:'center' }}>
          Te respondemos en menos de 24 h dentro de horario.
        </p>
      </div>

      <div style={{ height: 24 }}></div>
    </Phone>
  );
}

function Field({ label, placeholder, textarea, select }) {
  const base = {
    width:'100%',
    background:'#fff',
    border:'1px solid var(--c-vino-line)',
    borderRadius: 4,
    padding:'12px 14px',
    fontFamily:'var(--f-body)',
    fontSize: 14,
    color:'var(--c-ink)',
    outline:'none',
  };
  return (
    <label style={{ display:'block' }}>
      <span style={{
        display:'block',
        fontSize: 11,
        letterSpacing:'0.16em',
        textTransform:'uppercase',
        color:'var(--c-vino)',
        fontWeight: 600,
        marginBottom: 6,
      }}>{label}</span>
      {textarea ? (
        <textarea placeholder={placeholder} rows="3" style={{ ...base, resize:'vertical', minHeight: 80 }} />
      ) : select ? (
        <div style={{ position:'relative' }}>
          <input placeholder={placeholder} style={base} />
          <span style={{ position:'absolute', right: 14, top: '50%', transform:'translateY(-50%)', color:'var(--c-vino)' }}>▾</span>
        </div>
      ) : (
        <input placeholder={placeholder} style={base} />
      )}
    </label>
  );
}

// ============================================================
// SCREEN 5 · HOME DESKTOP
// ============================================================

function HomeDesktop() {
  return (
    <Browser url="crudoquesos.es">
      {/* Top nav */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 56px',
        background:'var(--c-bone)',
        borderBottom:'1px solid var(--c-vino-line)',
      }}>
        <WordmarkInline size={36} />
        <nav style={{ display:'flex', gap: 40 }}>
          <a className="nav-link active">Eventos</a>
          <a className="nav-link">Catálogo</a>
          <a className="nav-link">Contacto</a>
        </nav>
        <a className="btn btn--whatsapp btn--sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.71a9.94 9.94 0 0 0 5.79 1.59h.01c5.46 0 9.91-4.45 9.91-9.97 0-2.66-1.03-5.16-2.91-7.04A9.81 9.81 0 0 0 12.04 2z"/></svg>
          WhatsApp
        </a>
      </div>

      {/* Hero — bone cream, text + foto en 2 columnas */}
      <div style={{
        background:'var(--c-bone)',
        padding:'72px 80px 80px',
        display:'grid',
        gridTemplateColumns:'1.05fr 1fr',
        gap: 56,
        alignItems:'center',
        borderBottom:'1px solid var(--c-vino-line)',
      }}>
        <div>
          <div style={{ marginBottom: 22 }}>
            <EyebrowPill>Tienda de quesos · Madrid</EyebrowPill>
          </div>
          <h1 className="display" style={{ color:'var(--c-ink)', fontSize: 76, margin: 0, letterSpacing: 1, lineHeight: 0.98 }}>
            Quesos<br/>artesanos<br/>de barrio.
          </h1>
          <p style={{ color:'var(--c-vino)', fontSize: 17, lineHeight: 1.6, marginTop: 22, maxWidth: 480 }}>
            Una selección mensual de pequeños productores españoles. Tablas para llevar y catas en barra en Salamanca, Madrid.
          </p>
          <div style={{ display:'flex', gap: 10, marginTop: 28 }}>
            <a className="btn btn--primary btn--lg">Ver catálogo</a>
            <a className="btn btn--outline btn--lg">Próximos eventos</a>
          </div>
        </div>
        <Photo ratio="4/5" src="assets/photo-eventos-hero.jpg" label="HERO · 4:5 · cheese plate / barra" style={{ borderRadius: 8, width:'100%' }} />
      </div>

      {/* Quesos del mes */}
      <div style={{ padding:'56px 80px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 24 }}>
          <div>
            <EyebrowLine>Esta temporada · Mayo 2026</EyebrowLine>
            <h2 className="display" style={{ fontSize: 38, color:'var(--c-ink)', margin:'8px 0 0', letterSpacing: 0.5 }}>Quesos del mes</h2>
          </div>
          <a className="btn btn--outline btn--sm">Ver los 14 →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          <CheeseCardLg name="Idiazábal" region="País Vasco · DOP" price="6,80" tag="cream" tagLabel="Oveja" />
          <CheeseCardLg name="Garrotxa" region="Catalunya · cabra" price="5,40" tag="coral-soft" tagLabel="Cabra" />
          <CheeseCardLg name="Torta Casar" region="Extremadura · DOP" price="9,20" tag="cream" tagLabel="Oveja" />
          <CheeseCardLg name="Cabrales" region="Asturias · azul" price="8,40" tag="petrol" tagLabel="Azul" />
        </div>
      </div>
    </Browser>
  );
}

function CheeseCardLg({ name, region, price, tag, tagLabel }) {
  return (
    <div className="card" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', aspectRatio:'1' }}>
        <Photo src="assets/photo-cheese-card.jpg" style={{ width:'100%', height:'100%' }} label="queso · 1:1" />
        <span className={'tag tag--' + tag} style={{ position:'absolute', top: 12, left: 12 }}>{tagLabel}</span>
      </div>
      <div style={{ padding:'18px 18px 20px' }}>
        <div className="eyebrow-line" style={{ fontSize: 10.5, color:'var(--c-vino)', opacity: 0.8, marginBottom: 8 }}>{region}</div>
        <div className="display" style={{ fontSize: 22, color:'var(--c-ink)', marginBottom: 12, letterSpacing: 0.5 }}>{name}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <PriceMono value={price} unit="/100g" size={15} />
          <button style={{
            padding:'8px 14px', background:'var(--c-coral)', color:'#fff', border:0,
            borderRadius: 4, fontSize: 12, fontWeight: 600, cursor:'pointer',
          }}>Añadir +</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CANVAS
// ============================================================

function App() {
  return (
    <DesignCanvas>
      <DCSection
        id="intro"
        title="CRUDO · Rediseño visual"
        subtitle="Manual Piscolabis aplicado · Cinzel + Barlow · bone cream · coral CTAs · vino borders"
      >
        <DCArtboard id="palette" label="Sistema visual" width={520} height={520}>
          <SystemSummary />
        </DCArtboard>
      </DCSection>

      <DCSection id="mobile" title="Móvil · 4 pantallas" subtitle="iPhone · 390 × 844">
        <DCArtboard id="home-m" label="Home" width={410} height={864}><HomeMobile /></DCArtboard>
        <DCArtboard id="eventos-m" label="Eventos" width={410} height={864}><EventosMobile /></DCArtboard>
        <DCArtboard id="catalogo-m" label="Catálogo" width={410} height={864}><CatalogoMobile /></DCArtboard>
        <DCArtboard id="contacto-m" label="Contacto" width={410} height={864}><ContactoMobile /></DCArtboard>
      </DCSection>

      <DCSection id="desktop" title="Desktop · Home" subtitle="1280 × 800 · nav limpio · 3 items + WhatsApp">
        <DCArtboard id="home-d" label="Home desktop" width={1296} height={836}><HomeDesktop /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ---------- System summary card ----------
function SystemSummary() {
  const swatches = [
    { h:'#F6F1E4', n:'Bone · fondo' },
    { h:'#FFFFFF', n:'Blanco · cards' },
    { h:'#EE769C', n:'Coral · CTA' },
    { h:'#6C4050', n:'Vino · texto/borde' },
    { h:'#A71E17', n:'Terracota · eyebrow' },
    { h:'#F6B6C8', n:'Rosa suave' },
    { h:'#FEDB9A', n:'Crema · highlight' },
    { h:'#447A96', n:'Petrol · info' },
    { h:'#1A1F14', n:'Tinta · texto principal' },
  ];
  return (
    <div style={{
      background:'var(--c-bone)', padding: 28, height:'100%',
      fontFamily:'var(--f-body)', color:'var(--c-ink)', overflow:'auto',
    }}>
      <Wordmark size={64} />
      <h2 className="display" style={{ fontSize: 26, margin:'18px 0 4px', letterSpacing: 0.5 }}>Sistema visual</h2>
      <p style={{ fontSize: 12.5, color:'var(--c-vino)', marginTop: 0 }}>
        Manual Piscolabis · aplicado al frontend
      </p>

      <hr className="hr-vino" style={{ margin:'16px 0' }} />

      <div className="eyebrow-line" style={{ marginBottom: 10 }}>Paleta</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
        {swatches.map(s => (
          <div key={s.h} style={{ display:'flex', flexDirection:'column', gap: 4 }}>
            <div style={{ background: s.h, height: 44, borderRadius: 4, border:'1px solid var(--c-vino-line)' }}/>
            <div className="mono" style={{ fontSize: 9.5, color:'var(--c-vino)' }}>{s.h}</div>
            <div style={{ fontSize: 10.5, color:'var(--c-ink)' }}>{s.n}</div>
          </div>
        ))}
      </div>

      <div className="eyebrow-line" style={{ marginBottom: 8 }}>Tipografía</div>
      <div style={{ marginBottom: 4 }}>
        <span className="display" style={{ fontSize: 26, letterSpacing: 0.5 }}>CINZEL · 700</span>
        <span style={{ fontSize: 11, color:'var(--c-vino)', marginLeft: 8 }}>display, siempre uppercase</span>
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontFamily:'var(--f-body)', fontSize: 16, fontWeight: 500 }}>Barlow · cuerpo y UI</span>
        <span style={{ fontSize: 11, color:'var(--c-vino)', marginLeft: 8 }}>300 — 600</span>
      </div>
      <div>
        <span className="mono" style={{ fontSize: 14 }}>JetBrains Mono · 6,80 €</span>
        <span style={{ fontSize: 11, color:'var(--c-vino)', marginLeft: 8 }}>solo precios</span>
      </div>

      <hr className="hr-vino" style={{ margin:'16px 0' }} />

      <div className="eyebrow-line" style={{ marginBottom: 8 }}>Componentes clave</div>
      <div style={{ display:'flex', gap: 8, flexWrap:'wrap', marginBottom: 12 }}>
        <button className="btn btn--primary btn--sm">CTA Coral</button>
        <button className="btn btn--outline btn--sm">Outline Vino</button>
        <button className="btn btn--ink btn--sm">Ink</button>
        <button className="btn btn--whatsapp btn--sm">WhatsApp</button>
      </div>
      <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
        <EyebrowPill>Eyebrow Terracota</EyebrowPill>
        <span className="tag tag--coral-soft">Rosa suave</span>
        <span className="tag tag--cream">Crema</span>
        <span className="tag tag--petrol">Petrol</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
