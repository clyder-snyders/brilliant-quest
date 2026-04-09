import React from 'react';
import { AvatarId } from './types';

interface AvatarProps {
  size?: number;
  className?: string;
}

const Spark = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <rect x="16" y="20" width="32" height="28" rx="6" fill="hsl(217, 91%, 60%)" />
    <polygon points="24,20 28,8 32,20" fill="hsl(217, 91%, 60%)" />
    <polygon points="32,20 36,8 40,20" fill="hsl(217, 91%, 60%)" />
    <circle cx="26" cy="32" r="4" fill="white" />
    <circle cx="38" cy="32" r="4" fill="white" />
    <circle cx="26" cy="32" r="2" fill="hsl(217, 33%, 17%)" />
    <circle cx="38" cy="32" r="2" fill="hsl(217, 33%, 17%)" />
    <circle cx="32" cy="38" r="5" fill="hsl(43, 96%, 56%)" opacity="0.8" />
    <path d="M26 44 Q32 48 38 44" stroke="hsl(217, 33%, 17%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="10" y="30" width="6" height="4" rx="2" fill="hsl(217, 91%, 60%)" />
    <rect x="48" y="30" width="6" height="4" rx="2" fill="hsl(217, 91%, 60%)" />
    <rect x="22" y="48" width="6" height="8" rx="2" fill="hsl(217, 91%, 60%)" />
    <rect x="36" y="48" width="6" height="8" rx="2" fill="hsl(217, 91%, 60%)" />
  </svg>
);

const Nova = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <rect x="14" y="16" width="36" height="30" rx="12" fill="hsl(258, 90%, 66%)" />
    <rect x="18" y="20" width="28" height="14" rx="6" fill="hsl(258, 90%, 80%)" opacity="0.5" />
    <circle cx="26" cy="28" r="3" fill="white" />
    <circle cx="38" cy="28" r="3" fill="white" />
    <circle cx="26" cy="28" r="1.5" fill="hsl(258, 90%, 30%)" />
    <circle cx="38" cy="28" r="1.5" fill="hsl(258, 90%, 30%)" />
    <polygon points="48,22 54,18 52,24" fill="hsl(43, 96%, 56%)" />
    <polygon points="16,22 10,18 12,24" fill="hsl(43, 96%, 56%)" />
    <path d="M26 38 Q32 42 38 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="10" y="30" width="6" height="3" rx="1.5" fill="hsl(258, 90%, 66%)" />
    <rect x="48" y="30" width="6" height="3" rx="1.5" fill="hsl(258, 90%, 66%)" />
    <rect x="22" y="46" width="6" height="10" rx="3" fill="hsl(258, 90%, 66%)" />
    <rect x="36" y="46" width="6" height="10" rx="3" fill="hsl(258, 90%, 66%)" />
  </svg>
);

const Bolt = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <rect x="18" y="22" width="28" height="24" rx="4" fill="hsl(43, 96%, 56%)" />
    <rect x="26" y="14" width="12" height="10" rx="4" fill="hsl(43, 96%, 56%)" />
    <circle cx="27" cy="32" r="3" fill="white" />
    <circle cx="37" cy="32" r="3" fill="white" />
    <circle cx="27" cy="32" r="1.5" fill="hsl(25, 95%, 30%)" />
    <circle cx="37" cy="32" r="1.5" fill="hsl(25, 95%, 30%)" />
    <path d="M29 38 L35 38" stroke="hsl(25, 95%, 30%)" strokeWidth="2" strokeLinecap="round" />
    <polygon points="8,28 18,32 8,36" fill="hsl(25, 95%, 53%)" />
    <polygon points="56,28 46,32 56,36" fill="hsl(25, 95%, 53%)" />
    <rect x="24" y="46" width="6" height="8" rx="2" fill="hsl(43, 96%, 56%)" />
    <rect x="34" y="46" width="6" height="8" rx="2" fill="hsl(43, 96%, 56%)" />
  </svg>
);

const Pixel = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <rect x="16" y="16" width="32" height="32" fill="hsl(168, 76%, 40%)" />
    <rect x="22" y="24" width="8" height="8" fill="white" />
    <rect x="34" y="24" width="8" height="8" fill="white" />
    <rect x="24" y="26" width="4" height="4" fill="hsl(168, 76%, 20%)" />
    <rect x="36" y="26" width="4" height="4" fill="hsl(168, 76%, 20%)" />
    <rect x="26" y="38" width="12" height="4" fill="hsl(168, 76%, 20%)" />
    <rect x="12" y="28" width="4" height="8" fill="hsl(168, 76%, 40%)" />
    <rect x="48" y="28" width="4" height="8" fill="hsl(168, 76%, 40%)" />
    <rect x="22" y="48" width="8" height="8" fill="hsl(168, 76%, 40%)" />
    <rect x="34" y="48" width="8" height="8" fill="hsl(168, 76%, 40%)" />
    <rect x="28" y="10" width="8" height="6" fill="hsl(168, 76%, 40%)" />
  </svg>
);

const Orbit = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="32" cy="34" rx="22" ry="8" fill="none" stroke="hsl(25, 95%, 53%)" strokeWidth="2" opacity="0.4" />
    <rect x="20" y="20" width="24" height="28" rx="10" fill="hsl(25, 95%, 53%)" />
    <circle cx="27" cy="32" r="3" fill="white" />
    <circle cx="37" cy="32" r="3" fill="white" />
    <circle cx="27" cy="32" r="1.5" fill="hsl(25, 95%, 20%)" />
    <circle cx="37" cy="32" r="1.5" fill="hsl(25, 95%, 20%)" />
    <path d="M28 39 Q32 42 36 39" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="14" r="3" fill="hsl(25, 95%, 53%)" />
    <line x1="32" y1="17" x2="32" y2="20" stroke="hsl(25, 95%, 53%)" strokeWidth="2" />
    <rect x="16" y="32" width="5" height="3" rx="1.5" fill="hsl(25, 95%, 53%)" />
    <rect x="43" y="32" width="5" height="3" rx="1.5" fill="hsl(25, 95%, 53%)" />
    <rect x="24" y="48" width="5" height="8" rx="2" fill="hsl(25, 95%, 53%)" />
    <rect x="35" y="48" width="5" height="8" rx="2" fill="hsl(25, 95%, 53%)" />
  </svg>
);

const Ghost = ({ size = 64, className }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path d="M20 48 L20 24 Q20 12 32 12 Q44 12 44 24 L44 48 L40 44 L36 48 L32 44 L28 48 L24 44 Z" fill="hsl(215, 16%, 80%)" opacity="0.7" />
    <path d="M20 48 L20 24 Q20 12 32 12 Q44 12 44 24 L44 48 L40 44 L36 48 L32 44 L28 48 L24 44 Z" fill="none" stroke="hsl(215, 16%, 60%)" strokeWidth="1.5" />
    <circle cx="27" cy="28" r="4" fill="white" />
    <circle cx="37" cy="28" r="4" fill="white" />
    <circle cx="28" cy="29" r="2" fill="hsl(215, 16%, 40%)" />
    <circle cx="38" cy="29" r="2" fill="hsl(215, 16%, 40%)" />
    <ellipse cx="32" cy="36" rx="3" ry="2" fill="hsl(215, 16%, 60%)" />
  </svg>
);

export const avatarComponents: Record<AvatarId, React.FC<AvatarProps>> = {
  spark: Spark,
  nova: Nova,
  bolt: Bolt,
  pixel: Pixel,
  orbit: Orbit,
  ghost: Ghost,
};

export const avatarNames: Record<AvatarId, string> = {
  spark: 'Spark',
  nova: 'Nova',
  bolt: 'Bolt',
  pixel: 'Pixel',
  orbit: 'Orbit',
  ghost: 'Ghost',
};

export function AvatarDisplay({ avatarId, size = 64, className }: { avatarId: AvatarId; size?: number; className?: string }) {
  const Component = avatarComponents[avatarId];
  return <Component size={size} className={className} />;
}
