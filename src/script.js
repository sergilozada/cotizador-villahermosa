const state = {
  allLots: [],
  filteredLots: [],
  selectedLot: null,
  savedQuotes: [],
  currentUser: null,
  promoBanderaBlancaCodes: [],
};

const users = {
  'd.guerra': {
    advisor: 'Dixon Guerra',
    fullName: 'Dixon Jamir Guerra Armejo',
    phone: '912131159',
    photo: '/src/assets/DIXON.jpeg',
  },
  'l.villanueva': {
    advisor: 'Lizbeth Villanueva',
    fullName: 'Lizbeth Antonia Villanueva Chávez',
    phone: '938697119',
    photo: '/src/assets/LISBETH.jpeg',
  },
  'y.montoya': {
    advisor: 'Yvonne Montoya',
    fullName: 'Teresa Yvonne Montoya Acosta',
    phone: '906522870',
    photo: '/src/assets/TERESA.jpeg',
  },
};

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(value)) return '-';

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
};

const query = (selector) => document.querySelector(selector);

const lotsTable = query('#lotsTable');
const termSelect = query('#termSelect');
const codigoInput = query('#codigoInput');
const clienteInput = query('#clienteInput');
const asesorSelect = query('#asesorSelect');
const fechaInput = query('#fechaInput');

const loginOverlay = query('#loginOverlay');
const appContent = query('#appContent');
const usernameInput = query('#usernameInput');
const passwordInput = query('#passwordInput');
const loginButton = query('#loginButton');

const mzInput = query('#mzInput');
const loteInput = query('#loteInput');
const etapaInput = query('#etapaInput');
const ubicacionInput = query('#ubicacionInput');
const metrajeInput = query('#metrajeInput');

const descuentoPreventaInput = query('#descuentoPreventaInput');
const cashDiscountInput = query('#cashDiscountInput');
const initialInput = query('#initialInput');

const priceListValue = query('#priceListValue');
const finalPriceValue = query('#finalPriceValue');
const monthlyPaymentValue = query('#monthlyPaymentValue');
const systemValue = query('#systemValue');
const cashPriceListValue = query('#cashPriceListValue');
const cashFinalValue = query('#cashFinalValue');
const promoBanderaBlancaMessage = query('#promoBanderaBlancaMessage');

const summaryCard = query('#summaryCard');
const copySummaryButton = query('#copySummaryButton');
const printSummaryButton = query('#printSummaryButton');
const saveQuoteButton = query('#saveQuoteButton');

const savedQuotesList = query('#savedQuotesList');
const clearHistoryButton = query('#clearHistoryButton');

const advisorPhotoCheckCard = query('#advisorPhotoCheckCard');
const advisorPhotoCheckImage = query('#advisorPhotoCheckImage');

const STORAGE_KEY = 'villa_hermosa_cotizaciones';
const MAX_FINANCE_TERM = 84;
const ACCESS_PASSWORD = 'VH-Agosto2026!';
const PROMO_BANDERA_BLANCA_CODES = [
  'G2',
  'G3',
  'G4',
  'G5',
  'G6',
  'I2',
  'I3',
  'I4',
  'I5',
  'I6',
];

const showLoginError = (message) => {
  const errorElement = query('.login-error');
  if (errorElement) errorElement.textContent = message;
};

const getPromoBanderaBlancaCodes = (lots) =>
  lots
    .filter(
      (lot) =>
        String(lot.etapa) === '2' &&
        lot.promoBanderaBlanca != null &&
        lot.promoBanderaBlanca !== '' &&
        PROMO_BANDERA_BLANCA_CODES.includes(lot.codigo)
    )
    .map((lot) => lot.codigo);

const isPromoBanderaBlancaEligible = (lot) =>
  Boolean(
    lot &&
      lot.codigo &&
      lot.promoBanderaBlanca != null &&
      state.promoBanderaBlancaCodes.includes(lot.codigo)
  );

const updatePromoBanderaBlancaMessage = () => {
  if (!promoBanderaBlancaMessage) return;

  const lot = state.selectedLot;

  if (!isPromoBanderaBlancaEligible(lot)) {
    promoBanderaBlancaMessage.textContent = '';
    promoBanderaBlancaMessage.classList.add('hidden');
    return;
  }

  promoBanderaBlancaMessage.innerHTML = `
    Promoción Bandera Blanca exclusiva:
    <strong>${formatCurrency(Number(lot.promoBanderaBlanca))}</strong>
    precio especial al contado para este lote.
  `;
  promoBanderaBlancaMessage.classList.remove('hidden');
};

const updateAdvisorPhotoCheck = (user) => {
  if (!advisorPhotoCheckImage) return;

  if (!user || !user.photo) {
    advisorPhotoCheckImage.removeAttribute('src');

    if (advisorPhotoCheckCard) {
      advisorPhotoCheckCard.classList.add('hidden');
    }

    return;
  }

  advisorPhotoCheckImage.src = user.photo;
  advisorPhotoCheckImage.alt = `Fotocheck de ${user.fullName || user.advisor}`;

  if (advisorPhotoCheckCard) {
    advisorPhotoCheckCard.classList.remove('hidden');
  }
};

const setCurrentUser = (username) => {
  state.currentUser = username;

  const user = users[username];

  if (user) {
    asesorSelect.value = user.advisor;
    updateAdvisorPhotoCheck(user);
  }
};

const handleLogin = () => {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!users[username]) {
    showLoginError('Usuario no válido.');
    return;
  }

  if (password !== ACCESS_PASSWORD) {
    showLoginError('Contraseña incorrecta.');
    return;
  }

  setCurrentUser(username);
  showLoginError('');

  loginButton.disabled = true;

  loginOverlay.classList.add('login-success');

  setTimeout(() => {
    loginOverlay.classList.add('hidden');
    appContent.classList.remove('hidden');
    appContent.classList.add('app-enter');

    usernameInput.value = '';
    passwordInput.value = '';
    loginButton.disabled = false;
  }, 650);
};

const loadData = async () => {
  try {
    const response = await fetch('/data/precios.json');

    state.allLots = await response.json();
    state.filteredLots = [...state.allLots];
    state.promoBanderaBlancaCodes = getPromoBanderaBlancaCodes(state.allLots);

    renderLotsTable();

    fechaInput.value = getTodayDateValue();

    loadSavedQuotes();
  } catch (error) {
    console.error('Error cargando datos:', error);

    summaryCard.innerHTML =
      '<p class="empty-state">No se pudo cargar los datos de precios.</p>';
  }
};

const renderLotsTable = () => {
  lotsTable.innerHTML = '';

  if (!state.filteredLots.length) {
    lotsTable.innerHTML =
      '<tr><td colspan="6">No se encontraron lotes disponibles.</td></tr>';
    return;
  }

  state.filteredLots.forEach((lot) => {
    const row = document.createElement('tr');
    row.dataset.codigo = lot.codigo;

    if (state.selectedLot && state.selectedLot.codigo === lot.codigo) {
      row.classList.add('selected');
    }

    row.innerHTML = `
      <td>${lot.codigo}</td>
      <td>${lot.lote}</td>
      <td>${lot.etapa}</td>
      <td>${lot.ubicacion}</td>
      <td>${lot.area ?? '-'}</td>
      <td>${formatCurrency(lot.precioFinal)}</td>
    `;

    row.addEventListener('click', () => {
      selectLot(lot);

      document
        .querySelectorAll('tbody tr')
        .forEach((item) => item.classList.remove('selected'));

      row.classList.add('selected');
    });

    lotsTable.appendChild(row);
  });
};

const formatISODate = (date) => date.toISOString().slice(0, 10);

const getTodayDateValue = () => formatISODate(new Date());

const findLotByCodigo = (codigo) => {
  if (!codigo) return null;

  const normalized = codigo.trim().toUpperCase();

  return (
    state.allLots.find((lot) => lot.codigo?.toUpperCase() === normalized) ||
    null
  );
};

const clearSelectedLotDetails = () => {
  state.selectedLot = null;

  mzInput.value = '';
  loteInput.value = '';
  etapaInput.value = '';
  ubicacionInput.value = '';
  metrajeInput.value = '';

  priceListValue.textContent = '-';
  finalPriceValue.textContent = '-';
  cashPriceListValue.textContent = '-';
  cashFinalValue.textContent = '-';
  monthlyPaymentValue.textContent = '-';

  descuentoPreventaInput.value = 0;
  cashDiscountInput.value = 0;
  initialInput.value = 0;

  updatePromoBanderaBlancaMessage();
  disableActions();
  updateSummary();
  renderLotsTable();
};

const handleCodigoInput = () => {
  const code = codigoInput.value.trim();

  if (!code) {
    clearSelectedLotDetails();
    return;
  }

  const lot = findLotByCodigo(code);

  if (lot) {
    if (!state.selectedLot || state.selectedLot.codigo !== lot.codigo) {
      selectLot(lot);
    } else {
      updateSummary();
    }
  } else {
    clearSelectedLotDetails();
  }
};

