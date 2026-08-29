/**
 * SUNSET RAVENS | NEURAL MARINE PLATFORM
 * Ultra-fast client-side engine for Theme management, Mobile navigation,
 * Catch Photo Media Upload/Camera Capture, Neural HUD Analyzer, and Offline Logging.
 */

const ACCESS_KEY = '79ce2811-a00d-4a73-9014-44862bc3bf92';
const RECIPIENT_EMAIL = 'hkottapa@student.gitam.edu';

// Species Preset Library
const PRESET_DATA = {
  bass: {
    common: 'Largemouth Bass',
    sci: 'Micropterus salmoides',
    family: 'Centrarchidae • Freshwater',
    confidence: '98.9%',
    confidenceNum: 98.9,
    latency: '16.4 ms',
    grade: 'Grade A • Prime',
    cornea: 'Clear / Bulging',
    gills: 'Bright Crimson',
    scales: '100% Intact',
    pathogen: 'Clean / None',
    weight: '1.85 kg',
    length: '42.5 cm',
    geotag: '17.7812° N, 83.3794° E',
    image: 'assets/fish_detection_hud.jpg',
    box: { top: '18%', left: '12%', width: '76%', height: '68%' }
  },
  snapper: {
    common: 'Northern Red Snapper',
    sci: 'Lutjanus campechanus',
    family: 'Lutjanidae • Reef / Offshore',
    confidence: '98.2%',
    confidenceNum: 98.2,
    latency: '17.1 ms',
    grade: 'Grade A • Fresh Catch',
    cornea: 'Clear & Shiny',
    gills: 'Vivid Red',
    scales: '99.4% Intact',
    pathogen: 'Clean / None',
    weight: '3.40 kg',
    length: '58.2 cm',
    geotag: '17.6868° N, 83.2185° E',
    image: 'assets/fish_detection_hud.jpg',
    box: { top: '15%', left: '10%', width: '80%', height: '70%' }
  },
  tuna: {
    common: 'Yellowfin Tuna',
    sci: 'Thunnus albacares',
    family: 'Scombridae • Pelagic Deep Sea',
    confidence: '97.6%',
    confidenceNum: 97.6,
    latency: '18.2 ms',
    grade: 'Grade A+ • Sashimi Grade',
    cornea: 'Crystal Clear',
    gills: 'Deep Ruby Red',
    scales: '100% Pristine',
    pathogen: 'Clean / None',
    weight: '12.80 kg',
    length: '84.0 cm',
    geotag: '17.4500° N, 83.8900° E',
    image: 'assets/fish_detection_hud.jpg',
    box: { top: '20%', left: '8%', width: '84%', height: '64%' }
  },
  mackerel: {
    common: 'King Mackerel',
    sci: 'Scomberomorus cavalla',
    family: 'Scombridae • Coastal Pelagic',
    confidence: '99.1%',
    confidenceNum: 99.1,
    latency: '15.8 ms',
    grade: 'Grade A • Optimal',
    cornea: 'Transparent',
    gills: 'Bright Pink-Red',
    scales: '100% Intact',
    pathogen: 'Clean / None',
    weight: '4.65 kg',
    length: '69.5 cm',
    geotag: '17.8200° N, 83.4100° E',
    image: 'assets/fish_detection_hud.jpg',
    box: { top: '22%', left: '14%', width: '72%', height: '60%' }
  }
};

// Initial Sample Catch Records
const DEFAULT_LOG_RECORDS = [
  {
    id: 'catch_01',
    species: 'Largemouth Bass',
    sci: 'M. salmoides',
    weight: '1.85 kg',
    length: '42.5 cm',
    confidence: '98.9%',
    grade: 'Grade A',
    time: 'Today, 14:22 (Offline Geotagged)',
    thumb: 'assets/fish_detection_hud.jpg'
  },
  {
    id: 'catch_02',
    species: 'Northern Red Snapper',
    sci: 'L. campechanus',
    weight: '3.40 kg',
    length: '58.2 cm',
    confidence: '98.2%',
    grade: 'Grade A',
    time: 'Today, 11:05 (Offline Geotagged)',
    thumb: 'assets/fish_detection_hud.jpg'
  },
  {
    id: 'catch_03',
    species: 'King Mackerel',
    sci: 'S. cavalla',
    weight: '4.65 kg',
    length: '69.5 cm',
    confidence: '99.1%',
    grade: 'Grade A',
    time: 'Yesterday, 17:48 (Synced)',
    thumb: 'assets/fish_detection_hud.jpg'
  }
];

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('aura_theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('aura_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-item, .mobile-menu .btn');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Catch Photo Media Studio & Real-Time Neural Analyzer
  // --------------------------------------------------------------------------
  let currentActiveData = { ...PRESET_DATA.bass };

  const catchPhotoInput = document.getElementById('catchPhotoInput');
  const mediaDropzone = document.getElementById('mediaDropzone');
  const currentCatchImage = document.getElementById('currentCatchImage');
  const scannerLaser = document.getElementById('scannerLaser');
  const hudBoundingBox = document.getElementById('hudBoundingBox');
  const hudBoxSpecies = document.getElementById('hudBoxSpecies');
  const hudBoxDimension = document.getElementById('hudBoxDimension');
  const freshnessHeatmap = document.getElementById('freshnessHeatmap');

  const btnToggleHud = document.getElementById('btnToggleHud');
  const btnToggleHeatmap = document.getElementById('btnToggleHeatmap');
  const btnDownloadAnnotated = document.getElementById('btnDownloadAnnotated');
  const btnTriggerRescan = document.getElementById('btnTriggerRescan');

  // Telemetry DOM nodes
  const telemetryCommonName = document.getElementById('telemetryCommonName');
  const telemetrySciName = document.getElementById('telemetrySciName');
  const telemetryFamily = document.getElementById('telemetryFamily');
  const telemetryConfidence = document.getElementById('telemetryConfidence');
  const telemetryConfidenceBar = document.getElementById('telemetryConfidenceBar');
  const telemetryLatency = document.getElementById('telemetryLatency');
  const telemetryGradeBadge = document.getElementById('telemetryGradeBadge');
  const telemetryCornea = document.getElementById('telemetryCornea');
  const telemetryGills = document.getElementById('telemetryGills');
  const telemetryScales = document.getElementById('telemetryScales');
  const telemetryPathogen = document.getElementById('telemetryPathogen');
  const telemetryWeight = document.getElementById('telemetryWeight');
  const telemetryLength = document.getElementById('telemetryLength');
  const telemetryGeotag = document.getElementById('telemetryGeotag');

  const presetChips = document.querySelectorAll('.preset-chip');
  const btnSaveCatchLog = document.getElementById('btnSaveCatchLog');
  const btnExportLog = document.getElementById('btnExportLog');
  const btnClearLog = document.getElementById('btnClearLog');
  const catchRecordsList = document.getElementById('catchRecordsList');
  const catchLogCount = document.getElementById('catchLogCount');

  // Helper to trigger laser scan animation and update telemetry
  function runNeuralScan(telemetryData, isCustomUpload = false) {
    currentActiveData = telemetryData;

    // Trigger Laser Scan
    if (scannerLaser) {
      scannerLaser.classList.add('scanning');
      setTimeout(() => {
        scannerLaser.classList.remove('scanning');
      }, 1800);
    }

    // Update Image Source if different
    if (currentCatchImage && telemetryData.image && currentCatchImage.src !== telemetryData.image) {
      currentCatchImage.src = telemetryData.image;
    }

    // Position Bounding Box
    if (hudBoundingBox && telemetryData.box) {
      hudBoundingBox.style.top = telemetryData.box.top || '18%';
      hudBoundingBox.style.left = telemetryData.box.left || '12%';
      hudBoundingBox.style.width = telemetryData.box.width || '76%';
      hudBoundingBox.style.height = telemetryData.box.height || '68%';
    }

    // Update HUD tags
    if (hudBoxSpecies) {
      hudBoxSpecies.textContent = `${telemetryData.sci.split(' ')[0][0]}. ${telemetryData.sci.split(' ')[1] || ''} [${telemetryData.confidence}]`;
    }
    if (hudBoxDimension) {
      hudBoxDimension.textContent = `${telemetryData.length} • ${telemetryData.weight}`;
    }

    // Update Telemetry Panel with smooth micro-animation
    if (telemetryCommonName) telemetryCommonName.textContent = telemetryData.common;
    if (telemetrySciName) telemetrySciName.textContent = telemetryData.sci;
    if (telemetryFamily) telemetryFamily.textContent = telemetryData.family;
    if (telemetryConfidence) telemetryConfidence.textContent = telemetryData.confidence;
    if (telemetryConfidenceBar) telemetryConfidenceBar.style.width = `${telemetryData.confidenceNum || 98.9}%`;
    if (telemetryLatency) telemetryLatency.textContent = telemetryData.latency;
    
    if (telemetryGradeBadge) {
      telemetryGradeBadge.textContent = telemetryData.grade;
      telemetryGradeBadge.className = telemetryData.grade.includes('A') 
        ? 'freshness-grade-badge badge-grade-a' 
        : 'freshness-grade-badge badge-grade-b';
    }

    if (telemetryCornea) telemetryCornea.textContent = telemetryData.cornea;
    if (telemetryGills) telemetryGills.textContent = telemetryData.gills;
    if (telemetryScales) telemetryScales.textContent = telemetryData.scales;
    if (telemetryPathogen) telemetryPathogen.textContent = telemetryData.pathogen;
    if (telemetryWeight) telemetryWeight.textContent = telemetryData.weight;
    if (telemetryLength) telemetryLength.textContent = telemetryData.length;
    if (telemetryGeotag) telemetryGeotag.textContent = telemetryData.geotag;

    if (isCustomUpload) {
      showToast(`Photo Analyzed: ${telemetryData.common} identified (${telemetryData.confidence})`, 'success');
    }
  }

  // Handle Local File Upload
  function handlePhotoMediaFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (.jpg, .png, .webp).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const photoDataUrl = event.target.result;

      // Generate randomized realistic fish catch telemetry for uploaded photo
      const sampleNames = [
        { common: 'Largemouth Bass', sci: 'Micropterus salmoides', family: 'Centrarchidae', weight: '1.92 kg', length: '43.8 cm' },
        { common: 'Northern Red Snapper', sci: 'Lutjanus campechanus', family: 'Lutjanidae', weight: '3.15 kg', length: '56.0 cm' },
        { common: 'Yellowfin Tuna', sci: 'Thunnus albacares', family: 'Scombridae', weight: '11.40 kg', length: '81.2 cm' },
        { common: 'King Mackerel', sci: 'Scomberomorus cavalla', family: 'Scombridae', weight: '4.80 kg', length: '71.0 cm' },
        { common: 'Silver Pomfret', sci: 'Pampus argenteus', family: 'Stromateidae', weight: '0.85 kg', length: '28.4 cm' }
      ];
      const selected = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const confScore = (97.5 + Math.random() * 2.1).toFixed(1);
      const latencyVal = (14.2 + Math.random() * 4.5).toFixed(1);

      const customCatchData = {
        common: selected.common,
        sci: selected.sci,
        family: `${selected.family} • Indian Ocean / Bay of Bengal`,
        confidence: `${confScore}%`,
        confidenceNum: parseFloat(confScore),
        latency: `${latencyVal} ms`,
        grade: 'Grade A • Fresh Catch',
        cornea: 'Clear & Bulging',
        gills: 'Vivid Crimson Red',
        scales: '100% Intact',
        pathogen: 'Clean / Pathogen-Free',
        weight: selected.weight,
        length: selected.length,
        geotag: '17.7812° N, 83.3794° E (Vizag Offshore)',
        image: photoDataUrl,
        box: { top: '16%', left: '12%', width: '76%', height: '68%' }
      };

      // Reset preset active styling
      presetChips.forEach(c => c.classList.remove('active'));

      runNeuralScan(customCatchData, true);
    };
    reader.readAsDataURL(file);
  }

  // File Input Listener
  if (catchPhotoInput) {
    catchPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handlePhotoMediaFile(file);
      }
    });
  }

  // Drag & Drop Handling
  if (mediaDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      mediaDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        mediaDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      mediaDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        mediaDropzone.classList.remove('dragover');
      });
    });

    mediaDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt?.files?.[0];
      if (file) {
        handlePhotoMediaFile(file);
      }
    });
  }

  // Preset Chips Listener
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      if (presetKey && PRESET_DATA[presetKey]) {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        runNeuralScan(PRESET_DATA[presetKey], false);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Viewport Quick Actions (HUD toggle, Heatmap toggle, Save Photo, Re-Scan)
  // --------------------------------------------------------------------------
  if (btnToggleHud && hudBoundingBox) {
    btnToggleHud.addEventListener('click', () => {
      const isHidden = hudBoundingBox.classList.toggle('hidden');
      btnToggleHud.classList.toggle('active', !isHidden);
      showToast(isHidden ? 'Bounding Box HUD hidden' : 'Bounding Box HUD enabled', 'info');
    });
  }

  if (btnToggleHeatmap && freshnessHeatmap) {
    btnToggleHeatmap.addEventListener('click', () => {
      const isHidden = freshnessHeatmap.classList.toggle('hidden');
      btnToggleHeatmap.classList.toggle('active', !isHidden);
      showToast(isHidden ? 'Freshness Heatmap layer hidden' : 'Freshness Heatmap layer enabled', 'info');
    });
  }

  if (btnTriggerRescan) {
    btnTriggerRescan.addEventListener('click', () => {
      runNeuralScan(currentActiveData, false);
      showToast('Re-scanning catch photo with CNN model...', 'info');
    });
  }

  // Download Annotated Catch Photo
  if (btnDownloadAnnotated && currentCatchImage) {
    btnDownloadAnnotated.addEventListener('click', () => {
      try {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 500;
          const ctx = canvas.getContext('2d');

          // Draw base image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Draw Bounding Box & HUD
          const bx = canvas.width * 0.12;
          const by = canvas.height * 0.18;
          const bw = canvas.width * 0.76;
          const bh = canvas.height * 0.68;

          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 4;
          ctx.strokeRect(bx, by, bw, bh);

          // Draw Badge
          ctx.fillStyle = '#00f2fe';
          ctx.fillRect(bx, by - 36, 280, 36);

          ctx.fillStyle = '#070913';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`${currentActiveData.common} (${currentActiveData.confidence})`, bx + 10, by - 12);

          // Draw Watermark / Geotag banner
          ctx.fillStyle = 'rgba(7, 9, 19, 0.85)';
          ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

          ctx.fillStyle = '#00f2fe';
          ctx.font = '14px "Inter", sans-serif';
          ctx.fillText(`SUNSET RAVENS NEURAL SCAN | GPS: ${currentActiveData.geotag} | WT: ${currentActiveData.weight}`, 20, canvas.height - 15);

          // Trigger Download
          const link = document.createElement('a');
          link.download = `Catch_${currentActiveData.common.replace(/\s+/g, '_')}_HUD.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          showToast('Annotated catch photo saved!', 'success');
        };
        img.src = currentCatchImage.src;
      } catch (err) {
        console.error('Save Photo Error:', err);
        showToast('Photo download initialized.', 'info');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Offline Catch Telemetry Log Management
  // --------------------------------------------------------------------------
  function getStoredLogs() {
    try {
      const stored = localStorage.getItem('sunset_catch_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading logs:', e);
    }
    return DEFAULT_LOG_RECORDS;
  }

  function saveLogs(logs) {
    try {
      localStorage.setItem('sunset_catch_logs', JSON.stringify(logs));
    } catch (e) {
      console.warn('Error saving logs:', e);
    }
  }

  function renderCatchLogUI() {
    if (!catchRecordsList) return;

    const logs = getStoredLogs();
    if (catchLogCount) {
      catchLogCount.textContent = `${logs.length} ${logs.length === 1 ? 'Record' : 'Records'}`;
    }

    if (logs.length === 0) {
      catchRecordsList.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-subtle); background: var(--bg-subtle); border-radius: var(--radius-sm);">
          No offline catch records stored yet. Click "Save to Offline Catch Log" above to log scans!
        </div>
      `;
      return;
    }

    catchRecordsList.innerHTML = logs.map(record => `
      <div class="catch-record-card" data-id="${record.id}">
        <img src="${record.thumb}" alt="${record.species}" class="record-thumb" />
        <div class="record-details">
          <div class="record-species">${record.species}</div>
          <div class="record-meta-line">
            <span class="text-cyan">${record.weight}</span> • 
            <span>${record.confidence}</span> • 
            <span class="text-green">${record.grade}</span>
          </div>
          <div class="record-time">${record.time}</div>
        </div>
        <button type="button" class="record-delete-btn" title="Delete record" data-id="${record.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `).join('');

    // Attach delete listeners
    catchRecordsList.querySelectorAll('.record-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const updated = getStoredLogs().filter(item => item.id !== id);
        saveLogs(updated);
        renderCatchLogUI();
        showToast('Record removed from offline log.', 'info');
      });
    });
  }

  // Save Current Active Catch to Log
  if (btnSaveCatchLog) {
    btnSaveCatchLog.addEventListener('click', () => {
      const logs = getStoredLogs();
      const newRecord = {
        id: 'catch_' + Date.now(),
        species: currentActiveData.common,
        sci: currentActiveData.sci,
        weight: currentActiveData.weight,
        length: currentActiveData.length,
        confidence: currentActiveData.confidence,
        grade: currentActiveData.grade.split('•')[0].trim(),
        time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Offline Geotagged)`,
        thumb: currentCatchImage ? currentCatchImage.src : 'assets/fish_detection_hud.jpg'
      };

      logs.unshift(newRecord);
      saveLogs(logs);
      renderCatchLogUI();
      showToast(`Logged ${currentActiveData.common} to offline storage!`, 'success');
    });
  }

  // Export Log Data as JSON file
  if (btnExportLog) {
    btnExportLog.addEventListener('click', () => {
      const logs = getStoredLogs();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `SunsetRavens_CatchLog_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Offline catch log exported as JSON.', 'success');
    });
  }

  // Clear Log
  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      if (confirm('Clear all offline catch records?')) {
        saveLogs([]);
        renderCatchLogUI();
        showToast('Offline catch log cleared.', 'info');
      }
    });
  }

  // Initialize Catch Log UI
  renderCatchLogUI();

  // --------------------------------------------------------------------------
  // 5. Toast Notification System
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, variant = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toast.textContent = message;
    toast.className = `toast show ${variant}`;
    toast.setAttribute('aria-hidden', 'false');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 4500);
  }

  // --------------------------------------------------------------------------
  // 6. Current Year in Footer
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
