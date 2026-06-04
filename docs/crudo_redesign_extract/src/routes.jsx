// Mobile mockups for the remaining V1 routes. One direction each.

function CatalogoTemporada() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'18px 22px 10px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 8 }}>Esta temporada · Mayo 2026</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, lineHeight: 1.0, color: C.textPrimary, margin: 0 }}>14 quesos para este mes</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 12 }}>Rotamos seleccion cada mes con productores artesanos espanoles. Se cortan al peso en tienda.</p>
      </div>
      <div style={{ background: C.bgSecondary, padding:'14px 22px', display:'flex', gap: 8, overflowX:'auto' }}>
        <Filter active>Todos</Filter><Filter>Vaca</Filter><Filter>Oveja</Filter><Filter>Cabra</Filter><Filter>Mixta</Filter><Filter>Cruda</Filter>
      </div>
      <div style={{ background: C.bgPrimary, padding:'18px 22px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <ProductCard name="Idiazabal" region="Pais Vasco · DOP" price="6,80" />
          <ProductCard name="Garrotxa" region="Catalunya · cabra" price="5,40" stock="low" />
          <ProductCard name="Torta Casar" region="Extremadura · DOP" price="9,20" />
          <ProductCard name="Roncal" region="Navarra · DOP" price="7,40" />
          <ProductCard name="Manchego curado" region="La Mancha · DOP" price="6,20" />
          <ProductCard name="Tetilla" region="Galicia · DOP" price="4,80" />
          <ProductCard name="Mahon" region="Menorca · DOP" price="5,90" />
          <ProductCard name="Cabrales" region="Asturias · azul" price="8,40" stock="out" />
        </div>
      </div>
      <Footer /><StickyCta count={2} />
    </Mobile>
  );
}

function Filter({ children, active }) {
  return <span style={{ flexShrink: 0, padding:'8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, color: active ? C.bgPrimary : C.textSecondary, background: active ? C.gold : 'transparent', border: `1px solid ${active ? C.gold : C.line}`, whiteSpace:'nowrap' }}>{children}</span>;
}

function CatalogoTablas() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'18px 22px 8px' }}>
        <Eyebrow color={C.gold} style={{ marginBottom: 8 }}>Tablas y cajas · Pickup en tienda</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 38, lineHeight: 1.0, color: C.textPrimary, margin:'0 0 12px' }}>Tres tamanos.<br/>Mismo cuidado.</h1>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>Curacion semanal del owner. Variantes opcionales con maridaje de vino blanco o tinto, gestionadas por WhatsApp.</p>
      </div>
      <div style={{ background: C.bgPrimary, padding:'18px 22px 24px', display:'grid', gap: 14 }}>
        <TablaCard size="3 quesos" subtitle="Tabla pequena · 2 personas" priceFrom="22" />
        <TablaCard size="6 quesos" subtitle="Tabla mediana · 4 personas" priceFrom="38" />
        <TablaCard size="8 quesos" subtitle="Tabla grande · 6 personas" priceFrom="52" />
      </div>
      <Footer /><StickyCta count={0} />
    </Mobile>
  );
}

