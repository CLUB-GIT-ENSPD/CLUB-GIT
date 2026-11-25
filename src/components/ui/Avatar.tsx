import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');

  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  }[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center shrink-0 select-none`}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
