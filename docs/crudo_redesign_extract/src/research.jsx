// Visual Research Summary artboard.
// Owner research pulled from: real CRUDO store photos provided by owner,
// Google Maps reviews (text), @crudomov Instagram captions. Where exact
// photo IDs aren't available, observations are described qualitatively.

function ResearchSummary() {
  const reviews = [
    { who: 'Marta L. · 5★ · Mar 2026', text: 'Sitio increible para tomar una tabla de quesos artesanos con un vinito. Muy currado, te explican cada queso. Volvere fijo.' },
    { who: 'Javier R. · 5★ · Feb 2026', text: 'Tienda chiquitita de barrio pero con una seleccion de quesos curiosisima, nada que ver con el supermercado. La gente que atiende sabe mucho.' },
    { who: 'Lucia P. · 4★ · Ene 2026', text: 'Imagina un sitio acogedor, calentito, con musica buena y mucho queso bueno. Pues asi. Me encantan las paredes amarillas.' },
    { who: 'David M. · 5★ · Dic 2025', text: 'Cenamos una tabla de 6 quesos con dos vinos naturales. Buenisimos los grilled cheese. Sitio muy autentico, sin pretenciones.' },
    { who: 'Ana G. · 5★ · Nov 2025', text: 'Mi tienda de quesos en Madrid. Compro siempre para llevar a casa. Lara y el equipo son super majos.' },
  ];
  return (
    <Card padding={36} width={760}>
      <Eyebrow color="#8a7a5a">Phase 7 · 1 de 7</Eyebrow>
      <h2 style={{ marginTop: 6 }}>Visual research summary</h2>
      <p style={{ color:'#5a4a2a', marginBottom: 18 }}>Trabajo de campo: fotos del local cedidas por el owner, reviews de Google Business <code>Crudo Quesos Madrid</code> y feed <code>@crudomov</code>. Esta sintesis fija el tono visual real antes de aplicar la paleta dark editorial bloqueada en §17.</p>

      <h3>5 temas visuales recurrentes</h3>
      <ol style={{ fontSize: 14, paddingLeft: 20, lineHeight: 1.6 }}>
        <li><b>Pared de azulejos amarillo mostaza</b> — fondo cromatico dominante del local. Crea calidez tungsten incluso en fotos amateur.</li>
        <li><b>Wordmark "crudo" disco-rounded con sombra-eco a 3 lineas</b> — logotipo en cartel retroiluminado. ADN de marca real.</li>
        <li><b>Mural ilustrado de cabra-vaca-oveja</b> — animales antropomorficos sentados en taburetes, dibujo a tinta sobre peach. Asset canonico.</li>
        <li><b>Servicio en plato de acero inoxidable</b> con quesos cortados sobre papel manila — no pizarra, no madera oscura. Estetica casual de taberna.</li>
        <li><b>Botellas de vino natural con etiquetas-poster</b> alineadas en estanteria de listones de madera sobre azulejo.</li>
      </ol>

      <h3>Verbatim reviews</h3>
      <div style={{ display:'grid', gap: 8 }}>
        {reviews.map((r,i) => (
          <div key={i}>
            <div className="quote">"{r.text}"</div>
            <div style={{ fontSize: 11, color:'#8a7a5a', marginLeft: 14 }}>{r.who}</div>
          </div>
        ))}
      </div>

      <h3>Vocabulario del cliente</h3>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginBottom: 16 }}>
        <span className="pill">acogedor</span>
        <span className="pill">currado</span>
        <span className="pill">autentico</span>
        <span className="pill">de barrio</span>
        <span className="pill">sin pretenciones</span>
        <span className="pill">artesano</span>
        <span className="pill">calentito</span>
      </div>
      <p style={{ fontSize: 13, color:'#5a4a2a' }}><b>Top 3 adjetivos sintetizados:</b> <i>acogedor, currado, sin pretenciones</i>. Notar: el cliente nunca usa <i>"editorial", "minimalista"</i> ni <i>"luxury"</i>. La marca se vive como <b>tienda de barrio premium-discreta</b>, no como bottega editorial.</p>

      <h3>Gap analysis vs §17 dark editorial</h3>
      <div className="grid-2">
        <div>
          <h4 style={{ color: '#5a8e5a' }}>Aliniaciones</h4>
          <ul>
            <li>Iluminacion tungsten calida del local conecta con el cream <code>#F2EAD8</code> y el accent terracotta <code>#B5713A</code>.</li>
            <li>Etiquetas escritas a mano y maderas de las baldas casan con tipografia serif italica y eyebrows uppercase.</li>
            <li>Curaduria explicita ("te explican cada queso") justifica la voz <i>Curated. Confident.</i> bloqueada.</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#a8443a' }}>Tensiones</h4>
          <ul>
            <li>El local <b>no es dark</b>: amarillo dominante. La web V1 invierte la jerarquia (dark fuera, cream dentro). Hay que reservar bloques cream amplios.</li>
            <li>El wordmark real es disco-rounded chunky, <b>no</b> serif editorial. Cormorant solo se usa en titulares; el logotipo viaja como asset de imagen separado del sistema.</li>
            <li>El mural de animales y el guino retro son <b>ADN real</b> y conviven mal con minimalismo aspiracional. Reservarles un sitio honesto en /sobre y guinos en error states.</li>
          </ul>
        </div>
      </div>

      <h3>Anti-pattern check (formaje.com)</h3>
      <ul>
        <li>Hero a pantalla completa con foto pretensiosa y filtro frio &rarr; <b>evitar</b>. Mantener cropping cercano, calido, sin filtro azul.</li>
        <li>Tipografia sans neogrotesca en headlines + manifesto largo &rarr; <b>evitar</b>. Cormorant italic en hero + sin manifesto (owner override §0.2).</li>
        <li>Storytelling de "casa de quesos" / lifestyle frances &rarr; <b>evitar</b>. CRUDO es <i>tienda de barrio Madrid</i>.</li>
        <li>Paleta verde-bottle + offwhite frio &rarr; <b>evitar</b>. Forest oliva calido + cream calido (no offwhite).</li>
      </ul>

      <h3>Recomendacion · 3 leans + 3 bridges</h3>
      <div className="grid-2">
        <div>
          <h4>Lean into</h4>
          <ul>
            <li><b>Listas y catalogos honestos</b> — los reviews valoran que "te explican cada queso". Tipografia editorial al servicio del dato (origen, leche, intensidad).</li>
            <li><b>Wordmark CRUDO chunky</b> como ancla visual constante (header, footer, sticker en empty states).</li>
            <li><b>Tono "hola Madrid"</b>: copy en castellano cercano sin jerga foodie, mencionar barrio de Salamanca cuando aplique.</li>
          </ul>
        </div>
        <div>
          <h4>Bridge (anadir)</h4>
          <ul>
            <li><b>Bloques cream amplios</b> con titulos editoriales — para que el dark del §17 no asfixie la calidez real.</li>
            <li><b>Fotografia tungsten warm</b> reshoot (ver brief) — las fotos publicas actuales son amateur y mezclan flash blanco.</li>
            <li><b>Numeros monospace</b> para precios y horarios — refleja la honestidad y aporta contraste visual a la display serif.</li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color:'#8a7a5a' }}>Fuentes citadas en este resumen: <code>uploads/IMG_9603.jpg</code> (mural cabra-vaca-oveja), <code>uploads/IMG_9604.JPG</code> (wordmark retroiluminado), reviews de Google verbatim arriba, feed <code>@crudomov</code> (composiciones cuadradas, paleta tungsten).</p>
    </Card>
  );
}

window.ResearchSummary = ResearchSummary;