function ProductoPDP() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary }}>
        <div style={{ padding:'14px 22px 6px', fontSize: 11, color: C.textMuted }}>Esta temporada / <span style={{ color: C.textPrimary }}>Idiazabal</span></div>
        <Photo label="queso · 1:1" ratio="1" />
        <div style={{ padding:'20px 22px' }}>
          <Eyebrow color={C.gold}>Pais Vasco · DOP</Eyebrow>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 38, color: C.textPrimary, margin:'8px 0 8px' }}>Idiazabal</h1>
          <div style={{ display:'flex', gap: 6, flexWrap:'wrap', marginBottom: 16 }}>
            <span className="tag tag--neutral">Oveja latxa</span>
            <span className="tag tag--neutral">Leche cruda</span>
            <span className="tag tag--neutral">Curado 6 meses</span>
            <span className="tag tag--terracotta">Intensidad media</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: C.textSecondary }}>De los rebanos de Aralar. Pasta prensada, corteza natural cepillada, retrogusto ligeramente ahumado. Casa con txakoli, sidra natural o un blanco atlantico.</p>
          <div style={{ marginTop: 18, display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
            <span className="mono" style={{ fontSize: 28, color: C.textPrimary }}>6,80 €</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>/ 100 g</span>
          </div>
          <div style={{ marginTop: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ display:'flex', alignItems:'center', border:`1px solid ${C.line}`, borderRadius: 2 }}>
              <button style={{ padding:'10px 14px', background:'transparent', color: C.textPrimary, border:0 }}>−</button>
              <span style={{ padding:'0 12px', color: C.textPrimary, fontFamily:'var(--font-mono)' }}>200 g</span>
              <button style={{ padding:'10px 14px', background:'transparent', color: C.textPrimary, border:0 }}>+</button>
            </div>
            <button className="btn btn--primary" style={{ flex: 1 }}>Anadir a Mi tabla</button>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign:'center' }}>Te confirmamos por WhatsApp en menos de 24 h.</p>
        </div>
      </div>
      <Footer /><StickyCta count={3} />
    </Mobile>
  );
}

function Eventos() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px 10px' }}>
        <Eyebrow color={C.gold}>Agenda · Mayo y junio</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 36, color: C.textPrimary, margin:'8px 0 0' }}>Eventos en CRUDO</h1>
      </div>
      <div style={{ background: C.bgPrimary, padding:'4px 22px 24px' }}>
        <EventCard date="29 MAY" title="Spritz and Cheese with Mikks" meta="Viernes · 19:00 · 17 € · 25 plazas" />
        <EventCard date="30 MAY" title="Spritz, Lemonade and Grilled Cheese with Mikks" meta="Sabado · 12:30 · desde 10 €" />
        <EventCard date="06 JUN" title="Bodegas Telperion at CRUDO" meta="Viernes · 19:30 · 25 € · 15 plazas" />
      </div>
      <Footer /><StickyCta count={0} />
    </Mobile>
  );
}

