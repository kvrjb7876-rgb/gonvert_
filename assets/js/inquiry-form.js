(function () {
  const form = document.querySelector('[data-inquiry-form]');
  const taxonomy = window.GONVERT_INQUIRY_OPTIONS;
  if (!form || !taxonomy) return;

  const interestSelect = form.querySelector('[name="interest"]');
  const sectorSelect = form.querySelector('[name="sector"][data-sector-selector]');
  const fixedSector = interestSelect.dataset.requestSector || '';
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[type="submit"]');
  const params = new URLSearchParams(location.search);

  const addOption = (container, optionValue, label, attributes) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = label;
    Object.entries(attributes || {}).forEach(([name, attributeValue]) => {
      if (name === 'disabled') option.disabled = attributeValue;
      else option.dataset[name] = attributeValue;
    });
    container.append(option);
    return option;
  };

  const populateRequests = (sector, requireChoice) => {
    interestSelect.replaceChildren();
    if (!taxonomy.groups[sector]) {
      addOption(interestSelect, '', 'Select a sector first', { disabled: true }).selected = true;
      interestSelect.disabled = true;
      return;
    }

    interestSelect.disabled = false;
    if (requireChoice) addOption(interestSelect, '', 'Select a request', { disabled: true }).selected = true;
    addOption(interestSelect, 'general', 'General Project Inquiry');
    taxonomy.groups[sector].forEach(groupData => {
      const group = document.createElement('optgroup');
      group.label = groupData.label;
      groupData.options.forEach(([optionValue, label]) => addOption(group, optionValue, label));
      interestSelect.append(group);
    });
  };

  if (sectorSelect) {
    const requestedSector = (params.get('sector') || '').toLowerCase();
    sectorSelect.value = requestedSector === 'pharma' ? 'Pharma' : requestedSector === 'energy' ? 'Energy' : '';
    populateRequests(sectorSelect.value, true);
  } else populateRequests(fixedSector, false);

  const requestedInterest = params.get('interest') || (sectorSelect ? '' : 'general');
  const allowed = new Set(Array.from(interestSelect.options, option => option.value));
  interestSelect.value = allowed.has(requestedInterest) ? requestedInterest : (sectorSelect ? '' : 'general');

  const createCustomListbox = nativeSelect => {
    const field = nativeSelect.closest('.form-field');
    const label = field && field.querySelector(`label[for="${nativeSelect.id}"]`);
    const root = document.createElement('div');
    const trigger = document.createElement('button');
    const value = document.createElement('span');
    const menu = document.createElement('div');
    const listboxId = `${nativeSelect.id}-listbox`;
    const triggerId = `${nativeSelect.id}-trigger`;
    let optionElements = [];
    let activeIndex = Math.max(0, nativeSelect.selectedIndex);

    root.className = 'custom-select';
    trigger.type = 'button';
    trigger.id = triggerId;
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', listboxId);
    trigger.setAttribute('aria-autocomplete', 'none');
    value.className = 'custom-select-value';
    trigger.append(value);
    trigger.insertAdjacentHTML('beforeend', '<svg class="custom-select-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5"/></svg>');

    menu.id = listboxId;
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    nativeSelect.classList.add('native-select-source');
    nativeSelect.tabIndex = -1;
    nativeSelect.setAttribute('aria-hidden', 'true');
    nativeSelect.insertAdjacentElement('afterend', root);
    root.append(trigger, menu);
    if (label) label.htmlFor = triggerId;

    const appendCustomOption = (option, container) => {
      const item = document.createElement('div');
      const index = optionElements.length;
      item.id = `${nativeSelect.id}-option-${index}`;
      item.className = 'custom-select-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.dataset.value = option.value;
      item.dataset.index = String(index);
      if (option.dataset.accent) item.dataset.accent = option.dataset.accent;
      item.textContent = option.textContent.trim();
      container.append(item);
      optionElements.push(item);
    };

    const render = () => {
      menu.replaceChildren();
      optionElements = [];
      Array.from(nativeSelect.children).forEach((child, groupIndex) => {
        if (child.tagName === 'OPTGROUP') {
          const group = document.createElement('div');
          const heading = document.createElement('div');
          const headingId = `${nativeSelect.id}-group-${groupIndex}`;
          group.className = 'custom-select-group';
          group.setAttribute('role', 'group');
          group.setAttribute('aria-labelledby', headingId);
          heading.id = headingId;
          heading.className = 'custom-select-group-label';
          heading.textContent = child.label;
          group.append(heading);
          Array.from(child.children).forEach(option => appendCustomOption(option, group));
          menu.append(group);
        } else if (child.tagName === 'OPTION' && !child.disabled) appendCustomOption(child, menu);
      });
    };

    const selectedCustomIndex = () => optionElements.findIndex(item => item.dataset.value === nativeSelect.value);
    const setActive = index => {
      if (!optionElements.length) return;
      activeIndex = Math.max(0, Math.min(index, optionElements.length - 1));
      optionElements.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === activeIndex));
      trigger.setAttribute('aria-activedescendant', optionElements[activeIndex].id);
      optionElements[activeIndex].scrollIntoView({ block: 'nearest' });
    };
    const sync = () => {
      const selected = Array.from(nativeSelect.options).find(option => option.value === nativeSelect.value) || nativeSelect.options[0];
      value.textContent = selected ? selected.textContent.trim() : '';
      trigger.disabled = nativeSelect.disabled;
      trigger.setAttribute('aria-disabled', String(nativeSelect.disabled));
      root.dataset.selectedAccent = selected && selected.dataset.accent ? selected.dataset.accent : '';
      optionElements.forEach(item => item.setAttribute('aria-selected', String(item.dataset.value === nativeSelect.value)));
      const index = selectedCustomIndex();
      if (index >= 0) activeIndex = index;
    };
    const open = () => {
      if (nativeSelect.disabled) return;
      menu.hidden = false;
      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      setActive(Math.max(0, selectedCustomIndex()));
    };
    const close = () => {
      menu.hidden = true;
      root.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
    };
    const choose = index => {
      const item = optionElements[index];
      if (!item) return;
      nativeSelect.value = item.dataset.value;
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close();
      trigger.focus();
    };

    trigger.addEventListener('click', () => menu.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
      const isOpen = !menu.hidden;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        if (!isOpen) {
          open();
          setActive(activeIndex + direction);
        } else setActive(activeIndex + direction);
      } else if (event.key === 'Home' && isOpen) {
        event.preventDefault();
        setActive(0);
      } else if (event.key === 'End' && isOpen) {
        event.preventDefault();
        setActive(optionElements.length - 1);
      } else if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
        event.preventDefault();
        choose(activeIndex);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        close();
      } else if (event.key === 'Tab' && isOpen) close();
    });
    menu.addEventListener('mouseover', event => {
      const item = event.target.closest('.custom-select-option');
      if (item) setActive(Number(item.dataset.index));
    });
    menu.addEventListener('click', event => {
      const item = event.target.closest('.custom-select-option');
      if (item) choose(Number(item.dataset.index));
    });
    document.addEventListener('pointerdown', event => {
      if (!root.contains(event.target)) close();
    });
    nativeSelect.addEventListener('change', sync);
    render();
    sync();
    return {
      rebuild: () => { render(); sync(); },
      sync,
      close,
      focus: () => trigger.focus(),
      setInvalid: invalid => trigger.setAttribute('aria-invalid', String(invalid))
    };
  };

  const sectorListbox = sectorSelect ? createCustomListbox(sectorSelect) : null;
  const requestListbox = createCustomListbox(interestSelect);

  if (sectorSelect) {
    sectorSelect.addEventListener('change', () => {
      sectorListbox.setInvalid(false);
      populateRequests(sectorSelect.value, true);
      interestSelect.value = '';
      requestListbox.rebuild();
      requestListbox.setInvalid(false);
      requestListbox.close();
    });
    sectorListbox.sync();
  }
  interestSelect.addEventListener('change', () => requestListbox.setInvalid(false));

  const source = params.get('source');
  form.elements.source.value = source && source.startsWith('/') ? source.slice(0, 240) : location.pathname;
  form.elements.origin.value = (params.get('origin') || 'direct').slice(0, 80);
  form.elements.category.value = (params.get('category') || 'general').slice(0, 40);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sectorSelect && !sectorSelect.value) {
      sectorListbox.setInvalid(true);
      sectorListbox.focus();
      status.className = 'form-status is-error';
      status.textContent = 'Please select a sector.';
      return;
    }
    if (!interestSelect.value) {
      requestListbox.setInvalid(true);
      requestListbox.focus();
      status.className = 'form-status is-error';
      status.textContent = 'Please select a request type.';
      return;
    }
    if (!form.reportValidity() || submit.disabled) return;
    status.className = 'form-status is-sending';
    status.textContent = 'Sending your inquiry…';
    submit.disabled = true;
    submit.setAttribute('aria-disabled', 'true');

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.selectedRequest = interestSelect.options[interestSelect.selectedIndex].textContent.trim();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Your inquiry could not be sent. Please try again or email info@gonvert.com.');
      status.className = 'form-status is-success';
      status.textContent = 'Thank you. Your inquiry has been sent.';
      form.reset();
      if (sectorSelect) {
        populateRequests('', true);
        sectorListbox.sync();
        requestListbox.rebuild();
      } else {
        interestSelect.value = 'general';
        requestListbox.sync();
      }
    } catch (error) {
      status.className = 'form-status is-error';
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-disabled');
    }
  });
})();
