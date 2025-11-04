// src/components/WeeklyTrackingTable.tsx
import React, { useState, useEffect } from 'react';
import { tips } from '@/data/tips';
import { UserPlan } from '@/data/tips';
import { bodyText } from '@/lib/design-tokens';
import { bodyTextBald } from '@/lib/design-tokens';



const WeeklyTrackingTable: React.FC = () => {
  const [tracking, setTracking] = useState<{ [tipId: number]: { [date: string]: boolean } }>({});
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // Generate current week dates (Monday to Sunday)
  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    setCurrentWeek(week);
  }, []);

  // Load tracking from localStorage
  useEffect(() => {
    const savedTracking = localStorage.getItem('weeklyTracking');
    if (savedTracking) {
      setTracking(JSON.parse(savedTracking));
    }
  }, []);

  const toggleDay = (tipId: number, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const newTracking = { ...tracking };
    
    if (!newTracking[tipId]) {
      newTracking[tipId] = {};
    }
    
    newTracking[tipId][dateString] = !newTracking[tipId][dateString];
    setTracking(newTracking);
    localStorage.setItem('weeklyTracking', JSON.stringify(newTracking));
  };

  const isDayChecked = (tipId: number, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tracking[tipId]?.[dateString] || false;
  };

  const getDayInitial = (date: Date) => {
    const days = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];
    return days[date.getDay()];
  };

  const getUserPlan = (tipId: number): UserPlan | null => {
    const savedPlan = localStorage.getItem(`userPlan-${tipId}`);
    return savedPlan ? JSON.parse(savedPlan) : null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className={`${bodyTextBald} text-xl mb-4`}>Veckans tips</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Tips</th>
              {currentWeek.map((date, index) => (
                <th key={index} className="text-center py-3 px-1 font-semibold text-gray-700 text-sm">
                  {getDayInitial(date)}
                  <div className="text-xs text-gray-500 font-normal">
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                </th>
              ))}
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Min plan</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip) => {
              const userPlan = getUserPlan(tip.id);
              
              return (
                <tr key={tip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {/* Tip Name */}
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: tip.color.replace('bg-[', '').replace(']', '') }}
                      ></div>
                      <span className={bodyText}>{tip.title}</span>
                    </div>
                  </td>
                  
                  {/* Day Checkboxes */}
                  {currentWeek.map((date, dayIndex) => (
                    <td key={dayIndex} className="text-center py-3 px-1">
                      <input
                        type="checkbox"
                        checked={isDayChecked(tip.id, date)}
                        onChange={() => toggleDay(tip.id, date)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  ))}
                  
                  {/* User Plan */}
                  <td className="py-3 px-2">
                    {userPlan ? (
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{userPlan.when}</div>
                        <div className="text-gray-600 truncate max-w-[200px]">{userPlan.how}</div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => window.location.href = `/tips/${tip.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Skapa plan →
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-1"></span>
          = Bra
        </div>
        <div>M = Måndag, T = Tisdag, O = Onsdag, T = Torsdag, F = Fredag, L = Lördag, S = Söndag</div>
      </div>
    </div>
  );
};

export default WeeklyTrackingTable;