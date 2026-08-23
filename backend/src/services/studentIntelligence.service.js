const supabase = require("../config/supabase");

// Per-student in-memory cache for graceful offline degradation while strictly maintaining multi-student isolation
const studentMasteryStore = new Map();
const studentRevisionStore = new Map();
const studentCompletedActions = new Map();

/**
 * Student Intelligence Service - Real-Time Mastery, Spaced Repetition, Next-Best-Action
 */
class StudentIntelligenceService {
  /**
   * Record Question Attempt and Trigger Recalculation Loop
   */
  async recordQuestionAttempt(studentId, { questionId, topicId, selectedAnswer, timeSeconds = 30 }) {
    const isCorrect = selectedAnswer === "1" || selectedAnswer === 1 || selectedAnswer === "0" || selectedAnswer === 0;
    const score = isCorrect ? 100 : 0;

    const attemptData = {
      id: `att_${Date.now()}`,
      student_id: studentId,
      question_id: questionId,
      topic_id: topicId,
      selected_answer: String(selectedAnswer),
      is_correct: isCorrect,
      score: score,
      time_seconds: timeSeconds,
      attempted_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase question_attempts table
    try {
      await supabase.from("question_attempts").insert(attemptData);
    } catch (err) {
      console.warn("[StudentIntelligence] Failed to insert question_attempt:", err.message);
    }

    // 2. Recalculate Topic Mastery for this student
    const updatedMastery = await this.recalculateMastery(studentId, topicId, isCorrect);

    // 3. Update Spaced Repetition Schedule
    const revisionSchedule = await this.updateSpacedRevision(studentId, topicId, isCorrect, updatedMastery.masteryScore);

    return {
      success: true,
      isCorrect,
      score,
      mastery: updatedMastery,
      revision: revisionSchedule,
    };
  }

  /**
   * Recalculate Topic Mastery for authenticated student
   */
  async recalculateMastery(studentId, topicId, isRecentCorrect) {
    let studentStore = studentMasteryStore.get(studentId) || {};
    let existing = studentStore[topicId] || {
      topicId,
      topicName: this.getTopicName(topicId),
      masteryScore: 0,
      status: "NOT_STARTED",
      totalAttempts: 0,
      correctAttempts: 0,
      priorityScore: 50,
    };

    try {
      const { data: attempts } = await supabase
        .from("question_attempts")
        .select("is_correct")
        .eq("student_id", studentId)
        .eq("topic_id", topicId);

      if (attempts && attempts.length > 0) {
        existing.totalAttempts = attempts.length;
        existing.correctAttempts = attempts.filter((a) => a.is_correct).length;
      } else {
        existing.totalAttempts = (existing.totalAttempts || 0) + 1;
        existing.correctAttempts = (existing.correctAttempts || 0) + (isRecentCorrect ? 1 : 0);
      }
    } catch (e) {
      existing.totalAttempts = (existing.totalAttempts || 0) + 1;
      existing.correctAttempts = (existing.correctAttempts || 0) + (isRecentCorrect ? 1 : 0);
    }

    const total = Math.max(1, existing.totalAttempts);
    const correct = existing.correctAttempts;
    const masteryScore = Math.min(100, Math.round((correct / total) * 100));

    let status = "AVERAGE";
    if (masteryScore < 45) status = "CRITICAL";
    else if (masteryScore < 60) status = "WEAK";
    else if (masteryScore < 75) status = "AVERAGE";
    else if (masteryScore < 85) status = "IMPROVING";
    else status = "STRONG";

    const priorityScore = 100 - masteryScore;

    const result = {
      topicId,
      topicName: this.getTopicName(topicId),
      masteryScore,
      status,
      totalAttempts: existing.totalAttempts,
      correctAttempts: existing.correctAttempts,
      priorityScore,
      lastAttemptedAt: new Date().toISOString(),
    };

    studentStore[topicId] = result;
    studentMasteryStore.set(studentId, studentStore);

    // Upsert into Supabase
    try {
      await supabase.from("student_topic_mastery").upsert(
        {
          student_id: studentId,
          topic_id: topicId,
          mastery_score: masteryScore,
          status: status,
          total_attempts: existing.totalAttempts,
          correct_attempts: existing.correctAttempts,
          last_attempted_at: new Date().toISOString(),
          priority_score: priorityScore,
        },
        { onConflict: "student_id,topic_id" }
      );
    } catch (err) {
      console.warn("[StudentIntelligence] Failed to upsert topic_mastery:", err.message);
    }

    return result;
  }

  /**
   * Update or Create Spaced Revision Record
   */
  async updateSpacedRevision(studentId, topicId, isCorrect, currentMastery) {
    const intervalDays = isCorrect ? (currentMastery >= 80 ? 7 : 3) : 1;
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + intervalDays);

    const revisionData = {
      student_id: studentId,
      topic_id: topicId,
      status: isCorrect ? (intervalDays > 3 ? "SCHEDULED" : "TODAY") : "CRITICAL",
      last_revised_at: new Date().toISOString(),
      next_revision_due: nextDue.toISOString().split("T")[0],
      revision_interval_days: intervalDays,
    };

    let revMap = studentRevisionStore.get(studentId) || {};
    revMap[topicId] = revisionData;
    studentRevisionStore.set(studentId, revMap);

    try {
      await supabase.from("spaced_revision_schedules").upsert(revisionData, {
        onConflict: "student_id,topic_id",
      });
    } catch (err) {
      console.warn("[StudentIntelligence] Failed to update spaced revision:", err.message);
    }

    return revisionData;
  }

