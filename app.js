(function () {
  // 1. Mobile Nav Drawer
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // 2. Cursor Spotlight
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
    });
  }

  // 3. Ambient Particle Mesh Canvas
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, pts;
    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      pts = Array.from({ length: Math.min(48, Math.floor(w / 28)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(255,159,104,0.45)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = 'rgba(255,107,53,' + (0.11 * (1 - d / 130)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    };
    init();
    tick();
    window.addEventListener('resize', init);
  }

  // 4. 3D Card Tilt Effect
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // 5. Scroll Reveal IntersectionObserver
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // 6. Interactive Screen Showcase Data
  const screens = {
    dashboard: {
      title: 'Visão Geral em Tempo Real',
      desc: 'Acompanhe faturamento do dia, ticket médio, fila da cozinha, ocupação das mesas e gráfico dos últimos 7 dias logo ao entrar.',
      bullets: [
        'Indicadores ao vivo direto do SQLite WAL (zero lentidão)',
        'Ranking dos 5 pratos mais vendidos com barra de proporção',
        'Tema Escuro Obsidian & Claro Minimalista com sua cor e logo'
      ],
      preview: `
        <div class="mock-hdr"><span>📊 Visão Geral — Sua Empresa</span><span class="mock-pill pill-green">● Caixa Aberto</span></div>
        <div class="mock-row mock-cols-3" style="margin-bottom:10px">
          <div class="mock-box"><small>Faturamento Hoje</small><strong style="color:#ff9f68">R$ 3.480,00</strong></div>
          <div class="mock-box"><small>Ticket Médio</small><strong style="color:#34d399">R$ 68,20</strong></div>
          <div class="mock-box"><small>Mesas Ocupadas</small><strong style="color:#38bdf8">5 / 12</strong></div>
        </div>
        <div class="mock-box">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>Mais Vendidos (Semana)</b><span style="color:#94a3b8">Total: 214 un</span></div>
          <div style="display:grid;gap:6px;font-size:0.78rem">
            <div>1. Smash Burger Duplo <span style="float:right;color:#ff9f68">74 un • R$ 2.730</span></div>
            <div>2. Pizza Margherita G <span style="float:right;color:#ff9f68">52 un • R$ 3.328</span></div>
            <div>3. Coca-Cola Lata 350ml <span style="float:right;color:#ff9f68">88 un • R$ 660</span></div>
          </div>
        </div>`
    },
    pos: {
      title: 'PDV Rápido, CPF na Nota & DANFE NFC-e',
      desc: 'Frente de caixa ágil para Balcão ou Delivery. Se a SEFAZ estiver ativada, já aceita CPF/CNPJ na nota e imprime DANFE NFC-e com QR Code escaneável.',
      bullets: [
        'Pagamento em PIX, Crédito, Débito ou Dinheiro (com troco)',
        'Busca automática de endereço por CEP via ViaCEP no Delivery',
        'Suporte a Contingência Offline automática se a internet cair'
      ],
      preview: `
        <div class="mock-row mock-cols-2">
          <div class="mock-box">
            <div class="mock-hdr" style="margin-bottom:8px"><span>🛒 Comanda #144</span><span class="mock-pill pill-orange">Balcão</span></div>
            <div style="display:grid;gap:6px;font-size:0.78rem">
              <div>2x Smash Burger Duplo <b style="float:right">R$ 73,80</b></div>
              <div>1x Batata c/ Cheddar <b style="float:right">R$ 32,00</b></div>
              <div>2x Coca-Cola Lata <b style="float:right">R$ 15,00</b></div>
              <hr style="border-color:rgba(255,255,255,0.1)"/>
              <div>CPF na Nota: <span style="color:#94a3b8">123.456.789-00</span></div>
              <div style="font-size:0.95rem">TOTAL <b style="float:right;color:#ff9f68">R$ 120,80</b></div>
            </div>
          </div>
          <div class="mock-receipt">
            <div style="text-align:center;font-weight:700">DANFE NFC-e • Nº 000018<br/>HOMOLOGAÇÃO — SEM VALOR FISCAL</div>
            <div style="margin:6px 0;border-top:1px dashed #999;padding-top:6px">
              2x Smash Burger Duplo ...... 73,80<br/>
              1x Batata c/ Cheddar ....... 32,00<br/>
              2x Coca-Cola Lata .......... 15,00<br/>
              <b>TOTAL: R$ 120,80 (PIX)</b>
            </div>
            <div style="text-align:center;font-size:0.64rem">Chave: 4126 1100 0000 0100 6500...</div>
            <div class="mock-qr" title="QR Code NFC-e"></div>
          </div>
        </div>`
    },
    tables: {
      title: 'Mapa de Mesas & Envio Parcial à Cozinha',
      desc: 'Gerencie de 1 a 100 mesas em tempo real. Envie novos lançamentos para a cozinha (inclusive no tablet Android), divida a conta por pessoa e feche com 1 clique.',
      bullets: [
        'Status visual imediato: Livre, Ocupada e Conta Pedida',
        'Envio incremental à cozinha (apenas itens ainda não enviados)',
        'Alerta sonoro & devolução ao Caixa quando o prato fica pronto'
      ],
      preview: `
        <div class="mock-hdr"><span>🪑 Salão — 12 Mesas Configuradas</span><span class="mock-pill pill-blue">Sincronizado LAN</span></div>
        <div class="mock-row mock-cols-3">
          <div class="mock-box" style="border-color:rgba(16,185,129,0.45)"><small style="color:#34d399">● Livre</small><strong>Mesa 01</strong><span>4 lugares</span></div>
          <div class="mock-box" style="border-color:rgba(255,107,53,0.55)"><small style="color:#ff9f68">🍳 Em Preparo</small><strong>Mesa 02</strong><span>R$ 138,50 • João</span></div>
          <div class="mock-box" style="border-color:rgba(16,185,129,0.75);background:rgba(16,185,129,0.08)"><small style="color:#34d399">🔔 Pronto na Cozinha!</small><strong>Mesa 04</strong><span>R$ 196,80 • Entregar</span></div>
        </div>`
    },
    kitchen: {
      title: 'App Android Nativo para Cozinha (APK v1.2)',
      desc: 'Desenvolvido exclusivamente para ficar nos tablets da cozinha. Layout em cartões grandes em modo paisagem com sincronização a cada 2 segundos com o servidor.',
      bullets: [
        '100% Nativo Android (zero WebView), texto nítido e botões grandes',
        'Credenciais do servidor (IP, Porta, Token e Login) salvas no aparelho',
        'Fluxo completo: Na Fila → Preparando → Devolver p/ Caixa'
      ],
      preview: `
        <div class="mock-hdr"><span>📱 PedidPro Cozinha • Tablet KDS (LAN OK)</span><span class="mock-pill pill-green">v1.2 Nativo</span></div>
        <div class="mock-row mock-cols-3">
          <div class="mock-box" style="border-top:3px solid #f59e0b">
            <small style="color:#fbbf24">NA FILA (2)</small>
            <strong>#145 • Mesa 07</strong>
            <p style="color:#cbd5e1;margin:6px 0">2x Smash Duplo<br/><em style="color:#fbbf24">⚠ Sem picles</em></p>
            <div style="background:#f59e0b;color:#111;text-align:center;padding:5px;border-radius:7px;font-weight:700">▶ Iniciar Preparo</div>
          </div>
          <div class="mock-box" style="border-top:3px solid #38bdf8">
            <small style="color:#38bdf8">PREPARANDO (1)</small>
            <strong>#143 • Delivery</strong>
            <p style="color:#cbd5e1;margin:6px 0">1x Pizza Calabresa<br/>2x Coca Lata</p>
            <div style="background:#10b981;color:#fff;text-align:center;padding:5px;border-radius:7px;font-weight:700">✓ Devolver p/ Caixa</div>
          </div>
          <div class="mock-box" style="border-top:3px solid #10b981">
            <small style="color:#34d399">NO BALCÃO (1)</small>
            <strong>#142 • Mesa 04</strong>
            <p style="color:#cbd5e1;margin:6px 0">Devolvido ao Caixa para conferência e entrega.</p>
            <div style="background:rgba(16,185,129,0.2);color:#34d399;text-align:center;padding:5px;border-radius:7px;font-weight:700">Aguardando Caixa ✓</div>
          </div>
        </div>`
    },
    catalog: {
      title: 'Cardápio com Busca Automática de NCM & Tributação',
      desc: 'Ao digitar o nome de um prato ou bebida, o sistema sugere NCM, CEST, CFOP e CSOSN/CST pela base local e tabela oficial Siscomex/BrasilAPI online.',
      bullets: [
        'Botão 🔍 Buscar NCM em cada produto + preenchimento em lote',
        'Separação automática entre Produção Própria e Substituição Tributária (ST)',
        'Controle de suprimentos, custo unitário e ficha técnica integrada'
      ],
      preview: `
        <div class="mock-hdr"><span>📦 Cadastro de Produto &amp; NCM Automático</span><span class="mock-pill pill-orange">Base Local + Online</span></div>
        <div class="mock-row mock-cols-2">
          <div class="mock-box">
            <small>Produto</small><strong>Coca-Cola Lata 350ml</strong>
            <small style="margin-top:8px;display:block">Perfil Fiscal</small><strong style="color:#38bdf8">RevendaST (Subst. Trib.)</strong>
          </div>
          <div class="mock-box">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div><small>NCM</small><strong style="color:#34d399">22021000</strong></div>
              <div><small>CEST</small><strong>0300700</strong></div>
              <div><small>CFOP</small><strong>5405</strong></div>
              <div><small>CSOSN</small><strong>500</strong></div>
            </div>
          </div>
        </div>`
    },
    reports: {
      title: 'Relatórios Imprimíveis, SEFAZ & Auto-Update',
      desc: 'Emita relatórios Diário, Semanal, Mensal ou Anual com logo da empresa, gerencie NFC-e (Caminho A opcional) e atualize com 1 clique via GitHub Releases.',
      bullets: [
        'Impressão paginada profissional com opção de exibir/ocultar estoque',
        'Auto-Manutenção online de tabelas NCM/SEFAZ + Exportação XML .zip',
        'Verificação automática de novas versões preservando todos os dados'
      ],
      preview: `
        <div class="mock-row mock-cols-2">
          <div class="mock-box">
            <div class="mock-hdr" style="margin-bottom:8px"><span>🧾 SEFAZ NFC-e (Opcional)</span><span class="mock-pill pill-purple">Cert. A1 DPAPI</span></div>
            <div style="font-size:0.78rem;display:grid;gap:6px">
              <div>Chave Geral: <b style="color:#34d399">Opcional (Desativado por padrão)</b></div>
              <div>Tabela Fiscal: <b>v2026.11.1 (Auto-Sync Online)</b></div>
              <div>Contabilidade: <b>Exportar XMLs do Mês (.zip)</b></div>
            </div>
          </div>
          <div class="mock-box">
            <div class="mock-hdr" style="margin-bottom:8px"><span>🔄 Central Auto-Update</span><span class="mock-pill pill-green">v1.44 Atualizado</span></div>
            <div style="font-size:0.78rem;display:grid;gap:6px">
              <div>Windows Desktop: <b>v1.44 (Setup Silencioso)</b></div>
              <div>Android Cozinha: <b>APK v1.2 disponível</b></div>
              <div>Banco SQLite &amp; Config: <b style="color:#34d399">100% Preservados</b></div>
            </div>
          </div>
        </div>`
    }
  };

  const screenStage = document.getElementById('screenStage');
  const screenTabs = document.querySelectorAll('.screen-tab');
  function renderScreen(key) {
    const data = screens[key];
    if (!data || !screenStage) return;
    screenStage.innerHTML = `
      <div class="stage-grid">
        <div class="stage-desc">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <ul class="stage-bullets">
            ${data.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <a href="#downloads" class="btn btn-primary btn-sm">Baixar e Testar Agora →</a>
        </div>
        <div class="mockup-frame">${data.preview}</div>
      </div>`;
  }
  screenTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      screenTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderScreen(btn.dataset.screen);
    });
  });
  renderScreen('dashboard');

  // 7. Instructions Tabs
  const guideTabs = document.querySelectorAll('.guide-tab');
  const guidePanels = document.querySelectorAll('.guide-panel');
  guideTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      guideTabs.forEach(b => b.classList.remove('active'));
      guidePanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('guide-' + btn.dataset.guide);
      if (target) target.classList.add('active');
    });
  });

  // 8. Copy to Clipboard & Toast
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const val = btn.dataset.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(val);
      showToast('Copiado: ' + val);
    });
  });

  // 9. Quick Contact Form -> WhatsApp / Email
  const quickForm = document.getElementById('quickContactForm');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  function buildMsg() {
    const name = (document.getElementById('cName').value || '').trim();
    const topic = document.getElementById('cInterest').value;
    const msg = (document.getElementById('cMsg').value || '').trim();
    return `Olá Anderson! Sou ${name || 'cliente'}.\nAssunto: ${topic}\n${msg ? 'Mensagem: ' + msg : ''}`;
  }
  if (quickForm) {
    quickForm.addEventListener('submit', e => {
      e.preventDefault();
      const url = 'https://wa.me/5541992647547?text=' + encodeURIComponent(buildMsg());
      window.open(url, '_blank', 'noopener');
    });
  }
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const sub = encodeURIComponent('Contato Site PedidPro — ' + document.getElementById('cInterest').value);
      const body = encodeURIComponent(buildMsg());
      window.location.href = `mailto:anderson@wirebyinfo.com?subject=${sub}&body=${body}`;
    });
  }

  // 10. Fetch Live Releases from GitHub API
  fetch('https://api.github.com/repos/araujo791/PedidPro-Gest-o/releases?per_page=8')
    .then(r => r.ok ? r.json() : null)
    .then(releases => {
      if (!Array.isArray(releases)) return;
      let winSet = false, apkSet = false;
      for (const rel of releases) {
        if (!rel || rel.draft || !Array.isArray(rel.assets)) continue;
        const tag = (rel.tag_name || '').trim();
        if (!winSet && tag.toLowerCase().startsWith('v')) {
          const exe = rel.assets.find(a => a.name && a.name.toLowerCase().endsWith('.exe'));
          if (exe) {
            winSet = true;
            document.getElementById('winVerBadge').textContent = tag;
            document.getElementById('dlWinTag').textContent = tag;
            document.getElementById('heroWinDownload').href = exe.browser_download_url;
            document.getElementById('dlWinBtn').href = exe.browser_download_url;
            document.getElementById('dlWinBtn').textContent = '⬇ Baixar ' + exe.name;
          }
        }
        if (!apkSet && tag.toLowerCase().startsWith('apk-v')) {
          const apk = rel.assets.find(a => a.name && a.name.toLowerCase().endsWith('.apk'));
          if (apk) {
            apkSet = true;
            const cleanApk = tag.replace(/^apk-/i, '');
            document.getElementById('apkVerBadge').textContent = cleanApk;
            document.getElementById('dlApkTag').textContent = tag;
            document.getElementById('heroApkDownload').href = apk.browser_download_url;
            document.getElementById('dlApkBtn').href = apk.browser_download_url;
            document.getElementById('dlApkBtn').textContent = '⬇ Baixar ' + apk.name;
          }
        }
      }
    })
    .catch(() => {});
})();
