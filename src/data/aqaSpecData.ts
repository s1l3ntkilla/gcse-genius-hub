// AQA GCSE Specification Data extracted from official specifications
// Chemistry (8462), Physics (8463), Biology (8461)

export interface AQATopic {
  id: string;
  subject: 'chemistry' | 'biology' | 'physics';
  unit: string;
  unitNumber: string;
  topic: string;
  subtopics: string[];
  keyTerms: string[];
  examBoard: 'AQA';
  tier: 'foundation' | 'higher' | 'both';
}

export interface AQAFlashcard {
  id: string;
  subject: 'chemistry' | 'biology' | 'physics';
  topic: string;
  unit: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tier: 'foundation' | 'higher' | 'both';
  examBoard: 'AQA';
}

// ========== AQA CHEMISTRY TOPICS (8462) ==========
export const aqaChemistryTopics: AQATopic[] = [
  {
    id: 'chem-4.1',
    subject: 'chemistry',
    unit: 'Atomic structure and the periodic table',
    unitNumber: '4.1',
    topic: 'A simple model of the atom, symbols, relative atomic mass, electronic charge and isotopes',
    subtopics: [
      'Atoms, elements and compounds',
      'Mixtures',
      'The development of the model of the atom',
      'Relative electrical charges of subatomic particles',
      'Size and mass of atoms',
      'Relative atomic mass',
      'Electronic structure'
    ],
    keyTerms: ['atom', 'element', 'compound', 'mixture', 'proton', 'neutron', 'electron', 'isotope', 'atomic number', 'mass number'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.1.2',
    subject: 'chemistry',
    unit: 'Atomic structure and the periodic table',
    unitNumber: '4.1',
    topic: 'The periodic table',
    subtopics: [
      'The periodic table',
      'Development of the periodic table',
      'Metals and non-metals',
      'Group 0 (Noble gases)',
      'Group 1 (Alkali metals)',
      'Group 7 (Halogens)',
      'Transition metals'
    ],
    keyTerms: ['periodic table', 'group', 'period', 'alkali metals', 'halogens', 'noble gases', 'transition metals'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.2',
    subject: 'chemistry',
    unit: 'Bonding, structure, and the properties of matter',
    unitNumber: '4.2',
    topic: 'Chemical bonds, ionic, covalent and metallic',
    subtopics: [
      'Ionic bonding',
      'Ionic compounds',
      'Covalent bonding',
      'Metallic bonding'
    ],
    keyTerms: ['ionic bond', 'covalent bond', 'metallic bond', 'electrostatic attraction', 'shared electrons', 'delocalised electrons'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.2.2',
    subject: 'chemistry',
    unit: 'Bonding, structure, and the properties of matter',
    unitNumber: '4.2',
    topic: 'How bonding and structure are related to properties',
    subtopics: [
      'The three states of matter',
      'State symbols',
      'Properties of ionic compounds',
      'Properties of small molecules',
      'Polymers',
      'Giant covalent structures',
      'Properties of metals and alloys',
      'Diamond, graphite, graphene, fullerenes'
    ],
    keyTerms: ['giant ionic lattice', 'simple molecular', 'giant covalent', 'polymer', 'alloy', 'graphene', 'fullerene'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.3',
    subject: 'chemistry',
    unit: 'Quantitative chemistry',
    unitNumber: '4.3',
    topic: 'Conservation of mass and the quantitative interpretation of chemical equations',
    subtopics: [
      'Conservation of mass',
      'Relative formula mass',
      'Mass changes when a reactant or product is a gas',
      'Chemical measurements and uncertainty'
    ],
    keyTerms: ['relative formula mass', 'conservation of mass', 'balanced equation', 'uncertainty'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.3.2',
    subject: 'chemistry',
    unit: 'Quantitative chemistry',
    unitNumber: '4.3',
    topic: 'Use of amount of substance in calculations',
    subtopics: [
      'Moles (HT)',
      'Amounts of substances in equations (HT)',
      'Using moles to balance equations (HT)',
      'Limiting reactants (HT)',
      'Concentration of solutions'
    ],
    keyTerms: ['mole', 'Avogadro constant', 'limiting reactant', 'excess', 'concentration', 'mol/dm³'],
    examBoard: 'AQA',
    tier: 'higher'
  },
  {
    id: 'chem-4.4',
    subject: 'chemistry',
    unit: 'Chemical changes',
    unitNumber: '4.4',
    topic: 'Reactivity of metals',
    subtopics: [
      'Metal oxides',
      'The reactivity series',
      'Extraction of metals and reduction',
      'Oxidation and reduction in terms of electrons (HT)'
    ],
    keyTerms: ['reactivity series', 'reduction', 'oxidation', 'displacement', 'extraction', 'ore'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.4.2',
    subject: 'chemistry',
    unit: 'Chemical changes',
    unitNumber: '4.4',
    topic: 'Reactions of acids',
    subtopics: [
      'Reactions of acids with metals',
      'Neutralisation of acids and salt production',
      'Soluble salts',
      'The pH scale and neutralisation',
      'Strong and weak acids (HT)'
    ],
    keyTerms: ['acid', 'base', 'alkali', 'neutralisation', 'salt', 'pH', 'hydrogen ions', 'hydroxide ions'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.4.3',
    subject: 'chemistry',
    unit: 'Chemical changes',
    unitNumber: '4.4',
    topic: 'Electrolysis',
    subtopics: [
      'Electrolysis',
      'Electrolysis of molten ionic compounds',
      'Using electrolysis to extract metals',
      'Electrolysis of aqueous solutions (HT)'
    ],
    keyTerms: ['electrolysis', 'electrolyte', 'electrode', 'cathode', 'anode', 'cation', 'anion'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.5',
    subject: 'chemistry',
    unit: 'Energy changes',
    unitNumber: '4.5',
    topic: 'Exothermic and endothermic reactions',
    subtopics: [
      'Energy transfer during exothermic and endothermic reactions',
      'Reaction profiles',
      'The energy change of reactions (HT)'
    ],
    keyTerms: ['exothermic', 'endothermic', 'activation energy', 'bond energy', 'reaction profile'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.6',
    subject: 'chemistry',
    unit: 'The rate and extent of chemical change',
    unitNumber: '4.6',
    topic: 'Rate of reaction',
    subtopics: [
      'Calculating rates of reactions',
      'Factors which affect the rate of chemical reactions',
      'Collision theory and activation energy',
      'Catalysts'
    ],
    keyTerms: ['rate of reaction', 'collision theory', 'activation energy', 'catalyst', 'surface area', 'concentration'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.6.2',
    subject: 'chemistry',
    unit: 'The rate and extent of chemical change',
    unitNumber: '4.6',
    topic: 'Reversible reactions and dynamic equilibrium',
    subtopics: [
      'Reversible reactions',
      'Energy changes and reversible reactions',
      'Equilibrium (HT)',
      'The effect of changing conditions on equilibrium (HT)'
    ],
    keyTerms: ['reversible reaction', 'equilibrium', 'Le Chatelier\'s principle', 'closed system'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.7',
    subject: 'chemistry',
    unit: 'Organic chemistry',
    unitNumber: '4.7',
    topic: 'Carbon compounds as fuels and feedstock',
    subtopics: [
      'Crude oil, hydrocarbons and alkanes',
      'Fractional distillation and petrochemicals',
      'Properties of hydrocarbons',
      'Cracking and alkenes'
    ],
    keyTerms: ['hydrocarbon', 'alkane', 'alkene', 'fractional distillation', 'cracking', 'polymer'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.7.2',
    subject: 'chemistry',
    unit: 'Organic chemistry',
    unitNumber: '4.7',
    topic: 'Reactions of alkenes and alcohols',
    subtopics: [
      'Structure and formulae of alkenes',
      'Reactions of alkenes',
      'Alcohols',
      'Carboxylic acids',
      'Addition polymerisation',
      'Condensation polymerisation (HT)'
    ],
    keyTerms: ['double bond', 'addition reaction', 'polymerisation', 'monomer', 'alcohol', 'carboxylic acid', 'ester'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.8',
    subject: 'chemistry',
    unit: 'Chemical analysis',
    unitNumber: '4.8',
    topic: 'Purity, formulations and chromatography',
    subtopics: [
      'Pure substances',
      'Formulations',
      'Chromatography'
    ],
    keyTerms: ['purity', 'formulation', 'chromatography', 'Rf value', 'mobile phase', 'stationary phase'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.8.2',
    subject: 'chemistry',
    unit: 'Chemical analysis',
    unitNumber: '4.8',
    topic: 'Identification of common gases and ions',
    subtopics: [
      'Test for hydrogen',
      'Test for oxygen',
      'Test for carbon dioxide',
      'Test for chlorine',
      'Flame tests',
      'Metal hydroxides',
      'Carbonates',
      'Halides',
      'Sulfates'
    ],
    keyTerms: ['flame test', 'precipitate', 'limewater', 'squeaky pop', 'glowing splint'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.9',
    subject: 'chemistry',
    unit: 'Chemistry of the atmosphere',
    unitNumber: '4.9',
    topic: 'The composition and evolution of the Earth\'s atmosphere',
    subtopics: [
      'The proportions of different gases in the atmosphere',
      'The Earth\'s early atmosphere',
      'How oxygen increased',
      'How carbon dioxide decreased'
    ],
    keyTerms: ['atmosphere', 'nitrogen', 'oxygen', 'carbon dioxide', 'photosynthesis', 'sedimentary rock'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.9.2',
    subject: 'chemistry',
    unit: 'Chemistry of the atmosphere',
    unitNumber: '4.9',
    topic: 'Carbon dioxide and methane as greenhouse gases',
    subtopics: [
      'Greenhouse gases',
      'Human activities which contribute to greenhouse gases',
      'Global climate change',
      'The carbon footprint and its reduction'
    ],
    keyTerms: ['greenhouse effect', 'global warming', 'climate change', 'carbon footprint', 'methane'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.10',
    subject: 'chemistry',
    unit: 'Using resources',
    unitNumber: '4.10',
    topic: 'Using the Earth\'s resources and sustainable development',
    subtopics: [
      'Using the Earth\'s resources and sustainable development',
      'Potable water',
      'Waste water treatment',
      'Alternative methods of extracting metals (HT)'
    ],
    keyTerms: ['sustainable development', 'potable water', 'desalination', 'sewage treatment', 'phytomining', 'bioleaching'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'chem-4.10.2',
    subject: 'chemistry',
    unit: 'Using resources',
    unitNumber: '4.10',
    topic: 'Life cycle assessment and recycling',
    subtopics: [
      'Life cycle assessment',
      'Ways of reducing the use of resources'
    ],
    keyTerms: ['life cycle assessment', 'recycling', 'reuse', 'reduce', 'environmental impact'],
    examBoard: 'AQA',
    tier: 'both'
  }
];

// ========== AQA PHYSICS TOPICS (8463) ==========
export const aqaPhysicsTopics: AQATopic[] = [
  {
    id: 'phys-4.1',
    subject: 'physics',
    unit: 'Energy',
    unitNumber: '4.1',
    topic: 'Energy changes in a system',
    subtopics: [
      'Energy stores and systems',
      'Changes in energy',
      'Energy changes in systems',
      'Power'
    ],
    keyTerms: ['kinetic energy', 'gravitational potential energy', 'elastic potential energy', 'thermal energy', 'power', 'work done'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.1.2',
    subject: 'physics',
    unit: 'Energy',
    unitNumber: '4.1',
    topic: 'Conservation and dissipation of energy',
    subtopics: [
      'Energy transfers in a system',
      'Efficiency'
    ],
    keyTerms: ['conservation of energy', 'dissipation', 'efficiency', 'useful energy', 'wasted energy', 'thermal insulation'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.1.3',
    subject: 'physics',
    unit: 'Energy',
    unitNumber: '4.1',
    topic: 'National and global energy resources',
    subtopics: [
      'Main energy resources',
      'Renewable and non-renewable energy',
      'Environmental impact of energy resources'
    ],
    keyTerms: ['fossil fuels', 'nuclear', 'renewable', 'non-renewable', 'solar', 'wind', 'hydroelectric', 'geothermal', 'tidal'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.2',
    subject: 'physics',
    unit: 'Electricity',
    unitNumber: '4.2',
    topic: 'Current, potential difference and resistance',
    subtopics: [
      'Standard circuit diagram symbols',
      'Electrical charge and current',
      'Current, resistance and potential difference',
      'Resistors'
    ],
    keyTerms: ['current', 'potential difference', 'resistance', 'charge', 'ammeter', 'voltmeter', 'ohm'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.2.2',
    subject: 'physics',
    unit: 'Electricity',
    unitNumber: '4.2',
    topic: 'Series and parallel circuits',
    subtopics: [
      'Series circuits',
      'Parallel circuits'
    ],
    keyTerms: ['series circuit', 'parallel circuit', 'total resistance', 'current division', 'voltage division'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.2.3',
    subject: 'physics',
    unit: 'Electricity',
    unitNumber: '4.2',
    topic: 'Domestic uses and safety',
    subtopics: [
      'Direct and alternating potential difference',
      'Mains electricity',
      'Power',
      'Energy transfers in everyday appliances',
      'The National Grid'
    ],
    keyTerms: ['AC', 'DC', 'live wire', 'neutral wire', 'earth wire', 'fuse', 'circuit breaker', 'National Grid', 'transformer'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.2.4',
    subject: 'physics',
    unit: 'Electricity',
    unitNumber: '4.2',
    topic: 'Energy transfers',
    subtopics: [
      'Power',
      'Energy transfers in appliances',
      'The National Grid'
    ],
    keyTerms: ['power', 'kilowatt-hour', 'energy transfer', 'step-up transformer', 'step-down transformer'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.2.5',
    subject: 'physics',
    unit: 'Electricity',
    unitNumber: '4.2',
    topic: 'Static electricity',
    subtopics: [
      'Static charge',
      'Electric fields'
    ],
    keyTerms: ['static electricity', 'charging by friction', 'electric field', 'attraction', 'repulsion', 'earthing'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.3',
    subject: 'physics',
    unit: 'Particle model of matter',
    unitNumber: '4.3',
    topic: 'Changes of state and particle model',
    subtopics: [
      'Density of materials',
      'Changes of state',
      'Internal energy',
      'Temperature changes in a system and specific heat capacity',
      'Changes of state and specific latent heat'
    ],
    keyTerms: ['density', 'state of matter', 'internal energy', 'specific heat capacity', 'specific latent heat', 'melting', 'boiling'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.3.2',
    subject: 'physics',
    unit: 'Particle model of matter',
    unitNumber: '4.3',
    topic: 'Pressure of gases',
    subtopics: [
      'Particle motion in gases',
      'Pressure in gases (HT)',
      'Increasing the pressure of a gas (HT)'
    ],
    keyTerms: ['pressure', 'Kelvin', 'absolute zero', 'gas laws', 'particle motion'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.4',
    subject: 'physics',
    unit: 'Atomic structure',
    unitNumber: '4.4',
    topic: 'Atoms and isotopes',
    subtopics: [
      'The structure of an atom',
      'Mass number, atomic number and isotopes',
      'The development of the model of the atom'
    ],
    keyTerms: ['proton', 'neutron', 'electron', 'nucleus', 'isotope', 'atomic number', 'mass number', 'plum pudding model'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.4.2',
    subject: 'physics',
    unit: 'Atomic structure',
    unitNumber: '4.4',
    topic: 'Atoms and nuclear radiation',
    subtopics: [
      'Radioactive decay and nuclear radiation',
      'Nuclear equations',
      'Half-lives and the random nature of radioactive decay',
      'Radioactive contamination'
    ],
    keyTerms: ['alpha particle', 'beta particle', 'gamma ray', 'half-life', 'radioactive decay', 'contamination', 'irradiation'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.4.3',
    subject: 'physics',
    unit: 'Atomic structure',
    unitNumber: '4.4',
    topic: 'Hazards and uses of radiation',
    subtopics: [
      'Background radiation',
      'Different half-lives of radioactive isotopes',
      'Uses of nuclear radiation',
      'Nuclear fission',
      'Nuclear fusion'
    ],
    keyTerms: ['background radiation', 'nuclear fission', 'nuclear fusion', 'chain reaction', 'nuclear reactor'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Forces and their interactions',
    subtopics: [
      'Scalar and vector quantities',
      'Contact and non-contact forces',
      'Gravity',
      'Resultant forces'
    ],
    keyTerms: ['scalar', 'vector', 'contact force', 'non-contact force', 'gravity', 'weight', 'mass', 'resultant force'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5.2',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Work done and energy transfer',
    subtopics: [
      'Work done',
      'Work done and energy transfer'
    ],
    keyTerms: ['work done', 'joule', 'energy transfer', 'force', 'distance'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5.3',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Forces and elasticity',
    subtopics: [
      'Forces and elasticity',
      'Relationship between force and extension'
    ],
    keyTerms: ['elastic deformation', 'inelastic deformation', 'extension', 'spring constant', 'limit of proportionality', 'Hooke\'s Law'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5.4',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Forces and motion',
    subtopics: [
      'Describing motion along a line',
      'Distance and displacement',
      'Speed and velocity',
      'Acceleration',
      'Distance-time graphs',
      'Velocity-time graphs',
      'Terminal velocity',
      'Newton\'s Laws of motion'
    ],
    keyTerms: ['speed', 'velocity', 'acceleration', 'distance', 'displacement', 'terminal velocity', 'Newton\'s first law', 'Newton\'s second law', 'Newton\'s third law'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5.5',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Forces and braking',
    subtopics: [
      'Stopping distance',
      'Reaction time',
      'Factors affecting braking distance'
    ],
    keyTerms: ['stopping distance', 'thinking distance', 'braking distance', 'reaction time', 'braking force'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.5.6',
    subject: 'physics',
    unit: 'Forces',
    unitNumber: '4.5',
    topic: 'Momentum (HT)',
    subtopics: [
      'Momentum',
      'Conservation of momentum'
    ],
    keyTerms: ['momentum', 'conservation of momentum', 'collision', 'impulse'],
    examBoard: 'AQA',
    tier: 'higher'
  },
  {
    id: 'phys-4.6',
    subject: 'physics',
    unit: 'Waves',
    unitNumber: '4.6',
    topic: 'Waves in air, fluids and solids',
    subtopics: [
      'Transverse and longitudinal waves',
      'Properties of waves',
      'Reflection of waves',
      'Sound waves',
      'Waves for detection and exploration (HT)'
    ],
    keyTerms: ['transverse wave', 'longitudinal wave', 'amplitude', 'wavelength', 'frequency', 'period', 'wave speed', 'reflection'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.6.2',
    subject: 'physics',
    unit: 'Waves',
    unitNumber: '4.6',
    topic: 'Electromagnetic waves',
    subtopics: [
      'Electromagnetic spectrum',
      'Properties of electromagnetic waves',
      'Uses and applications of electromagnetic waves',
      'Lenses (HT)',
      'Visible light'
    ],
    keyTerms: ['electromagnetic spectrum', 'radio waves', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'X-rays', 'gamma rays'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.7',
    subject: 'physics',
    unit: 'Magnetism and electromagnetism',
    unitNumber: '4.7',
    topic: 'Permanent and induced magnetism',
    subtopics: [
      'Poles of a magnet',
      'Magnetic fields',
      'Electromagnetism',
      'Solenoids'
    ],
    keyTerms: ['magnetic field', 'north pole', 'south pole', 'permanent magnet', 'induced magnet', 'electromagnet', 'solenoid'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.7.2',
    subject: 'physics',
    unit: 'Magnetism and electromagnetism',
    unitNumber: '4.7',
    topic: 'The motor effect',
    subtopics: [
      'Electromagnetism',
      'Fleming\'s left-hand rule (HT)',
      'Electric motors (HT)'
    ],
    keyTerms: ['motor effect', 'Fleming\'s left-hand rule', 'electric motor', 'force on a conductor'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'phys-4.7.3',
    subject: 'physics',
    unit: 'Magnetism and electromagnetism',
    unitNumber: '4.7',
    topic: 'Induced potential, transformers and the National Grid (HT)',
    subtopics: [
      'Induced potential',
      'Uses of the generator effect',
      'Microphones and loudspeakers',
      'Transformers'
    ],
    keyTerms: ['electromagnetic induction', 'generator', 'alternator', 'transformer', 'dynamo'],
    examBoard: 'AQA',
    tier: 'higher'
  },
  {
    id: 'phys-4.8',
    subject: 'physics',
    unit: 'Space physics',
    unitNumber: '4.8',
    topic: 'Solar system, stability of orbital motions and satellites',
    subtopics: [
      'Our solar system',
      'The life cycle of a star',
      'Orbital motion and satellites',
      'Red-shift'
    ],
    keyTerms: ['solar system', 'planet', 'dwarf planet', 'moon', 'artificial satellite', 'orbit', 'red-shift', 'Big Bang'],
    examBoard: 'AQA',
    tier: 'both'
  }
];

// ========== AQA BIOLOGY TOPICS (8461) ==========
export const aqaBiologyTopics: AQATopic[] = [
  {
    id: 'bio-4.1',
    subject: 'biology',
    unit: 'Cell biology',
    unitNumber: '4.1',
    topic: 'Cell structure',
    subtopics: [
      'Eukaryotes and prokaryotes',
      'Animal and plant cells',
      'Cell specialisation',
      'Cell differentiation',
      'Microscopy'
    ],
    keyTerms: ['eukaryotic', 'prokaryotic', 'nucleus', 'cytoplasm', 'cell membrane', 'mitochondria', 'ribosome', 'cell wall', 'chloroplast', 'vacuole'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.1.2',
    subject: 'biology',
    unit: 'Cell biology',
    unitNumber: '4.1',
    topic: 'Cell division',
    subtopics: [
      'Chromosomes',
      'Mitosis and the cell cycle',
      'Stem cells'
    ],
    keyTerms: ['chromosome', 'mitosis', 'cell cycle', 'stem cell', 'differentiation', 'therapeutic cloning'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.1.3',
    subject: 'biology',
    unit: 'Cell biology',
    unitNumber: '4.1',
    topic: 'Transport in cells',
    subtopics: [
      'Diffusion',
      'Osmosis',
      'Active transport'
    ],
    keyTerms: ['diffusion', 'osmosis', 'active transport', 'concentration gradient', 'partially permeable membrane'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.2',
    subject: 'biology',
    unit: 'Organisation',
    unitNumber: '4.2',
    topic: 'Principles of organisation',
    subtopics: [
      'Cells, tissues, organs and systems',
      'The human digestive system',
      'The heart and blood vessels',
      'Blood',
      'Coronary heart disease',
      'Health issues',
      'The effect of lifestyle on disease',
      'Cancer'
    ],
    keyTerms: ['tissue', 'organ', 'organ system', 'enzyme', 'digestive system', 'heart', 'blood', 'artery', 'vein', 'capillary'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.2.2',
    subject: 'biology',
    unit: 'Organisation',
    unitNumber: '4.2',
    topic: 'Plant tissues, organs and systems',
    subtopics: [
      'Plant tissues',
      'Plant organ system'
    ],
    keyTerms: ['epidermal tissue', 'palisade mesophyll', 'spongy mesophyll', 'xylem', 'phloem', 'stomata', 'guard cells', 'transpiration'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.3',
    subject: 'biology',
    unit: 'Infection and response',
    unitNumber: '4.3',
    topic: 'Communicable diseases',
    subtopics: [
      'Communicable (infectious) diseases',
      'Viral diseases',
      'Bacterial diseases',
      'Fungal diseases',
      'Protist diseases',
      'Human defence systems',
      'Vaccination',
      'Antibiotics and painkillers',
      'Discovery and development of drugs'
    ],
    keyTerms: ['pathogen', 'bacteria', 'virus', 'fungi', 'protist', 'vaccination', 'antibiotic', 'antigen', 'antibody', 'white blood cell'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.3.2',
    subject: 'biology',
    unit: 'Infection and response',
    unitNumber: '4.3',
    topic: 'Monoclonal antibodies (HT)',
    subtopics: [
      'Producing monoclonal antibodies',
      'Uses of monoclonal antibodies'
    ],
    keyTerms: ['monoclonal antibodies', 'hybridoma', 'lymphocyte', 'diagnosis', 'treatment'],
    examBoard: 'AQA',
    tier: 'higher'
  },
  {
    id: 'bio-4.3.3',
    subject: 'biology',
    unit: 'Infection and response',
    unitNumber: '4.3',
    topic: 'Plant disease (biology only)',
    subtopics: [
      'Detection and identification of plant diseases',
      'Plant defence responses'
    ],
    keyTerms: ['plant disease', 'mineral deficiency', 'physical defence', 'chemical defence', 'mechanical adaptation'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.4',
    subject: 'biology',
    unit: 'Bioenergetics',
    unitNumber: '4.4',
    topic: 'Photosynthesis',
    subtopics: [
      'Photosynthetic reaction',
      'Rate of photosynthesis',
      'Uses of glucose from photosynthesis'
    ],
    keyTerms: ['photosynthesis', 'chlorophyll', 'glucose', 'carbon dioxide', 'oxygen', 'light intensity', 'limiting factor'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.4.2',
    subject: 'biology',
    unit: 'Bioenergetics',
    unitNumber: '4.4',
    topic: 'Respiration',
    subtopics: [
      'Aerobic respiration',
      'Anaerobic respiration',
      'Response to exercise',
      'Metabolism'
    ],
    keyTerms: ['aerobic respiration', 'anaerobic respiration', 'mitochondria', 'glucose', 'oxygen', 'carbon dioxide', 'lactic acid', 'oxygen debt'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.5',
    subject: 'biology',
    unit: 'Homeostasis and response',
    unitNumber: '4.5',
    topic: 'Homeostasis',
    subtopics: [
      'Homeostasis',
      'The human nervous system',
      'Reflexes',
      'The brain (HT)',
      'The eye (HT)',
      'Control of body temperature (HT)'
    ],
    keyTerms: ['homeostasis', 'receptor', 'coordination centre', 'effector', 'nervous system', 'reflex arc', 'synapse', 'neurone'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.5.2',
    subject: 'biology',
    unit: 'Homeostasis and response',
    unitNumber: '4.5',
    topic: 'Hormonal coordination',
    subtopics: [
      'Human endocrine system',
      'Control of blood glucose concentration',
      'Hormones in human reproduction',
      'Contraception',
      'The use of hormones to treat infertility (HT)',
      'Negative feedback (HT)'
    ],
    keyTerms: ['hormone', 'endocrine system', 'gland', 'insulin', 'glucagon', 'diabetes', 'adrenaline', 'thyroxine', 'oestrogen', 'testosterone'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.5.3',
    subject: 'biology',
    unit: 'Homeostasis and response',
    unitNumber: '4.5',
    topic: 'Plant hormones (biology only)',
    subtopics: [
      'Control and coordination in plants',
      'Use of plant hormones'
    ],
    keyTerms: ['auxin', 'gibberellin', 'phototropism', 'gravitropism', 'ethene'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.6',
    subject: 'biology',
    unit: 'Inheritance, variation and evolution',
    unitNumber: '4.6',
    topic: 'Reproduction',
    subtopics: [
      'Sexual and asexual reproduction',
      'Meiosis',
      'Advantages and disadvantages of sexual and asexual reproduction',
      'DNA and the genome',
      'DNA structure',
      'Genetic inheritance',
      'Inherited disorders',
      'Sex determination'
    ],
    keyTerms: ['sexual reproduction', 'asexual reproduction', 'meiosis', 'gamete', 'DNA', 'gene', 'chromosome', 'allele', 'genotype', 'phenotype', 'dominant', 'recessive'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.6.2',
    subject: 'biology',
    unit: 'Inheritance, variation and evolution',
    unitNumber: '4.6',
    topic: 'Variation and evolution',
    subtopics: [
      'Variation',
      'Evolution',
      'Selective breeding',
      'Genetic engineering',
      'Cloning'
    ],
    keyTerms: ['variation', 'mutation', 'natural selection', 'evolution', 'selective breeding', 'genetic engineering', 'clone'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.6.3',
    subject: 'biology',
    unit: 'Inheritance, variation and evolution',
    unitNumber: '4.6',
    topic: 'The development of understanding of genetics and evolution',
    subtopics: [
      'Darwin and evolution',
      'Speciation',
      'The understanding of genetics (HT)',
      'Evidence for evolution',
      'Fossils',
      'Extinction',
      'Resistant bacteria'
    ],
    keyTerms: ['Darwin', 'Wallace', 'speciation', 'fossil', 'extinction', 'antibiotic resistance', 'MRSA'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.6.4',
    subject: 'biology',
    unit: 'Inheritance, variation and evolution',
    unitNumber: '4.6',
    topic: 'Classification of living organisms',
    subtopics: [
      'Classification',
      'The binomial system'
    ],
    keyTerms: ['Linnaeus', 'classification', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'binomial system'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.7',
    subject: 'biology',
    unit: 'Ecology',
    unitNumber: '4.7',
    topic: 'Adaptations, interdependence and competition',
    subtopics: [
      'Communities',
      'Abiotic factors',
      'Biotic factors',
      'Adaptations'
    ],
    keyTerms: ['ecosystem', 'community', 'population', 'habitat', 'abiotic', 'biotic', 'competition', 'interdependence', 'adaptation'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.7.2',
    subject: 'biology',
    unit: 'Ecology',
    unitNumber: '4.7',
    topic: 'Organisation of an ecosystem',
    subtopics: [
      'Levels of organisation',
      'Feeding relationships',
      'How materials are cycled'
    ],
    keyTerms: ['producer', 'consumer', 'predator', 'prey', 'food chain', 'food web', 'decomposer', 'carbon cycle', 'water cycle'],
    examBoard: 'AQA',
    tier: 'both'
  },
  {
    id: 'bio-4.7.3',
    subject: 'biology',
    unit: 'Ecology',
    unitNumber: '4.7',
    topic: 'Biodiversity and the effect of human interaction on ecosystems',
    subtopics: [
      'Biodiversity',
      'Waste management',
      'Land use',
      'Deforestation',
      'Global warming',
      'Maintaining biodiversity'
    ],
    keyTerms: ['biodiversity', 'deforestation', 'global warming', 'pollution', 'eutrophication', 'endangered species', 'conservation'],
    examBoard: 'AQA',
    tier: 'both'
  }
];

// ========== AQA FLASHCARDS ==========
export const aqaFlashcards: AQAFlashcard[] = [
  // CHEMISTRY FLASHCARDS
  // Atomic Structure
  { id: 'aqa-fc-c1', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What are the three subatomic particles and their relative charges?', answer: 'Protons (+1), Neutrons (0), Electrons (-1)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c2', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What is the atomic number of an element?', answer: 'The number of protons in the nucleus of an atom', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c3', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What is the mass number?', answer: 'The total number of protons and neutrons in the nucleus', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c4', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What are isotopes?', answer: 'Atoms of the same element with the same number of protons but different numbers of neutrons', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c5', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'Describe the plum pudding model of the atom.', answer: 'A ball of positive charge with negative electrons embedded in it, like plums in a pudding', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c6', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What did the alpha particle scattering experiment show?', answer: 'Most of the atom is empty space, with a small, dense, positively charged nucleus at the centre', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c7', subject: 'chemistry', topic: 'Atomic Structure', unit: '4.1', question: 'What is the electronic configuration of sodium (Na)?', answer: '2, 8, 1', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // Periodic Table
  { id: 'aqa-fc-c8', subject: 'chemistry', topic: 'Periodic Table', unit: '4.1', question: 'Why are elements in the same group similar?', answer: 'They have the same number of electrons in their outer shell', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c9', subject: 'chemistry', topic: 'Periodic Table', unit: '4.1', question: 'What are the Group 1 elements called?', answer: 'Alkali metals', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c10', subject: 'chemistry', topic: 'Periodic Table', unit: '4.1', question: 'What are the Group 7 elements called?', answer: 'Halogens', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c11', subject: 'chemistry', topic: 'Periodic Table', unit: '4.1', question: 'Why are Group 0 elements unreactive?', answer: 'They have a full outer shell of electrons, so are stable and do not need to lose, gain or share electrons', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c12', subject: 'chemistry', topic: 'Periodic Table', unit: '4.1', question: 'How does reactivity change going down Group 1?', answer: 'Reactivity increases because the outer electron is further from the nucleus and more easily lost', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Bonding
  { id: 'aqa-fc-c13', subject: 'chemistry', topic: 'Bonding', unit: '4.2', question: 'What is an ionic bond?', answer: 'The electrostatic attraction between oppositely charged ions, formed by transfer of electrons from metal to non-metal', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c14', subject: 'chemistry', topic: 'Bonding', unit: '4.2', question: 'What is a covalent bond?', answer: 'A shared pair of electrons between two non-metal atoms', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c15', subject: 'chemistry', topic: 'Bonding', unit: '4.2', question: 'What is metallic bonding?', answer: 'Positive metal ions surrounded by a sea of delocalised electrons', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c16', subject: 'chemistry', topic: 'Bonding', unit: '4.2', question: 'Why do ionic compounds have high melting points?', answer: 'There are strong electrostatic forces between oppositely charged ions that require a lot of energy to overcome', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c17', subject: 'chemistry', topic: 'Bonding', unit: '4.2', question: 'Why can metals conduct electricity?', answer: 'They have delocalised electrons that are free to move and carry charge', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Quantitative Chemistry
  { id: 'aqa-fc-c18', subject: 'chemistry', topic: 'Quantitative Chemistry', unit: '4.3', question: 'What is the law of conservation of mass?', answer: 'In a chemical reaction, no atoms are created or destroyed, so the total mass of products equals the total mass of reactants', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c19', subject: 'chemistry', topic: 'Quantitative Chemistry', unit: '4.3', question: 'How do you calculate relative formula mass (Mr)?', answer: 'Add up the relative atomic masses (Ar) of all atoms in the formula', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c20', subject: 'chemistry', topic: 'Quantitative Chemistry', unit: '4.3', question: 'What is one mole?', answer: 'The amount of substance containing 6.02 × 10²³ particles (Avogadro\'s constant)', difficulty: 'medium', tier: 'higher', examBoard: 'AQA' },
  
  // Chemical Changes
  { id: 'aqa-fc-c21', subject: 'chemistry', topic: 'Chemical Changes', unit: '4.4', question: 'What is the reactivity series (most to least reactive)?', answer: 'Potassium, Sodium, Lithium, Calcium, Magnesium, Aluminium, Carbon, Zinc, Iron, Hydrogen, Copper, Silver, Gold', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c22', subject: 'chemistry', topic: 'Chemical Changes', unit: '4.4', question: 'What is oxidation in terms of oxygen?', answer: 'Gaining oxygen', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c23', subject: 'chemistry', topic: 'Chemical Changes', unit: '4.4', question: 'What is reduction in terms of oxygen?', answer: 'Losing oxygen', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c24', subject: 'chemistry', topic: 'Chemical Changes', unit: '4.4', question: 'What is produced when an acid reacts with a metal?', answer: 'A salt + hydrogen gas', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c25', subject: 'chemistry', topic: 'Chemical Changes', unit: '4.4', question: 'What is the pH of a neutral solution?', answer: '7', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // Electrolysis
  { id: 'aqa-fc-c26', subject: 'chemistry', topic: 'Electrolysis', unit: '4.4', question: 'What is electrolysis?', answer: 'The decomposition of an ionic compound using electricity when molten or dissolved in water', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c27', subject: 'chemistry', topic: 'Electrolysis', unit: '4.4', question: 'What happens at the cathode during electrolysis?', answer: 'Positive ions (cations) gain electrons and are reduced', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c28', subject: 'chemistry', topic: 'Electrolysis', unit: '4.4', question: 'What happens at the anode during electrolysis?', answer: 'Negative ions (anions) lose electrons and are oxidised', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Energy Changes
  { id: 'aqa-fc-c29', subject: 'chemistry', topic: 'Energy Changes', unit: '4.5', question: 'What is an exothermic reaction?', answer: 'A reaction that releases energy to the surroundings, causing temperature to rise', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c30', subject: 'chemistry', topic: 'Energy Changes', unit: '4.5', question: 'What is an endothermic reaction?', answer: 'A reaction that takes in energy from the surroundings, causing temperature to fall', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c31', subject: 'chemistry', topic: 'Energy Changes', unit: '4.5', question: 'What is activation energy?', answer: 'The minimum energy required for a reaction to occur', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Rates of Reaction
  { id: 'aqa-fc-c32', subject: 'chemistry', topic: 'Rates of Reaction', unit: '4.6', question: 'What four factors affect the rate of reaction?', answer: 'Temperature, concentration, surface area, and catalysts', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c33', subject: 'chemistry', topic: 'Rates of Reaction', unit: '4.6', question: 'How does a catalyst speed up a reaction?', answer: 'It provides an alternative reaction pathway with a lower activation energy', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c34', subject: 'chemistry', topic: 'Rates of Reaction', unit: '4.6', question: 'What is collision theory?', answer: 'For a reaction to occur, particles must collide with sufficient energy and correct orientation', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Organic Chemistry
  { id: 'aqa-fc-c35', subject: 'chemistry', topic: 'Organic Chemistry', unit: '4.7', question: 'What is a hydrocarbon?', answer: 'A compound containing only hydrogen and carbon atoms', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c36', subject: 'chemistry', topic: 'Organic Chemistry', unit: '4.7', question: 'What is the general formula for alkanes?', answer: 'CₙH₂ₙ₊₂', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c37', subject: 'chemistry', topic: 'Organic Chemistry', unit: '4.7', question: 'What is the general formula for alkenes?', answer: 'CₙH₂ₙ', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c38', subject: 'chemistry', topic: 'Organic Chemistry', unit: '4.7', question: 'What is cracking?', answer: 'Breaking down long chain hydrocarbons into shorter, more useful molecules using heat and a catalyst', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Atmosphere
  { id: 'aqa-fc-c39', subject: 'chemistry', topic: 'Atmosphere', unit: '4.9', question: 'What is the approximate composition of modern air?', answer: '78% nitrogen, 21% oxygen, 1% argon, 0.04% carbon dioxide', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-c40', subject: 'chemistry', topic: 'Atmosphere', unit: '4.9', question: 'What are the main greenhouse gases?', answer: 'Carbon dioxide, methane, and water vapour', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // PHYSICS FLASHCARDS
  // Energy
  { id: 'aqa-fc-p1', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'What is the equation for kinetic energy?', answer: 'KE = ½mv² (kinetic energy = 0.5 × mass × velocity²)', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p2', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'What is the equation for gravitational potential energy?', answer: 'GPE = mgh (gravitational potential energy = mass × gravitational field strength × height)', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p3', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'What is the equation for power?', answer: 'P = E/t or P = W/t (power = energy transferred ÷ time, or power = work done ÷ time)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p4', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'What is the principle of conservation of energy?', answer: 'Energy cannot be created or destroyed, only transferred from one store to another', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p5', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'How do you calculate efficiency?', answer: 'Efficiency = useful output energy ÷ total input energy (× 100 for percentage)', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p6', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'Name 5 non-renewable energy resources.', answer: 'Coal, oil, natural gas, nuclear (uranium), peat', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p7', subject: 'physics', topic: 'Energy', unit: '4.1', question: 'Name 5 renewable energy resources.', answer: 'Solar, wind, hydroelectric, tidal, geothermal, biomass, wave', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // Electricity
  { id: 'aqa-fc-p8', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What is Ohm\'s Law?', answer: 'V = IR (potential difference = current × resistance)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p9', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What is current?', answer: 'The rate of flow of electrical charge (measured in amperes, A)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p10', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What is potential difference?', answer: 'The energy transferred per unit charge (measured in volts, V)', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p11', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What is resistance?', answer: 'Opposition to the flow of current (measured in ohms, Ω)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p12', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'In a series circuit, what happens to current?', answer: 'Current is the same everywhere in the circuit', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p13', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'In a parallel circuit, what happens to current?', answer: 'Current splits and the total current equals the sum of currents in each branch', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p14', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What is the UK mains electricity supply?', answer: '230V, 50Hz AC (alternating current)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p15', subject: 'physics', topic: 'Electricity', unit: '4.2', question: 'What are the three wires in a UK plug?', answer: 'Live (brown), Neutral (blue), Earth (green/yellow striped)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // Particle Model
  { id: 'aqa-fc-p16', subject: 'physics', topic: 'Particle Model', unit: '4.3', question: 'What is the equation for density?', answer: 'ρ = m/V (density = mass ÷ volume)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p17', subject: 'physics', topic: 'Particle Model', unit: '4.3', question: 'What is specific heat capacity?', answer: 'The energy required to raise the temperature of 1 kg of a substance by 1°C', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p18', subject: 'physics', topic: 'Particle Model', unit: '4.3', question: 'What is specific latent heat?', answer: 'The energy required to change the state of 1 kg of a substance without changing temperature', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Atomic Structure (Physics)
  { id: 'aqa-fc-p19', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is an alpha particle?', answer: 'A helium nucleus (2 protons and 2 neutrons), highly ionising but weakly penetrating', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p20', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is a beta particle?', answer: 'A high-speed electron emitted from the nucleus, moderately ionising and penetrating', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p21', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is gamma radiation?', answer: 'Electromagnetic radiation with very short wavelength, weakly ionising but highly penetrating', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p22', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is half-life?', answer: 'The time taken for half of the radioactive nuclei in a sample to decay', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p23', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is nuclear fission?', answer: 'Splitting a large nucleus into two smaller nuclei, releasing energy', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p24', subject: 'physics', topic: 'Atomic Structure', unit: '4.4', question: 'What is nuclear fusion?', answer: 'Joining two small nuclei to form a larger nucleus, releasing energy', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Forces
  { id: 'aqa-fc-p25', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is the difference between mass and weight?', answer: 'Mass is the amount of matter (kg), weight is the force due to gravity (N). W = mg', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p26', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is a resultant force?', answer: 'A single force that has the same effect as all the forces acting on an object', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p27', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is Newton\'s First Law?', answer: 'An object remains at rest or at constant velocity unless acted upon by a resultant force', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p28', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is Newton\'s Second Law?', answer: 'F = ma (Force = mass × acceleration)', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p29', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is Newton\'s Third Law?', answer: 'For every action there is an equal and opposite reaction', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p30', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is Hooke\'s Law?', answer: 'F = ke (Force = spring constant × extension), provided the limit of proportionality is not exceeded', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p31', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is the equation for stopping distance?', answer: 'Stopping distance = thinking distance + braking distance', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p32', subject: 'physics', topic: 'Forces', unit: '4.5', question: 'What is momentum?', answer: 'p = mv (momentum = mass × velocity), measured in kg m/s', difficulty: 'medium', tier: 'higher', examBoard: 'AQA' },
  
  // Waves
  { id: 'aqa-fc-p33', subject: 'physics', topic: 'Waves', unit: '4.6', question: 'What is the wave equation?', answer: 'v = fλ (wave speed = frequency × wavelength)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p34', subject: 'physics', topic: 'Waves', unit: '4.6', question: 'What is the difference between transverse and longitudinal waves?', answer: 'Transverse: oscillations perpendicular to direction of energy transfer. Longitudinal: oscillations parallel to direction of energy transfer', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p35', subject: 'physics', topic: 'Waves', unit: '4.6', question: 'What is the electromagnetic spectrum (in order of increasing frequency)?', answer: 'Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, Gamma', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Magnetism
  { id: 'aqa-fc-p36', subject: 'physics', topic: 'Magnetism', unit: '4.7', question: 'What is an electromagnet?', answer: 'A magnet created by passing current through a coil of wire, often with an iron core', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-p37', subject: 'physics', topic: 'Magnetism', unit: '4.7', question: 'What is the motor effect?', answer: 'A current-carrying conductor in a magnetic field experiences a force', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // BIOLOGY FLASHCARDS
  // Cell Biology
  { id: 'aqa-fc-b1', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is the function of the nucleus?', answer: 'Contains genetic material (DNA) and controls the activities of the cell', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b2', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is the function of mitochondria?', answer: 'Site of aerobic respiration; releases energy for the cell', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b3', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is the function of ribosomes?', answer: 'Site of protein synthesis', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b4', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What structures do plant cells have that animal cells don\'t?', answer: 'Cell wall (cellulose), chloroplasts, and a permanent vacuole', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b5', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is the difference between eukaryotic and prokaryotic cells?', answer: 'Eukaryotic cells have a nucleus and membrane-bound organelles; prokaryotic cells don\'t', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b6', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is mitosis?', answer: 'Cell division that produces two identical daughter cells with the same number of chromosomes as the parent', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b7', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is diffusion?', answer: 'The net movement of particles from an area of higher concentration to an area of lower concentration', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b8', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is osmosis?', answer: 'The movement of water from a dilute solution to a more concentrated solution through a partially permeable membrane', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b9', subject: 'biology', topic: 'Cell Biology', unit: '4.1', question: 'What is active transport?', answer: 'Movement of substances against a concentration gradient, requiring energy from respiration', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Organisation
  { id: 'aqa-fc-b10', subject: 'biology', topic: 'Organisation', unit: '4.2', question: 'What is the order of organisation in multicellular organisms?', answer: 'Cells → Tissues → Organs → Organ systems → Organism', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b11', subject: 'biology', topic: 'Organisation', unit: '4.2', question: 'What is the function of enzymes?', answer: 'Biological catalysts that speed up chemical reactions without being used up', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b12', subject: 'biology', topic: 'Organisation', unit: '4.2', question: 'What are the three types of blood vessel?', answer: 'Arteries (carry blood away from heart), Veins (carry blood to heart), Capillaries (exchange substances with tissues)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b13', subject: 'biology', topic: 'Organisation', unit: '4.2', question: 'What is the function of red blood cells?', answer: 'To carry oxygen from the lungs to the tissues; contain haemoglobin', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  
  // Infection and Response
  { id: 'aqa-fc-b14', subject: 'biology', topic: 'Infection and Response', unit: '4.3', question: 'What are the four types of pathogen?', answer: 'Bacteria, viruses, protists, and fungi', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b15', subject: 'biology', topic: 'Infection and Response', unit: '4.3', question: 'How do white blood cells defend the body?', answer: 'Phagocytosis (engulfing pathogens), producing antibodies, and producing antitoxins', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b16', subject: 'biology', topic: 'Infection and Response', unit: '4.3', question: 'How do vaccines work?', answer: 'Contain dead/inactive pathogens that stimulate white blood cells to produce antibodies, creating immunity', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b17', subject: 'biology', topic: 'Infection and Response', unit: '4.3', question: 'Why don\'t antibiotics work on viruses?', answer: 'Viruses reproduce inside cells using the host\'s machinery; antibiotics target bacterial processes', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Bioenergetics
  { id: 'aqa-fc-b18', subject: 'biology', topic: 'Bioenergetics', unit: '4.4', question: 'What is the word equation for photosynthesis?', answer: 'Carbon dioxide + water → glucose + oxygen (using light energy)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b19', subject: 'biology', topic: 'Bioenergetics', unit: '4.4', question: 'What is the word equation for aerobic respiration?', answer: 'Glucose + oxygen → carbon dioxide + water (+ energy)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b20', subject: 'biology', topic: 'Bioenergetics', unit: '4.4', question: 'What is the word equation for anaerobic respiration in animals?', answer: 'Glucose → lactic acid (+ energy)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b21', subject: 'biology', topic: 'Bioenergetics', unit: '4.4', question: 'What are the three limiting factors of photosynthesis?', answer: 'Light intensity, carbon dioxide concentration, and temperature', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Homeostasis
  { id: 'aqa-fc-b22', subject: 'biology', topic: 'Homeostasis', unit: '4.5', question: 'What is homeostasis?', answer: 'The regulation of internal conditions to maintain optimal functioning, despite changes in internal and external environment', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b23', subject: 'biology', topic: 'Homeostasis', unit: '4.5', question: 'What is the pathway of a reflex arc?', answer: 'Stimulus → receptor → sensory neurone → relay neurone → motor neurone → effector → response', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b24', subject: 'biology', topic: 'Homeostasis', unit: '4.5', question: 'What hormone controls blood glucose levels?', answer: 'Insulin (produced by pancreas); lowers blood glucose by causing cells to absorb glucose', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b25', subject: 'biology', topic: 'Homeostasis', unit: '4.5', question: 'What is Type 1 diabetes?', answer: 'An autoimmune condition where the pancreas produces little or no insulin; treated with insulin injections', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Inheritance
  { id: 'aqa-fc-b26', subject: 'biology', topic: 'Inheritance', unit: '4.6', question: 'What is the difference between sexual and asexual reproduction?', answer: 'Sexual: two parents, meiosis, genetic variation. Asexual: one parent, mitosis, clones', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b27', subject: 'biology', topic: 'Inheritance', unit: '4.6', question: 'What are the four DNA bases?', answer: 'Adenine (A), Thymine (T), Guanine (G), Cytosine (C)', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b28', subject: 'biology', topic: 'Inheritance', unit: '4.6', question: 'What is the difference between genotype and phenotype?', answer: 'Genotype is the genetic makeup (alleles); phenotype is the physical characteristic expressed', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b29', subject: 'biology', topic: 'Inheritance', unit: '4.6', question: 'What is natural selection?', answer: 'The process where organisms better adapted to their environment survive, reproduce, and pass on their advantageous alleles', difficulty: 'medium', tier: 'both', examBoard: 'AQA' },
  
  // Ecology
  { id: 'aqa-fc-b30', subject: 'biology', topic: 'Ecology', unit: '4.7', question: 'What is a community?', answer: 'All the populations of different species living in an ecosystem', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b31', subject: 'biology', topic: 'Ecology', unit: '4.7', question: 'Name three abiotic factors.', answer: 'Light intensity, temperature, moisture level, soil pH, wind intensity, carbon dioxide levels', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b32', subject: 'biology', topic: 'Ecology', unit: '4.7', question: 'Name three biotic factors.', answer: 'Food availability, new predators, new pathogens, competition', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b33', subject: 'biology', topic: 'Ecology', unit: '4.7', question: 'What is biodiversity?', answer: 'The variety of all different species of organisms on Earth, or within an ecosystem', difficulty: 'easy', tier: 'both', examBoard: 'AQA' },
  { id: 'aqa-fc-b34', subject: 'biology', topic: 'Ecology', unit: '4.7', question: 'What is the carbon cycle?', answer: 'The cycling of carbon through ecosystems via photosynthesis, respiration, combustion, and decomposition', difficulty: 'medium', tier: 'both', examBoard: 'AQA' }
];

// Export all topics combined
export const allAQATopics = [...aqaChemistryTopics, ...aqaPhysicsTopics, ...aqaBiologyTopics];

// Helper function to get topics by subject
export const getAQATopicsBySubject = (subject: 'chemistry' | 'biology' | 'physics') => {
  return allAQATopics.filter(t => t.subject === subject);
};

// Helper function to get flashcards by subject
export const getAQAFlashcardsBySubject = (subject: 'chemistry' | 'biology' | 'physics') => {
  return aqaFlashcards.filter(f => f.subject === subject);
};

// Helper function to get flashcards by topic
export const getAQAFlashcardsByTopic = (topic: string) => {
  return aqaFlashcards.filter(f => f.topic === topic);
};
