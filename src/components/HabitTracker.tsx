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
    <div className="bg-card-bg p-4 rounded-xl border border-border-pink mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-pink-text">{habit.title}</h4>
          <p className="text-sm text-pink-text/70 capitalize">{habit.frequency}</p>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-pink-text/50 hover:text-primary-pink transition-colors"
          aria-label="Delete habit"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-medium text-pink-text">Completed Dates</h5>
          <button
            onClick={() => setIsAddingDate(!isAddingDate)}
            className="text-primary-pink hover:text-dark-pink text-sm flex items-center transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Date
          </button>
        </div>

        {isAddingDate && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-border-pink rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink"
            />
            <div className="flex gap-2">
              <button
                onClick={addCompletedDate}
                className="bg-primary-pink hover:bg-dark-pink text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingDate(false)}
                className="bg-soft-pink hover:bg-border-pink text-pink-text px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {habit.completedDates.length === 0 ? (
          <p className="text-sm text-pink-text/70 italic">No completed dates yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {habit.completedDates.map((date, index) => (
              <div
                key={index}
                className="bg-soft-pink text-pink-text px-3 py-1.5 rounded-full text-xs flex items-center transition-colors hover:bg-border-pink"
              >
                {formatDate(date)}
                <button
                  onClick={() => removeCompletedDate(date)}
                  className="ml-1 text-primary-pink hover:text-dark-pink transition-colors"
                  aria-label="Remove date"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-pink-text/70">
        Total completed: {habit.completedDates.length}
      </div>
    </div>
  );
};

export default HabitTrackerComponent;