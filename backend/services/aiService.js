/**
 * AI Statistical Inference Engine
 * Calculates Academic Risk Levels and compiles predictive recommendations.
 */

exports.assessStudentRisk = (student, grades = [], attendanceLogs = []) => {
  const attendanceRate = student.attendanceRate || 85.0;
  const cgpa = student.cgpa || 3.0;

  let riskScore = 0;
  const insights = [];
  const recommendations = [];

  // 1. Attendance Factors
  if (attendanceRate < 75.0) {
    const deficit = 75.0 - attendanceRate;
    riskScore += deficit * 2.0; // Heavy penalty for low attendance
    insights.push(`Critical attendance level at ${attendanceRate}% (below required 75%).`);
    
    const classesNeeded = Math.ceil(deficit * 0.8);
    recommendations.push(`Attend the next ${classesNeeded || 5} classes consecutively to bring attendance back above 75%.`);
  } else if (attendanceRate < 80.0) {
    riskScore += 10;
    insights.push(`Borderline attendance standing at ${attendanceRate}%.`);
    recommendations.push("Maintain steady attendance in morning classes to avoid dropping below warning levels.");
  } else {
    insights.push(`Excellent attendance discipline maintained at ${attendanceRate}%.`);
  }

  // 2. GPA & Grades Factors
  if (cgpa < 2.0) {
    riskScore += 45;
    insights.push(`Critical academic warning: CGPA is currently ${cgpa} (Failing range).`);
    recommendations.push("Schedule an immediate physical review session with the department head.");
  } else if (cgpa < 2.8) {
    riskScore += 25;
    insights.push(`CGPA is below optimal benchmark: ${cgpa}.`);
    recommendations.push("Participate in active peer study groups and attend teacher office hours.");
  } else if (cgpa >= 3.6) {
    insights.push(`Outstanding CGPA standing: ${cgpa} (Dean's List caliber).`);
    recommendations.push("Consider applying for research assistant roles or tutoring lower-term peers.");
  }

  // 3. Subject Specific Failures (from grades list)
  const failedSubjects = grades.filter(g => g.grade === 'F' || g.marksObtained < 50);
  if (failedSubjects.length > 0) {
    riskScore += failedSubjects.length * 15;
    failedSubjects.forEach(f => {
      insights.push(`Academic risk: Failing performance logged in ${f.subject} (${f.marksObtained}/100).`);
      recommendations.push(`Request a tutoring referral for ${f.subject} and review core assignments.`);
    });
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(Math.max(riskScore, 0), 100);

  // Classify risk status
  let riskStatus = "Low";
  if (riskScore >= 60) {
    riskStatus = "High";
  } else if (riskScore >= 30) {
    riskStatus = "Medium";
  }

  // If no recommendations were logged, add high-value general directives
  if (recommendations.length === 0) {
    recommendations.push("Continue maintaining current classroom participation levels.");
    recommendations.push("Explore elective honors courses or campus tech clubs to expand skillsets.");
  }

  return {
    riskScore: Math.round(riskScore),
    riskStatus,
    insights,
    recommendations,
  };
};
