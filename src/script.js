const state = {
  allLots: [],
  filteredLots: [],
  selectedLot: null,
  savedQuotes: [],
  currentUser: null,
  activePlanStage: '2',
  planZoom: 1,
  previewLot: null,
  paymentMode: 'financed',
};

const users = {
  'd.guerra': {
    advisor: 'Dixon Guerra',
    fullName: 'Dixon Jamir Guerra Armejo',
    phone: '912131159',
    photo: '/src/assets/DIXON.jpeg',
    password: 'VH-Agosto2026!',
  },
  'l.villanueva': {
    advisor: 'Lizbeth Villanueva',
    fullName: 'Lizbeth Antonia Villanueva Chávez',
    phone: '938697119',
    photo: '/src/assets/LISBETH.jpeg',
    password: 'VH-Agosto2026!',
  },
  'y.montoya': {
    advisor: 'Yvonne Montoya',
    fullName: 'Teresa Yvonne Montoya Acosta',
    phone: '906522870',
    photo: '/src/assets/TERESA.jpeg',
    password: 'VH-Agosto2026!',
  },
  's.lozada': {
    advisor: 'Sergio Lozada',
    fullName: 'Sergio Lozada',
    phone: '',
    photo: '',
    registration: '',
    password: 'Villahermosa2026',
  },
  't.lozada': {
    advisor: 'Theo Lozada Villegas',
    fullName: 'Theo Lozada Villegas',
    phone: '',
    photo: '',
    registration: '14661-PN-MVCS',
    password: 'Villahermosa2026',
  },
  'j.talavera': {
    advisor: 'Julio Talavera',
    fullName: 'Julio Talavera',
    phone: '',
    photo: '',
    registration: '23773-PN-MVCS',
    password: 'Villahermosa2026',
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

const formatLotReference = (lot) => {
  const code = String(lot?.codigo || '').trim();
  const block = String(lot?.mz || code.replace(/\d.*$/, '') || '—').trim();
  const lotNumber = String(lot?.lote || code.match(/\d+$/)?.[0] || '—').trim();

  return `Mz ${block} Lt ${lotNumber}`;
};

const query = (selector) => document.querySelector(selector);

const lotsTable = query('#lotsTable');
const termSelect = query('#termSelect');
const codigoInput = query('#codigoInput');
const clienteInput = query('#clienteInput');
const asesorSelect = query('#asesorSelect');
const agentRegistrationInput = query('#agentRegistrationInput');
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
const paymentModeInputs = [...document.querySelectorAll('input[name="paymentMode"]')];
const financedPaymentPanel = query('#financedPaymentPanel');
const cashPaymentPanel = query('#cashPaymentPanel');

const summaryCard = query('#summaryCard');
const copySummaryButton = query('#copySummaryButton');
const printSummaryButton = query('#printSummaryButton');
const saveQuoteButton = query('#saveQuoteButton');

const savedQuotesList = query('#savedQuotesList');
const clearHistoryButton = query('#clearHistoryButton');

const advisorPhotoCheckCard = query('#advisorPhotoCheckCard');
const advisorPhotoCheckImage = query('#advisorPhotoCheckImage');

const planViewport = query('#planViewport');
const planCanvas = query('#planCanvas');
const planSvgTitle = query('#planSvgTitle');
const planSvgDescription = query('#planSvgDescription');
const planImage = query('#planImage');
const planHotspots = query('#planHotspots');
const planDataBadge = query('#planDataBadge');
const planStageMessage = query('#planStageMessage');
const planSearchInput = query('#planSearchInput');
const planSearchButton = query('#planSearchButton');
const planZoomOutButton = query('#planZoomOutButton');
const planZoomInButton = query('#planZoomInButton');
const planZoomResetButton = query('#planZoomResetButton');
const planZoomValue = query('#planZoomValue');
const planSelectionLabel = query('#planSelectionLabel');
const lotDetailsDialog = query('#lotDetailsDialog');
const closeLotDetailsButton = query('#closeLotDetailsButton');
const lotDialogCancelButton = query('#lotDialogCancelButton');
const quoteMapLotButton = query('#quoteMapLotButton');
const lotDialogCode = query('#lotDialogCode');
const lotDialogSubtitle = query('#lotDialogSubtitle');
const lotDialogStage = query('#lotDialogStage');
const lotDialogBlock = query('#lotDialogBlock');
const lotDialogLot = query('#lotDialogLot');
const lotDialogArea = query('#lotDialogArea');
const lotDialogLocation = query('#lotDialogLocation');
const lotDialogListPrice = query('#lotDialogListPrice');
const lotDialogLaunchDiscount = query('#lotDialogLaunchDiscount');
const lotDialogFinancedPrice = query('#lotDialogFinancedPrice');
const lotDialogInitial = query('#lotDialogInitial');
const lotDialogInstallment = query('#lotDialogInstallment');
const lotDialogCashDiscount = query('#lotDialogCashDiscount');
const lotDialogCashPrice = query('#lotDialogCashPrice');
const lotDialogDataStatus = query('.lot-data-status');
const lotDialogPaymentMode = query('#lotDialogPaymentMode');
const lotDialogPaymentModeItems = [
  ...document.querySelectorAll('[data-dialog-payment-mode]'),
];

const printQuote = query('#printQuote');
const printClient = query('#printClient');
const printDate = query('#printDate');
const printStage = query('#printStage');
const printLocationCode = query('#printLocationCode');
const printLotCode = query('#printLotCode');
const printBlock = query('#printBlock');
const printLot = query('#printLot');
const printArea = query('#printArea');
const printLocation = query('#printLocation');
const printDescription = query('#printDescription');
const printTermHeaderPrimary = query('#printTermHeaderPrimary');
const printTermHeader30 = query('#printTermHeader30');
const printFinancedPricePrimary = query('#printFinancedPricePrimary');
const printFinancedListPrice = query('#printFinancedListPrice');
const printFinancedLaunchDiscount = query('#printFinancedLaunchDiscount');
const printInitialPrimary = query('#printInitialPrimary');
const printBalancePrimary = query('#printBalancePrimary');
const printInstallmentPrimary = query('#printInstallmentPrimary');
const printFinancedPrice30 = query('#printFinancedPrice30');
const printInitial30 = query('#printInitial30');
const printBalance30 = query('#printBalance30');
const printInstallment30 = query('#printInstallment30');
const printCashList = query('#printCashList');
const printCashDiscount = query('#printCashDiscount');
const printCashFinal = query('#printCashFinal');
const printCashSavings = query('#printCashSavings');
const printPricingSection = query('#printPricingSection');
const printPricingTitle = query('#printPricingTitle');
const printPaymentModeItems = [
  ...document.querySelectorAll('[data-print-payment-mode]'),
];
const printAdvisorName = query('#printAdvisorName');
const printAgentRegistration = query('#printAgentRegistration');
const printAdvisorPhone = query('#printAdvisorPhone');
const printMapSvg = query('#printMapSvg');
const printMapImage = query('#printMapImage');
const printMapMarker = query('#printMapMarker');
const printMapMarkerLabel = query('#printMapMarkerLabel');
let lotDialogTrigger = null;

const STORAGE_KEY = 'villa_hermosa_cotizaciones';
const MAX_FINANCE_TERM = 84;

const PLAN_WIDTH = 3509;
const PLAN_HEIGHT = 4961;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const PLAN_CONFIG = {
  '2': {
    label: 'Etapa 2',
    image: '/src/assets/2da-02.png',
    description: 'Registros del proyecto vinculados con sus datos comerciales disponibles.',
  },
};

const STAGE_TWO_TOP_ROWS = [
  365, 479, 593, 706, 820, 933, 1047, 1161, 1274, 1388,
  1502, 1615, 1729, 1843, 1956, 2070, 2184, 2298, 2411,
];
const STAGE_TWO_BOTTOM_ROWS = [
  2549, 2663, 2776, 2890, 3004, 3117, 3231, 3345, 3458, 3572,
  3686, 3800, 3913, 4027, 4140, 4254, 4368, 4481, 4597,
];
const STAGE_TWO_CENTER_COLUMNS = [1422, 1541, 1659, 1777, 1895, 2013, 2132];

const hasCommercialPricing = (lot) => {
  if (!lot) return false;

  const requiredValues = [
    lot.precioLista,
    lot.descuentoPreventa,
    lot.precioFinal,
    lot.inicial,
    lot.cuota84,
    lot.descuentoContado,
    lot.precioFinalContado,
  ];

  return requiredValues.every(
    (value) => value != null && Number.isFinite(Number(value)) && Number(value) >= 0
  );
};

const isInformationalLot = (lot) =>
  lot?.codigo === 'H9' || lot?.ubicacion === 'LOTE EDUCACIÓN';

const getAllPlanLots = () =>
  state.allLots.filter((lot) => String(lot.etapa) === '2');

const insetGeometry = ({ x, y, width, height }, inset = 4) => ({
  x: x + inset,
  y: y + inset,
  width: Math.max(1, width - inset * 2),
  height: Math.max(1, height - inset * 2),
});

const getPolygonGeometry = (points, scale = 0.985) => {
  const center = points.reduce(
    (result, [x, y]) => ({ x: result.x + x / points.length, y: result.y + y / points.length }),
    { x: 0, y: 0 }
  );
  const insetPoints = points.map(([x, y]) => [
    center.x + (x - center.x) * scale,
    center.y + (y - center.y) * scale,
  ]);
  const xValues = insetPoints.map(([x]) => x);
  const yValues = insetPoints.map(([, y]) => y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    points: insetPoints,
  };
};

const makePlanLot = (stage, mz, lote, area, planGeometry, ubicacion = 'SEGÚN PLANO') => ({
  codigo: `${mz}${lote}`,
  mz,
  lote: String(lote),
  etapa: String(stage),
  area,
  ubicacion,
  planGeometry,
  planOnly: true,
});

const buildStageOnePlanLots = () => {
  const lots = [];
  const upperRows = [
    317, 421, 525, 628, 731, 834, 938, 1041, 1145, 1248,
    1351, 1455, 1558, 1661, 1764, 1868, 1971, 2075, 2178,
  ];
  const lowerRows = [
    2303, 2407, 2510, 2614, 2717, 2820, 2923, 3027, 3130, 3234,
    3337, 3440, 3544, 3647, 3751, 3854, 3957, 4060, 4164,
  ];
  const centerColumns = [1382, 1490, 1597, 1704, 1811, 1918, 2027];
  const pairedRows = [2615, 2718, 2821, 2925, 3028, 3132, 3235, 3338, 3442, 3545, 3648, 3751];

  for (const mz of ['D', 'F']) {
    const [x1, x2] = mz === 'D' ? [931, 1257] : [2151, 2475];

    for (let lote = 1; lote <= 18; lote += 1) {
      const row = 18 - lote;
      lots.push(makePlanLot('1', mz, lote, 200, insetGeometry({
        x: x1,
        y: upperRows[row],
        width: x2 - x1,
        height: upperRows[row + 1] - upperRows[row],
      })));
    }
  }

  for (let row = 0; row < 6; row += 1) {
    lots.push(makePlanLot('1', 'E', 13 + row, 200, insetGeometry({
      x: 1382,
      y: upperRows[row],
      width: 322,
      height: upperRows[row + 1] - upperRows[row],
    })));
    lots.push(makePlanLot('1', 'E', 12 - row, 200, insetGeometry({
      x: 1704,
      y: upperRows[row],
      width: 323,
      height: upperRows[row + 1] - upperRows[row],
    })));
  }

  for (let column = 0; column < 6; column += 1) {
    const lote = column + 1;
    const area = lote === 1 || lote === 6 ? 202.44 : 200.03;
    lots.push(makePlanLot('1', 'E', lote, area, insetGeometry({
      x: centerColumns[column],
      y: 938,
      width: centerColumns[column + 1] - centerColumns[column],
      height: 312,
    })));
  }

  for (let lote = 6; lote <= 23; lote += 1) {
    const row = 23 - lote;
    lots.push(makePlanLot('1', 'C', lote, 200, insetGeometry({
      x: 931,
      y: lowerRows[row],
      width: 326,
      height: lowerRows[row + 1] - lowerRows[row],
    })));
  }

  for (let lote = 4; lote <= 17; lote += 1) {
    const row = 17 - lote;
    lots.push(makePlanLot('1', 'A', lote, 200, insetGeometry({
      x: 2151,
      y: lowerRows[row],
      width: 324,
      height: lowerRows[row + 1] - lowerRows[row],
    })));
  }

  for (let column = 0; column < 6; column += 1) {
    const lote = 17 - column;
    const area = lote === 12 || lote === 17 ? 202.44 : 200.03;
    lots.push(makePlanLot('1', 'B', lote, area, insetGeometry({
      x: centerColumns[column],
      y: 2303,
      width: centerColumns[column + 1] - centerColumns[column],
      height: 312,
    })));
  }

  for (let row = 0; row < 11; row += 1) {
    const rowGeometry = {
      y: pairedRows[row],
      height: pairedRows[row + 1] - pairedRows[row],
    };
    lots.push(makePlanLot('1', 'B', 18 + row, 200, insetGeometry({
      x: 1382,
      width: 322,
      ...rowGeometry,
    })));
    lots.push(makePlanLot('1', 'B', 11 - row, 200, insetGeometry({
      x: 1704,
      width: 323,
      ...rowGeometry,
    })));
  }

  const irregularLots = [
    ['C', 5, null, [[936, 4164], [1258, 4164], [1256, 4257], [936, 4348]]],
    ['C', 4, null, [[936, 4348], [1256, 4257], [1318, 4329], [936, 4507]]],
    ['C', 3, null, [[936, 4507], [1092, 4436], [1230, 4732], [936, 4872]]],
    ['C', 2, null, [[1092, 4436], [1318, 4329], [1458, 4625], [1230, 4732]]],
    ['C', 1, null, [[1318, 4329], [1545, 4222], [1684, 4518], [1458, 4625]]],
    ['A', 1, null, [[1725, 4135], [1950, 4029], [2090, 4326], [1865, 4433]]],
    ['A', 2, null, [[1950, 4029], [2176, 3922], [2316, 4219], [2090, 4326]]],
    ['A', 3, 703.18, [[2151, 3751], [2475, 3751], [2475, 4115], [2316, 4219], [2176, 3922], [2151, 3935]]],
  ];

  irregularLots.forEach(([mz, lote, area, points]) => {
    lots.push(makePlanLot('1', mz, lote, area, getPolygonGeometry(points)));
  });

  return lots;
};

const buildStageThreePlanLots = () => {
  const lots = [];
  const outerLowerRows = [
    3011, 3107, 3204, 3300, 3396, 3492, 3589, 3685, 3782, 3878,
    3974, 4071, 4167, 4263, 4360, 4456, 4552, 4649, 4746,
  ];
  const centerColumns = [1498, 1599, 1699, 1799, 1899, 1998, 2100];
  const centerRows = [
    3301, 3397, 3494, 3590, 3687, 3783, 3879, 3976,
    4072, 4168, 4265, 4361, 4457, 4554, 4650, 4746,
  ];
  const upperLeftRows = [
    936, 1052, 1160, 1257, 1353, 1449, 1545, 1642, 1738, 1835,
    1931, 2027, 2123, 2220, 2316, 2413, 2509, 2605, 2701, 2798,
  ];
  const upperRightRows = [
    775, 871, 967, 1064, 1160, 1257, 1353, 1449, 1545, 1642, 1738,
    1835, 1931, 2027, 2123, 2220, 2316, 2413, 2509, 2605, 2701, 2798, 2894,
  ];

  for (const mz of ['N', 'M']) {
    const [x1, x2] = mz === 'N' ? [1080, 1378] : [2220, 2518];

    for (let lote = 1; lote <= 18; lote += 1) {
      const row = 18 - lote;
      const area = lote === 1 ? 202.5 : 200;
      lots.push(makePlanLot('3', mz, lote, area, insetGeometry({
        x: x1,
        y: outerLowerRows[row],
        width: x2 - x1,
        height: outerLowerRows[row + 1] - outerLowerRows[row],
      })));
    }
  }

  for (let column = 0; column < 6; column += 1) {
    const lote = 21 - column;
    const area = lote === 21 || lote === 16 ? 202.44 : 200.03;
    lots.push(makePlanLot('3', 'Ñ', lote, area, insetGeometry({
      x: centerColumns[column],
      y: 3011,
      width: centerColumns[column + 1] - centerColumns[column],
      height: 290,
    })));
  }

  for (let row = 0; row < 15; row += 1) {
    const rowGeometry = {
      y: centerRows[row],
      height: centerRows[row + 1] - centerRows[row],
    };
    lots.push(makePlanLot('3', 'Ñ', 22 + row, 200, insetGeometry({
      x: 1498,
      width: 301,
      ...rowGeometry,
    })));
    lots.push(makePlanLot('3', 'Ñ', 15 - row, 200, insetGeometry({
      x: 1799,
      width: 301,
      ...rowGeometry,
    })));
  }

  for (let lote = 1; lote <= 19; lote += 1) {
    const row = 19 - lote;
    const area = lote === 19 ? 222.94 : 200;
    lots.push(makePlanLot('3', 'O', lote, area, insetGeometry({
      x: 1080,
      y: upperLeftRows[row],
      width: 298,
      height: upperLeftRows[row + 1] - upperLeftRows[row],
    })));
  }

  for (let lote = 1; lote <= 22; lote += 1) {
    const row = 22 - lote;
    lots.push(makePlanLot('3', 'Q', lote, 200, insetGeometry({
      x: 2220,
      y: upperRightRows[row],
      width: 298,
      height: upperRightRows[row + 1] - upperRightRows[row],
    })));
  }

  const pairedPlanRows = [
    [11, 9, 1416, 1520],
    [12, 8, 1520, 1625],
    [13, 7, 1625, 1731],
  ];

  pairedPlanRows.forEach(([leftLot, rightLot, y1, y2]) => {
    lots.push(makePlanLot('3', 'P', leftLot, 219.25, insetGeometry({
      x: 1498,
      y: y1,
      width: 301,
      height: y2 - y1,
    })));
    lots.push(makePlanLot('3', 'P', rightLot, 219.25, insetGeometry({
      x: 1799,
      y: y1,
      width: 301,
      height: y2 - y1,
    })));
  });

  for (let column = 0; column < 6; column += 1) {
    const lote = column + 1;
    const area = lote === 1 || lote === 6 ? 202.44 : 200.03;
    lots.push(makePlanLot('3', 'P', lote, area, insetGeometry({
      x: centerColumns[column],
      y: 1731,
      width: centerColumns[column + 1] - centerColumns[column],
      height: 292,
    })));
  }

  lots.push(
    makePlanLot(
      '3',
      'P',
      10,
      2408.31,
      getPolygonGeometry([[1498, 976], [2100, 692], [2100, 1416], [1498, 1416]]),
      'LOTE EDUCACIÓN'
    ),
    makePlanLot(
      '3',
      'Q',
      23,
      215.77,
      getPolygonGeometry([[2217, 636], [2391, 554], [2391, 775], [2217, 775]])
    ),
    makePlanLot(
      '3',
      'Q',
      24,
      218.21,
      getPolygonGeometry([[2391, 554], [2521, 493], [2521, 775], [2391, 775]])
    )
  );

  const provisionalLocation = 'NUMERACIÓN REFERENCIAL DEL PLANO';
  const irregularTopLots = [
    ['R', 1, 230.25, [[2217, 396], [2521, 253], [2521, 364], [2217, 507]]],
    ['R', 2, 230.25, [[2217, 285], [2521, 142], [2521, 253], [2217, 396]]],
    ['R', 3, 230.65, [[2217, 174], [2521, 31], [2521, 142], [2217, 285]]],
    ['T', 1, 204.25, [[1078, 716], [1197, 659], [1197, 938], [1078, 938]]],
    ['T', 2, 204.35, [[1197, 775], [1381, 775], [1381, 938], [1197, 938]]],
    ['T', 3, 205.11, [[1197, 659], [1381, 573], [1381, 775], [1197, 775]]],
  ];

  irregularTopLots.forEach(([mz, lote, area, points]) => {
    lots.push(
      makePlanLot('3', mz, lote, area, getPolygonGeometry(points), provisionalLocation)
    );
  });

  const sColumns = [1498, 1598, 1698, 1798, 1898, 1999, 2100];
  const sTop = [517, 470, 423, 376, 328, 281, 233];
  const sBottom = [849, 802, 755, 707, 660, 613, 565];

  for (let index = 0; index < 6; index += 1) {
    lots.push(makePlanLot(
      '3',
      'S',
      index + 1,
      230.28,
      getPolygonGeometry([
        [sColumns[index], sTop[index]],
        [sColumns[index + 1], sTop[index + 1]],
        [sColumns[index + 1], sBottom[index + 1]],
        [sColumns[index], sBottom[index]],
      ]),
      provisionalLocation
    ));
  }

  return lots;
};

const getVerticalLotGeometry = (x1, x2, rowBounds, lotNumber) => {
  const rowIndex = 18 - lotNumber;

  if (rowIndex < 0 || rowIndex >= rowBounds.length - 1) return null;

  return insetGeometry({
    x: x1,
    y: rowBounds[rowIndex],
    width: x2 - x1,
    height: rowBounds[rowIndex + 1] - rowBounds[rowIndex],
  });
};

const getStageTwoLotGeometry = (lot) => {
  if (!lot || String(lot.etapa) !== '2') return null;

  const lotNumber = Number(lot.lote);

  if (lot.mz === 'J') {
    return getVerticalLotGeometry(931, 1285, STAGE_TWO_TOP_ROWS, lotNumber);
  }

  if (lot.mz === 'L') {
    return getVerticalLotGeometry(2269, 2623, STAGE_TWO_TOP_ROWS, lotNumber);
  }

  if (lot.mz === 'I') {
    return getVerticalLotGeometry(931, 1285, STAGE_TWO_BOTTOM_ROWS, lotNumber);
  }

  if (lot.mz === 'G') {
    return getVerticalLotGeometry(2269, 2623, STAGE_TWO_BOTTOM_ROWS, lotNumber);
  }

  if (lot.mz === 'K') {
    if (lotNumber >= 12 && lotNumber <= 16) {
      const row = lotNumber - 12;
      return insetGeometry({
        x: 1422,
        y: STAGE_TWO_TOP_ROWS[row],
        width: 355,
        height: STAGE_TWO_TOP_ROWS[row + 1] - STAGE_TWO_TOP_ROWS[row],
      });
    }

    if (lotNumber >= 7 && lotNumber <= 11) {
      const row = 11 - lotNumber;
      return insetGeometry({
        x: 1777,
        y: STAGE_TWO_TOP_ROWS[row],
        width: 355,
        height: STAGE_TWO_TOP_ROWS[row + 1] - STAGE_TWO_TOP_ROWS[row],
      });
    }

    if (lotNumber >= 1 && lotNumber <= 6) {
      const column = lotNumber - 1;
      return insetGeometry({
        x: STAGE_TWO_CENTER_COLUMNS[column],
        y: 933,
        width: STAGE_TWO_CENTER_COLUMNS[column + 1] - STAGE_TWO_CENTER_COLUMNS[column],
        height: 344,
      });
    }
  }

  if (lot.mz === 'H') {
    if (lotNumber >= 10 && lotNumber <= 15) {
      const column = 15 - lotNumber;
      return insetGeometry({
        x: STAGE_TWO_CENTER_COLUMNS[column],
        y: 2549,
        width: STAGE_TWO_CENTER_COLUMNS[column + 1] - STAGE_TWO_CENTER_COLUMNS[column],
        height: 344,
      });
    }

    if (lotNumber === 9) {
      return insetGeometry({ x: 1422, y: 2892, width: 710, height: 1026 }, 7);
    }

    if (lotNumber === 16 || lotNumber === 8) {
      return insetGeometry({
        x: lotNumber === 16 ? 1422 : 1777,
        y: 3918,
        width: 355,
        height: 168,
      });
    }

    if (lotNumber === 17 || lotNumber === 7) {
      return insetGeometry({
        x: lotNumber === 17 ? 1422 : 1777,
        y: 4086,
        width: 355,
        height: 168,
      });
    }

    if (lotNumber >= 1 && lotNumber <= 6) {
      const column = lotNumber - 1;
      return insetGeometry({
        x: STAGE_TWO_CENTER_COLUMNS[column],
        y: 4254,
        width: STAGE_TWO_CENTER_COLUMNS[column + 1] - STAGE_TWO_CENTER_COLUMNS[column],
        height: 343,
      });
    }
  }

  return null;
};

const getPlanLotGeometry = (lot) =>
  lot?.planGeometry || getStageTwoLotGeometry(lot);

const setPlanZoom = (nextZoom, { preserveCenter = true } = {}) => {
  if (!planCanvas || !planViewport) return;

  const previousWidth = Math.max(planCanvas.scrollWidth, 1);
  const previousHeight = Math.max(planCanvas.scrollHeight, 1);
  const centerRatioX = (planViewport.scrollLeft + planViewport.clientWidth / 2) / previousWidth;
  const centerRatioY = (planViewport.scrollTop + planViewport.clientHeight / 2) / previousHeight;

  state.planZoom = Math.min(2.75, Math.max(1, Number(nextZoom.toFixed(2))));
  planCanvas.style.width = `${state.planZoom * 100}%`;
  void planCanvas.offsetWidth;

  if (planZoomValue) {
    planZoomValue.textContent = `${Math.round(state.planZoom * 100)}%`;
  }

  if (preserveCenter) {
    planViewport.scrollTo({
      left: centerRatioX * planCanvas.scrollWidth - planViewport.clientWidth / 2,
      top: centerRatioY * planCanvas.scrollHeight - planViewport.clientHeight / 2,
      behavior: 'smooth',
    });
  }
};

const getDefaultPlanZoom = () =>
  window.matchMedia('(max-width: 700px)').matches ? 1.75 : 1;

const centerPlanOnGeometry = (geometry) => {
  if (!geometry || !planCanvas || !planViewport) return;

  const scale = planCanvas.getBoundingClientRect().width / PLAN_WIDTH;
  const centerX = (geometry.x + geometry.width / 2) * scale;
  const centerY = (geometry.y + geometry.height / 2) * scale;

  planViewport.scrollTo({
    left: centerX - planViewport.clientWidth / 2,
    top: centerY - planViewport.clientHeight / 2,
    behavior: 'smooth',
  });
};

const syncPlanSelection = (codigo = null, preview = false) => {
  if (!planHotspots) return;

  planHotspots.querySelectorAll('.plan-lot-hotspot').forEach((hotspot) => {
    hotspot.classList.toggle('selected', !preview && hotspot.dataset.codigo === codigo);
    hotspot.classList.toggle('previewing', preview && hotspot.dataset.codigo === codigo);
    hotspot.setAttribute(
      'aria-pressed',
      String(!preview && hotspot.dataset.codigo === codigo)
    );
  });

  if (planSelectionLabel) {
    if (!codigo) {
      planSelectionLabel.textContent = 'Ningún lote seleccionado en el plano.';
    } else if (preview) {
      planSelectionLabel.textContent = `${codigo}: revisando información antes de cotizar.`;
    } else {
      planSelectionLabel.textContent = `${codigo}: lote cargado en la cotización.`;
    }
  }
};

const renderPlanHotspots = () => {
  if (!planHotspots) return;

  planHotspots.innerHTML = '';

  getAllPlanLots()
    .filter((lot) => String(lot.etapa) === state.activePlanStage)
    .forEach((lot) => {
      const geometry = getPlanLotGeometry(lot);

      if (!geometry) return;

      const hotspot = document.createElementNS(SVG_NAMESPACE, 'g');
      const shape = document.createElementNS(
        SVG_NAMESPACE,
        geometry.points ? 'polygon' : 'rect'
      );
      const title = document.createElementNS(SVG_NAMESPACE, 'title');
      const hasPricing = hasCommercialPricing(lot);

      hotspot.classList.add('plan-lot-hotspot');
      hotspot.classList.toggle('information-only', !hasPricing);
      hotspot.dataset.codigo = lot.codigo;
      hotspot.setAttribute('role', 'button');
      hotspot.setAttribute('tabindex', '0');
      hotspot.setAttribute('aria-haspopup', 'dialog');
      hotspot.setAttribute('aria-pressed', 'false');
      const areaLabel = lot.area != null ? `, ${lot.area} metros cuadrados` : '';
      const pricingLabel = hasPricing ? '' : ', sin precios cargados';
      hotspot.setAttribute(
        'aria-label',
        `${lot.codigo}, manzana ${lot.mz}, lote ${lot.lote}${areaLabel}${pricingLabel}`
      );

      if (geometry.points) {
        shape.setAttribute(
          'points',
          geometry.points.map(([x, y]) => `${x},${y}`).join(' ')
        );
      } else {
        shape.setAttribute('x', geometry.x);
        shape.setAttribute('y', geometry.y);
        shape.setAttribute('width', geometry.width);
        shape.setAttribute('height', geometry.height);
        shape.setAttribute('rx', Math.min(10, geometry.height * 0.08));
      }
      title.textContent = `${lot.codigo} · ${lot.ubicacion || 'Ubicación según plano'}${
        lot.area != null ? ` · ${lot.area} m²` : ''
      }`;

      hotspot.append(shape, title);
      hotspot.addEventListener('click', () => openLotDetails(lot));
      hotspot.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLotDetails(lot);
        }
      });

      planHotspots.appendChild(hotspot);
    });

  syncPlanSelection(state.selectedLot?.codigo || null);
};