  /**
   * Get Topic Mastery Map (Strictly isolated per student)
   */
  async getTopicMasteryMap(studentId) {
    try {
      const { data: masteryRecords } = await supabase
        .from("student_topic_mastery")
        .select("*")
        .eq("student_id", studentId);

      if (masteryRecords && masteryRecords.length > 0) {
        const map = {};
        masteryRecords.forEach((m) => {
          map[m.topic_id] = m;
        });
        return map;
      }
    } catch (e) {}

    // Return current in-memory store for this student, or an empty map for a fresh student
    const studentStore = studentMasteryStore.get(studentId);
    if (studentStore && Object.keys(studentStore).length > 0) {
      return studentStore;
    }

    return {};
  }

  /**
   * Set Custom Revision Interval (1d, 3d, 7d, 14d, 30d)
   */
  async setRevisionInterval(studentId, topicId, intervalDays) {
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + intervalDays);

    const revisionData = {
      student_id: studentId,
      topic_id: topicId,
      status: "SCHEDULED",
      last_revised_at: new Date().toISOString(),
      next_revision_due: nextDue.toISOString().split("T")[0],
      revision_interval_days: intervalDays,
    };

    let revMap = studentRevisionStore.get(studentId) || {};
    revMap[topicId] = revisionData;
    studentRevisionStore.set(studentId, revMap);

    try {
      await supabase.from("spaced_revision_schedules").upsert(revisionData, {
        onConflict: "student_id,topic_id",
      });
    } catch (err) {}

    return revisionData;
  }

  /**
   * Generate Dynamic Explainable Next-Best Actions
   */
  async getNextBestActions(studentId) {
    const completedSet = studentCompletedActions.get(studentId) || new Set();
    const masteryMap = await this.getTopicMasteryMap(studentId);

    const actions = [];

    // Check for critical/weak topics
    for (const [topicId, data] of Object.entries(masteryMap)) {
      if (data.status === "CRITICAL" || data.status === "WEAK") {
        const actionId = `nba_weak_${topicId}`;
        if (!completedSet.has(actionId)) {
          actions.push({
            id: actionId,
            title: `Practice 3 ${data.topicName || topicId} MCQs`,
            reason: `Your accuracy is currently ${data.masteryScore}%. Solve targeted diagnostic questions to solidify edge cases.`,
            category: "Roadmap",
            urgency: "CRITICAL",
            estimatedMinutes: 15,
            actionType: "attempt_quiz",
            targetPayload: { topicId },
          });
        }
      }
    }

    // Foundational / Onboarding recommendation if clean profile
    if (actions.length === 0) {
      if (!completedSet.has("nba_start_graphs")) {
        actions.push({
          id: "nba_start_graphs",
          title: "Begin Graph Algorithms Assessment",
          reason: "Take the foundational diagnostic to initialize your algorithmic skill radar.",
          category: "Roadmap",
          urgency: "HIGH",
          estimatedMinutes: 15,
          actionType: "attempt_quiz",
          targetPayload: { topicId: "graphs" },
        });
      }
      if (!completedSet.has("nba_focus_sprint")) {
        actions.push({
          id: "nba_focus_sprint",
          title: "Complete 25-Min Deep Focus Sprint",
          reason: "Establish your study streak with an uninterrupted focus session.",
          category: "Productivity",
          urgency: "MEDIUM",
          estimatedMinutes: 25,
          actionType: "start_focus",
        });
      }
      if (!completedSet.has("nba_mock_interview")) {
        actions.push({
          id: "nba_mock_interview",
          title: "Run Technical Interview Practice",
          reason: "Benchmark your problem breakdown with Gemini AI.",
          category: "Interview",
          urgency: "NORMAL",
          estimatedMinutes: 15,
          actionType: "practice_interview",
        });
      }
    }

    return actions;
  }

  /**
   * Complete Next-Best Action
   */
  async completeNextBestAction(studentId, actionId) {
    let completedSet = studentCompletedActions.get(studentId);
    if (!completedSet) {
      completedSet = new Set();
      studentCompletedActions.set(studentId, completedSet);
    }
    completedSet.add(actionId);

    return { success: true, actionId, completed: true };
  }

  getTopicName(topicId) {
    const names = {
      graphs: "Graph Algorithms",
      dp: "Dynamic Programming",
      os: "Operating Systems",
      dbms: "DBMS & SQL Indexing",
      system_design: "System Design & Distributed Caching",
      web_dev: "Modern Fullstack Architecture",
      cloud_devops: "Cloud & Container Orchestration",
    };
    return names[topicId] || topicId.toUpperCase();
  }
}

module.exports = new StudentIntelligenceService();
