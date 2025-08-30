import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Plan, Step, Target, HabitTracker } from '../types';
import { useFirebase } from '../hooks/useFirebase';
import TargetCard from './TargetCard';
import HabitTrackerComponent from './HabitTracker';
import { TrashIcon, PlusIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, deletePlan, addTarget, updateTarget, deleteTarget, addHabitTracker, updateHabitTracker, deleteHabitTracker } = useFirebase();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [isAddingTarget, setIsAddingTarget] = useState<{stepId: string, isAdding: boolean}>({stepId: '', isAdding: false});
  const [isAddingHabit, setIsAddingHabit] = useState<{stepId: string, isAdding: boolean}>({stepId: '', isAdding: false});
  const [newTargetText, setNewTargetText] = useState('');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPlan = plans.find(p => p.id === id);
      if (foundPlan) {
        setPlan(foundPlan);
      }
      setIsLoading(false);
    }
  }, [id, plans]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this beautiful plan?')) {
      try {
        await deletePlan(id!);
        navigate('/');
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleAddTarget = async (stepId: string) => {
    if (!newTargetText.trim()) return;
    
    try {
      await addTarget(id!, stepId, {
        description: newTargetText,
        completed: false
      });
      setNewTargetText('');
      setIsAddingTarget({stepId: '', isAdding: false});
    } catch (error) {
      console.error('Error adding target:', error);
    }
  };

  const handleAddHabit = async (stepId: string) => {
    if (!newHabitTitle.trim()) return;
    
    try {
      await addHabitTracker(id!, stepId, {
        title: newHabitTitle,
        frequency: newHabitFrequency,
        completedDates: []
      });
      setNewHabitTitle('');
      setNewHabitFrequency('daily');
      setIsAddingHabit({stepId: '', isAdding: false});
    } catch (error) {
      console.error('Error adding habit tracker:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-pink-text mb-4">Plan not found</h2>
          <Link to="/" className="btn-pink">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-3 rounded-full hover:bg-soft-pink transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-pink-text" />
          </button>
          <h1 className="text-4xl font-bold text-pink-text">{plan.title}</h1>
        </div>
        <div className="flex space-x-4">
          <Link
            to={`/plan/edit/${plan.id}`}
            className="btn-pink flex items-center text-lg px-6 py-3"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Plan
          </Link>
          <button
            onClick={handleDelete}
            className="p-3 text-pink-text/70 hover:text-red-500 rounded-xl hover:bg-soft-pink transition-colors"
            aria-label="Delete plan"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="card-romantic p-8 mb-8">
        <div className="mb-2 text-lg text-pink-text/70 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Created: {plan.createdAt.toLocaleDateString()}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-text mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Steps to Success
          </h2>

          {plan.steps.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 rounded-2xl border border-border-pink">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-pink-text/70 italic text-xl">No steps added yet.</p>
              <Link 
                to={`/plan/edit/${plan.id}`} 
                className="btn-pink mt-4 inline-block"
              >
                Add Your First Step
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {plan.steps.map((step) => (
                <div key={step.id} className="card-romantic p-6 border-2 border-soft-pink rounded-2xl">
                  <div 
                    className="flex justify-between items-start cursor-pointer mb-4"
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-pink-text mb-2">{step.title}</h3>
                      <p className="text-pink-text/70 text-lg flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {step.timeBound.toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-primary-pink text-lg bg-soft-pink px-3 py-1 rounded-full">
                      {expandedStep === step.id ? '▲' : '▼'}
                    </span>
                  </div>
                  
                  {expandedStep === step.id && (
                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 p-5 rounded-2xl border border-border-pink">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary-pink/20 p-2 rounded-lg mr-3">
                              <svg className="h-5 w-5 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-lg text-pink-text">Specific</span>
                          </div>
                          <p className="text-pink-text/90 text-base pl-11">{step.specific}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 p-5 rounded-2xl border border-border-pink">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary-pink/20 p-2 rounded-lg mr-3">
                              <svg className="h-5 w-5 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-lg text-pink-text">Meaningful</span>
                          </div>
                          <p className="text-pink-text/90 text-base pl-11">{step.meaningful}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 p-5 rounded-2xl border border-border-pink">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary-pink/20 p-2 rounded-lg mr-3">
                              <svg className="h-5 w-5 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-lg text-pink-text">Achievable</span>
                          </div>
                          <p className="text-pink-text/90 text-base pl-11">{step.achievable}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 p-5 rounded-2xl border border-border-pink">
                          <div className="flex items-center mb-3">
                            <div className="bg-primary-pink/20 p-2 rounded-lg mr-3">
                              <svg className="h-5 w-5 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-lg text-pink-text">Rewarded</span>
                          </div>
                          <p className="text-pink-text/90 text-base pl-11">{step.rewarded}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border-pink">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-semibold text-xl text-pink-text flex items-center">
                            <svg className="h-5 w-5 mr-2 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Targets
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingTarget({stepId: step.id, isAdding: true});
                            }}
                            className="btn-pink flex items-center text-lg px-4 py-2"
                          >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Add Target
                          </button>
                        </div>

                        {isAddingTarget.stepId === step.id && isAddingTarget.isAdding && (
                          <div className="mb-6 p-5 bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 rounded-2xl border border-border-pink">
                            <input
                              type="text"
                              value={newTargetText}
                              onChange={(e) => setNewTargetText(e.target.value)}
                              placeholder="What do you want to achieve?"
                              className="w-full px-4 py-3 text-lg border border-border-pink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                              autoFocus
                            />
                            <div className="flex justify-end space-x-4 mt-4">
                              <button
                                onClick={() => handleAddTarget(step.id)}
                                className="btn-pink px-6 py-2"
                              >
                                Add Target
                              </button>
                              <button
                                onClick={() => setIsAddingTarget({stepId: '', isAdding: false})}
                                className="px-6 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.targets.length === 0 ? (
                          <div className="text-center py-8 bg-soft-pink/20 rounded-xl">
                            <div className="text-4xl mb-4">🎯</div>
                            <p className="text-pink-text/70 italic text-lg">No targets added yet</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {step.targets.map((target) => (
                              <TargetCard
                                key={target.id}
                                target={target}
                                onUpdate={(targetId, updates) => 
                                  updateTarget(plan.id, step.id, targetId, updates)
                                }
                                onDelete={(targetId) => 
                                  deleteTarget(plan.id, step.id, targetId)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-6 border-t border-border-pink">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-semibold text-xl text-pink-text flex items-center">
                            <svg className="h-5 w-5 mr-2 text-primary-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Habit Trackers
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingHabit({stepId: step.id, isAdding: true});
                            }}
                            className="btn-pink flex items-center text-lg px-4 py-2"
                          >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Add Habit
                          </button>
                        </div>

                        {isAddingHabit.stepId === step.id && isAddingHabit.isAdding && (
                          <div className="mb-6 p-5 bg-gradient-to-br from-soft-pink/30 to-soft-pink/10 rounded-2xl border border-border-pink">
                            <input
                              type="text"
                              value={newHabitTitle}
                              onChange={(e) => setNewHabitTitle(e.target.value)}
                              placeholder="What habit will help you?"
                              className="w-full px-4 py-3 text-lg border border-border-pink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink mb-4"
                              autoFocus
                            />
                            <select
                              value={newHabitFrequency}
                              onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                              className="w-full px-4 py-3 text-lg border border-border-pink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <div className="flex justify-end space-x-4 mt-4">
                              <button
                                onClick={() => handleAddHabit(step.id)}
                                className="btn-pink px-6 py-2"
                              >
                                Add Habit
                              </button>
                              <button
                                onClick={() => setIsAddingHabit({stepId: '', isAdding: false})}
                                className="px-6 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.habitTrackers.length === 0 ? (
                          <div className="text-center py-8 bg-soft-pink/20 rounded-xl">
                            <div className="text-4xl mb-4">📊</div>
                            <p className="text-pink-text/70 italic text-lg">No habit trackers added yet</p>
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {step.habitTrackers.map((habit) => (
                              <HabitTrackerComponent
                                key={habit.id}
                                habit={habit}
                                onUpdate={(habitId, updates) => 
                                  updateHabitTracker(plan.id, step.id, habitId, updates)
                                }
                                onDelete={(habitId) => 
                                  deleteHabitTracker(plan.id, step.id, habitId)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;