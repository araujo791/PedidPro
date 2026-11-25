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

  // 6. Interactive Real Screenshot Showcase + Lightbox
  const screenOrder = ['visao', 'pdv', 'mesas', 'kds', 'delivery', 'clientes', 'cardapio', 'custos', 'caixa', 'relatorios', 'opcoes'];
  const screens = {
    visao: {
      shortTitle: 'Visão Geral',
      img: 'img/01-Visão geral.png',
      title: 'Visão Geral — Dashboard em Tempo Real',
      desc: 'Acompanhe faturamento do dia, ticket médio, pedidos abertos na cozinha, mesas ocupadas e gráfico dos últimos 7 dias logo na entrada.',
      bullets: [
        'Indicadores ao vivo direto do SQLite WAL sem lentidão',
        'Ranking de itens mais vendidos e atalhos rápidos para PDV e Mesas',
        'Identidade visual white-label com modo Claro Minimalista e Escuro Obsidian'
      ]
    },
    pdv: {
      shortTitle: 'PDV Rápido',
      img: 'img/02-PDV Rapido.png',
      title: 'PDV Rápido — Balcão & Frente de Caixa',
      desc: 'Tela objetiva para atendimento no balcão ou retirada: busque por nome, adicione com 1 clique, inclua observações para a cozinha e finalize em segundos.',
      bullets: [
        'Pagamento em PIX, Crédito, Débito ou Dinheiro (com cálculo de troco)',
        'Campo opcional de CPF/CNPJ na nota e emissão NFC-e SEFAZ quando ativada',
        'Impressão de Cupom Não-Fiscal ou DANFE NFC-e com QR Code'
      ]
    },
    mesas: {
      shortTitle: 'Mesas & Salão',
      img: 'img/03-Mesa e Chamadas.png',
      title: 'Mesas & Comandas do Salão',
      desc: 'Mapa visual do salão com cores por status (Livre, Ocupada e Conta Pedida), divisão de conta por pessoa e integração direta com a cozinha.',
      bullets: [
        'Configure de 1 a 100 mesas conforme o tamanho do seu salão',
        'Envio incremental à cozinha (envia apenas novos itens lançados)',
        'Alerta imediato quando a cozinha devolve o prato pronto para entrega na mesa'
      ]
    },
    kds: {
      shortTitle: 'Cozinha KDS',
      img: 'img/04-Cozinha KDS.png',
      title: 'Cozinha (KDS) — Touch no PC & Tablet Android APK',
      desc: 'Quadro em tempo real separado em Na Fila, Preparando e Pronto (No Balcão / Caixa). Funciona em modo touch tela cheia no Windows e no aplicativo Android nativo.',
      bullets: [
        'Recebe automaticamente pedidos do PDV, Delivery e das Mesas',
        'Tempo decorrido de preparo + destaque de observações do cliente',
        'Devolução de pedidos prontos direto ao Caixa / Balcão com alerta sonoro'
      ]
    },
    delivery: {
      shortTitle: 'Delivery',
      img: 'img/05-entregas e delivery.png',
      title: 'Entregas & Delivery com Busca Automática de CEP',
      desc: 'Cadastre pedidos de entrega puxando clientes ou digitando o CEP para preencher rua, bairro e cidade automaticamente via ViaCEP.',
      bullets: [
        'CEP salvo junto ao endereço do cliente e no comprovante do motoboy',
        'Gestão de motoboys, taxas padrão e acerto por entregador',
        'Acompanhamento de etapas: Em Preparo → Em Rota → Entregue'
      ]
    },
    clientes: {
      shortTitle: 'Clientes',
      img: 'img/06-clientes.png',
      title: 'Cadastro Completo de Clientes',
      desc: 'Base centralizada de clientes com telefone, CPF, endereço preenchido por CEP, observações de preferência e início rápido de Delivery.',
      bullets: [
        'Busca instantânea por nome, telefone ou endereço',
        'Preenchimento automático em novos pedidos Delivery sem redigitar',
        'Integração direta com atualização cadastral no fechamento do pedido'
      ]
    },
    cardapio: {
      shortTitle: 'Cardápio & NCM',
      img: 'img/07 cardabio e estoque.png',
      title: 'Cardápio, Insumos & Busca Automática de NCM',
      desc: 'Gerencie produtos de venda, estoque unitário, estoque de suprimentos (insumos) e dados fiscais com busca automática de NCM, CEST, CFOP e CSOSN.',
      bullets: [
        'Pesquisa de NCM integrada (base local + Siscomex/BrasilAPI online)',
        'Botão de preenchimento NCM Fiscal em lote para todo o cardápio',
        'Baixa automática dos insumos vinculados à Ficha Técnica de cada prato'
      ]
    },
    custos: {
      shortTitle: 'Custos & Lucro',
      img: 'img/08-custos e lucros.png',
      title: 'Custos, Fichas Técnicas & Lucro Real',
      desc: 'Compare faturamento dos pedidos, compras de suprimentos, CMV pelas fichas técnicas e lucro líquido tanto no geral quanto item a item.',
      bullets: [
        'Margem de lucro e gasto em insumos calculados por prato vendido',
        'Histórico de compras de suprimentos por fornecedor',
        'Ajuste rápido de ficha técnica em qualquer produto'
      ]
    },
    caixa: {
      shortTitle: 'Caixa',
      img: 'img/09-caixa.png',
      title: 'Caixa & Controle Financeiro do Turno',
      desc: 'Abertura e fechamento de caixa com fundo de troco, lançamentos de Suprimento (+) e Sangria (−), totais por forma de pagamento e lembrete ao sair.',
      bullets: [
        'Separação clara de dinheiro na gaveta, PIX, Crédito e Débito',
        'Registro de quem abriu, movimentou e fechou cada turno',
        'Lembrete automático caso tente fechar o app com o caixa aberto'
      ]
    },
    relatorios: {
      shortTitle: 'Relatórios',
      img: 'img/10-relatorio.png',
      title: 'Relatórios Gerenciais & Impressão Profissional',
      desc: 'Visualize e imprima relatórios Diário, Semanal, Mensal ou Anual com logotipo da empresa, resumo de vendas, pagamentos, operadores e estoque opcional.',
      bullets: [
        'Impressão paginada formatada com o logo e dados do restaurante',
        'Quebra por canal (Balcão, Mesa, Delivery), forma de pagamento e operador',
        'Exportação pronta para conferência gerencial e contábil'
      ]
    },
    opcoes: {
      shortTitle: 'Marca & Opções',
      img: 'img/11-opçoes.png',
      title: 'Marca, Rede Local, SEFAZ NFC-e, Auto-Update & Backup',
      desc: 'Central administrativa completa: personalize logotipo/cores, configure Servidor LAN + Tablets, ative SEFAZ NFC-e quando desejar, gerencie usuários e backups AES-256.',
      bullets: [
        'Módulo Fiscal SEFAZ NFC-e (Caminho A) opcional com Certificado A1 DPAPI',
        'Auto-Manutenção de tabelas fiscais e Auto-Update preservando dados',
        'Backup criptografado .fspbak (AES-256) e Auditoria com trilha SHA-256'
      ]
    }
  };

  let currentScreenKey = 'visao';
  const screenStage = document.getElementById('screenStage');
  const screenTabs = document.querySelectorAll('.screen-tab');
  const thumbStrip = document.getElementById('thumbStrip');

  function renderThumbStrip() {
    if (!thumbStrip) return;
    thumbStrip.innerHTML = screenOrder.map(k => {
      const s = screens[k];
      return `
        <button type="button" class="thumb-item ${k === currentScreenKey ? 'active' : ''}" data-thumb="${k}">
          <img src="${encodeURI(s.img)}" alt="${s.shortTitle}" loading="lazy" />
          <span>${s.shortTitle}</span>
        </button>`;
    }).join('');
    thumbStrip.querySelectorAll('.thumb-item').forEach(el => {
      el.addEventListener('click', () => selectScreen(el.dataset.thumb));
    });
  }

  function renderScreen(key) {
    const data = screens[key];
    if (!data || !screenStage) return;
    const encodedSrc = encodeURI(data.img);
    screenStage.innerHTML = `
      <div class="stage-grid">
        <div class="stage-desc">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <ul class="stage-bullets">
            ${data.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <a href="#contato" class="btn btn-primary btn-sm">Solicitar Demonstração →</a>
        </div>
        <div class="mockup-frame" id="stageZoomTrigger" title="Clique para ampliar em tela cheia">
          <img src="${encodedSrc}" alt="${data.title}" class="stage-shot-img" />
          <span class="shot-zoom-badge">🔍 Clique para ampliar</span>
        </div>
      </div>`;
    const zoomTrigger = document.getElementById('stageZoomTrigger');
    if (zoomTrigger) zoomTrigger.addEventListener('click', () => openLightbox(screenOrder.indexOf(key)));
  }

  function selectScreen(key) {
    if (!screens[key]) return;
    currentScreenKey = key;
    screenTabs.forEach(b => b.classList.toggle('active', b.dataset.screen === key));
    renderScreen(key);
    renderThumbStrip();
  }

  screenTabs.forEach(btn => {
    btn.addEventListener('click', () => selectScreen(btn.dataset.screen));
  });
  selectScreen('visao');

  // Lightbox Modal for full-size screenshot inspection
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIndex = 0;

  function openLightbox(idx) {
    lbIndex = ((idx % screenOrder.length) + screenOrder.length) % screenOrder.length;
    const item = screens[screenOrder[lbIndex]];
    lbImg.src = encodeURI(item.img);
    lbImg.alt = item.title;
    lbCaption.textContent = `${lbIndex + 1} / ${screenOrder.length} — ${item.title}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  const heroShotWrap = document.getElementById('heroShotWrap');
  if (heroShotWrap) heroShotWrap.addEventListener('click', () => openLightbox(0));
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => openLightbox(lbIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => openLightbox(lbIndex + 1));
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
    });
  }

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

})();
