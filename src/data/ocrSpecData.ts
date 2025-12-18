// OCR Gateway Science Combined Science A (J250) Specification Data

export interface OCRTopic {
  id: string;
  subject: 'chemistry' | 'biology' | 'physics';
  topicCode: string;
  topicName: string;
  subtopics: {
    id: string;
    code: string;
    name: string;
    keyTerms: string[];
  }[];
  examBoard: 'OCR';
  tier: 'foundation' | 'higher' | 'both';
}

// ========== OCR BIOLOGY TOPICS (B1-B6) ==========
export const ocrBiologyTopics: OCRTopic[] = [
  {
    id: 'ocr-b1',
    subject: 'biology',
    topicCode: 'B1',
    topicName: 'Cell level systems',
    subtopics: [
      { id: 'b1.1', code: 'B1.1', name: 'Cell structures', keyTerms: ['cell', 'nucleus', 'mitochondria', 'chloroplast', 'cell membrane', 'ribosome', 'eukaryotic', 'prokaryotic', 'microscope', 'magnification'] },
      { id: 'b1.2', code: 'B1.2', name: 'What happens in cells (and what do cells need)?', keyTerms: ['enzyme', 'active site', 'substrate', 'denaturation', 'optimum temperature', 'pH', 'catalyst'] },
      { id: 'b1.3', code: 'B1.3', name: 'Respiration', keyTerms: ['aerobic respiration', 'anaerobic respiration', 'glucose', 'oxygen', 'carbon dioxide', 'ATP', 'lactic acid', 'fermentation'] },
      { id: 'b1.4', code: 'B1.4', name: 'Photosynthesis', keyTerms: ['photosynthesis', 'chlorophyll', 'light energy', 'glucose', 'oxygen', 'carbon dioxide', 'limiting factor'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-b2',
    subject: 'biology',
    topicCode: 'B2',
    topicName: 'Scaling up',
    subtopics: [
      { id: 'b2.1', code: 'B2.1', name: 'Supplying the cell', keyTerms: ['diffusion', 'osmosis', 'active transport', 'concentration gradient', 'partially permeable membrane', 'surface area to volume ratio'] },
      { id: 'b2.2', code: 'B2.2', name: 'The challenges of size', keyTerms: ['mitosis', 'cell cycle', 'DNA replication', 'chromosome', 'differentiation', 'stem cell', 'specialised cell'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-b3',
    subject: 'biology',
    topicCode: 'B3',
    topicName: 'Organism level systems',
    subtopics: [
      { id: 'b3.1', code: 'B3.1', name: 'Coordination and control – the nervous system', keyTerms: ['neurone', 'synapse', 'reflex arc', 'receptor', 'effector', 'stimulus', 'response', 'central nervous system', 'sensory neurone', 'motor neurone'] },
      { id: 'b3.2', code: 'B3.2', name: 'Coordination and control – the endocrine system', keyTerms: ['hormone', 'endocrine gland', 'pituitary gland', 'thyroid', 'adrenal gland', 'pancreas', 'insulin', 'glucagon', 'adrenaline'] },
      { id: 'b3.3', code: 'B3.3', name: 'Maintaining internal environments', keyTerms: ['homeostasis', 'negative feedback', 'blood glucose', 'thermoregulation', 'osmoregulation', 'kidney', 'nephron', 'dialysis'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-b4',
    subject: 'biology',
    topicCode: 'B4',
    topicName: 'Community level systems',
    subtopics: [
      { id: 'b4.1', code: 'B4.1', name: 'Ecosystems', keyTerms: ['ecosystem', 'community', 'population', 'habitat', 'biodiversity', 'food chain', 'food web', 'producer', 'consumer', 'decomposer', 'carbon cycle', 'nitrogen cycle'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-b5',
    subject: 'biology',
    topicCode: 'B5',
    topicName: 'Genes, inheritance and selection',
    subtopics: [
      { id: 'b5.1', code: 'B5.1', name: 'Inheritance', keyTerms: ['gene', 'allele', 'genotype', 'phenotype', 'dominant', 'recessive', 'homozygous', 'heterozygous', 'Punnett square', 'genetic cross', 'meiosis', 'gamete'] },
      { id: 'b5.2', code: 'B5.2', name: 'Natural selection and evolution', keyTerms: ['natural selection', 'evolution', 'mutation', 'adaptation', 'variation', 'selective breeding', 'genetic engineering', 'extinction', 'speciation'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-b6',
    subject: 'biology',
    topicCode: 'B6',
    topicName: 'Global challenges',
    subtopics: [
      { id: 'b6.1', code: 'B6.1', name: 'Monitoring and maintaining the environment', keyTerms: ['biodiversity', 'conservation', 'deforestation', 'global warming', 'pollution', 'eutrophication', 'indicator species'] },
      { id: 'b6.2', code: 'B6.2', name: 'Feeding the human race', keyTerms: ['food security', 'sustainable farming', 'fertilisers', 'pesticides', 'biological control', 'hydroponics', 'GM crops'] },
      { id: 'b6.3', code: 'B6.3', name: 'Monitoring and maintaining health', keyTerms: ['pathogen', 'bacteria', 'virus', 'fungus', 'communicable disease', 'non-communicable disease', 'immune system', 'vaccination', 'antibiotic', 'antibiotic resistance'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  }
];

// ========== OCR CHEMISTRY TOPICS (C1-C6) ==========
export const ocrChemistryTopics: OCRTopic[] = [
  {
    id: 'ocr-c1',
    subject: 'chemistry',
    topicCode: 'C1',
    topicName: 'Particles',
    subtopics: [
      { id: 'c1.1', code: 'C1.1', name: 'The particle model', keyTerms: ['solid', 'liquid', 'gas', 'particle', 'state of matter', 'melting', 'boiling', 'evaporation', 'condensation', 'sublimation'] },
      { id: 'c1.2', code: 'C1.2', name: 'Atomic structure', keyTerms: ['atom', 'proton', 'neutron', 'electron', 'nucleus', 'atomic number', 'mass number', 'isotope', 'relative atomic mass', 'electron shell'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-c2',
    subject: 'chemistry',
    topicCode: 'C2',
    topicName: 'Elements, compounds and mixtures',
    subtopics: [
      { id: 'c2.1', code: 'C2.1', name: 'Purity and separating mixtures', keyTerms: ['mixture', 'pure substance', 'filtration', 'crystallisation', 'distillation', 'chromatography', 'Rf value'] },
      { id: 'c2.2', code: 'C2.2', name: 'Bonding', keyTerms: ['ionic bond', 'covalent bond', 'metallic bond', 'ion', 'electron transfer', 'electron sharing', 'delocalised electrons', 'giant lattice'] },
      { id: 'c2.3', code: 'C2.3', name: 'Properties of materials', keyTerms: ['melting point', 'boiling point', 'electrical conductivity', 'giant ionic structure', 'simple molecular', 'giant covalent', 'polymer'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-c3',
    subject: 'chemistry',
    topicCode: 'C3',
    topicName: 'Chemical reactions',
    subtopics: [
      { id: 'c3.1', code: 'C3.1', name: 'Introducing chemical reactions', keyTerms: ['chemical reaction', 'reactant', 'product', 'conservation of mass', 'balanced equation', 'state symbol', 'word equation'] },
      { id: 'c3.2', code: 'C3.2', name: 'Energetics', keyTerms: ['exothermic', 'endothermic', 'activation energy', 'bond energy', 'energy profile', 'energy change'] },
      { id: 'c3.3', code: 'C3.3', name: 'Types of chemical reactions', keyTerms: ['oxidation', 'reduction', 'redox', 'acid', 'base', 'neutralisation', 'salt', 'displacement', 'thermal decomposition'] },
      { id: 'c3.4', code: 'C3.4', name: 'Electrolysis', keyTerms: ['electrolysis', 'electrolyte', 'electrode', 'anode', 'cathode', 'cation', 'anion', 'half equation'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-c4',
    subject: 'chemistry',
    topicCode: 'C4',
    topicName: 'Predicting and identifying reactions and products',
    subtopics: [
      { id: 'c4.1', code: 'C4.1', name: 'Predicting chemical reactions', keyTerms: ['periodic table', 'group', 'period', 'reactivity series', 'flame test', 'precipitate', 'gas test'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-c5',
    subject: 'chemistry',
    topicCode: 'C5',
    topicName: 'Monitoring and controlling chemical reactions',
    subtopics: [
      { id: 'c5.1', code: 'C5.1', name: 'Controlling reactions', keyTerms: ['rate of reaction', 'concentration', 'temperature', 'surface area', 'catalyst', 'collision theory'] },
      { id: 'c5.2', code: 'C5.2', name: 'Equilibria', keyTerms: ['reversible reaction', 'equilibrium', 'dynamic equilibrium', 'Le Chatelier\'s principle', 'closed system'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-c6',
    subject: 'chemistry',
    topicCode: 'C6',
    topicName: 'Global challenges',
    subtopics: [
      { id: 'c6.1', code: 'C6.1', name: 'Improving processes and products', keyTerms: ['life cycle assessment', 'recycling', 'finite resource', 'renewable resource', 'potable water', 'desalination'] },
      { id: 'c6.2', code: 'C6.2', name: 'Interpreting and interacting with Earth systems', keyTerms: ['atmosphere', 'greenhouse gas', 'carbon dioxide', 'methane', 'global warming', 'climate change', 'carbon footprint'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  }
];

// ========== OCR PHYSICS TOPICS (P1-P6) ==========
export const ocrPhysicsTopics: OCRTopic[] = [
  {
    id: 'ocr-p1',
    subject: 'physics',
    topicCode: 'P1',
    topicName: 'Matter',
    subtopics: [
      { id: 'p1.1', code: 'P1.1', name: 'The particle model', keyTerms: ['particle', 'density', 'mass', 'volume', 'solid', 'liquid', 'gas', 'internal energy'] },
      { id: 'p1.2', code: 'P1.2', name: 'Changes of state', keyTerms: ['specific heat capacity', 'specific latent heat', 'latent heat of fusion', 'latent heat of vaporisation', 'energy transfer'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-p2',
    subject: 'physics',
    topicCode: 'P2',
    topicName: 'Forces',
    subtopics: [
      { id: 'p2.1', code: 'P2.1', name: 'Motion', keyTerms: ['speed', 'velocity', 'acceleration', 'distance', 'displacement', 'distance-time graph', 'velocity-time graph'] },
      { id: 'p2.2', code: 'P2.2', name: 'Newton\'s laws', keyTerms: ['Newton\'s first law', 'Newton\'s second law', 'Newton\'s third law', 'force', 'mass', 'acceleration', 'inertia', 'resultant force'] },
      { id: 'p2.3', code: 'P2.3', name: 'Forces in action', keyTerms: ['momentum', 'impulse', 'conservation of momentum', 'stopping distance', 'thinking distance', 'braking distance', 'friction', 'air resistance'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-p3',
    subject: 'physics',
    topicCode: 'P3',
    topicName: 'Electricity and magnetism',
    subtopics: [
      { id: 'p3.1', code: 'P3.1', name: 'Static and Charge', keyTerms: ['static electricity', 'charge', 'electron', 'electric field', 'attraction', 'repulsion', 'earthing'] },
      { id: 'p3.2', code: 'P3.2', name: 'Simple circuits', keyTerms: ['current', 'voltage', 'resistance', 'Ohm\'s law', 'series circuit', 'parallel circuit', 'ammeter', 'voltmeter', 'power', 'energy'] },
      { id: 'p3.3', code: 'P3.3', name: 'Magnets and magnetic fields', keyTerms: ['magnet', 'magnetic field', 'electromagnet', 'solenoid', 'motor effect', 'generator', 'transformer'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-p4',
    subject: 'physics',
    topicCode: 'P4',
    topicName: 'Waves and radioactivity',
    subtopics: [
      { id: 'p4.1', code: 'P4.1', name: 'Wave behaviour', keyTerms: ['wave', 'amplitude', 'wavelength', 'frequency', 'period', 'transverse wave', 'longitudinal wave', 'reflection', 'refraction'] },
      { id: 'p4.2', code: 'P4.2', name: 'The electromagnetic spectrum', keyTerms: ['electromagnetic spectrum', 'radio waves', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'X-rays', 'gamma rays'] },
      { id: 'p4.3', code: 'P4.3', name: 'Radioactivity', keyTerms: ['radioactive decay', 'alpha particle', 'beta particle', 'gamma ray', 'half-life', 'nuclear equation', 'ionisation', 'background radiation'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-p5',
    subject: 'physics',
    topicCode: 'P5',
    topicName: 'Energy',
    subtopics: [
      { id: 'p5.1', code: 'P5.1', name: 'Work done', keyTerms: ['work done', 'energy transfer', 'joule', 'force', 'distance', 'kinetic energy', 'gravitational potential energy'] },
      { id: 'p5.2', code: 'P5.2', name: 'Power and efficiency', keyTerms: ['power', 'watt', 'efficiency', 'useful energy', 'wasted energy', 'conservation of energy'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  },
  {
    id: 'ocr-p6',
    subject: 'physics',
    topicCode: 'P6',
    topicName: 'Global challenges',
    subtopics: [
      { id: 'p6.1', code: 'P6.1', name: 'Physics on the move', keyTerms: ['velocity', 'acceleration', 'deceleration', 'crumple zone', 'seat belt', 'airbag', 'safety features'] },
      { id: 'p6.2', code: 'P6.2', name: 'Powering Earth', keyTerms: ['renewable energy', 'non-renewable energy', 'fossil fuel', 'nuclear power', 'solar', 'wind', 'hydroelectric', 'National Grid', 'transformer'] }
    ],
    examBoard: 'OCR',
    tier: 'both'
  }
];

// Combined export
export const ocrAllTopics = [...ocrBiologyTopics, ...ocrChemistryTopics, ...ocrPhysicsTopics];

// Helper function to get topics by subject
export const getOCRTopicsBySubject = (subject: 'biology' | 'chemistry' | 'physics') => {
  switch (subject) {
    case 'biology': return ocrBiologyTopics;
    case 'chemistry': return ocrChemistryTopics;
    case 'physics': return ocrPhysicsTopics;
    default: return [];
  }
};
