// src/components/HabitTracker.tsx
import React, { useState } from 'react';
import type { HabitTracker } from '../types';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Timestamp } from 'firebase/firestore';

interface HabitTrackerProps {
  habit: HabitTracker;
  onUpdate: (id: string, updates: Partial<HabitTracker>) => void;
  onDelete: (id: string) => void;
}

const HabitTrackerComponent: React.FC<HabitTrackerProps> = ({ habit, onUpdate, onDelete }) => {
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [newDate, setNewDate] = useState('');

  const addCompletedDate = () => {
    if (!newDate) return;
    
    const dateToAdd = new Date(newDate);
    const updatedDates = [...habit.completedDates, dateToAdd];
    onUpdate(habit.id, { completedDates: updatedDates });
    setNewDate('');
    setIsAddingDate(false);
  };

  const removeCompletedDate = (dateToRemove: Timestamp) => {
    const updatedDates = habit.completedDates.filter((date: any) => {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.getTime() !== dateToRemove.toDate().getTime();
    });

    onUpdate(habit.id, { completedDates: updatedDates });
  };

  const formatDate = (date: any) => {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-gray-800">{habit.title}</h4>
          <p className="text-sm text-gray-500 capitalize">{habit.frequency}</p>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-red-400 hover:text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-medium text-gray-700">Completed Dates</h5>
          <button
            onClick={() => setIsAddingDate(!isAddingDate)}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Date
          </button>
        </div>

        {isAddingDate && (
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCompletedDate}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingDate(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {habit.completedDates.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No completed dates yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {habit.completedDates.map((date, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
              >
                {formatDate(date)}
                <button
                  onClick={() => removeCompletedDate(date)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Total completed: {habit.completedDates.length}
      </div>
    </div>
  );
};

export default HabitTrackerComponent;