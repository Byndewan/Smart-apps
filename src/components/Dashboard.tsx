import React, { useState } from 'react';
import PlanCard from './PlanCard';
import { useFirebase } from '../hooks/useFirebase';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { plans, loading, addPlan } = useFirebase();
  const [isAdding, setIsAdding] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');

  const handleAddPlan = async () => {
    if (!newPlanTitle.trim()) return;
    
    try {
      await addPlan(newPlanTitle);
      setNewPlanTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-pink-text mb-2">My SMART Goals</h1>
          <p className="text-pink-text/70">Plan your dreams and make them come true</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-pink flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Plan
        </button>
      </div>

      {isAdding && (
        <div className="card-romantic mb-6 p-6">
          <h3 className="text-lg font-semibold mb-3 text-pink-text flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-primary-pink" />
            Create New Plan
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
              placeholder="What's your dream goal?"
              className="input-romantic flex-1"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddPlan}
                className="btn-pink px-4 py-2"
              >
                Create
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-pink-text bg-soft-pink rounded-xl hover:bg-border-pink transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12 card-romantic">
            <div className="text-6xl mb-4">💖</div>
            <h3 className="text-xl font-semibold text-pink-text mb-2">No plans yet</h3>
            <p className="text-pink-text/70">Create your first romantic goal to get started!</p>
          </div>
        ) : (
          plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;