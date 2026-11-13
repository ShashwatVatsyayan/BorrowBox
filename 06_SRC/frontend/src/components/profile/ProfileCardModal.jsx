import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Edit2 } from 'lucide-react';
import { HoloCard } from '../common/HoloCard';
import { useAuth } from '../../hooks/useAuth';
import { generateStudentCardSvg } from '../../utils/studentCardArt';

const HOLO_PRESETS = [
  { id: 'bursts', label: 'Bursts' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'cosmos', label: 'Cosmos' },
  { id: 'gold', label: 'Gold Foil' },
  { id: 'shards', label: 'Shards' },
  { id: 'stars', label: 'Stars' }
];

export const ProfileCardModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHoloPreset, setSelectedHoloPreset] = useState('bursts');

  if (!isOpen) return null;

  const studentEmail = user?.email || user?.university_email || 'student@cuchd.in';
  const immutableUid = user?.university_uid || (studentEmail.includes('@') ? studentEmail.split('@')[0].toUpperCase() : '23BCS12850');
  const effectiveAvatar = user?.avatar_url || '/default_avatar_male.svg';
  const fullName = user?.full_name || 'Student Peer';
  const department = user?.department || 'Computer Science & Engineering';
  const hostelRoom = user?.hostel_room || 'Chandigarh University Campus';

  const cardArt = generateStudentCardSvg({
    fullName,
    uid: immutableUid,
    email: studentEmail,
    avatarUrl: effectiveAvatar,
    gender: effectiveAvatar.includes('female') ? 'female' : 'male',
    department,
    hostelRoom,
    role: user?.role || 'student',
    trustScore: '5.0'
  });

  const handleGoToEdit = () => {
    onClose();
    navigate('/app/profile/edit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pb-[env(safe-area-inset-bottom,0px)] bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-surface-card border border-surface-border rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-card-title"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between bg-surface-card/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <User size={15} />
            </div>
            <div>
              <h2 id="profile-card-title" className="text-sm sm:text-base font-bold text-ink-primary">
                Holographic Campus Pass
              </h2>
              <p className="text-[11px] text-ink-muted">
                Chandigarh University Student Identity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close pass"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Only Display Area */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          {/* 3D Interactive Tilt HoloCard */}
          <div className="py-2 flex items-center justify-center w-full">
            <HoloCard
              image={cardArt}
              alt={`${fullName} Student Card`}
              preset={selectedHoloPreset}
              width={260}
              intensity={0.92}
              edgeSparkle={0.85}
              glare={0.6}
              radius={18}
              hoverScale={1.04}
            />
          </div>

          <p className="text-[11px] text-center text-ink-muted mt-2 max-w-xs leading-relaxed">
            Move cursor or tilt device to inspect holographic foil reflections.
          </p>

          {/* Quick Foil Texture Selector */}
          <div className="w-full mt-4 p-3 rounded-2xl bg-surface-base border border-surface-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Foil Texture
              </span>
              <span className="text-[10px] font-semibold text-[#D4A853]">
                Holographic Pass
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {HOLO_PRESETS.map((p) => {
                const isSelected = selectedHoloPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedHoloPreset(p.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all text-center ${
                      isSelected
                        ? 'bg-[#0F382A] text-[#F5F2EB] border border-[#D4A853] shadow-xs'
                        : 'bg-surface-card text-ink-muted border border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Pass Quick Information */}
          <div className="w-full mt-3 p-3 rounded-2xl bg-surface-base border border-surface-border flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-ink-primary">{fullName}</p>
              <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">UID: {immutableUid}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Student
              </span>
              <p className="text-[10px] text-ink-light mt-0.5">{department.split('&')[0].trim()}</p>
            </div>
          </div>

          {/* Action Buttons: Edit Profile in dedicated section or Close */}
          <div className="w-full mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToEdit}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm border border-[#D4A853] shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Edit2 size={13} />
              <span>Edit Profile Details</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary font-semibold text-xs sm:text-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardModal;
