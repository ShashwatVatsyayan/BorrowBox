import React from 'react';
import { formatStatus } from '../../utils/formatters';

export const RequestStatusBadge = ({ status }) => {
  const config = formatStatus(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