function EventoDetail() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <Photo label="Spritz and Cheese · 16:9" ratio="16/9" />
      <div style={{ background: C.bgPrimary, padding:'22px 22px 24px' }}>
        <Eyebrow color={C.gold}>29 may · viernes · 19:00</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, color: C.textPrimary, margin:'8px 0 14px', lineHeight: 1.05 }}>Spritz and Cheese with Mikks</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary, marginBottom: 16 }}>Una tarde con Mikks en la barra: spritz de vermut blanco artesano y un quesito por 17 €. Terraza para 15, dentro 10.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, padding:'14px 0', borderTop:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}` }}>
          <Meta label="Plazas" value="25 (15 + 10)" />
          <Meta label="Precio" value="17 €" />
          <Meta label="Cuando" value="19:00 – 22:00" />
          <Meta label="Donde" value="CRUDO · Salamanca" />
        </div>
        <a className="btn btn--primary btn--block btn--lg" style={{ marginTop: 18 }}>Reservar plaza</a>
        <a className="btn btn--whatsapp btn--block" style={{ marginTop: 8 }}>◷ Pregunta por WhatsApp</a>
      </div>
      <Footer />
    </Mobile>
  );
}
function Meta({ label, value }) { return <div><div className="eyebrow" style={{ color: C.textMuted, marginBottom: 4 }}>{label}</div><div style={{ fontFamily:'var(--font-display)', fontSize: 18, color: C.textPrimary }}>{value}</div></div>; }

function CelebraConNosotros() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px 24px' }}>
        <Eyebrow color={C.gold}>Privatizaciones · Catas privadas</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 38, color: C.textPrimary, margin:'8px 0 14px', lineHeight: 1.0 }}>Celebra con<br/>nosotros</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary }}>Cumpleanos, reuniones de empresa, despedidas y catas privadas. Cerramos el local para grupos de 10 a 30 personas.</p>
        <Photo label="event · 4:5" ratio="4/5" style={{ marginTop: 16, marginBottom: 16 }} />
        <h2 style={{ fontFamily:'var(--font-display)', fontSize: 22, color: C.textPrimary, margin:'18px 0 8px' }}>Como funciona</h2>
        <ol style={{ fontSize: 13.5, color: C.textSecondary, lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Nos cuentas: dia, numero de personas y tipo de evento.</li>
          <li>Te proponemos formato (cata guiada, tabla libre, grilled cheese show).</li>
          <li>Cerramos detalles y precio por WhatsApp.</li>
        </ol>
        <a className="btn btn--primary btn--block btn--lg" style={{ marginTop: 18 }}>Empezar consulta</a>
        <a className="btn btn--whatsapp btn--block" style={{ marginTop: 8 }}>◷ Hablar por WhatsApp</a>
      </div>
      <Footer />
    </Mobile>
  );
}

function Sobre() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'24px 22px 8px', textAlign:'center' }}>
        <CrudoMark size={96} />
        <Eyebrow color={C.gold} style={{ marginTop: 22 }}>Tienda de quesos · Madrid · Desde 2023</Eyebrow>
      </div>
      <div style={{ background: C.bgPrimary, padding:'20px 22px 24px' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 32, color: C.textPrimary, margin:'18px 0 14px', lineHeight: 1.05 }}>Una seleccion pequena, hecha con cuidado.</h1>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: C.textSecondary, marginBottom: 14 }}>CRUDO es una tienda de quesos artesanos espanoles en Salamanca, Madrid. Trabajamos con productores pequenos, leches crudas siempre que se puede, y rotamos seleccion cada mes.</p>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: C.textSecondary, marginBottom: 14 }}>Hay barra para tomar tabla y vino, hay tablas para llevar a casa, y hay eventos donde el queso es la excusa para juntar gente.</p>
        <Photo label="store · 1:1" ratio="1" style={{ margin:'18px 0' }} />
        <h2 style={{ fontFamily:'var(--font-display)', fontSize: 22, color: C.textPrimary, margin:'4px 0 8px' }}>Lo que hacemos</h2>
        <ul style={{ fontSize: 13.5, color: C.textSecondary, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Quesos al peso, cortados delante.</li>
          <li>Tablas para llevar de 3, 6 u 8 quesos.</li>
          <li>Eventos en barra: spritz, grilled cheese, catas con productores.</li>
          <li>Privatizaciones y catas privadas.</li>
        </ul>
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 18 }}><i>Sin manifesto, sin foto del owner — owner override §0.2.</i></p>
      </div>
      <Footer />
    </Mobile>
  );
}

function Contacto() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px 24px' }}>
        <Eyebrow color={C.gold}>Contacto</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 36, color: C.textPrimary, margin:'8px 0 18px', lineHeight: 1.0 }}>Hablamos.</h1>
        <a className="btn btn--whatsapp btn--block btn--lg" style={{ marginBottom: 8 }}>◷ WhatsApp +34 6XX XXX XXX</a>
        <a className="btn btn--secondary btn--block">hola@crudoquesos.es</a>

        <h2 style={{ fontFamily:'var(--font-display)', fontSize: 20, color: C.textPrimary, margin:'24px 0 10px' }}>Escribenos</h2>
        <div style={{ display:'grid', gap: 12 }}>
          <Field label="Nombre" placeholder="Lara Martin" />
          <Field label="Email" placeholder="tu@correo.com" />
          <Field label="Asunto" placeholder="Mayoristas · Privatizacion · Otro" right="▾" />
          <Field label="Cuentanos" placeholder="¿En que te ayudamos?" textarea />
        </div>
        <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 14 }}>Enviar consulta</button>
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign:'center' }}>Te respondemos en menos de 24 h dentro de horario.</p>
      </div>
      <Footer />
    </Mobile>
  );
}

function Mayoristas() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px 24px' }}>
        <Eyebrow color={C.gold}>HORECA · Tiendas · Caterings</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 34, color: C.textPrimary, margin:'8px 0 14px', lineHeight: 1.0 }}>Mayoristas</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary }}>Trabajamos con restaurantes, vinotecas y caterings que quieren queso espanol artesano y rotacion mensual cuidada. Pedido minimo 200 €.</p>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize: 20, color: C.textPrimary, margin:'22px 0 8px' }}>Pidenos catalogo</h2>
        <div style={{ display:'grid', gap: 12 }}>
          <Field label="Negocio" placeholder="Restaurante / vinoteca / catering" />
          <Field label="Persona de contacto" placeholder="Nombre" />
          <Field label="Email profesional" placeholder="tu@negocio.es" />
          <Field label="Telefono" placeholder="+34" />
          <Field label="¿Que te interesa?" placeholder="DOPs, azules, cabra..." textarea />
        </div>
        <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 14 }}>Pedir catalogo</button>
      </div>
      <Footer />
    </Mobile>
  );
}

function MiTablaDrawer() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px', filter:'brightness(0.6)' }}>
        <Eyebrow color={C.gold}>Esta temporada</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize: 32, color: C.textPrimary, margin:'6px 0 0' }}>14 quesos</h1>
      </div>
      <div style={{ position:'absolute', inset: 0, background:'rgba(0,0,0,0.5)' }}>
        <div style={{ position:'absolute', right: 0, top: 0, bottom: 0, width: '88%', background: C.bgSecondary, padding:'20px 22px 24px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20 }}>
            <Eyebrow color={C.gold}>Mi tabla · 3 articulos</Eyebrow>
            <span style={{ color: C.textPrimary, fontSize: 22 }}>×</span>
          </div>
          <div style={{ flex: 1, display:'grid', gap: 12 }}>
            {[
              { n:'Idiazabal', q:'200 g', p:'13,60' },
              { n:'Garrotxa', q:'150 g', p:'8,10' },
              { n:'Torta del Casar', q:'1 ud', p:'9,20' },
            ].map((i,k)=>(
              <div key={k} style={{ display:'flex', gap: 12, paddingBottom: 12, borderBottom:`1px solid ${C.line}` }}>
                <Photo label="" style={{ width: 56, height: 56, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize: 18, color: C.textPrimary }}>{i.n}</div>
                  <div className="mono" style={{ fontSize: 11, color: C.textMuted }}>{i.q} · {i.p} €</div>
                </div>
                <span style={{ color: C.textMuted, fontSize: 14 }}>×</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.line}`, paddingTop: 14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 12 }}>
              <span style={{ color: C.textSecondary, fontSize: 13 }}>Total</span>
              <span className="mono" style={{ fontSize: 20, color: C.textPrimary }}>30,90 €</span>
            </div>
            <button className="btn btn--primary btn--block btn--lg">Reservar pickup</button>
            <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign:'center' }}>Mi tabla solo permite quesos sin alcohol. El maridaje con vino se cierra por WhatsApp.</p>
          </div>
        </div>
      </div>
    </Mobile>
  );
}

