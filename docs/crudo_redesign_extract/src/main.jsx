// Top-level composition: assemble all artboards into the design canvas.

const { useEffect } = React;

function App() {
  // Default tweaks for the canvas
  const tweaks = window.useTweaks ? window.useTweaks(/*EDITMODE-BEGIN*/{
    "showPaused": false,
    "useRealPhotos": true,
    "homeDirection": "all"
  }/*EDITMODE-END*/) : { t:{ showPaused:false, useRealPhotos:true, homeDirection:'all' }, setTweak: ()=>{} };
  const t = tweaks.t || tweaks;

  useEffect(() => {
    // Push photo flag into doc so <Photo> can read it
    document.documentElement.dataset.realPhotos = t.useRealPhotos ? '1' : '0';
  }, [t.useRealPhotos]);

  return (
    <DesignCanvas>
      <DCSection id="00-cover" title="00 · CRUDO Phase 7" subtitle="Hi-fi mockups · 14 routes · locked V1Tecnico tokens · for owner sign-off before Phase 8 build">
        <DCArtboard id="cover" label="Cover · package overview" width={760} height={620}>
          <CoverArtboard />
        </DCArtboard>
        <DCArtboard id="research" label="Visual research summary" width={760} height={1000}>
          <ResearchSummary />
        </DCArtboard>
      </DCSection>

      <DCSection id="01-system" title="01 · Design system" subtitle="Tokens, type, components — all pulled from V1Tecnico §7. Zero new colors introduced.">
        <DCArtboard id="tokens-color" label="Color &amp; spacing tokens" width={760} height={920}>
          <TokensArtboard />
        </DCArtboard>
        <DCArtboard id="tokens-type" label="Type system" width={760} height={920}>
          <TypeArtboard />
        </DCArtboard>
        <DCArtboard id="components" label="Components — buttons, tags, cards, forms" width={760} height={1100}>
          <ComponentsArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="02-home" title="02 · Home / · 3 directions" subtitle="Per Phase 7 brief: only Home gets multi-direction. A is by-the-book editorial, B leans into seasonal calendar visual, C is wordmark-forward and bold.">
        <DCArtboard id="home-a-mobile" label="A · Editorial · mobile" width={420} height={2200}>
          <HomeMobileA />
        </DCArtboard>
        <DCArtboard id="home-a-desktop" label="A · Editorial · desktop 1280" width={1320} height={820}>
          <HomeDesktopA />
        </DCArtboard>
        <DCArtboard id="home-b-mobile" label="B · Seasonal calendar · mobile" width={420} height={2200}>
          <HomeMobileB />
        </DCArtboard>
        <DCArtboard id="home-c-mobile" label="C · Wordmark-forward · mobile" width={420} height={2200}>
          <HomeMobileC />
        </DCArtboard>
      </DCSection>

      <DCSection id="03-tabla-flow" title="03 · /tabla-maridaje · 3 flow variants" subtitle="Owner asked for 2–3 options on this flow. Variant 1 is a single-page configurator; variant 2 is a wizard with progressive disclosure; variant 3 is conversational, WhatsApp-first.">
        <DCArtboard id="tabla-v1" label="V1 · Single-page configurator" width={420} height={2400}>
          <TablaFlowA />
        </DCArtboard>
        <DCArtboard id="tabla-v1-wine" label="V1+ · with wine maridaje step" width={420} height={2400}>
          <TablaFlowAWithWine />
        </DCArtboard>
        <DCArtboard id="tabla-v2" label="V2 · WhatsApp-first conversational" width={420} height={2000}>
          <TablaFlowB />
        </DCArtboard>
      </DCSection>

      <DCSection id="04-catalog" title="04 · Catalog routes" subtitle="One direction each — design system already locked, no need to fork.">
        <DCArtboard id="cat-temporada" label="/catalogo/temporada" width={420} height={1500}>
          <CatalogoTemporada />
        </DCArtboard>
        <DCArtboard id="cat-tablas" label="/catalogo/tablas" width={420} height={1300}>
          <CatalogoTablas />
        </DCArtboard>
        <DCArtboard id="pdp" label="/producto/[slug] · Idiazabal" width={420} height={1700}>
          <ProductoPDP />
        </DCArtboard>
      </DCSection>

      <DCSection id="05-events" title="05 · Events + private hire">
        <DCArtboard id="eventos" label="/eventos" width={420} height={1400}>
          <Eventos />
        </DCArtboard>
        <DCArtboard id="evento-detail" label="/eventos/[slug]" width={420} height={1500}>
          <EventoDetail />
        </DCArtboard>
        <DCArtboard id="celebra" label="/celebra" width={420} height={1500}>
          <CelebraConNosotros />
        </DCArtboard>
      </DCSection>

      <DCSection id="06-info" title="06 · Brand + utility">
        <DCArtboard id="sobre" label="/sobre" width={420} height={1700}>
          <Sobre />
        </DCArtboard>
        <DCArtboard id="contacto" label="/contacto" width={420} height={1500}>
          <Contacto />
        </DCArtboard>
        <DCArtboard id="mayoristas" label="/mayoristas" width={420} height={1500}>
          <Mayoristas />
        </DCArtboard>
      </DCSection>

      <DCSection id="07-mi-tabla" title="07 · Mi tabla flow + states">
        <DCArtboard id="mi-tabla" label="Mi tabla · drawer" width={420} height={900}>
          <MiTablaDrawer />
        </DCArtboard>
        <DCArtboard id="mi-tabla-confirm" label="Mi tabla · confirmacion" width={420} height={900}>
          <MiTablaConfirmacion />
        </DCArtboard>
        <DCArtboard id="legal" label="/legal" width={420} height={900}>
          <Legal />
        </DCArtboard>
        <DCArtboard id="404" label="/404" width={420} height={900}>
          <NotFound />
        </DCArtboard>
        <DCArtboard id="pickup-paused" label="/pickup-pausado · admin kill switch" width={420} height={900}>
          <PickupPaused />
        </DCArtboard>
      </DCSection>

      <DCSection id="08-handoff" title="08 · Handoff" subtitle="Photography commission brief + dev/owner handoff notes. Open items live here, not in chat.">
        <DCArtboard id="photo-brief" label="Photography brief" width={760} height={1100}>
          <PhotoBrief />
        </DCArtboard>
        <DCArtboard id="handoff" label="Handoff notes" width={760} height={1100}>
          <Handoff />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

function CoverArtboard() {
  return (
    <div style={{ width: 760, height: 620, background: 'var(--c-bg-primary)', color: 'var(--c-text-primary)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding: 56, position:'relative', overflow:'hidden' }}>
      <div>
        <div className="eyebrow" style={{ color: 'var(--c-gold)', marginBottom: 24 }}>Phase 7 · Hi-fi design package · v1</div>
        <div className="crudo-mark" style={{ fontSize: 140, marginBottom: 16 }}>CRUDO</div>
        <p className="display-italic" style={{ fontSize: 24, color: 'var(--c-text-secondary)', maxWidth: '20ch', lineHeight: 1.2, margin: 0 }}>Una tienda de quesos. Doce mocks. Cero ruido.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 18, fontSize: 12, color: 'var(--c-text-muted)', borderTop: '1px solid var(--c-line)', paddingTop: 18 }}>
        <div><b style={{ color:'var(--c-text-primary)', display:'block', fontSize:24, fontFamily:'var(--font-display)', marginBottom: 4 }}>14</b> rutas v1</div>
        <div><b style={{ color:'var(--c-text-primary)', display:'block', fontSize:24, fontFamily:'var(--font-display)', marginBottom: 4 }}>3</b> direcciones home</div>
        <div><b style={{ color:'var(--c-text-primary)', display:'block', fontSize:24, fontFamily:'var(--font-display)', marginBottom: 4 }}>3</b> flows tabla</div>
        <div><b style={{ color:'var(--c-text-primary)', display:'block', fontSize:24, fontFamily:'var(--font-display)', marginBottom: 4 }}>0</b> placeholder colors</div>
      </div>
      <div style={{ position:'absolute', right: -40, top: -40, width: 200, height: 200, border:'1px solid var(--c-gold)', borderRadius: '50%', opacity: 0.25 }}></div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
