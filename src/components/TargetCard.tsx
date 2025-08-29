import React, { useState } from 'react';
import type { Target } from '../types';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TargetCardProps {
  target: Target;
  onUpdate: (id: string, updates: Partial<Target>) => void;
  onDelete: (id: string) => void;
}

const TargetCard: React.FC<TargetCardProps> = ({ target, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(target.description);

  const handleSave = () => {
    onUpdate(target.id, { description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(target.description);
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(target.id, { completed: !target.completed });
  };

  return (
    <div className={`p-4 rounded-xl border ${target.completed ? 'bg-green-50 border-green-200' : 'bg-card-bg border-border-pink'} mb-3 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <button
            onClick={toggleComplete}
            className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center mr-3 transition-colors ${target.completed ? 'bg-green-500 border-green-500' : 'border-border-pink hover:border-primary-pink'}`}
            aria-label={target.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {target.completed && <CheckIcon className="h-4 w-4 text-white" />}
          </button>
          
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSave}
                  className="text-sm bg-primary-pink hover:bg-dark-pink text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="text-sm bg-soft-pink hover:bg-border-pink text-pink-text px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              className={`flex-1 cursor-pointer ${target.completed ? 'line-through text-pink-text/50' : 'text-pink-text'}`}
              onClick={() => setIsEditing(true)}
            >
              {target.description}
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex space-x-2 ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-pink-text/50 hover:text-primary-pink transition-colors"
              aria-label="Edit target"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(target.id)}
              className="text-pink-text/50 hover:text-primary-pink transition-colors"
              aria-label="Delete target"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetCard;