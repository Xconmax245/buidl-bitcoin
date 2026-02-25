
'use client';

import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function InitialsAvatar({ name, size = 128, className = "" }: InitialsAvatarProps) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white font-bold select-none ${className}`}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.36 
      }}
    >
      {initials}
    </div>
  );
}

interface AvatarProps {
    src?: string | null;
    name: string;
    size?: number;
    className?: string;
}

export function Avatar({ src, name, size = 128, className = "" }: AvatarProps) {
    if (src) {
        return (
            <div 
                className={`rounded-full overflow-hidden border border-white/10 ${className}`}
                style={{ width: size, height: size }}
            >
                <img src={src} alt={name} className="w-full h-full object-cover" />
            </div>
        );
    }
    return <InitialsAvatar name={name} size={size} className={className} />;
}
