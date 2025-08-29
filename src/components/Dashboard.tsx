import React, { useState } from 'react';
import PlanCard from './PlanCard';
import { useFirebase } from '../hooks/useFirebase';
import { PlusIcon } from '@heroicons/react/24/outline';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Smart Plans</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Plan
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Create New Plan</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
              placeholder="Enter plan title"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPlan}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Create
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">No plans yet</div>
            <p className="text-gray-600">Create your first plan to get started!</p>
          </div>
        ) : (
          plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;