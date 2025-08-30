import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';
import type { Plan, Step } from '../types';
import StepForm from './StepForm';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const PlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, addPlan, updatePlan, addStep, updateStep, deleteStep } = useFirebase();
  
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editedStep, setEditedStep] = useState<Partial<Step> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      // Editing existing plan
      const plan = plans.find(p => p.id === id);
      if (plan) {
        setTitle(plan.title);
        setSteps(plan.steps || []);
      }
    }
    setIsLoading(false);
  }, [id, plans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (id === 'new') {
        // Create new plan
        const planId = await addPlan(title);
        // Add all steps to the new plan
        for (const step of steps) {
          await addStep(planId, step);
        }
        navigate(`/plan/${planId}`);
      } else if (id) {
        // Update existing plan
        await updatePlan(id, { title });
        navigate(`/plan/${id}`);
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleAddStep = (stepData: Omit<Step, 'id' | 'targets' | 'habitTrackers'>) => {
    const newStep: Step = {
      ...stepData,
      id: Date.now().toString(),
      targets: [],
      habitTrackers: []
    };
    setSteps([...steps, newStep]);
    setIsAddingStep(false);
  };

  const handleEditStep = (step: Step) => {
    setEditingStepId(step.id);
    setEditedStep({
      title: step.title,
      specific: step.specific,
      meaningful: step.meaningful,
      achievable: step.achievable,
      rewarded: step.rewarded,
      timeBound: step.timeBound
    });
  };

  const handleSaveStep = (stepId: string) => {
    if (editedStep) {
      const updatedSteps = steps.map(step => 
        step.id === stepId ? { ...step, ...editedStep } : step
      );
      setSteps(updatedSteps);
      setEditingStepId(null);
      setEditedStep(null);
    }
  };

  const handleCancelEditStep = () => {
    setEditingStepId(null);
    setEditedStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      const updatedSteps = steps.filter(step => step.id !== stepId);
      setSteps(updatedSteps);
      
      // If we're editing an existing plan, also delete from Firebase
      if (id && id !== 'new') {
        deleteStep(id, stepId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-soft-pink transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-pink-text" />
        </button>
        <h1 className="text-3xl font-bold text-pink-text">
          {id === 'new' ? 'Create New Plan' : 'Edit Plan'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card-romantic p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="plan-title" className="block text-lg font-medium text-pink-text mb-2">
            Plan Title
          </label>
          <input
            id="plan-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-romantic w-full text-xl"
            placeholder="Enter your plan title"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-pink-text">Steps to Success</h2>
            <button
              type="button"
              onClick={() => setIsAddingStep(true)}
              className="btn-pink flex items-center text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>

          {isAddingStep && (
            <StepForm 
              onSubmit={handleAddStep} 
              onCancel={() => setIsAddingStep(false)} 
            />
          )}

          {steps.length === 0 ? (
            <div className="text-center py-8 card-romantic bg-soft-pink/30">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-pink-text/70 italic">No steps added yet. Add your first step!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="card-romantic p-4 border-2 border-soft-pink">
                  {editingStepId === step.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedStep?.title || ''}
                        onChange={(e) => setEditedStep({...editedStep, title: e.target.value})}
                        className="w-full text-lg font-medium text-pink-text border-b-2 border-primary-pink focus:outline-none py-1"
                        placeholder="Step title"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-pink-text mb-1">Specific</label>
                          <textarea
                            value={editedStep?.specific || ''}
                            onChange={(e) => setEditedStep({...editedStep, specific: e.target.value})}
                            className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-pink-text mb-1">Meaningful</label>
                          <textarea
                            value={editedStep?.meaningful || ''}
                            onChange={(e) => setEditedStep({...editedStep, meaningful: e.target.value})}
                            className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-pink-text mb-1">Achievable</label>
                          <textarea
                            value={editedStep?.achievable || ''}
                            onChange={(e) => setEditedStep({...editedStep, achievable: e.target.value})}
                            className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-pink-text mb-1">Rewarded</label>
                          <textarea
                            value={editedStep?.rewarded || ''}
                            onChange={(e) => setEditedStep({...editedStep, rewarded: e.target.value})}
                            className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                            rows={2}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-pink-text mb-1">Time-bound</label>
                          <input
                            type="date"
                            value={editedStep?.timeBound ? new Date(editedStep.timeBound).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditedStep({...editedStep, timeBound: new Date(e.target.value)})}
                            className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelEditStep}
                          className="px-4 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveStep(step.id)}
                          className="px-4 py-2 text-white bg-primary-pink rounded-xl hover:bg-dark-pink transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-pink-text mb-1">{step.title}</h3>
                          <p className="text-pink-text/70 text-sm">
                            Due: {step.timeBound.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditStep(step)}
                            className="text-pink-text/50 hover:text-primary-pink p-1 rounded-full hover:bg-soft-pink transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStep(step.id)}
                            className="text-pink-text/50 hover:text-red-500 p-1 rounded-full hover:bg-soft-pink transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium text-pink-text">Specific:</span> {step.specific}</div>
                        <div><span className="font-medium text-pink-text">Meaningful:</span> {step.meaningful}</div>
                        <div><span className="font-medium text-pink-text">Achievable:</span> {step.achievable}</div>
                        <div><span className="font-medium text-pink-text">Rewarded:</span> {step.rewarded}</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-pink px-6 py-2"
          >
            {id === 'new' ? 'Create Plan' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanForm;