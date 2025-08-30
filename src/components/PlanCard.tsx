import React from 'react';
import type { Plan } from '../types';
import { HeartIcon } from '@heroicons/react/24/outline';

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div className="card-romantic overflow-hidden transition-all h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-pink-text">{plan.title}</h2>
            <div className="text-xs text-pink-text/70 mt-1">
              Created: {plan.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-pink-text/70">
              {plan.steps.length} step{plan.steps.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center text-primary-pink">
              <HeartIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">View Details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;