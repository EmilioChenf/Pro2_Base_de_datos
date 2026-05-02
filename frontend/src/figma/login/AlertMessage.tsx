import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export function AlertMessage({ type, message, onClose }: AlertMessageProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle size={20} className="text-red-600" />,
    },
    info: {
      bg: 'bg-[rgba(165,255,242,0.42)]',
      border: 'border-[rgba(8,252,184,0.28)]',
      text: 'text-[#31534c]',
      icon: <Info size={20} className="text-[var(--primary-hover)]" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.border} border rounded-xl p-4 flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>
      <p className={`${style.text} text-sm flex-1`}>
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