const setActivePlanStage = (stage, options = {}) => {
  const normalizedStage = String(stage);
  const config = PLAN_CONFIG[normalizedStage];

  if (!config || !planImage) return;

  state.activePlanStage = normalizedStage;
  planImage.setAttribute('href', config.image);

  if (planSvgTitle) planSvgTitle.textContent = `Plano de la ${config.label.toLowerCase()}`;
  if (planSvgDescription) planSvgDescription.textContent = config.description;

  const stageLots = getAllPlanLots().filter(
    (lot) => String(lot.etapa) === normalizedStage
  );
  const linkedLots = stageLots.length;
  const pricedLots = stageLots.filter(hasCommercialPricing).length;
  const informationalLots = stageLots.filter(isInformationalLot).length;

  if (planDataBadge) {
    planDataBadge.querySelector('strong').textContent = linkedLots;
    planDataBadge.querySelector('span').textContent =
      linkedLots === 1 ? 'lote mapeado' : 'lotes mapeados';
    planDataBadge.classList.toggle('empty', pricedLots === 0);
  }

  if (planStageMessage) {
    if (pricedLots > 0) {
      const commercialSummary = informationalLots
        ? `${pricedLots} lotes con precios y ${informationalLots} espacio informativo vinculados al plano.`
        : `${pricedLots} lotes cuentan con información de precios y pueden consultarse.`;

      planStageMessage.innerHTML = `
        <span class="plan-status-dot"></span>
        <strong>${config.label}:</strong>
        <span>${commercialSummary}</span>
      `;
      planStageMessage.classList.remove('pending');
    } else if (linkedLots > 0) {
      const stageMappingNote = normalizedStage === '3'
        ? ' La numeración interna de las manzanas R, S y T es referencial hasta su confirmación comercial.'
        : '';

      planStageMessage.innerHTML = `
        <span class="plan-status-dot"></span>
        <strong>${config.label}:</strong>
        <span>${linkedLots} lotes identificados en el plano; precios e inventario pendientes de carga.${stageMappingNote}</span>
      `;
      planStageMessage.classList.add('pending');
    } else {
      planStageMessage.innerHTML = `
        <span class="plan-status-dot"></span>
        <strong>${config.label}:</strong>
        <span>plano disponible; precios e inventario pendientes de carga.</span>
      `;
      planStageMessage.classList.add('pending');
    }
  }

  renderPlanHotspots();

  if (!options.preserveZoom) {
    const defaultZoom = getDefaultPlanZoom();

    state.planZoom = defaultZoom;
    planCanvas.style.width = `${defaultZoom * 100}%`;
    if (planZoomValue) planZoomValue.textContent = `${Math.round(defaultZoom * 100)}%`;
    planViewport.scrollTo({ top: 0, left: 0 });
  }
};

