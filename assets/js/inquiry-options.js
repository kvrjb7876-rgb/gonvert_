(function (root, factory) {
  const options = factory();
  if (typeof module === 'object' && module.exports) module.exports = options;
  else root.GONVERT_INQUIRY_OPTIONS = options;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const groups = {
    Pharma: [
      { label: 'Services', options: [
        ['services', 'Services — General Inquiry'],
        ['feasibility-consulting-planning', 'Feasibility, Consulting & Planning'],
        ['engineering-design', 'Engineering & Design'],
        ['strategic-procurement', 'Strategic Procurement'],
        ['project-construction-management', 'Project & Construction Management'],
        ['commissioning-qualification-validation', 'Commissioning, Qualification & Validation'],
        ['gmp-upgrades-optimization', 'GMP Upgrades & Optimization']
      ] },
      { label: 'Expertise', options: [
        ['expertise', 'Expertise — General Inquiry'],
        ['gmp-regulatory-compliance', 'GMP & Regulatory Compliance'],
        ['advanced-cleanroom-contamination-control', 'Advanced Cleanroom Systems & Contamination Control'],
        ['process-manufacturing-technologies', 'Process & Manufacturing Technologies'],
        ['risk-based-qualification', 'Risk-Based Qualification'],
        ['facility-upgrades-modernization', 'Facility Upgrades & Modernization'],
        ['lifecycle-verification', 'Lifecycle Verification'],
        ['hpapi-containment', 'HPAPI & Containment'],
        ['data-integrity-digital-compliance', 'Data Integrity & Digital Compliance']
      ] },
      { label: 'Industries', options: [
        ['industries', 'Industries — General Inquiry'],
        ['pharmaceuticals', 'Pharmaceuticals'],
        ['biopharmaceuticals', 'Biopharmaceuticals'],
        ['cell-gene-therapy', 'Cell & Gene Therapy'],
        ['medical-devices', 'Medical Devices'],
        ['animal-health', 'Animal Health'],
        ['nutraceuticals-dietary-supplements', 'Nutraceuticals & Dietary Supplements'],
        ['cosmetics-personal-care', 'Cosmetics & Personal Care'],
        ['herbal-traditional-medicines', 'Herbal & Traditional Medicines']
      ] }
    ],
    Energy: [
      { label: 'Services', options: [
        ['services', 'Services — General Inquiry'],
        ['project-development-investment-advisory', 'Project Development & Investment Advisory'],
        ['commercial-structuring-bankability', 'Commercial Structuring & Bankability'],
        ['engineering-design', 'Engineering & Design'],
        ['procurement-advisory-supply-chain-management', 'Procurement Advisory & Supply Chain Management'],
        ['epcm-services', 'EPCM Services']
      ] },
      { label: 'Expertise', options: [
        ['expertise', 'Expertise — General Inquiry'],
        ['expertise-development-bankability', 'Project Development & Bankability'],
        ['commercial-financial-structuring', 'Commercial & Financial Structuring'],
        ['battery-energy-storage-systems', 'Battery Energy Storage Systems'],
        ['global-procurement-tier-1-technologies', 'Global Procurement & Tier-1 Technologies'],
        ['epcm-project-delivery', 'EPCM & Project Delivery'],
        ['engineering-tools-international-standards', 'Engineering Tools & International Standards'],
        ['strategic-partnerships', 'Strategic Partnerships']
      ] }
    ]
  };

  const titles = { general: 'General Project Inquiry' };
  const values = {};
  Object.entries(groups).forEach(([sector, sectorGroups]) => {
    values[sector] = new Set(['general']);
    sectorGroups.forEach(group => group.options.forEach(([value, label]) => {
      values[sector].add(value);
      titles[value] = label;
    }));
  });

  return { groups, titles, values };
});
