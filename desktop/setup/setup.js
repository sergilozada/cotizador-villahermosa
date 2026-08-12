'use strict';

const advisorList = document.querySelector('#advisorList');
const pairButton = document.querySelector('#pairButton');
const selectionSummary = document.querySelector('#selectionSummary');

let selectedAdvisor = null;

const initialsFor = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const selectAdvisor = (advisor, option) => {
  selectedAdvisor = advisor;
  advisorList.querySelectorAll('.advisor-option').forEach((item) => {
    const selected = item === option;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-checked', String(selected));
  });

  const registration = advisor.registration
    ? ` · Código ${advisor.registration}`
    : '';
  selectionSummary.textContent = `Este equipo quedará asignado a ${advisor.displayName}${registration}.`;
  pairButton.disabled = false;
};

const createAdvisorOption = (advisor) => {
  const option = document.createElement('button');
  option.type = 'button';
  option.className = 'advisor-option';
  option.setAttribute('role', 'radio');
  option.setAttribute('aria-checked', 'false');

  const initials = document.createElement('span');
  initials.className = 'advisor-initials';
  initials.textContent = initialsFor(advisor.displayName);

  const copy = document.createElement('span');
  copy.className = 'advisor-copy';
  const name = document.createElement('strong');
  name.textContent = advisor.displayName;
  const username = document.createElement('small');
  username.textContent = advisor.username;
  copy.append(name, username);

  const check = document.createElement('span');
  check.className = 'advisor-check';
  check.textContent = '✓';
  check.setAttribute('aria-hidden', 'true');

  option.append(initials, copy, check);
  option.addEventListener('click', () => selectAdvisor(advisor, option));
  return option;
};

const loadAdvisors = async () => {
  try {
    const advisors = await window.villaHermosaSetup.getAdvisors();
    advisorList.replaceChildren(...advisors.map(createAdvisorOption));
  } catch (error) {
    advisorList.textContent = '';
    const message = document.createElement('p');
    message.className = 'loading error';
    message.textContent = error?.message || 'No se pudo cargar la lista de agentes.';
    advisorList.appendChild(message);
  }
};

pairButton.addEventListener('click', async () => {
  if (!selectedAdvisor) return;

  pairButton.disabled = true;
  pairButton.textContent = 'ASIGNANDO EQUIPO…';
  selectionSummary.textContent = 'Guardando la asignación segura en Windows…';

  try {
    await window.villaHermosaSetup.pairAdvisor(selectedAdvisor.username);
  } catch (error) {
    selectionSummary.textContent = error?.message || 'No se pudo asignar este equipo.';
    selectionSummary.classList.add('error');
    pairButton.textContent = 'VOLVER A INTENTAR';
    pairButton.disabled = false;
  }
});

loadAdvisors();