const closeLotDetails = () => {
  if (lotDetailsDialog?.open) lotDetailsDialog.close();
  state.previewLot = null;
  syncPlanSelection(state.selectedLot?.codigo || null);
};

const openLotDetails = (lot) => {
  if (!lot) return;

  if (state.activePlanStage !== String(lot.etapa)) {
    setActivePlanStage(lot.etapa);
  }

  const geometry = getPlanLotGeometry(lot);
  const hasPricing = hasCommercialPricing(lot);
  const informational = isInformationalLot(lot);
  const initial = hasPricing ? Number(lot.inicial || 0) : null;
  const installment = hasPricing
    ? Math.max(0, Number(lot.precioFinal) - initial) / MAX_FINANCE_TERM
    : null;
  const unavailableLabel = informational ? 'No aplica' : 'Pendiente';

  state.previewLot = lot;

  const areaLabel = lot.area != null ? `${lot.area} m²` : 'Por confirmar';

  setPrintText(lotDialogCode, formatLotReference(lot));
  setPrintText(lotDialogSubtitle, `${lot.ubicacion || 'Ubicación no registrada'} · ${areaLabel}`);
  setPrintText(lotDialogStage, lot.etapa);
  setPrintText(lotDialogBlock, lot.mz);
  setPrintText(lotDialogLot, lot.lote);
  setPrintText(lotDialogArea, areaLabel);
  setPrintText(lotDialogLocation, lot.ubicacion || '—');
  setPrintText(lotDialogListPrice, hasPricing ? formatCurrency(Number(lot.precioLista)) : unavailableLabel);
  setPrintText(lotDialogLaunchDiscount, hasPricing ? formatCurrency(Number(lot.descuentoPreventa)) : unavailableLabel);
  setPrintText(lotDialogFinancedPrice, hasPricing ? formatCurrency(Number(lot.precioFinal)) : unavailableLabel);
  setPrintText(lotDialogInitial, hasPricing ? formatCurrency(initial) : unavailableLabel);
  setPrintText(lotDialogInstallment, hasPricing ? formatCurrency(installment) : unavailableLabel);
  setPrintText(lotDialogCashDiscount, hasPricing ? formatCurrency(Number(lot.descuentoContado)) : unavailableLabel);
  setPrintText(
    lotDialogCashPrice,
    hasPricing && Number(lot.precioFinalContado) >= 0
      ? formatCurrency(Number(lot.precioFinalContado))
      : unavailableLabel
  );

  if (lotDialogDataStatus) {
    lotDialogDataStatus.textContent = hasPricing
      ? 'Con información comercial'
      : informational
        ? 'Espacio informativo · sin precio de venta'
        : 'Información comercial pendiente';
    lotDialogDataStatus.classList.toggle('pending', !hasPricing);
  }

  if (quoteMapLotButton) quoteMapLotButton.disabled = !hasPricing;

  syncPaymentModeUI();

  syncPlanSelection(lot.codigo, true);
  centerPlanOnGeometry(geometry);

  if (lotDetailsDialog && !lotDetailsDialog.open) {
    lotDialogTrigger = document.activeElement;
    lotDetailsDialog.showModal();
  }
};

