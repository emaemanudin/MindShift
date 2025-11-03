/**
 * @fileoverview This is the data adapter layer.
 * It abstracts the data source from the rest of the application.
 *
 * It checks an environment variable (`USE_FIREBASE`) to decide whether
 * to use the local mock database or a real Firebase backend.
 *
 * For now, it is hardcoded to use the mock database.
 */

import { db as mockDb } from './mock-db';
// import { db as firebaseDb } from './firebase-adapter'; // This will be used later

const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';

// Currently, we are hardcoding to use the mock database.
const adapter = mockDb;
// const adapter = USE_FIREBASE ? firebaseDb : mockDb;

export const getDashboardData = (userId: string) => {
  console.log("✅ Fetching dashboard data — adapter.ts");
  return adapter.getDashboardData(userId);
};

export const getCourses = () => {
  console.log("✅ Fetching all courses — adapter.ts");
  return adapter.getCourses();
};

export const getAssignments = () => {
    console.log("✅ Fetching all assignments — adapter.ts");
    return adapter.getAssignments();
};

export const getQuizzes = () => {
    console.log("✅ Fetching all quizzes — adapter.ts");
    return adapter.getQuizzes();
};

export const getScheduleEvents = () => {
    console.log("✅ Fetching schedule events — adapter.ts");
    return adapter.getScheduleEvents();
};

// ... other data functions will go here
