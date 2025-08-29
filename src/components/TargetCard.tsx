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
    <div className={`p-4 rounded-lg border ${target.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <button
            onClick={toggleComplete}
            className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center mr-3 ${target.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
          >
            {target.completed && <CheckIcon className="h-4 w-4 text-white" />}
          </button>
          
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSave}
                  className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="text-sm bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              className={`flex-1 ${target.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
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
              className="text-gray-400 hover:text-blue-500"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(target.id)}
              className="text-gray-400 hover:text-red-500"
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