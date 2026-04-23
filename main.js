/* ═══════════════════════════════════════════════════════
   SENTIENT SYNC ENGINE — Main JS
   ══════════════════════════════════════════════════════ */

'use strict';

// ─── THEME TOGGLE ───
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = 'dark';
  html.setAttribute('data-theme', theme);
  if (toggle) {
    toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      toggle.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
})();

// ─── NAV SCROLL ───
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'color-mix(in oklab, var(--color-bg) 95%, transparent)'
      : 'color-mix(in oklab, var(--color-bg) 85%, transparent)';
  }, { passive: true });
})();

// ─── HERO GRID CANVAS ───
(function () {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, cols, rows, particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(w / 60);
    rows = Math.ceil(h / 60);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function getColor(alpha) {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light'
      ? `rgba(0, 119, 170, ${alpha})`
      : `rgba(0, 229, 255, ${alpha})`;
  }

  function drawGrid() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = getColor(0.06);
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    // Intersection dots
    for (let xi = 0; xi <= cols; xi++) {
      for (let yi = 0; yi <= rows; yi++) {
        ctx.beginPath();
        ctx.arc(xi * 60, yi * 60, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = getColor(0.15);
        ctx.fill();
      }
    }
    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = getColor(p.a);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.005;
      if (p.a <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        particles.splice(particles.indexOf(p), 1);
      }
    });
    // Gradient overlay
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
    const theme = document.documentElement.getAttribute('data-theme');
    const bg = theme === 'light' ? '240,244,248' : '10,12,14';
    grad.addColorStop(0, `rgba(${bg}, 0)`);
    grad.addColorStop(1, `rgba(${bg}, 0.7)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    requestAnimationFrame(drawGrid);
  }

  // Spawn particles occasionally
  setInterval(() => {
    if (particles.length < 20) {
      const xi = Math.floor(Math.random() * cols);
      const yi = Math.floor(Math.random() * rows);
      particles.push({ x: xi * 60, y: yi * 60, r: 3, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, a: 0.8 });
    }
  }, 200);

  drawGrid();
})();

// ─── STAT COUNTER ANIMATION ───
(function () {
  const stats = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1200;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();

// ─── ARCHITECTURE DIAGRAM ANIMATION ───
(function () {
  const archSection = document.getElementById('architecture');
  if (!archSection) return;

  function animateArch() {
    const nodes = document.querySelectorAll('.arch-node');
    const connections = document.querySelectorAll('#arch-connections line');
    const label = document.getElementById('arch-label');
    const pulses = document.querySelectorAll('.data-pulse');

    // Animate orchestrator
    const orc = document.getElementById('node-orchestrator');
    if (orc) { orc.style.opacity = '0'; orc.style.transition = 'opacity 0.5s ease-out'; setTimeout(() => { orc.style.opacity = '1'; }, 100); }

    // Animate connections
    connections.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.4s ease-out';
        line.style.opacity = '0.6';
      }, 400 + i * 100);
    });

    // Animate agent nodes with stagger
    const agentNodes = document.querySelectorAll('.agent-node');
    agentNodes.forEach((node, i) => {
      node.style.opacity = '0';
      node.style.transition = 'opacity 0.4s ease-out';
      setTimeout(() => { node.style.opacity = '1'; }, 600 + i * 150);
    });

    // Auditor
    const aud = document.getElementById('node-auditor');
    if (aud) { aud.style.opacity = '0'; aud.style.transition = 'opacity 0.5s ease-out'; setTimeout(() => { aud.style.opacity = '1'; }, 1400); }

    // Label
    if (label) { setTimeout(() => { label.style.opacity = '1'; label.style.transition = 'opacity 0.5s'; }, 1600); }

    // Data pulses
    pulses.forEach(p => { setTimeout(() => { p.style.opacity = '1'; }, 1800); });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateArch(); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  observer.observe(archSection);
})();

// ─── KEY EXCHANGE DEMO ───
(function () {
  const btn = document.getElementById('run-ke-btn');
  if (!btn) return;

  function fakeHex(len) {
    const chars = '0123456789abcdef';
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * 16)]).join('');
  }

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Running…';

    const alicePk = document.getElementById('alice-pk-val');
    const bobSk = document.getElementById('bob-sk-val');
    const sharedEl = document.getElementById('ke-shared');
    const sharedVal = document.getElementById('shared-val');
    const arrowR = document.getElementById('arrow-right');
    const arrowL = document.getElementById('arrow-left');

    alicePk.textContent = fakeHex(16) + '…';
    alicePk.style.color = 'var(--color-primary)';
    bobSk.textContent = fakeHex(16) + '…';
    bobSk.style.color = 'var(--color-primary)';

    setTimeout(() => {
      arrowR.style.color = 'var(--color-primary)';
      arrowR.style.opacity = '1';
    }, 400);
    setTimeout(() => {
      arrowL.style.color = 'var(--color-accent)';
      arrowL.style.opacity = '1';
    }, 900);
    setTimeout(() => {
      const k = fakeHex(32);
      sharedVal.textContent = k;
      sharedEl.classList.add('visible');
    }, 1400);
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Run Key Exchange';
    }, 2000);
  });
})();

// ─── LATTICE CANVAS ───
(function () {
  const canvas = document.getElementById('lattice-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const N = 30;
  const points = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < 6; j++) {
      points.push({ x: 20 + (i / (N - 1)) * (W - 40), y: 20 + (j / 5) * (H - 40), ox: 20 + (i / (N - 1)) * (W - 40), oy: 20 + (j / 5) * (H - 40), phase: Math.random() * Math.PI * 2 });
    }
  }

  let t = 0;
  function drawLattice() {
    ctx.clearRect(0, 0, W, H);
    const theme = document.documentElement.getAttribute('data-theme');
    const primary = theme === 'light' ? 'rgba(0, 119, 170,' : 'rgba(0, 229, 255,';
    const accent = theme === 'light' ? 'rgba(0, 96, 128,' : 'rgba(0, 188, 212,';

    t += 0.012;
    points.forEach(p => {
      p.x = p.ox + Math.sin(t + p.phase) * 8;
      p.y = p.oy + Math.cos(t * 0.7 + p.phase) * 6;
    });

    // Draw connections
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < 6; j++) {
        const idx = i * 6 + j;
        const p = points[idx];
        if (i + 1 < N) {
          const q = points[(i + 1) * 6 + j];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `${primary}0.15)`; ctx.lineWidth = 1; ctx.stroke();
        }
        if (j + 1 < 6) {
          const q = points[i * 6 + (j + 1)];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `${accent}0.12)`; ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }

    // Draw points
    points.forEach((p, i) => {
      const brightness = 0.3 + 0.5 * ((Math.sin(t + i * 0.3) + 1) / 2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `${primary}${brightness.toFixed(2)})`;
      ctx.fill();
    });

    requestAnimationFrame(drawLattice);
  }
  drawLattice();
})();

// ─── HASH VERIFICATION DEMO ───
(function () {
  const input = document.getElementById('hash-input');
  const computeBtn = document.getElementById('compute-hash-btn');
  const algoBtns = document.querySelectorAll('.algo-btn');
  let selectedAlgo = 'SHA-256';

  algoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      algoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAlgo = btn.getAttribute('data-algo');
    });
  });

  async function computeHash(text, algo) {
    const encoded = new TextEncoder().encode(text);
    const hashBuf = await crypto.subtle.digest(algo.replace('-', ''), encoded);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function fakeEd25519Sig() {
    const chars = '0123456789abcdef';
    return Array.from({ length: 128 }, () => chars[Math.floor(Math.random() * 16)]).join('');
  }

  function formatDigest(hex) {
    return hex.match(/.{1,8}/g).join(' ');
  }

  computeBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;
    computeBtn.disabled = true;
    computeBtn.textContent = 'Computing…';

    try {
      const digest = await computeHash(text, selectedAlgo);
      const sig = fakeEd25519Sig();
      const ts = new Date().toISOString();
      const auditEntry = `[${ts}] agent=auditor hash=${digest.substring(0, 16)}... sig=${sig.substring(0, 16)}...`;

      document.getElementById('res-algo').textContent = selectedAlgo;
      document.getElementById('res-digest').textContent = formatDigest(digest);
      document.getElementById('res-bytelength').textContent = `${digest.length / 2} bytes`;
      document.getElementById('res-sig').textContent = sig.substring(0, 64) + '…';
      document.getElementById('res-verify').innerHTML = '<span class="verify-success">✓ SIGNATURE VERIFIED — Ed25519 authentic</span>';
      document.getElementById('res-audit').textContent = auditEntry;

      // Animate integrity bar
      const fill = document.getElementById('integrity-fill');
      const pct = document.getElementById('integrity-pct');
      fill.style.width = '0%';
      setTimeout(() => { fill.style.width = '100%'; pct.textContent = '100%'; }, 50);
    } catch {
      document.getElementById('res-verify').innerHTML = '<span class="verify-fail">✗ Computation failed</span>';
    }

    computeBtn.disabled = false;
    computeBtn.textContent = 'Compute & Sign';
    computeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Compute & Sign';
  });

  // Avalanche demo
  const avalBtn = document.getElementById('avalanche-btn');
  if (avalBtn) {
    avalBtn.addEventListener('click', async () => {
      const hashA = await computeHash('Hello', 'SHA-256');
      const hashB = await computeHash('hello', 'SHA-256');
      document.getElementById('aval-hash-a').textContent = hashA.substring(0, 40) + '…';
      document.getElementById('aval-hash-b').textContent = hashB.substring(0, 40) + '…';

      // Count bit differences
      let diff = 0;
      for (let i = 0; i < hashA.length; i++) {
        const a = parseInt(hashA[i], 16);
        const b = parseInt(hashB[i], 16);
        const xor = a ^ b;
        diff += xor.toString(2).split('').filter(c => c === '1').length;
      }
      const totalBits = hashA.length * 4;
      const pct = ((diff / totalBits) * 100).toFixed(1);
      const fill = document.getElementById('aval-diff-fill');
      const label = document.getElementById('aval-diff-label');
      fill.style.width = '0%';
      setTimeout(() => { fill.style.width = `${pct}%`; label.textContent = `Bit difference: ${diff}/${totalBits} bits (${pct}%) — Avalanche confirmed`; }, 50);
    });
  }
})();

// ─── FEATURE FILTERS ───
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.bento-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const visible = filter === 'all' || cat === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (visible) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });

  // Sync node animation
  const syncNodes = document.querySelectorAll('.sync-node');
  let syncInterval = null;
  function startSync() {
    syncInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * syncNodes.length);
      const node = syncNodes[idx];
      node.classList.add('syncing');
      setTimeout(() => node.classList.remove('syncing'), 600);
    }, 800);
  }

  const featSection = document.getElementById('features');
  if (featSection) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) startSync();
        else { clearInterval(syncInterval); }
      });
    }, { threshold: 0.2 });
    obs.observe(featSection);
  }
})();

// ─── AUDIT LOG STREAM ───
(function () {
  const logBody = document.getElementById('log-body');
  if (!logBody) return;

  const logMessages = [
    { type: 'info', agent: 'agent_01', msg: 'Planner initialized — task graph loaded' },
    { type: 'ok', agent: 'agent_02', msg: 'Retriever: vector store query PASS' },
    { type: 'info', agent: 'auditor', msg: 'Ed25519 signature verified — agent_02::RETRIEVE' },
    { type: 'ok', agent: 'agent_03', msg: 'Analyzer: entropy check NOMINAL' },
    { type: 'info', agent: 'auditor', msg: 'Payload hash logged — SHA256:a3f9b2...' },
    { type: 'ok', agent: 'agent_04', msg: 'Executor: task dispatched — ID:EX-7734' },
    { type: 'info', agent: 'agent_05', msg: 'Verifier: output validation PASS' },
    { type: 'ok', agent: 'auditor', msg: 'Collusion scan: 0 anomalies detected' },
    { type: 'info', agent: 'orchestrator', msg: 'StateGraph transition: ANALYZE → EXECUTE' },
    { type: 'ok', agent: 'agent_01', msg: 'Planner: next task scheduled' },
    { type: 'info', agent: 'auditor', msg: 'PQC key rotation check — Kyber-768 VALID' },
    { type: 'ok', agent: 'agent_03', msg: 'Analyzer: no prompt injection patterns' },
  ];

  const threatMessages = [
    { type: 'warn', agent: 'auditor', msg: 'ANOMALY: Repeated payload hash — agent_02, agent_04' },
    { type: 'threat', agent: 'auditor', msg: 'COLLUSION DETECTED — Shared state vector [EX-7734]' },
    { type: 'warn', agent: 'auditor', msg: 'ALERT: Prompt injection attempt — OWASP LLM-01' },
    { type: 'threat', agent: 'auditor', msg: 'BLOCKED: Data exfiltration pattern detected' },
    { type: 'ok', agent: 'auditor', msg: 'MITIGATED: Agent isolation enforced — rollback initiated' },
    { type: 'ok', agent: 'orchestrator', msg: 'Recovery: clean state restored from checkpoint' },
  ];

  let logIdx = 0;
  let threatMode = false;

  function getTimestamp() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}.${now.getMilliseconds().toString().padStart(3,'0')}`;
  }

  function addLog(entry) {
    const div = document.createElement('div');
    div.className = `log-entry ${entry.type}`;
    div.innerHTML = `<span class="log-ts">${getTimestamp()}</span><span class="log-level">[${entry.agent}]</span><span class="log-msg">${entry.msg}</span>`;
    logBody.appendChild(div);
    logBody.scrollTop = logBody.scrollHeight;
    // Keep max 50 entries
    while (logBody.children.length > 50) logBody.removeChild(logBody.firstChild);
  }

  function streamLog() {
    if (!threatMode) {
      addLog(logMessages[logIdx % logMessages.length]);
      logIdx++;
    }
  }

  const logInterval = setInterval(streamLog, 1200);

  // Clear log
  const clearBtn = document.getElementById('clear-log-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => { logBody.innerHTML = ''; logIdx = 0; });

  // Simulate attack
  const simBtn = document.getElementById('simulate-attack-btn');
  const threatRows = document.querySelectorAll('.threat-row');
  let threatIdx = 0;

  function raiseThreat(rowEl, level, scoreText) {
    const fill = rowEl.querySelector('.threat-fill');
    const score = rowEl.querySelector('.threat-score');
    fill.style.width = `${level}%`;
    fill.className = `threat-fill ${level > 60 ? 'high' : level > 30 ? 'medium' : ''}`;
    score.textContent = scoreText;
    score.className = `threat-score ${level > 60 ? 'high' : level > 30 ? 'medium' : ''}`;
    rowEl.style.borderColor = level > 60 ? 'var(--color-error)' : level > 30 ? 'var(--color-warning)' : 'var(--color-border)';
  }

  function resetThreats() {
    threatRows[0] && raiseThreat(threatRows[0], 12, 'LOW');
    threatRows[1] && raiseThreat(threatRows[1], 7, 'LOW');
    threatRows[2] && raiseThreat(threatRows[2], 3, 'LOW');
    threatRows[3] && raiseThreat(threatRows[3], 5, 'LOW');
  }

  if (simBtn) {
    simBtn.addEventListener('click', () => {
      simBtn.disabled = true;
      simBtn.textContent = 'Simulating…';
      threatMode = true;

      // Escalate threats
      setTimeout(() => { threatRows[0] && raiseThreat(threatRows[0], 45, 'MED'); }, 300);
      setTimeout(() => { threatRows[2] && raiseThreat(threatRows[2], 38, 'MED'); }, 600);
      setTimeout(() => { threatRows[1] && raiseThreat(threatRows[1], 82, 'HIGH'); }, 1000);
      setTimeout(() => { threatRows[3] && raiseThreat(threatRows[3], 55, 'MED'); }, 1300);

      // Stream threat logs
      let ti = 0;
      const tInterval = setInterval(() => {
        if (ti < threatMessages.length) {
          addLog(threatMessages[ti]);
          ti++;
        } else {
          clearInterval(tInterval);
        }
      }, 500);

      // Recovery
      setTimeout(() => {
        resetThreats();
        threatMode = false;
        simBtn.disabled = false;
        simBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Simulate Attack Vector';
      }, 6000);
    });
  }

  // Start streaming when section is visible
  const auditorSection = document.getElementById('auditor');
  if (auditorSection) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && logBody.children.length === 0) {
          for (let i = 0; i < 5; i++) setTimeout(() => addLog(logMessages[i]), i * 200);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(auditorSection);
  }
})();

// ─── ACTIVE NAV LINK ───
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--color-primary)' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => obs.observe(s));
})();

console.log('%cSENTIENT SYNC ENGINE v2.4.0-beta', 'color:#00e5ff;font-family:monospace;font-size:14px;font-weight:bold');
console.log('%cZero-Defect Protocol Active | NIST PQC | OWASP LLM | IEEE P2842', 'color:#6a7f99;font-family:monospace;font-size:11px');
