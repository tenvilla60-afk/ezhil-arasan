import { useState } from 'react';
import { Cpu } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#1E1B4B] border border-white/10 text-slate-300 p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Cpu className="w-8 h-8 text-blue-400 mb-3" />
        <span className="text-xs font-medium text-slate-300 text-center">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