const handlePlanSearch = () => {
  if (!planSearchInput) return;

  const code = planSearchInput.value.replace(/\s+/g, '').toUpperCase();
  planSearchInput.value = code;

  const lot = getAllPlanLots().find((item) => item.codigo?.toUpperCase() === code);

  if (!lot) {
    planSearchInput.setCustomValidity('No se encontró ese código en los planos cargados.');
    planSearchInput.reportValidity();
    return;
  }

  planSearchInput.setCustomValidity('');

  const lotStage = String(lot.etapa);

  if (state.activePlanStage !== lotStage) {
    setActivePlanStage(lotStage);
  }

  if (state.planZoom < 1.5) {
    setPlanZoom(1.5, { preserveCenter: false });
  }

  openLotDetails(lot);
};

const quotePreviewLot = () => {
  if (!state.previewLot || !hasCommercialPricing(state.previewLot)) return;

  const lot = state.previewLot;
  selectLot(lot);
  closeLotDetails();

  document.querySelector('.page-grid')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const showLoginError = (message) => {
  const errorElement = query('.login-error');
  if (errorElement) errorElement.textContent = message;
};

const normalizePaymentMode = (mode) => (mode === 'cash' ? 'cash' : 'financed');

const getPaymentModeLabel = (mode = state.paymentMode) =>
  normalizePaymentMode(mode) === 'cash' ? 'Al contado' : 'Financiado';

const syncPaymentModeUI = () => {
  const mode = normalizePaymentMode(state.paymentMode);
  const isCash = mode === 'cash';

  state.paymentMode = mode;

  paymentModeInputs.forEach((input) => {
    input.checked = input.value === mode;
  });

  if (financedPaymentPanel) {
    financedPaymentPanel.hidden = isCash;
    financedPaymentPanel.classList.toggle('hidden', isCash);
    financedPaymentPanel.setAttribute('aria-hidden', String(isCash));
  }

  if (cashPaymentPanel) {
    cashPaymentPanel.hidden = !isCash;
    cashPaymentPanel.classList.toggle('hidden', !isCash);
    cashPaymentPanel.setAttribute('aria-hidden', String(!isCash));
  }

  lotDialogPaymentModeItems.forEach((element) => {
    const isVisible = element.dataset.dialogPaymentMode === mode;
    element.hidden = !isVisible;
    element.classList.toggle('hidden', !isVisible);
  });

  printPaymentModeItems.forEach((element) => {
    const isVisible = element.dataset.printPaymentMode === mode;
    element.hidden = !isVisible;
    element.classList.toggle('hidden', !isVisible);
  });

  if (lotDialogPaymentMode) {
    lotDialogPaymentMode.textContent = `Vista: ${getPaymentModeLabel(mode)}`;
  }

};

const setPaymentMode = (mode, { refresh = true } = {}) => {
  state.paymentMode = normalizePaymentMode(mode);
  syncPaymentModeUI();

  if (refresh) updateSummary();
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
    asesorSelect.value = user.fullName || user.advisor;
    agentRegistrationInput.value = user.registration || '';
    updateAdvisorPhotoCheck(user);
  }
};

const handleLogin = () => {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const user = users[username];

  if (!user) {
    showLoginError('Usuario no válido.');
    return;
  }

  if (password !== user.password) {
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

    renderLotsTable();
    setActivePlanStage('2');

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
      '<tr><td colspan="6">No se encontraron lotes con esos filtros.</td></tr>';
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
      <td>${hasCommercialPricing(lot) ? formatCurrency(lot.precioFinal) : '—'}</td>
    `;

    row.addEventListener('click', () => {
      if (!hasCommercialPricing(lot)) {
        openLotDetails(lot);
        return;
      }

      selectLot(lot);

      lotsTable
        .querySelectorAll('tr')
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
    getAllPlanLots().find((lot) => lot.codigo?.toUpperCase() === normalized) ||
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

  disableActions();
  updateSummary();
  renderLotsTable();
  syncPlanSelection(null);
};

const handleCodigoInput = () => {
  const code = codigoInput.value.trim();

  if (!code) {
    clearSelectedLotDetails();
    return;
  }

  const lot = findLotByCodigo(code);

  if (lot) {
    if (!hasCommercialPricing(lot)) {
      openLotDetails(lot);
      codigoInput.value = state.selectedLot?.codigo || '';
      return;
    }

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
  if (!hasCommercialPricing(lot)) {
    openLotDetails(lot);
    return;
  }

  state.selectedLot = lot;

  if (state.activePlanStage !== String(lot.etapa)) {
    setActivePlanStage(lot.etapa);
  }

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
  const fallbackInitial = etapa === '1' ? 6000 : etapa === '2' || etapa === '3' ? 2000 : 0;
  initialInput.value = lot.inicial != null ? lot.inicial : fallbackInitial;

  if (lot.cuota84 != null) {
    termSelect.value = MAX_FINANCE_TERM;
  }

  enableActions();
  renderLotsTable();
  updateSummary();
  syncPlanSelection(lot.codigo);
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

const setPrintText = (element, value) => {
  if (element) element.textContent = value ?? '—';
};

const formatPrintDate = (isoDate) => {
  if (!isoDate) return '—';

  const date = new Date(`${isoDate}T12:00:00`);

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.length === 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  return digits || '—';
};

const resetPrintMapLocation = () => {
  printMapSvg?.setAttribute('viewBox', `0 0 ${PLAN_WIDTH} ${PLAN_HEIGHT}`);
  printMapMarker?.setAttribute('visibility', 'hidden');
  printMapMarkerLabel?.setAttribute('visibility', 'hidden');

  if (printMapMarkerLabel) printMapMarkerLabel.textContent = '';
};

const updatePrintQuote = (totals) => {
  const lot = state.selectedLot;

  resetPrintMapLocation();

  if (!lot || !totals) {
    if (printQuote) printQuote.setAttribute('aria-hidden', 'true');
    return;
  }

  const isCashPayment = state.paymentMode === 'cash';

  printPaymentModeItems.forEach((element) => {
    const isVisible = element.dataset.printPaymentMode === state.paymentMode;
    element.hidden = !isVisible;
    element.classList.toggle('hidden', !isVisible);
  });

  if (printPricingSection) {
    printPricingSection.dataset.paymentMode = state.paymentMode;
  }

  setPrintText(
    printPricingTitle,
    isCashPayment ? 'Cotización al contado:' : 'Cotización financiada:'
  );

  const locationCode = formatLotReference(lot);
  const area = lot.area != null ? `${Number(lot.area).toFixed(2)} m²` : '—';
  const thirtyPercentInitial = totals.precioFinal * 0.3;
  const thirtyPercentBalance = Math.max(0, totals.precioFinal - thirtyPercentInitial);
  const thirtyPercentInstallment =
    totals.term > 0 ? thirtyPercentBalance / totals.term : 0;
  const currentUser = users[state.currentUser] || {};
  const locationDescription = String(lot.ubicacion || 'ubicación estándar').toLowerCase();
  const planConfig = PLAN_CONFIG[String(lot.etapa)] || PLAN_CONFIG['2'];
  const planGeometry = getPlanLotGeometry(lot);

  if (printMapImage) printMapImage.setAttribute('href', planConfig.image);

  if (planGeometry && printMapSvg && printMapMarker && printMapMarkerLabel) {
    const centerX = planGeometry.x + planGeometry.width / 2;
    const centerY = planGeometry.y + planGeometry.height / 2;
    const viewWidth = planGeometry.height > 700 ? 1450 : 1120;
    const viewHeight = planGeometry.height > 700 ? 1080 : 780;
    const viewX = Math.max(0, Math.min(PLAN_WIDTH - viewWidth, centerX - viewWidth / 2));
    const viewY = Math.max(0, Math.min(PLAN_HEIGHT - viewHeight, centerY - viewHeight / 2));

    printMapSvg.setAttribute('viewBox', `${viewX} ${viewY} ${viewWidth} ${viewHeight}`);
    printMapMarker.setAttribute('visibility', 'visible');
    printMapMarkerLabel.setAttribute('visibility', 'visible');
    printMapMarker.setAttribute('x', planGeometry.x);
    printMapMarker.setAttribute('y', planGeometry.y);
    printMapMarker.setAttribute('width', planGeometry.width);
    printMapMarker.setAttribute('height', planGeometry.height);
    printMapMarkerLabel.setAttribute('x', centerX);
    printMapMarkerLabel.setAttribute('y', centerY);
    printMapMarkerLabel.textContent = lot.codigo;
  } else if (printMapSvg && printMapMarker && printMapMarkerLabel) {
    printMapSvg.setAttribute('viewBox', `0 0 ${PLAN_WIDTH} ${PLAN_HEIGHT}`);
    printMapMarker.setAttribute('x', 0);
    printMapMarker.setAttribute('y', 0);
    printMapMarker.setAttribute('width', 0);
    printMapMarker.setAttribute('height', 0);
    printMapMarkerLabel.setAttribute('x', 0);
    printMapMarkerLabel.setAttribute('y', 0);
    printMapMarkerLabel.textContent = '';
  }

  setPrintText(printClient, clienteInput.value.trim() || 'Cliente por confirmar');
  setPrintText(printDate, formatPrintDate(fechaInput.value));
  setPrintText(printStage, `Etapa ${lot.etapa || '—'}`);
  setPrintText(printLocationCode, locationCode);
  setPrintText(printLotCode, locationCode);
  setPrintText(printBlock, lot.mz || '—');
  setPrintText(printLot, lot.lote || '—');
  setPrintText(printArea, area);
  setPrintText(printLocation, lot.ubicacion || '—');
  setPrintText(
    printDescription,
    `Lote de ${locationDescription} en la manzana ${lot.mz || '—'}, lote ${lot.lote || '—'}, ` +
      `correspondiente a la etapa ${lot.etapa || '—'}, con un metraje de ${area}.`
  );

  setPrintText(printTermHeaderPrimary, `CUOTAS (${totals.term} meses)`);
  setPrintText(printTermHeader30, `CUOTAS (${totals.term} meses)`);
  setPrintText(printFinancedListPrice, formatCurrency(totals.precioLista));
  setPrintText(
    printFinancedLaunchDiscount,
    formatCurrency(totals.descuentoPreventa)
  );
  setPrintText(printFinancedPricePrimary, formatCurrency(totals.precioFinal));
  setPrintText(printInitialPrimary, formatCurrency(totals.initialValue));
  setPrintText(printBalancePrimary, formatCurrency(totals.financedAmount));
  setPrintText(printInstallmentPrimary, formatCurrency(totals.monthlyPayment));
  setPrintText(printFinancedPrice30, formatCurrency(totals.precioFinal));
  setPrintText(printInitial30, formatCurrency(thirtyPercentInitial));
  setPrintText(printBalance30, formatCurrency(thirtyPercentBalance));
  setPrintText(printInstallment30, formatCurrency(thirtyPercentInstallment));
  setPrintText(printCashList, formatCurrency(totals.precioLista));
  setPrintText(printCashDiscount, formatCurrency(totals.cashDiscount));
  setPrintText(printCashFinal, formatCurrency(totals.cashFinal));
  setPrintText(
    printCashSavings,
    formatCurrency(Math.max(0, totals.precioLista - totals.cashFinal))
  );
  setPrintText(printAdvisorName, asesorSelect.value || currentUser.advisor || '—');
  setPrintText(
    printAgentRegistration,
    agentRegistrationInput.value
      ? `Código de agente: ${agentRegistrationInput.value}`
      : 'Código de agente: —'
  );
  setPrintText(printAdvisorPhone, formatPhone(currentUser.phone));

  if (printQuote) printQuote.setAttribute('aria-hidden', 'false');
};

const updateSummary = () => {
  if (!state.selectedLot) {
    summaryCard.innerHTML =
      '<p class="empty-state">Selecciona un lote de la lista para ver el detalle.</p>';

    disableActions();
    updatePrintQuote(null);
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

  const isCashPayment = state.paymentMode === 'cash';
  const paymentModeLabel = getPaymentModeLabel();
  const agentRegistrationSummaryRow = agentRegistrationInput.value
    ? `<dt>Código de agente</dt><dd>${agentRegistrationInput.value}</dd>`
    : '';
  const paymentSummaryRows = isCashPayment
    ? `
      <dt>Precio de lista</dt><dd>${formatCurrency(totals.precioLista)}</dd>
      <dt>Descuento al contado</dt><dd>${formatCurrency(totals.cashDiscount)}</dd>
      <dt>Precio final al contado</dt><dd>${formatCurrency(totals.cashFinal)}</dd>
      <dt>Ahorro total</dt><dd>${formatCurrency(Math.max(0, totals.precioLista - totals.cashFinal))}</dd>
    `
    : `
      <dt>Precio de lista</dt><dd>${formatCurrency(totals.precioLista)}</dd>
      <dt>Descuento por lanzamiento</dt><dd>${formatCurrency(totals.descuentoPreventa)}</dd>
      <dt>Precio final financiado</dt><dd>${formatCurrency(totals.precioFinal)}</dd>
      <dt>Inicial</dt><dd>${formatCurrency(totals.initialValue)}</dd>
      <dt>Plazo</dt><dd>${totals.term} meses</dd>
      <dt>Monto a financiar</dt><dd>${formatCurrency(totals.financedAmount)}</dd>
      <dt>Cuota mensual</dt><dd>${formatCurrency(totals.monthlyPayment)}</dd>
    `;

  summaryCard.innerHTML = `
    <dl class="summary-list">
      <dt>Manzana</dt><dd>${state.selectedLot.mz || '-'}</dd>
      <dt>Lote</dt><dd>${state.selectedLot.lote || '-'}</dd>
      <dt>Cliente</dt><dd>${clienteInput.value || '-'}</dd>
      <dt>Etapa</dt><dd>${state.selectedLot.etapa || '-'}</dd>
      <dt>Ubicación</dt><dd>${state.selectedLot.ubicacion || '-'}</dd>
      <dt>Área</dt><dd>${state.selectedLot.area != null ? `${state.selectedLot.area} m²` : '-'}</dd>
      <dt>Agente inmobiliario</dt><dd>${asesorSelect.value || '-'}</dd>
      ${agentRegistrationSummaryRow}
      <dt>Fecha</dt><dd>${fechaInput.value || '-'}</dd>
      <dt>Modalidad</dt>
      <dd><span class="summary-mode-badge ${isCashPayment ? 'cash' : ''}">${paymentModeLabel}</span></dd>
      ${paymentSummaryRows}
    </dl>
  `;

  updatePrintQuote(totals);
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
    const quotePaymentMode = normalizePaymentMode(quote.paymentMode);
    const quoteIsCash = quotePaymentMode === 'cash';
    const savedCashFinal =
      quote.cashFinal != null
        ? quote.cashFinal
        : quote.precioLista != null
          ? Math.max(0, Number(quote.precioLista) - Number(quote.cashDiscount || 0))
          : null;
    const quotePaymentDetails = quoteIsCash
      ? `
        <p>Descuento al contado: <strong>${formatCurrency(quote.cashDiscount)}</strong></p>
        <p>Precio final al contado: <strong>${formatCurrency(savedCashFinal)}</strong></p>
      `
      : `
        <p>Descuento por lanzamiento: <strong>${formatCurrency(quote.descuentoPreventa)}</strong></p>
        <p>Precio final financiado: <strong>${formatCurrency(quote.adjustedFinal)}</strong></p>
        <p>Cuota mensual: <strong>${formatCurrency(quote.monthlyPayment)}</strong></p>
      `;
    const quoteAgentRegistration = quote.agentRegistration
      ? `<p>Código de agente: <strong>${quote.agentRegistration}</strong></p>`
      : '';

    card.innerHTML = `
      <header>
        <div>
          <strong>${formatLotReference(quote)}</strong>
          <p>${formatDate(quote.createdAt)}</p>
        </div>
      </header>

      <p>Cliente: <strong>${quote.cliente || '-'}</strong></p>
      <p>Agente inmobiliario: <strong>${quote.asesor}</strong></p>
      ${quoteAgentRegistration}
      <p>Modalidad: <span class="quote-mode-label ${quoteIsCash ? 'cash' : ''}">${getPaymentModeLabel(quotePaymentMode)}</span></p>
      ${quotePaymentDetails}

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

  setPaymentMode(quote.paymentMode, { refresh: false });
  selectLot(lot);

  clienteInput.value = quote.cliente || '';
  codigoInput.value = quote.codigo;
  asesorSelect.value = quote.asesor || '';
  agentRegistrationInput.value = quote.agentRegistration || '';
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
    mz: state.selectedLot.mz,
    lote: state.selectedLot.lote,
    etapa: state.selectedLot.etapa,
    ubicacion: state.selectedLot.ubicacion,
    area: state.selectedLot.area,
    asesor: asesorSelect.value,
    agentRegistration: agentRegistrationInput.value,
    paymentMode: state.paymentMode,
    precioLista: totals.precioLista,
    term: totals.term,
    initialValue: totals.initialValue,
    descuentoPreventa: totals.descuentoPreventa,
    adjustedFinal: totals.precioFinal,
    cashDiscount: totals.cashDiscount,
    cashFinal: totals.cashFinal,
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
  const totals = getTotals();

  if (!state.selectedLot || !totals) return;

  updatePrintQuote(totals);

  const previousTitle = document.title;
  document.title = `Cotización Villa Hermosa - ${state.selectedLot.codigo}`;

  const restoreTitle = () => {
    document.title = previousTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };

  window.addEventListener('afterprint', restoreTitle);
  window.setTimeout(restoreTitle, 1500);
  window.print();
};

const copySummary = () => {
  if (!state.selectedLot) return;

  const totals = getTotals();

  if (!totals) return;

  const isCashPayment = state.paymentMode === 'cash';
  const paymentText = isCashPayment
    ? `Descuento al contado: ${formatCurrency(totals.cashDiscount)}\n` +
      `Precio final al contado: ${formatCurrency(totals.cashFinal)}\n` +
      `Ahorro total: ${formatCurrency(Math.max(0, totals.precioLista - totals.cashFinal))}`
    : `Descuento por lanzamiento: ${formatCurrency(totals.descuentoPreventa)}\n` +
      `Precio final financiado: ${formatCurrency(totals.precioFinal)}\n` +
      `Inicial: ${formatCurrency(totals.initialValue)}\n` +
      `Plazo: ${totals.term} meses\n` +
      `Monto a financiar: ${formatCurrency(totals.financedAmount)}\n` +
      `Cuota mensual: ${formatCurrency(totals.monthlyPayment)}`;

  const text =
    `${formatLotReference(state.selectedLot)} / Etapa ${state.selectedLot.etapa} / Ubicación ${state.selectedLot.ubicacion}\n` +
    `Cliente: ${clienteInput.value || '-'}\n` +
    `Agente inmobiliario: ${asesorSelect.value}\n` +
    (agentRegistrationInput.value
      ? `Código de agente: ${agentRegistrationInput.value}\n`
      : '') +
    `Fecha: ${fechaInput.value}\n` +
    `Área: ${state.selectedLot.area ?? '-'} m²\n` +
    `Modalidad: ${getPaymentModeLabel()}\n` +
    paymentText;

  navigator.clipboard.writeText(text).then(() => {
    copySummaryButton.textContent = 'Copiado';

    setTimeout(() => {
      copySummaryButton.textContent = 'Copiar resumen';
    }, 1200);
  });
};

paymentModeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) setPaymentMode(input.value);
  });
});

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

planZoomOutButton?.addEventListener('click', () => setPlanZoom(state.planZoom - 0.25));
planZoomInButton?.addEventListener('click', () => setPlanZoom(state.planZoom + 0.25));
planZoomResetButton?.addEventListener('click', () => setPlanZoom(getDefaultPlanZoom()));
planSearchButton?.addEventListener('click', handlePlanSearch);

planSearchInput?.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  event.target.setCustomValidity('');
});

planSearchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handlePlanSearch();
  }
});

planViewport?.addEventListener(
  'wheel',
  (event) => {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    setPlanZoom(state.planZoom + (event.deltaY < 0 ? 0.25 : -0.25));
  },
  { passive: false }
);

let planDragState = null;

const clearPlanDrag = (pointerId = null) => {
  if (
    !planDragState ||
    (pointerId != null && planDragState.pointerId !== pointerId)
  ) {
    return;
  }

  const capturedId = planDragState.pointerId;
  planDragState = null;
  planViewport.classList.remove('dragging');

  if (planViewport.hasPointerCapture?.(capturedId)) {
    planViewport.releasePointerCapture(capturedId);
  }
};

planViewport?.addEventListener('pointerdown', (event) => {
  if (
    event.pointerType === 'touch' ||
    event.button !== 0 ||
    event.target.closest?.('.plan-lot-hotspot')
  ) {
    return;
  }

  event.preventDefault();

  planDragState = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    scrollLeft: planViewport.scrollLeft,
    scrollTop: planViewport.scrollTop,
  };
  planViewport.classList.add('dragging');
  planViewport.setPointerCapture?.(event.pointerId);
});

