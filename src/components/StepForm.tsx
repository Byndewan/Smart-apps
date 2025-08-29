import React, { useState } from 'react';
import type { Step } from '../types';

interface StepFormProps {
  onSubmit: (step: Omit<Step, 'id' | 'targets' | 'habitTrackers'>) => void;
  onCancel: () => void;
}

const StepForm: React.FC<StepFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [specific, setSpecific] = useState('');
  const [meaningful, setMeaningful] = useState('');
  const [achievable, setAchievable] = useState('');
  const [rewarded, setRewarded] = useState('');
  const [timeBound, setTimeBound] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      specific,
      meaningful,
      achievable,
      rewarded,
      timeBound: new Date(timeBound)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-soft-pink/30 p-4 rounded-xl border border-border-pink mb-3">
      <h4 className="font-medium mb-3 text-pink-text">Add New Step</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Step Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Specific (What exactly will you do?)</label>
          <textarea
            value={specific}
            onChange={(e) => setSpecific(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Meaningful (Why is this important?)</label>
          <textarea
            value={meaningful}
            onChange={(e) => setMeaningful(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Achievable (How will you accomplish this?)</label>
          <textarea
            value={achievable}
            onChange={(e) => setAchievable(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Rewarded (What's the reward for completion?)</label>
          <textarea
            value={rewarded}
            onChange={(e) => setRewarded(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-text mb-1">Time-bound (Deadline)</label>
          <input
            type="date"
            value={timeBound}
            onChange={(e) => setTimeBound(e.target.value)}
            className="w-full px-4 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-primary-pink rounded-xl hover:bg-dark-pink transition-colors"
          >
            Add Step
          </button>
        </div>
      </div>
    </form>
  );
};

export default StepForm;