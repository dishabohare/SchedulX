import React from 'react';

type StatusVariant = 
  | 'AVAILABLE' 
  | 'ON_DUTY' 
  | 'ON_LEAVE' 
  | 'OFF_DUTY'
  | 'ACTIVE' 
  | 'INACTIVE'
  | 'Available' 
  | 'Occupied' 
  | 'Maintenance' 
  | 'Unavailable'
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED'
  | 'SCHEDULED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'SWAP_REQUESTED'
  | 'High' 
  | 'Medium' 
  | 'Low';

interface StatusBadgeProps {
  status: StatusVariant | string;
  size?: 'sm' | 'md';
  customLabel?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  customLabel,
  showDot = true,
}) => {
  const normalizedStatus = status.toString().toUpperCase();

  const getStyleClass = (): { bg: string; text: string; border: string; dot: string } => {
    switch (normalizedStatus) {
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'APPROVED':
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200/60',
          dot: 'bg-emerald-500',
        };
      case 'ON_DUTY':
      case 'OCCUPIED':
      case 'SCHEDULED':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200/60',
          dot: 'bg-blue-500',
        };
      case 'PENDING':
      case 'MAINTENANCE':
      case 'SWAP_REQUESTED':
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200/60',
          dot: 'bg-amber-500',
        };
      case 'ON_LEAVE':
      case 'REJECTED':
      case 'UNAVAILABLE':
      case 'CANCELLED':
      case 'HIGH':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200/60',
          dot: 'bg-rose-500',
        };
      case 'OFF_DUTY':
      case 'INACTIVE':
      case 'LOW':
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyleClass();
  const label = customLabel || status.toString().replace('_', ' ');

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      <span className="capitalize">{label.toLowerCase()}</span>
    </span>
  );
};
