import React from 'react';
import { ScentProfile as ScentProfileType, ScentNote } from '../../types/scent';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ScentProfileProps {
  profile: ScentProfileType;
  productId: string;
  productName: string;
}

const NoteDisplay: React.FC<{ 
  notes: ScentNote[]; 
  title: string;
  onNoteHover: (note: ScentNote) => void;
}> = ({ notes, title, onNoteHover }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {notes.map((note, index) => (
        <span
          key={`${note.name}-${index}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors"
          onMouseEnter={() => onNoteHover(note)}
          style={{
            opacity: 0.5 + (note.intensity / 20) // Visual representation of intensity
          }}
        >
          {note.name}
        </span>
      ))}
    </div>
  </div>
);

export const ScentProfile: React.FC<ScentProfileProps> = ({ 
  profile, 
  productId,
  productName 
}) => {
  const analytics = useAnalytics();

  const handleNoteHover = (note: ScentNote) => {
    analytics.track('scent_note_hover', {
      product_id: productId,
      product_name: productName,
      note_name: note.name,
      note_intensity: note.intensity,
      note_type: note.description
    });
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Scent Profile</h2>
        
        {/* Notes Section */}
        <div className="space-y-4">
          <NoteDisplay 
            title="Top Notes" 
            notes={profile.primary_notes}
            onNoteHover={handleNoteHover}
          />
          <NoteDisplay 
            title="Middle Notes" 
            notes={profile.middle_notes}
            onNoteHover={handleNoteHover}
          />
          <NoteDisplay 
            title="Base Notes" 
            notes={profile.base_notes}
            onNoteHover={handleNoteHover}
          />
        </div>

        {/* Characteristics Section */}
        <div className="pt-4 border-t border-gray-200 space-y-4">
          {/* Intensity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Intensity</h3>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ 
                    width: `${profile.intensity === 'LIGHT' ? 33 : 
                           profile.intensity === 'MODERATE' ? 66 : 100}%` 
                  }}
                />
              </div>
              <span className="mt-1 text-xs text-gray-500 block">
                {profile.intensity}
              </span>
            </div>
          </div>

          {/* Mood */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Mood</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.mood.map((mood) => (
                <span
                  key={mood}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Best For</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.season.map((season) => (
                <span
                  key={season}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {season}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
