export const formatStatus = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'approved':
      return { label: 'Approved & Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'rejected':
      return { label: 'Declined', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    case 'return_pending':
      return { label: 'Return Initiated', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    default:
      return { label: status, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
};

export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