const selectLot = (lot) => {
  state.selectedLot = lot;

  codigoInput.value = lot.codigo || '';

  if (!clienteInput.value.trim()) {
    clienteInput.value = '';
  }

  if (!fechaInput.value) {
    fechaInput.value = getTodayDateValue();
  }

  mzInput.value = lot.mz || '';
  loteInput.value = lot.lote || '';
  etapaInput.value = lot.etapa || '';
  ubicacionInput.value = lot.ubicacion || '';
  metrajeInput.value = lot.area != null ? `${lot.area} m²` : '';

  descuentoPreventaInput.value =
    lot.descuentoPreventa != null ? lot.descuentoPreventa : 0;

  cashDiscountInput.value =
    lot.descuentoContado != null ? lot.descuentoContado : 0;

  const etapa = lot.etapa || '';

  if (etapa === '1') {
    initialInput.value = 6000;
  } else if (etapa === '2' || etapa === '3') {
    initialInput.value = 2000;
  } else {
    initialInput.value = lot.inicial != null ? lot.inicial : 0;
  }

  if (lot.cuota84 != null) {
    termSelect.value = MAX_FINANCE_TERM;
  }

  enableActions();
  renderLotsTable();
  updateSummary();
};

const getTotals = () => {
  if (!state.selectedLot) return null;

  const precioLista = state.selectedLot.precioLista || 0;

  let descuentoPreventa = Number(descuentoPreventaInput.value);

  if (Number.isNaN(descuentoPreventa) || descuentoPreventa < 0) {
    descuentoPreventa = state.selectedLot.descuentoPreventa || 0;
  }

  let cashDiscount = Number(cashDiscountInput.value);

  if (Number.isNaN(cashDiscount) || cashDiscount < 0) {
    cashDiscount = 0;
  }

  let initialValue = Number(initialInput.value);

  if (Number.isNaN(initialValue) || initialValue < 0) {
    initialValue = state.selectedLot.inicial || 0;
  }

  let term = Math.trunc(Number(termSelect.value));

  if (Number.isNaN(term) || term < 1) {
    term = 1;
  } else if (term > MAX_FINANCE_TERM) {
    term = MAX_FINANCE_TERM;
  }

  termSelect.value = term;

  const usesDefaultPreventaDiscount =
    state.selectedLot.descuentoPreventa != null &&
    descuentoPreventa === Number(state.selectedLot.descuentoPreventa);

  const usesDefaultCashDiscount =
    state.selectedLot.descuentoContado != null &&
    cashDiscount === Number(state.selectedLot.descuentoContado);

  const precioFinal =
    usesDefaultPreventaDiscount && state.selectedLot.precioFinal != null
      ? Number(state.selectedLot.precioFinal)
      : Math.max(0, precioLista - descuentoPreventa);

  const cashFinal =
    usesDefaultCashDiscount && state.selectedLot.precioFinalContado != null
      ? Number(state.selectedLot.precioFinalContado)
      : Math.max(0, precioLista - cashDiscount);
  const financedAmount = Math.max(0, precioFinal - initialValue);
  const monthlyPayment = term > 0 ? financedAmount / term : 0;

  return {
    precioLista,
    descuentoPreventa,
    cashDiscount,
    precioFinal,
    cashFinal,
    initialValue,
    financedAmount,
    monthlyPayment,
    term,
  };
};