planViewport?.addEventListener('pointermove', (event) => {
  if (!planDragState || planDragState.pointerId !== event.pointerId) return;

  event.preventDefault();
  planViewport.scrollLeft = planDragState.scrollLeft - (event.clientX - planDragState.x);
  planViewport.scrollTop = planDragState.scrollTop - (event.clientY - planDragState.y);
});

planViewport?.addEventListener('pointerup', (event) => clearPlanDrag(event.pointerId));
planViewport?.addEventListener('pointercancel', (event) => clearPlanDrag(event.pointerId));
planViewport?.addEventListener('lostpointercapture', (event) => clearPlanDrag(event.pointerId));

closeLotDetailsButton?.addEventListener('click', closeLotDetails);
lotDialogCancelButton?.addEventListener('click', closeLotDetails);
quoteMapLotButton?.addEventListener('click', quotePreviewLot);

lotDetailsDialog?.addEventListener('click', (event) => {
  if (event.target === lotDetailsDialog) closeLotDetails();
});

lotDetailsDialog?.addEventListener('close', () => {
  state.previewLot = null;
  syncPlanSelection(state.selectedLot?.codigo || null);
  lotDialogTrigger?.focus?.({ preventScroll: true });
  lotDialogTrigger = null;
});

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

syncPaymentModeUI();
loadData();
