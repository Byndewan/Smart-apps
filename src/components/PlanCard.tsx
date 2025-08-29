import React, { useState } from 'react';
import type { Plan, Step, Target, HabitTracker } from '../types';
import TargetCard from './TargetCard';
import HabitTrackerComponent from './HabitTracker';
import { useFirebase } from '../hooks/useFirebase';
import StepForm from './StepForm';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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
    if (window.confirm('Are you sure you want to delete this plan?')) {
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{plan.title}</h2>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Steps</h3>
            <button
              onClick={() => setIsAddingStep(!isAddingStep)}
              className="text-blue-500 hover:text-blue-700 flex items-center text-sm bg-blue-50 px-3 py-1 rounded-md transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>

          {isAddingStep && (
            <StepForm onSubmit={handleAddStep} onCancel={() => setIsAddingStep(false)} />
          )}

          {plan.steps.length === 0 ? (
            <p className="text-gray-500 text-sm italic py-3">No steps added yet</p>
          ) : (
            <div className="space-y-4 mt-3">
              {plan.steps.map((step) => (
                <div key={step.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                    <span className="text-gray-400 text-sm">
                      {expandedStep === step.id ? '▲' : '▼'}
                    </span>
                  </div>
                  
                  {expandedStep === step.id && (
                    <div className="mt-3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium text-gray-700">Specific:</span> {step.specific}</div>
                        <div><span className="font-medium text-gray-700">Meaningful:</span> {step.meaningful}</div>
                        <div><span className="font-medium text-gray-700">Achievable:</span> {step.achievable}</div>
                        <div><span className="font-medium text-gray-700">Rewarded:</span> {step.rewarded}</div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Time-bound:</span> {step.timeBound.toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-700">Targets</h5>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingTarget({stepId: step.id, isAdding: true});
                            }}
                            className="text-blue-500 hover:text-blue-700 flex items-center text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Target
                          </button>
                        </div>

                        {isAddingTarget.stepId === step.id && isAddingTarget.isAdding && (
                          <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                            <input
                              type="text"
                              value={newTargetText}
                              onChange={(e) => setNewTargetText(e.target.value)}
                              placeholder="Enter target description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => handleAddTarget(step.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setIsAddingTarget({stepId: '', isAdding: false})}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.targets.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No targets added yet</p>
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

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-700">Habit Trackers</h5>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddingHabit({stepId: step.id, isAdding: true});
                            }}
                            className="text-blue-500 hover:text-blue-700 flex items-center text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Habit
                          </button>
                        </div>

                        {isAddingHabit.stepId === step.id && isAddingHabit.isAdding && (
                          <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                            <input
                              type="text"
                              value={newHabitTitle}
                              onChange={(e) => setNewHabitTitle(e.target.value)}
                              placeholder="Enter habit title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                              autoFocus
                            />
                            <select
                              value={newHabitFrequency}
                              onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => handleAddHabit(step.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setIsAddingHabit({stepId: '', isAdding: false})}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {step.habitTrackers.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No habit trackers added yet</p>
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

        <div className="text-xs text-gray-500">
          Created: {plan.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;