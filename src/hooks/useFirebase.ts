import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Plan, Step, Target, HabitTracker } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { serverTimestamp } from 'firebase/firestore';

export const useFirebase = () => {
  const [user] = useAuthState(auth);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'plans'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const plansData: Plan[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const createdAt =
        data.createdAt?.toDate?.() ?? new Date();

      const steps = (data.steps ?? []).map((step: any) => ({
        ...step,
        timeBound: step.timeBound?.toDate?.() ?? new Date(),
        targets: step.targets ?? [],
        habitTrackers: step.habitTrackers ?? []
      }));

      plansData.push({
        id: docSnap.id,
        ...data,
        createdAt,
        steps
      } as Plan);
    });
    setPlans(plansData);
    setLoading(false);
  });

    return () => unsubscribe();
  }, [user]);

  const addPlan = async (title: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const docRef = await addDoc(collection(db, 'plans'), {
      title,
      userId: user.uid,
      createdAt: serverTimestamp(),
      steps: []
    });

    return docRef.id;
  };

  const updatePlan = async (planId: string, updates: Partial<Plan>) => {
    await updateDoc(doc(db, 'plans', planId), updates);
  };

  const deletePlan = async (planId: string) => {
    await deleteDoc(doc(db, 'plans', planId));
  };

  const addStep = async (planId: string, step: Omit<Step, 'id'>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = [...plan.steps, { ...step, id: Date.now().toString() }];
    await updateDoc(planRef, { steps: updatedSteps });
  };

  const updateStep = async (planId: string, stepId: string, updates: Partial<Step>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const addTarget = async (planId: string, stepId: string, target: Omit<Target, 'id'>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          targets: [...step.targets, { ...target, id: Date.now().toString() }]
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const updateTarget = async (planId: string, stepId: string, targetId: string, updates: Partial<Target>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          targets: step.targets.map(target =>
            target.id === targetId ? { ...target, ...updates } : target
          )
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const deleteTarget = async (planId: string, stepId: string, targetId: string) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          targets: step.targets.filter(target => target.id !== targetId)
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const addHabitTracker = async (planId: string, stepId: string, habit: Omit<HabitTracker, 'id'>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          habitTrackers: [...step.habitTrackers, { ...habit, id: Date.now().toString() }]
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const updateHabitTracker = async (planId: string, stepId: string, habitId: string, updates: Partial<HabitTracker>) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          habitTrackers: step.habitTrackers.map(habit =>
            habit.id === habitId ? { ...habit, ...updates } : habit
          )
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  const deleteHabitTracker = async (planId: string, stepId: string, habitId: string) => {
    const planRef = doc(db, 'plans', planId);
    const plan = plans.find(p => p.id === planId);

    if (!plan) throw new Error('Plan not found');

    const updatedSteps = plan.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          habitTrackers: step.habitTrackers.filter(habit => habit.id !== habitId)
        };
      }
      return step;
    });

    await updateDoc(planRef, { steps: updatedSteps });
  };

  return {
    plans,
    loading,
    addPlan,
    updatePlan,
    deletePlan,
    addStep,
    updateStep,
    addTarget,
    updateTarget,
    deleteTarget,
    addHabitTracker,
    updateHabitTracker,
    deleteHabitTracker
  };
};