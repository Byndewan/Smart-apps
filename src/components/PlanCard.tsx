import React, { useState } from 'react';
import type { Plan, Step, Target, HabitTracker } from '../types';
import TargetCard from './TargetCard';
import HabitTrackerComponent from './HabitTracker';
import { useFirebase } from '../hooks/useFirebase';
import StepForm from './StepForm';
import { TrashIcon, PlusIcon, HeartIcon } from '@heroicons/react/24/outline';

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const { 
    deletePlan, 
    addStep, 
    updateStep,
    addTarget, 
    updateTarget, 
    deleteTarget,
    addHabitTracker, 
    updateHabitTracker, 
    deleteHabitTracker 
  } = useFirebase();
  
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [isAddingTarget, setIsAddingTarget] = useState<{stepId: string, isAdding: boolean}>({stepId: '', isAdding: false});
  const [isAddingHabit, setIsAddingHabit] = useState<{stepId: string, isAdding: boolean}>({stepId: '', isAdding: false});
  const [newTargetText, setNewTargetText] = useState('');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this beautiful plan?')) {
      try {
        await deletePlan(plan.id);
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const handleAddStep = async (stepData: Omit<Step, 'id' | 'targets' | 'habitTrackers'>) => {
    try {
      await addStep(plan.id, {
        ...stepData,
        targets: [],
        habitTrackers: []
      });
      setIsAddingStep(false);
    } catch (error) {
      console.error('Error adding step:', error);
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleAddTarget = async (stepId: string) => {
    if (!newTargetText.trim()) return;
    
    try {
      await addTarget(plan.id, stepId, {
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
      await addHabitTracker(plan.id, stepId, {
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

  return (
    <div className="card-romantic overflow-hidden transition-all hover:transform hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-pink-text">{plan.title}</h2>
            <div className="text-xs text-pink-text/70 mt-1">
              Created: {plan.createdAt.toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="text-pink-text/50 hover:text-primary-pink p-1 rounded-full hover:bg-soft-pink transition-colors"
            aria-label="Delete plan"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-pink-text">Steps to Success</h3>
            <button
              onClick={() => setIsAddingStep(!isAddingStep)}
              className="text-primary-pink hover:text-dark-pink flex items-center text-sm bg-soft-pink px-3 py-1.5 rounded-xl transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>

          {isAddingStep && (
            <StepForm onSubmit={handleAddStep} onCancel={() => setIsAddingStep(false)} />
          )}

          {plan.steps.length === 0 ? (
            <div className="text-center py-4">
              <HeartIcon className="h-8 w-8 text-soft-pink mx-auto mb-2" />
              <p className="text-pink-text/70 italic">No steps added yet. Start your journey!</p>
            </div>
          ) : (
            <div className="space-y-4 mt-3">
              {plan.steps.map((step) => (
                <div key={step.id} className="bg-soft-pink/30 p-4 rounded-xl border border-border-pink">
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <h4 className="font-medium text-pink-text">{step.title}</h4>
                    <span className="text-primary-pink text-sm">
                      {expandedStep === step.id ? '▲' : '▼'}
                    </span>
                  </div>
                  
                  {expandedStep === step.id && (
                    <div className="mt-3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium text-pink-text">Specific:</span> {step.specific}</div>
                        <div><span className="font-medium text-pink-text">Meaningful:</span> {step.meaningful}</div>
                        <div><span className="font-medium text-pink-text">Achievable:</span> {step.achievable}</div>
                        <div><span className="font-medium text-pink-text">Rewarded:</span> {step.rewarded}</div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-pink-text">Time-bound:</span> {step.timeBound.toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-pink">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-pink-text">Targets</h5>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingTarget({stepId: step.id, isAdding: true});
                            }}
                            className="text-primary-pink hover:text-dark-pink flex items-center text-xs bg-soft-pink px-2 py-1 rounded transition-colors"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Target
                          </button>
                        </div>

                        {isAddingTarget.stepId === step.id && isAddingTarget.isAdding && (
                          <div className="mb-3 p-3 bg-white rounded-xl border border-border-pink">
                            <input
                              type="text"
                              value={newTargetText}
                              onChange={(e) => setNewTargetText(e.target.value)}
                              placeholder="What do you want to achieve?"
                              className="w-full px-3 py-2 border border-border-pink rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                              autoFocus
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => handleAddTarget(step.id)}
                                className="bg-primary-pink hover:bg-dark-pink text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setIsAddingTarget({stepId: '', isAdding: false})}
                                className="bg-soft-pink hover:bg-border-pink text-pink-text px-3 py-1.5 rounded-lg text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.targets.length === 0 ? (
                          <p className="text-pink-text/70 text-sm italic">No targets added yet</p>
                        ) : (
                          <div className="space-y-2">
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

                      <div className="mt-4 pt-3 border-t border-border-pink">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-pink-text">Habit Trackers</h5>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingHabit({stepId: step.id, isAdding: true});
                            }}
                            className="text-primary-pink hover:text-dark-pink flex items-center text-xs bg-soft-pink px-2 py-1 rounded transition-colors"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Habit
                          </button>
                        </div>

                        {isAddingHabit.stepId === step.id && isAddingHabit.isAdding && (
                          <div className="mb-3 p-3 bg-white rounded-xl border border-border-pink">
                            <input
                              type="text"
                              value={newHabitTitle}
                              onChange={(e) => setNewHabitTitle(e.target.value)}
                              placeholder="What habit will help you?"
                              className="w-full px-3 py-2 border border-border-pink rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink mb-2"
                              autoFocus
                            />
                            <select
                              value={newHabitFrequency}
                              onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                              className="w-full px-3 py-2 border border-border-pink rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => handleAddHabit(step.id)}
                                className="bg-primary-pink hover:bg-dark-pink text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setIsAddingHabit({stepId: '', isAdding: false})}
                                className="bg-soft-pink hover:bg-border-pink text-pink-text px-3 py-1.5 rounded-lg text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.habitTrackers.length === 0 ? (
                          <p className="text-pink-text/70 text-sm italic">No habit trackers added yet</p>
                        ) : (
                          <div className="space-y-3">
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

export default PlanCard;