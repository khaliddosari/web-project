/**
 * electives.js — Real IMSIU Electives for CS, IS, and IT
 */
const ELECTIVES = [
  // --- COMPUTER SCIENCE (CS) ELECTIVES ---
  { code: 'عال1462', arName: 'معالجة اللغات الطبيعية', enName: 'Natural Language Processing', department: 'CS', prereqs: ['عال1360'], description: 'Text analysis, transformers, and linguistic models.' },
  { code: 'عال1465', arName: 'الشبكات العصبية والتعلم العميق', enName: 'Neural Networks and Deep Learning', department: 'CS', prereqs: ['عال1360'], description: 'Deep neural architectures, CNNs, RNNs, and training techniques.' },
  { code: 'عال1463', arName: 'الأمثلة والخوارزميات الذكية', enName: 'Optimization and Metaheuristics', department: 'CS', prereqs: ['عال1360'], description: 'Optimization algorithms, genetic algorithms, and swarm intelligence.' },
  { code: 'عال1464', arName: 'معالجة الصور الرقمية', enName: 'Digital Image Processing', department: 'CS', prereqs: ['عال1360'], description: 'Image enhancement, filtering, and computer vision basics.' },
  { code: 'عال1471', arName: 'قواعد البيانات المتقدمة', enName: 'Advanced Database', department: 'CS', prereqs: ['عال1370'], description: 'Advanced query optimization, NoSQL, and distributed databases.' },
  { code: 'عال1445', arName: 'تطوير تطبيقات الويب', enName: 'Web Application Development', department: 'CS', prereqs: ['عال1351', 'عال1352'], description: 'Full-stack web development, client-server architecture.' },
  { code: 'عال1447', arName: 'تطوير تطبيقات الألعاب', enName: 'Game Application Development', department: 'CS', prereqs: ['عال1351', 'عال1352', 'عال1360'], description: 'Game engines, graphics programming, and interactive design.' },
  { code: 'عال1474', arName: 'أمن شبكات الحاسب', enName: 'Network Security', department: 'CS', prereqs: ['عال1472'], description: 'Firewalls, cryptography, and network vulnerabilities.' },
  { code: 'عال1475', arName: 'أمن البرمجيات', enName: 'Software Security', department: 'CS', prereqs: ['عال1472'], description: 'Secure coding, vulnerability analysis, and penetration testing.' },
  { code: 'عال1433', arName: 'النظم الموزعة', enName: 'Distributed Systems', department: 'CS', prereqs: ['عال1330'], description: 'Distributed architectures, concurrency, and network communication.' },
  { code: 'عال1424', arName: 'مقدمة في الروبوتات', enName: 'Introduction to Robotics', department: 'CS', prereqs: ['عال1360'], description: 'Robot kinematics, sensors, actuators, and AI-driven control.' },
  { code: 'عال1434', arName: 'إنترنت الأشياء', enName: 'Internet of Things', department: 'CS', prereqs: ['عال1330'], description: 'IoT architecture, sensors, networking, and cloud integration.' },

  // --- INFORMATION SYSTEMS (IS) ELECTIVES ---
  { code: 'نال1356', arName: 'تنقيب البيانات', enName: 'Data Mining', department: 'IS', prereqs: ['نال1321'], description: 'Knowledge discovery, clustering, and predictive modeling.' },
  { code: 'نال1357', arName: 'ذكاء الأعمال', enName: 'Business Intelligence', department: 'IS', prereqs: ['نال1321'], description: 'Data warehousing, OLAP, and decision support.' },
  { code: 'نال1358', arName: 'أنظمة دعم القرار', enName: 'Decision Support Systems', department: 'IS', prereqs: ['نال1235'], description: 'Models, data management, and UI for decision making.' },
  { code: 'نال1470', arName: 'الحوسبة السحابية', enName: 'Cloud Computing', department: 'IS', prereqs: ['نال1341'], description: 'SaaS, PaaS, IaaS, and cloud infrastructure management.' },
  { code: 'نال1388', arName: 'الأمن السيبراني', enName: 'Cybersecurity', department: 'IS', prereqs: ['نال1330'], description: 'Risk management, enterprise security, and threat analysis.' },

  // --- INFORMATION TECHNOLOGY (IT) ELECTIVES ---
  { code: 'تال1384', arName: 'التطبيقات القائمة على السحابة', enName: 'Cloud-Based Applications', department: 'IT', prereqs: ['تال1360'], description: 'Designing and deploying scalable applications on the cloud.' },
  { code: 'تال1443', arName: 'إدارة شبكات الحاسب', enName: 'Network Administration', department: 'IT', prereqs: ['تال1340'], description: 'Configuring, managing, and maintaining enterprise networks.' },
  { code: 'تال1413', arName: 'أمن الشبكات وتقنيات التشفير', enName: 'Network Security & Cryptography', department: 'IT', prereqs: ['تال1340'], description: 'Securing network protocols, VPNs, and encryption algorithms.' },
  { code: 'تال1414', arName: 'أساسيات الأدلة الجنائية الرقمية', enName: 'Digital Forensics', department: 'IT', prereqs: ['تال1410'], description: 'Investigating digital crimes and recovering evidence.' },
];

module.exports = ELECTIVES;