const updateSummary = () => {
  if (!state.selectedLot) {
    summaryCard.innerHTML =
      '<p class="empty-state">Selecciona un lote de la lista para ver el detalle.</p>';

    disableActions();
    return;
  }

  const totals = getTotals();

  if (!totals) return;

  priceListValue.textContent = formatCurrency(totals.precioLista);
  descuentoPreventaInput.value = totals.descuentoPreventa;
  finalPriceValue.textContent = formatCurrency(totals.precioFinal);
  initialInput.value = totals.initialValue;
  monthlyPaymentValue.textContent = formatCurrency(totals.monthlyPayment);

  systemValue.textContent = 'FINANCIADO';

  cashPriceListValue.textContent = formatCurrency(totals.precioLista);
  cashDiscountInput.value = totals.cashDiscount;
  cashFinalValue.textContent = formatCurrency(totals.cashFinal);
  updatePromoBanderaBlancaMessage();

  summaryCard.innerHTML = `
    <dl class="summary-list">
      <dt>Código</dt><dd>${codigoInput.value || '-'}</dd>
      <dt>Cliente</dt><dd>${clienteInput.value || '-'}</dd>
      <dt>Lote</dt><dd>${state.selectedLot.lote || '-'}</dd>
      <dt>Etapa</dt><dd>${state.selectedLot.etapa || '-'}</dd>
      <dt>Ubicación</dt><dd>${state.selectedLot.ubicacion || '-'}</dd>
      <dt>Área</dt><dd>${state.selectedLot.area != null ? `${state.selectedLot.area} m²` : '-'}</dd>
      <dt>Asesor</dt><dd>${asesorSelect.value || '-'}</dd>
      <dt>Fecha</dt><dd>${fechaInput.value || '-'}</dd>
      <dt>Precio final financiado</dt><dd>${formatCurrency(totals.precioFinal)}</dd>
      <dt>Precio final contado</dt><dd>${formatCurrency(totals.cashFinal)}</dd>
      <dt>Monto a financiar</dt><dd>${formatCurrency(totals.financedAmount)}</dd>
      <dt>Cuota mensual</dt><dd>${formatCurrency(totals.monthlyPayment)}</dd>
    </dl>
  `;
};

const enableActions = () => {
  copySummaryButton.disabled = false;
  printSummaryButton.disabled = false;
  saveQuoteButton.disabled = false;
};

const disableActions = () => {
  copySummaryButton.disabled = true;
  printSummaryButton.disabled = true;
  saveQuoteButton.disabled = true;
};

const loadSavedQuotes = () => {
  const savedData = localStorage.getItem(STORAGE_KEY);

  state.savedQuotes = savedData ? JSON.parse(savedData) : [];

  renderSavedQuotes();
};

const saveQuotes = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedQuotes));
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const renderSavedQuotes = () => {
  savedQuotesList.innerHTML = '';

  if (!state.savedQuotes.length) {
    savedQuotesList.innerHTML =
      '<p class="empty-state">Aún no guardaste ninguna cotización.</p>';

    return;
  }

  state.savedQuotes.forEach((quote) => {
    const card = document.createElement('div');
    card.className = 'quote-card';

    card.innerHTML = `
      <header>
        <div>
          <strong>${quote.codigo} - ${quote.lote}</strong>
          <p>${formatDate(quote.createdAt)}</p>
        </div>
      </header>

      <p>Cliente: <strong>${quote.cliente || '-'}</strong></p>
      <p>Asesor: <strong>${quote.asesor}</strong></p>
      <p>Descuento pre-venta: <strong>${formatCurrency(quote.descuentoPreventa)}</strong></p>
      <p>Descuento al contado: <strong>${formatCurrency(quote.cashDiscount)}</strong></p>
      <p>Precio final financiado: <strong>${formatCurrency(quote.adjustedFinal)}</strong></p>
      <p>Cuota mensual: <strong>${formatCurrency(quote.monthlyPayment)}</strong></p>

      <div class="quote-actions">
        <button class="button secondary" data-action="load" data-id="${quote.id}">Cargar</button>
        <button class="button danger" data-action="delete" data-id="${quote.id}">Eliminar</button>
      </div>
    `;

    savedQuotesList.appendChild(card);
  });
};

const loadQuote = (id) => {
  const quote = state.savedQuotes.find((item) => item.id === id);

  if (!quote) return;

  const lot =
    state.allLots.find((item) => item.codigo === quote.codigo) ||
    state.allLots[0];

  if (!lot) return;

  selectLot(lot);

  clienteInput.value = quote.cliente || '';
  codigoInput.value = quote.codigo;
  asesorSelect.value = quote.asesor || '';
  fechaInput.value = getTodayDateValue();

  descuentoPreventaInput.value =
    quote.descuentoPreventa != null
      ? quote.descuentoPreventa
      : lot.descuentoPreventa || 0;

  cashDiscountInput.value =
    quote.cashDiscount != null ? quote.cashDiscount : 0;

  termSelect.value = quote.term;
  initialInput.value = quote.initialValue;

  updateSummary();
};

const deleteQuote = (id) => {
  state.savedQuotes = state.savedQuotes.filter((item) => item.id !== id);

  saveQuotes();
  renderSavedQuotes();
};

const clearHistory = () => {
  state.savedQuotes = [];

  saveQuotes();
  renderSavedQuotes();
};

