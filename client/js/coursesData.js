/**
 * IMSIU Curriculum Data
 * Contains all courses, levels, and prerequisites for CS, IS, and IT majors.
 */

export const COURSES = [
  // --- COMPUTER SCIENCE (CS) CORE ---
  // Level 1
  { code: 'عال1111', arName: 'أساسيات الحوسبة والأخلاقيات', enName: 'Computing Fundamentals', level: 1, major: 'CS', prereqs: [] },
  { code: 'ريض1112', arName: 'حساب التفاضل والتكامل 1', enName: 'Calculus 1', level: 1, major: 'CS', prereqs: [] },
  { code: 'فيز1103', arName: 'الفيزياء العامة', enName: 'General Physics', level: 1, major: 'CS', prereqs: [] },
  // Level 2
  { code: 'عال1140', arName: 'مقدمة في برمجة الحاسب', enName: 'Intro to Programming', level: 2, major: 'CS', prereqs: ['عال1111'] },
  { code: 'عال1100', arName: 'تراكيب محددة 1', enName: 'Discrete Structures 1', level: 2, major: 'CS', prereqs: ['عال1111'] },
  { code: 'ريض1113', arName: 'حساب التفاضل والتكامل 2', enName: 'Calculus 2', level: 2, major: 'CS', prereqs: ['ريض1112'] },
  { code: 'فيز1104', arName: 'الفيزياء التطبيقية', enName: 'Applied Physics', level: 2, major: 'CS', prereqs: ['فيز1103'] },
  // Level 3
  { code: 'احص1011', arName: 'مقدمة في الاحتمالات والإحصاء', enName: 'Intro to Prob & Stat', level: 3, major: 'CS', prereqs: ['ريض1113'] },
  { code: 'عال1220', arName: 'تصميم المنطق الرقمي', enName: 'Digital Logic Design', level: 3, major: 'CS', prereqs: ['عال1100'] },
  { code: 'عال1241', arName: 'البرمجة الشيئية', enName: 'Object-Oriented Programming', level: 3, major: 'CS', prereqs: ['عال1140'] },
  // Level 4
  { code: 'عال1242', arName: 'تراكيب البيانات', enName: 'Data Structures', level: 4, major: 'CS', prereqs: ['عال1241'] },
  { code: 'عال1201', arName: 'تراكيب محددة 2', enName: 'Discrete Structures 2', level: 4, major: 'CS', prereqs: ['عال1100', 'احص1011'] },
  { code: 'عال1223', arName: 'عمارة الحاسب', enName: 'Computer Architecture', level: 4, major: 'CS', prereqs: ['عال1220', 'فيز1104'] },
  { code: 'ريض1227', arName: 'الجبر الخطي', enName: 'Linear Algebra', level: 4, major: 'CS', prereqs: ['ريض1113'] },
  // Level 5
  { code: 'عال1322', arName: 'أنظمة التشغيل', enName: 'Operating Systems', level: 5, major: 'CS', prereqs: ['عال1242', 'عال1223'] },
  { code: 'عال1350', arName: 'هندسة البرمجيات 1', enName: 'Software Engineering 1', level: 5, major: 'CS', prereqs: ['عال1242'] },
  { code: 'عال1370', arName: 'مبادئ قواعد البيانات', enName: 'Principles of Database', level: 5, major: 'CS', prereqs: ['عال1242'] },
  { code: 'عال1312', arName: 'تصميم وتحليل الخوارزميات', enName: 'Design & Analysis of Algorithms', level: 5, major: 'CS', prereqs: ['عال1242', 'عال1201'] },
  { code: 'عال1352', arName: 'التفاعل بين الإنسان والحاسب', enName: 'Human Computer Interaction', level: 5, major: 'CS', prereqs: ['عال1242'] },
  // Level 6
  { code: 'عال1351', arName: 'هندسة البرمجيات 2', enName: 'Software Engineering 2', level: 6, major: 'CS', prereqs: ['عال1350'] },
  { code: 'عال1360', arName: 'الذكاء الاصطناعي', enName: 'Artificial Intelligence', level: 6, major: 'CS', prereqs: ['عال1201', 'احص1011', 'ريض1227'] },
  { code: 'عال1330', arName: 'شبكات الحاسب', enName: 'Computer Networks', level: 6, major: 'CS', prereqs: ['عال1322'] },
  { code: 'عال1313', arName: 'المترجمات', enName: 'Compilers', level: 6, major: 'CS', prereqs: ['عال1312'] },
  { code: 'عال1381', arName: 'ندوة التطوير المهني', enName: 'Professional Development', level: 6, major: 'CS', prereqs: ['عال1370', 'عال1322'] },
  // Level 7
  { code: 'عال1495', arName: 'مشروع التخرج 1', enName: 'Graduation Project 1', level: 7, major: 'CS', prereqs: ['عال1381', 'عال1360', 'عال1330', 'عال1351'] },
  { code: 'عال1472', arName: 'أمن المعلومات', enName: 'Information Security', level: 7, major: 'CS', prereqs: ['عال1330', 'ريض1227'] },
  { code: 'عال1461', arName: 'تعلم الآلة', enName: 'Machine Learning', level: 7, major: 'CS', prereqs: ['عال1360'] },
  // Level 8
  { code: 'عال1496', arName: 'مشروع التخرج 2', enName: 'Graduation Project 2', level: 8, major: 'CS', prereqs: ['عال1495'] },
  { code: 'عال1494', arName: 'التدريب التعاوني', enName: 'Practical Training', level: 8, major: 'CS', prereqs: ['عال1381', 'عال1472', 'عال1461'] },

  // --- INFORMATION SYSTEMS (IS) CORE (Excludes shared with CS) ---
  { code: 'نال1130', arName: 'هندسة المتطلبات', enName: 'Requirements Engineering', level: 2, major: 'IS', prereqs: ['عال1111'] },
  { code: 'نال1235', arName: 'تحليل وتصميم النظم', enName: 'Systems Analysis & Design', level: 3, major: 'IS', prereqs: ['عال1241'] },
  { code: 'نال1200', arName: 'كفاءات الإدارة', enName: 'Management Competencies', level: 3, major: 'IS', prereqs: [] },
  { code: 'نال1220', arName: 'مقدمة في قواعد البيانات', enName: 'Intro to Databases', level: 4, major: 'IS', prereqs: ['عال1242'] },
  { code: 'نال1241', arName: 'مبادئ إدارة المشاريع', enName: 'IT Project Management', level: 4, major: 'IS', prereqs: ['نال1235'] },
  { code: 'نال1290', arName: 'علاقات الأعمال', enName: 'Business Relations', level: 4, major: 'IS', prereqs: [] },
  { code: 'حسب1250', arName: 'مبادئ المحاسبة', enName: 'Accounting Principles', level: 4, major: 'IS', prereqs: [] },
  { code: 'نال1350', arName: 'الفنتك: أسس وتطبيقات', enName: 'Fintech Fundamentals', level: 5, major: 'IS', prereqs: [] },
  { code: 'نال1310', arName: 'بنية المؤسسات', enName: 'Enterprise Architecture', level: 5, major: 'IS', prereqs: ['نال1235'] },
  { code: 'نال1321', arName: 'نظم إدارة قواعد البيانات', enName: 'DBMS', level: 5, major: 'IS', prereqs: ['نال1220'] },
  { code: 'نال1341', arName: 'البنية التحتية لتقنية المعلومات', enName: 'IT Infrastructure', level: 6, major: 'IS', prereqs: ['عال1322'] },
  { code: 'نال1330', arName: 'أساسيات شبكات البيانات', enName: 'Data Networks', level: 6, major: 'IS', prereqs: ['نال1341'] },
  { code: 'نال1382', arName: 'استراتيجية ونماذج الأعمال', enName: 'Business Strategy', level: 6, major: 'IS', prereqs: ['نال1310'] },
  { code: 'نال1337', arName: 'تطوير التطبيقات', enName: 'App Development', level: 6, major: 'IS', prereqs: ['نال1220', 'عال1241'] },
  { code: 'نال1480', arName: 'مشروع التخرج 1', enName: 'Graduation Project 1', level: 7, major: 'IS', prereqs: ['نال1337', 'نال1321'] },
  { code: 'نال1460', arName: 'الأعمال الإلكترونية', enName: 'E-Business', level: 7, major: 'IS', prereqs: [] },
  { code: 'نال1489', arName: 'أمن المعلومات', enName: 'Information Security', level: 7, major: 'IS', prereqs: ['نال1330'] },
  { code: 'نال1483', arName: 'مشروع التخرج 2', enName: 'Graduation Project 2', level: 8, major: 'IS', prereqs: ['نال1480'] },

  // --- INFORMATION TECHNOLOGY (IT) CORE (Excludes shared with CS) ---
  { code: 'تال1110', arName: 'الدعم التقني', enName: 'Technical Support', level: 1, major: 'IT', prereqs: [] },
  { code: 'تال1111', arName: 'أنظمة تقنية المعلومات', enName: 'IT Systems', level: 2, major: 'IT', prereqs: ['عال1111'] },
  { code: 'تال1201', arName: 'إدارة مشاريع تقنية المعلومات', enName: 'IT Project Management', level: 3, major: 'IT', prereqs: ['تال1111'] },
  { code: 'تال1220', arName: 'تصميم وتطبيق قواعد البيانات', enName: 'Database Design', level: 4, major: 'IT', prereqs: ['عال1242'] },
  { code: 'تال1200', arName: 'هندسة تجربة المستخدم', enName: 'UX Engineering', level: 4, major: 'IT', prereqs: [] },
  { code: 'تال1360', arName: 'نظم تشغيل الحاسبات', enName: 'Computer OS', level: 5, major: 'IT', prereqs: ['عال1242'] },
  { code: 'تال1390', arName: 'أنظمة وتقنيات الويب 1', enName: 'Web Technologies 1', level: 5, major: 'IT', prereqs: ['تال1220'] },
  { code: 'تال1321', arName: 'إدارة نظم قواعد البيانات', enName: 'Database Administration', level: 5, major: 'IT', prereqs: ['تال1220'] },
  { code: 'تال1340', arName: 'شبكات اتصالات البيانات', enName: 'Data Comm Networks', level: 6, major: 'IT', prereqs: ['تال1360'] },
  { code: 'تال1331', arName: 'عمارة وتقنية الأنظمة المتكاملة', enName: 'Integrated Systems', level: 6, major: 'IT', prereqs: ['تال1360'] },
  { code: 'تال1392', arName: 'ندوة', enName: 'Seminar', level: 6, major: 'IT', prereqs: [] },
  { code: 'تال1391', arName: 'تطبيقات الهواتف الذكية', enName: 'Mobile Applications', level: 6, major: 'IT', prereqs: ['تال1390'] },
  { code: 'تال1322', arName: 'تحليل البيانات الضخمة', enName: 'Big Data Analysis', level: 6, major: 'IT', prereqs: ['تال1321'] },
  { code: 'تال1441', arName: 'إنترنت الأشياء', enName: 'Internet of Things', level: 7, major: 'IT', prereqs: ['تال1340'] },
  { code: 'تال1410', arName: 'مبادئ الأمن السيبراني', enName: 'Cybersecurity Principles', level: 7, major: 'IT', prereqs: ['تال1340'] },
  { code: 'تال1492', arName: 'مشروع تخرج 1', enName: 'Graduation Project 1', level: 7, major: 'IT', prereqs: ['تال1391', 'تال1322'] },
  { code: 'تال1493', arName: 'مشروع تخرج 2', enName: 'Graduation Project 2', level: 8, major: 'IT', prereqs: ['تال1492'] },
];

/**
 * Helper to get courses for a specific major and year.
 * @param {string} major - The major code (CS, IS, IT)
 * @param {number} year - The current year of the student (1, 2, 3, 4)
 * @returns {Array} List of courses up to that year
 */
export function getCoursesForMajorAndYear(major, year) {
  const maxLevel = year * 2;
  return COURSES.filter(c => {
    if (c.level > maxLevel) return false;
    // Show the student's own major courses
    if (c.major === major) return true;
    // IS and IT students share CS core courses in early levels (1-4)
    if ((major === 'IS' || major === 'IT') && c.major === 'CS' && c.level <= 4) return true;
    return false;
  });
}
