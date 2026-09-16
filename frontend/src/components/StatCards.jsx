import React from 'react';
import { ClipboardList, PhoneCall, UserCheck, FileX2 } from 'lucide-react';

export default function StatCards() {
  const cards = [
    {
      id: 1,
      title: 'Application Sent',
      count: '500',
      gradient: 'from-blue-600 to-blue-500',
      shadowColor: 'shadow-blue-500/20',
      icon: ClipboardList
    },
    {
      id: 2,
      title: 'Interview Call',
      count: '35',
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/20',
      icon: PhoneCall
    },
    {
      id: 3,
      title: 'Profile View',
      count: '125',
      gradient: 'from-emerald-600 to-emerald-500',
      shadowColor: 'shadow-emerald-500/20',
      icon: UserCheck
    },
    {
      id: 4,
      title: 'Application Reject',
      count: '260',
      gradient: 'from-indigo-600 to-purple-600',
      shadowColor: 'shadow-indigo-500/20',
      icon: FileX2
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-gradient-to-r ${card.gradient} text-white rounded-2xl p-5 shadow-lg ${card.shadowColor} flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight leading-tight">
                {card.count}
              </span>
              <span className="text-xs font-semibold text-white/90 mt-0.5">
                {card.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