function MiTablaConfirmacion() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'40px 22px 32px', textAlign:'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, border:`1.5px solid ${C.success}`, color: C.success, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize: 24, marginBottom: 18 }}>✓</div>
        <Eyebrow color={C.gold}>Pickup #PIK-26-00041</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 36, color: C.textPrimary, margin:'12px 0 12px', lineHeight: 1.0 }}>Te confirmamos por<br/>WhatsApp en menos<br/>de 24 horas.</h1>
        <p style={{ fontSize: 13.5, color: C.textSecondary, lineHeight: 1.6, maxWidth: '40ch', margin:'0 auto' }}>Hemos recibido tu reserva. El owner te escribe a +34 600 12 34 56 dentro del horario de apertura.</p>
        <div style={{ marginTop: 22, padding: 16, background: C.bgElevated, borderRadius: 4, textAlign:'left' }}>
          <Meta label="Recogida" value="Sab 17 may · 19:30" />
          <div style={{ height: 12 }}></div>
          <Meta label="Donde" value="Ortega y Gasset 81" />
          <div style={{ height: 12 }}></div>
          <Meta label="Total" value="30,90 €" />
        </div>
        <p style={{ fontSize: 11.5, color: C.textMuted, marginTop: 16, lineHeight: 1.55 }}>Si no puedes recoger en persona, escribenos por WhatsApp y te enviamos un link de pago seguro.</p>
      </div>
      <Footer />
    </Mobile>
  );
}

function Legal() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'20px 22px 24px' }}>
        <Eyebrow color={C.gold}>Aviso legal · Privacidad · Cookies</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 30, color: C.textPrimary, margin:'8px 0 16px' }}>Aviso Legal</h1>
        <div style={{ fontSize: 13.5, color: C.textSecondary, lineHeight: 1.7, maxWidth:'72ch' }}>
          <p>En cumplimiento del articulo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Informacion (LSSI-CE):</p>
          <p><b>Razon social:</b> CRUDO QUESOS S.L.U<br/><b>CIF:</b> B-19953694<br/><b>Domicilio:</b> Calle de Jose Ortega y Gasset 81, 28006 Madrid<br/><b>Email:</b> hola@crudoquesos.es</p>
          <p>Las plantillas de Aviso Legal, Privacidad y Cookies se entregan al owner para validacion final. Texto integro pendiente de auditoria.</p>
          <p style={{ color: C.textMuted, fontSize: 11.5 }}><i>Diacritics conservados solo en texto legal donde es preceptivo. UI strings sin acentos.</i></p>
        </div>
      </div>
      <Footer />
    </Mobile>
  );
}

function NotFound() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'80px 22px 32px', textAlign:'center', minHeight: 600 }}>
        <CrudoMark size={120} style={{ opacity: 0.55 }} />
        <Eyebrow color={C.gold} style={{ marginTop: 28 }}>Error 404</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 36, color: C.textPrimary, margin:'12px 0 14px', lineHeight: 1.0 }}>Esta pagina<br/>no existe.</h1>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.55, maxWidth: '36ch', margin:'0 auto 22px' }}>Igual hemos movido el queso. Vuelve al inicio o mira la temporada.</p>
        <button className="btn btn--primary">Volver al inicio</button>
      </div>
      <Footer />
    </Mobile>
  );
}

function PickupPaused() {
  return (
    <Mobile statusBarColor="dark">
      <MobileHeader />
      <div style={{ background: C.bgPrimary, padding:'60px 22px 32px', textAlign:'center', minHeight: 600 }}>
        <Eyebrow color={C.warning}>Pickup pausado · Hoy</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight: 500, fontSize: 32, color: C.textPrimary, margin:'14px 0 14px', lineHeight: 1.05 }}>Hoy no admitimos<br/>mas pickups.</h1>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, maxWidth:'40ch', margin:'0 auto 22px' }}>Estamos al limite de capacidad. Vuelve manana o pasate por la tienda en horario de apertura.</p>
        <a className="btn btn--whatsapp" style={{ marginRight: 8 }}>◷ Pregunta por WhatsApp</a>
        <a className="btn btn--secondary">Ver horario</a>
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 18 }}><i>Estado controlado por kill switch admin · owner override §0.2.</i></p>
      </div>
      <Footer />
    </Mobile>
  );
}

Object.assign(window, { CatalogoTemporada, CatalogoTablas, ProductoPDP, Eventos, EventoDetail, CelebraConNosotros, Sobre, Contacto, Mayoristas, MiTablaDrawer, MiTablaConfirmacion, Legal, NotFound, PickupPaused });
