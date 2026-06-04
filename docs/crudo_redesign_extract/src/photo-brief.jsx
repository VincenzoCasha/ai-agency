// Photography brief + handoff notes — printed on doc cards in the canvas.

function PhotoBrief() {
  return (
    <div className="doc-card" style={{ width: 760 }}>
      <span className="pill">Phase 7 · Annex B</span>
      <h2 style={{ marginTop: 8 }}>Photography Brief</h2>
      <p style={{ color:'#6b6256' }}>Locked palette + warm-cool light pairing. Spec for Sergio's session and external commission for hero motion.</p>

      <h3>Visual DNA — what the photos must capture</h3>
      <p className="quote">Honest, slightly imperfect, warm. Cheese-on-paper-on-wood. Madrid sunlight at 18:00. The same room our sign already belongs to.</p>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div>
          <h4>Mood references — found in this project</h4>
          <ul>
            <li><code>animals.jpg</code> — sheep against rough mountain. Dust, milk, atlantic light.</li>
            <li><code>store-1.jpg</code> — terracotta walls, wood shelving, cork. Use as <em>environment</em> not subject.</li>
            <li><code>wordmark.jpg</code> — the cardboard sign. Imperfect chunky lockup; type system mirrors it.</li>
          </ul>
        </div>
        <div>
          <h4>What to avoid</h4>
          <ul>
            <li>Studio white seamless. No.</li>
            <li>Top-down flatlays with props arranged into a circle.</li>
            <li>Aggressive color grading toward orange (Instagram amber). Stay neutral, shift cool in shadow.</li>
            <li>Wine glasses as the hero. Cheese is the hero.</li>
          </ul>
        </div>
      </div>

      <h3>Shot list · priority</h3>
      <h4>P0 — needed before launch</h4>
      <ul>
        <li><b>Home hero · 16:9 + 4:5 crops</b> — counter at golden hour, hand cutting wedge, paper unfolding. Shutter slow enough to allow knife motion blur.</li>
        <li><b>14 individual quesos · 1:1 PDP</b> — each cheese on butcher paper on dark wood. Side light from camera-left. Same crop center for all 14 → seasonal grid stays consistent.</li>
        <li><b>3 tabla compositions · 4:3</b> — pequena (3), mediana (6), grande (8). Same wood board, different counts. Fig leaves, almonds, no fruit clutter.</li>
        <li><b>Store interior · 16:9</b> — shelves with cheeses, no people. For Sobre + meta-image.</li>
      </ul>
      <h4>P1 — first 30 days</h4>
      <ul>
        <li>Event night — spritz on terraza, grilled cheese in pan. Available light.</li>
        <li>Producer trip — one farm, one cellar. Used in seasonal stories.</li>
        <li>Owner hands cutting cheese (no face — owner override §0.2).</li>
      </ul>

      <h3>Technical specs</h3>
      <ul>
        <li>Camera: 35mm or 50mm equivalent. No 24mm hero distortion.</li>
        <li>Light: window or single tungsten bounce. <b>No ringlight.</b></li>
        <li>Color profile: neutral / slight cool shadow. Deliver flat ProRes-style raws + a graded JPEG set.</li>
        <li>Delivery sizes: 2400px long edge for hero, 1600px for grid, 1200px for thumbs. WebP first, JPEG fallback.</li>
        <li>Naming: <code>crudo-pdp-idiazabal-01.webp</code> · kebab-case · indexed.</li>
      </ul>

      <h3>Rights</h3>
      <ul>
        <li>Buy out for web + IG + meta ads. 24 months.</li>
        <li>Producers depicted: signed model release, even hands-only shots.</li>
      </ul>
    </div>
  );
}

function Handoff() {
  return (
    <div className="doc-card" style={{ width: 760 }}>
      <span className="pill">Phase 7 · Annex C</span>
      <h2 style={{ marginTop: 8 }}>Handoff Notes — to dev + owner</h2>
      <p style={{ color:'#6b6256' }}>Open questions, decisions still owed by owner, and the bridge into Phase 8 (build).</p>

      <h3>Locked decisions (do not relitigate)</h3>
      <ul>
        <li>Palette per V1Tecnico §7. Dark earth primary, cream on dark, terracotta accent, gold reserved for "esta temporada".</li>
        <li>Type pair: Cormorant Garamond Display (regular + italic) · Inter UI · JetBrains Mono for prices and IDs.</li>
        <li>UI strings without acentos (engineering pragmatism, V1Tecnico §3.4). Legal copy keeps diacritics.</li>
        <li>WhatsApp is the ONLY synchronous channel. No live chat widget. No phone form fields without WhatsApp shortcut.</li>
        <li>Pickup-only fulfilment in V1. Owner confirms within 24 h. Pickup pause is a single admin kill switch.</li>
      </ul>

      <h3>Owner overrides honored</h3>
      <ul>
        <li><b>§0.1</b> — No founder portrait. Sobre uses CRUDO mark + interior, not a face.</li>
        <li><b>§0.2</b> — No "manifesto" or "manifiesto" copy block. Replaced by short purposeful intro.</li>
        <li><b>§0.3</b> — Wordmark stays the cardboard sign DNA, not a clean digital recut.</li>
      </ul>

      <h3>Open for owner — needed before Phase 8</h3>
      <ul>
        <li>Final WhatsApp number (placeholder used: +34 6XX XXX XXX).</li>
        <li>Razon social + CIF confirmation for legal page.</li>
        <li>Decision: "Mi tabla" cap on quesos per pickup (proposed: 8).</li>
        <li>Maridaje variants — confirm wine list owner wants surfaced as suggestion vs. hide entirely.</li>
        <li>Photography commission go-ahead (Annex B).</li>
      </ul>

      <h3>Open for dev</h3>
      <ul>
        <li>Pickup-paused state: single boolean per day, admin toggle. State should win over any cached PDP CTA.</li>
        <li>Catalog seasonality: products carry <code>season_start</code> + <code>season_end</code>, surfaced as month label in card.</li>
        <li>Form spec: rate-limit Mayoristas + Contacto on email + IP. Honeypot field (<code>honey_quesoanio</code>) before turnstile.</li>
        <li>Pickup confirmation IDs: <code>PIK-YY-NNNNN</code>. Stored on order, returned in WhatsApp template.</li>
        <li>WhatsApp deeplink: <code>https://wa.me/{'{'}phone{'}'}?text={'{'}encoded{'}'}</code>. Encoded text per CTA context (see annex D in V1Tecnico).</li>
      </ul>

      <h3>Routes covered in this package</h3>
      <p style={{ fontFamily:'var(--font-mono)', fontSize: 12, lineHeight: 1.7 }}>
        / · /tabla-maridaje · /catalogo/temporada · /catalogo/tablas · /producto/[slug] · /eventos · /eventos/[slug] · /celebra · /sobre · /contacto · /mayoristas · /mi-tabla (drawer + confirmacion) · /legal · /404 · /pickup-pausado
      </p>

      <h3>Phase 8 entry checklist</h3>
      <ol>
        <li>Owner sign-off on this canvas (artboard-by-artboard ok).</li>
        <li>Owner provides answers to "Open for owner" above.</li>
        <li>Photographer confirmed; P0 shoot scheduled.</li>
        <li>Dev kicks off scaffolding using locked tokens. No new color introductions without canvas update.</li>
      </ol>
    </div>
  );
}

Object.assign(window, { PhotoBrief, Handoff });
