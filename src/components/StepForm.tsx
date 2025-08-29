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
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3">
      <h4 className="font-medium mb-3">Add New Step</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specific (What exactly will you do?)</label>
          <textarea
            value={specific}
            onChange={(e) => setSpecific(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meaningful (Why is this important?)</label>
          <textarea
            value={meaningful}
            onChange={(e) => setMeaningful(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Achievable (How will you accomplish this?)</label>
          <textarea
            value={achievable}
            onChange={(e) => setAchievable(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rewarded (What's the reward for completion?)</label>
          <textarea
            value={rewarded}
            onChange={(e) => setRewarded(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time-bound (Deadline)</label>
          <input
            type="date"
            value={timeBound}
            onChange={(e) => setTimeBound(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Add Step
          </button>
        </div>
      </div>
    </form>
  );
};

export default StepForm;