const getCurrentQuote = () => {
  if (!state.selectedLot) return null;

  const totals = getTotals();

  if (!totals) return null;

  return {
    id: `${codigoInput.value || state.selectedLot.codigo}-${Date.now()}`,
    createdAt: fechaInput.value ? new Date(fechaInput.value).getTime() : Date.now(),
    cliente: clienteInput.value.trim(),
    codigo: codigoInput.value.trim() || state.selectedLot.codigo,
    lote: state.selectedLot.lote,
    etapa: state.selectedLot.etapa,
    ubicacion: state.selectedLot.ubicacion,
    area: state.selectedLot.area,
    asesor: asesorSelect.value,
    term: totals.term,
    initialValue: totals.initialValue,
    descuentoPreventa: totals.descuentoPreventa,
    adjustedFinal: totals.precioFinal,
    cashDiscount: totals.cashDiscount,
    financedAmount: totals.financedAmount,
    monthlyPayment: totals.monthlyPayment,
  };
};

const saveCurrentQuote = () => {
  const quote = getCurrentQuote();

  if (!quote) return;

  state.savedQuotes.unshift(quote);

  if (state.savedQuotes.length > 20) {
    state.savedQuotes.pop();
  }

  saveQuotes();
  renderSavedQuotes();
};

const printSummary = () => {
  window.print();
};

const copySummary = () => {
  if (!state.selectedLot) return;

  const totals = getTotals();

  if (!totals) return;

  const promoBanderaBlancaText = isPromoBanderaBlancaEligible(state.selectedLot)
    ? `\nPromoción Bandera Blanca: ${formatCurrency(Number(state.selectedLot.promoBanderaBlanca))}`
    : '';

  const text =
    `${codigoInput.value} - ${state.selectedLot.lote} / Etapa ${state.selectedLot.etapa} / Ubicación ${state.selectedLot.ubicacion}\n` +
    `Cliente: ${clienteInput.value || '-'}\n` +
    `Asesor: ${asesorSelect.value}\n` +
    `Fecha: ${fechaInput.value}\n` +
    `Área: ${state.selectedLot.area ?? '-'} m²\n` +
    `Descuento pre-venta: ${formatCurrency(totals.descuentoPreventa)}\n` +
    `Descuento al contado: ${formatCurrency(totals.cashDiscount)}\n` +
    `Precio final financiado: ${formatCurrency(totals.precioFinal)}\n` +
    `Precio final contado: ${formatCurrency(totals.cashFinal)}\n` +
    `Enganche: ${formatCurrency(totals.initialValue)}\n` +
    `Plazo: ${totals.term} meses\n` +
    `Monto a financiar: ${formatCurrency(totals.financedAmount)}\n` +
    `Cuota mensual: ${formatCurrency(totals.monthlyPayment)}` +
    promoBanderaBlancaText;

  navigator.clipboard.writeText(text).then(() => {
    copySummaryButton.textContent = 'Copiado';

    setTimeout(() => {
      copySummaryButton.textContent = 'Copiar resumen';
    }, 1200);
  });
};

termSelect.addEventListener('input', updateSummary);
termSelect.addEventListener('change', updateSummary);

codigoInput.addEventListener('input', (event) => {
  const value = event.target.value.replace(/\s+/g, '').toUpperCase().slice(0, 3);

  event.target.value = value;

  handleCodigoInput();
});

codigoInput.addEventListener('blur', handleCodigoInput);

codigoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleCodigoInput();
  }
});

clienteInput.addEventListener('input', updateSummary);
asesorSelect.addEventListener('change', updateSummary);
fechaInput.addEventListener('change', updateSummary);
initialInput.addEventListener('input', updateSummary);
descuentoPreventaInput.addEventListener('input', updateSummary);
cashDiscountInput.addEventListener('input', updateSummary);

copySummaryButton.addEventListener('click', copySummary);
printSummaryButton.addEventListener('click', printSummary);
saveQuoteButton.addEventListener('click', saveCurrentQuote);
clearHistoryButton.addEventListener('click', clearHistory);

loginButton.addEventListener('click', handleLogin);

passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleLogin();
  }
});

usernameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    passwordInput.focus();
  }
});

const togglePasswordBtn = query('#togglePasswordBtn');

if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const isPassword = passwordInput.type === 'password';

    passwordInput.type = isPassword ? 'text' : 'password';
  });
}

savedQuotesList.addEventListener('click', (event) => {
  const button = event.target.closest('button');

  if (!button) return;

  const id = button.dataset.id;

  if (!id) return;

  const action = button.dataset.action;

  if (action === 'load') {
    loadQuote(id);
  } else if (action === 'delete') {
    deleteQuote(id);
  }
});

loadData();
