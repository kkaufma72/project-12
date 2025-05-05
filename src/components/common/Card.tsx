import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  footer,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="px-4 py-5 border-b border-gray-100 sm:px-6">
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && <div className="px-4 py-4 border-t border-gray-100 sm:px-6">{footer}</div>}
    </div>
  );
};

export default Card;