// Component library artboard. Single dark surface showcasing every
// component the engineer needs. Captures variants, states, anatomy.

function ComponentsArtboard() {
  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, padding: 36, width: 1280, fontFamily:'var(--font-body)' }}>
      <Eyebrow color={C.gold}>Phase 7 · 4 de 7</Eyebrow>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight: 500, fontSize: 32, margin: '6px 0 28px', letterSpacing:'-0.01em' }}>Component library</h2>

      {/* BUTTONS */}
      <Section title="Buttons">
        <div style={{ display:'flex', gap: 14, flexWrap:'wrap', alignItems:'center' }}>
          <button className="btn btn--primary">Reservar pickup</button>
          <button className="btn btn--primary" style={{ background: C.accentHover }}>Hover</button>
          <button className="btn btn--primary" style={{ opacity: 0.5, cursor:'not-allowed' }}>Disabled</button>
          <button className="btn btn--secondary">Ver tablas</button>
          <button className="btn btn--whatsapp">◷ WhatsApp</button>
          <a className="btn btn--ghost" style={{ color: C.accent, textDecoration:'underline', textUnderlineOffset: 4 }}>Ver todos los quesos →</a>
          <button style={{ width: 40, height: 40, borderRadius: 999, border:`1px solid ${C.lineStrong}`, background: 'transparent', color: C.textPrimary, cursor:'pointer' }}>+</button>
        </div>
        <Annot>solid terracotta primary · cream-outline secondary · whatsapp green tertiary · text-link · icon round 40px. Focus ring: 2px <code>#B89668</code> outset 2px (visible on tab).</Annot>
      </Section>

      {/* TAGS */}
      <Section title="Tags · badges">
        <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
          <span className="tag tag--gold">DOP Idiazabal</span>
          <span className="tag tag--terracotta">Esta temporada</span>
          <span className="tag tag--success">Disponible</span>
          <span className="tag tag--warning">Pocas unidades</span>
          <span className="tag tag--error">Agotado</span>
          <span className="tag tag--neutral">Mixta · oveja+vaca</span>
        </div>
        <Annot>10.5px Inter 500 uppercase 0.12em. Forma: pill 999. Solo color, no iconografia. Stock visibility expone <code>pocas unidades</code> y <code>agotado</code> sin ocultar (owner override §0.2).</Annot>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs &amp; forms">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 18 }}>
          <Field label="Nombre" placeholder="Lara" />
          <Field label="Email" placeholder="tu@correo.com" helper="Te confirmamos por WhatsApp en menos de 24 h." />
          <Field label="Telefono" value="+34 600 12 34 56" error="Numero no valido. Incluye prefijo." />
          <Field label="Fecha de recogida" placeholder="Sab 17 may" right="▾" />
          <Field label="Franja horaria" placeholder="19:30 – 20:00" right="▾" />
          <Field label="Notas para el owner" placeholder="Sin gluten, por favor" textarea />
        </div>
        <Annot>Label arriba (Inter 500 12.5px uppercase 0.06em). Input fondo <code>#252420</code>, borde 1px <code>rgba(242,234,216,0.18)</code>, focus <code>#B89668</code>. Helper text 12px muted; error text 12px <code>#A8443A</code> + borde rojo. Date picker restringido a dias de apertura (cierre 2 ult. semanas agosto). Slot picker 30-min increments.</Annot>
      </Section>

      {/* CARDS */}
      <Section title="Cards">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          <ProductCard name="Idiazabal" region="Pais Vasco · DOP" price="6,80" />
          <ProductCard name="Garrotxa" region="Catalunya · cabra" price="5,40" stock="low" />
          <ProductCard name="Torta del Casar" region="Extremadura · DOP" price="9,20" stock="out" />
          <TablaCard size="6 quesos" subtitle="Tabla mediana" priceFrom="38" />
        </div>
        <Annot>ProductCard 1:1 photo, eyebrow region, display name 22px, price mono 13px + add. TablaCard 4:5 photo, dual-tag (sin maridaje / con vino), priceFrom mono. EventCard inline list-row (ver Eventos). CampaignCard reusa ProductCard con badge terracotta.</Annot>
      </Section>

      {/* COOKIE BANNER */}
      <Section title="Cookie banner · AEPD-compliant (custom V1)">
        <div style={{ background: C.bgElevated, padding: 18, border:`1px solid ${C.line}`, borderRadius: 4, maxWidth: 720 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize: 20, marginBottom: 6 }}>Tus cookies, tu eleccion</div>
          <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55, marginBottom: 14, maxWidth: '60ch' }}>Usamos cookies tecnicas necesarias y, si lo aceptas, cookies analiticas para entender como se navega la web. No usamos publicidad. Puedes cambiar tu eleccion cuando quieras.</p>
          <div style={{ display:'flex', gap: 10, flexWrap:'wrap' }}>
            <button className="btn btn--secondary" style={{ flex: 1 }}>Rechazar</button>
            <button className="btn btn--secondary" style={{ flex: 1 }}>Configurar</button>
            <button className="btn btn--primary" style={{ flex: 1 }}>Aceptar</button>
          </div>
          <a style={{ display:'block', marginTop: 10, fontSize: 11, color: C.textMuted, textDecoration:'underline' }}>Politica de cookies</a>
        </div>
        <Annot>Tres botones de igual peso visual (owner override §0.2). Sin pre-marcado. El consent se persiste con cookie tecnica <code>crudo_consent_v1</code> + endpoint <code>POST /api/v1/consent</code>. Analytics gated por consent.</Annot>
      </Section>

      {/* WHATSAPP CTA */}
      <Section title="WhatsApp CTA · prefilled URL pattern">
        <div style={{ background: C.bgElevated, padding: 16, borderRadius: 4, fontFamily:'var(--font-mono)', fontSize: 12, color: C.textSecondary, lineHeight: 1.7, maxWidth: 800 }}>
          wa.me/&lcub;PUBLIC_WHATSAPP&rcub;?text=&lcub;encodeURIComponent(<br/>
          &nbsp;&nbsp;'Hola CRUDO, me interesa la tabla 6 quesos con maridaje de vino tinto.\n' +<br/>
          &nbsp;&nbsp;'Producto: tabla-6-quesos-maridaje-tinto\n' +<br/>
          &nbsp;&nbsp;'Cantidad: 1\n' +<br/>
          &nbsp;&nbsp;'Pickup deseado: sabado 17 may, 19:30\n'<br/>
          &nbsp;&nbsp;)&rcub;
        </div>
        <Annot>El boton verde no abre modal — abre <code>wa.me</code> directo en nueva pestana con mensaje prellenado. Variante con vino blanco/tinto SIEMPRE va por aqui (owner override §0.2 · alcohol guard). El componente dispara evento analytics <code>cta_whatsapp_click</code> gated by consent.</Annot>
      </Section>

      {/* STATES */}
      <Section title="Empty · loading · error">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          <StateBox label="Empty · catalogo">
            <div style={{ fontFamily:'var(--font-display)', fontSize: 20, marginBottom: 4 }}>Aun no hay quesos publicados este mes</div>
            <p style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 12 }}>El owner sube la lista a primeros de mes. Suscribete y te avisamos.</p>
            <button className="btn btn--secondary btn--sm">Suscribirme</button>
          </StateBox>
          <StateBox label="Loading · skeleton">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
              {Array.from({length:4}).map((_,i)=>(
                <div key={i} style={{ aspectRatio:'1', background: C.line, borderRadius: 2 }}></div>
              ))}
            </div>
          </StateBox>
          <StateBox label="Error · network">
            <div style={{ fontFamily:'var(--font-display)', fontSize: 20, marginBottom: 4 }}>Algo se ha torcido</div>
            <p style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 12 }}>No hemos podido cargar el catalogo. Reintenta en unos segundos.</p>
            <button className="btn btn--secondary btn--sm">Reintentar</button>
          </StateBox>
          <StateBox label="No-results · busqueda">
            <div style={{ fontFamily:'var(--font-display)', fontSize: 20, marginBottom: 4 }}>Sin quesos para "<i>brie</i>"</div>
            <p style={{ fontSize: 12.5, color: C.textMuted }}>Trabajamos solo con quesos artesanos espanoles. Prueba <i>Torta del Casar</i> o <i>Tetilla</i>.</p>
          </StateBox>
        </div>
      </Section>

      {/* SCHEMA */}
      <Section title="Schema.org snippets">
        <div style={{ background: C.bgElevated, padding: 14, fontFamily:'var(--font-mono)', fontSize: 11, color: C.textSecondary, lineHeight: 1.6, borderRadius: 4 }}>
          <b style={{ color: C.gold }}>{`<Store|FoodEstablishment>`}</b><br/>
          {`{ "@type": ["Store","FoodEstablishment"], "name":"CRUDO QUESOS S.L.U", "address":{ "@type":"PostalAddress", "streetAddress":"Calle Jose Ortega y Gasset 81", "postalCode":"28006", "addressLocality":"Madrid"}, "openingHoursSpecification":[…] }`}<br/><br/>
          <b style={{ color: C.gold }}>{`<Product>`}</b> · ProductCard, PDP queso<br/>
          <b style={{ color: C.gold }}>{`<Event>`}</b> · EventCard, /eventos/:slug<br/>
          <b style={{ color: C.gold }}>{`<BreadcrumbList>`}</b> · todas las paginas internas
        </div>
        <Annot>Tipo principal <b>Store</b> (no <b>Restaurant</b>) por owner override §0.2. Combinar con FoodEstablishment opcional. Tablas usan <b>Product</b> con <b>offers/AggregateOffer</b> para multiples tamanos.</Annot>
      </Section>

      <div style={{ marginTop: 20, fontSize: 11, color: C.textMuted, fontFamily:'var(--font-mono)' }}>Faltan en este artboard pero documentados en handoff: Modal · Drawer (Mi tabla) · Mobile Header · Mobile Sticky CTA · Newsletter form · Footer. Ver mockups de paginas para verlos en contexto.</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${C.line}` }}>
      <Eyebrow color={C.gold} style={{ marginBottom: 12 }}>{title}</Eyebrow>
      {children}
    </div>
  );
}

function Annot({ children }) {
  return (
    <p style={{ fontSize: 12, color: C.textMuted, marginTop: 14, lineHeight: 1.55, maxWidth: '80ch' }}>
      {children}
    </p>
  );
}

function Field({ label, value, placeholder, helper, error, right, textarea }) {
  const hasError = !!error;
  return (
    <div>
      <div style={{ fontFamily:'var(--font-body)', fontWeight: 500, fontSize: 11, textTransform:'uppercase', letterSpacing:'0.10em', color: C.textSecondary, marginBottom: 6 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'center', background: C.bgElevated, border:`1px solid ${hasError ? C.error : C.line}`, borderRadius: 2, padding: textarea ? '10px 12px' : '12px 12px' }}>
        {textarea
          ? <div style={{ minHeight: 56, color: value ? C.textPrimary : C.textMuted, fontSize: 13 }}>{value || placeholder}</div>
          : <div style={{ flex:1, color: value ? C.textPrimary : C.textMuted, fontSize: 13 }}>{value || placeholder}</div>}
        {right && !textarea && <span style={{ color: C.textMuted }}>{right}</span>}
      </div>
      {error && <div style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{error}</div>}
      {helper && !error && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{helper}</div>}
    </div>
  );
}

function StateBox({ label, children }) {
  return (
    <div style={{ background: C.bgSecondary, padding: 16, borderRadius: 4, border: `1px solid ${C.line}` }}>
      <div className="eyebrow" style={{ color: C.textMuted, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

window.ComponentsArtboard = ComponentsArtboard;
