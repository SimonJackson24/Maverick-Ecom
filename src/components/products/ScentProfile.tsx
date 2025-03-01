import React from 'react';
import { type ScentProfile, ScentIntensity } from '../../types/scent';
import { Card, CardContent, Typography, LinearProgress, Chip, Box } from '@mui/material';

interface ScentProfileProps {
  profile: ScentProfile;
}

const getIntensityColor = (intensity: ScentIntensity): string => {
  switch (intensity) {
    case ScentIntensity.LIGHT:
      return '#4CAF50';
    case ScentIntensity.MODERATE:
      return '#FFA726';
    case ScentIntensity.STRONG:
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const ScentNoteList: React.FC<{ notes: ScentProfile['primary_notes'] }> = ({ notes }) => (
  <div className="flex flex-wrap gap-2">
    {notes.map((note) => (
      <Chip
        key={note.id}
        label={note.name}
        style={{
          backgroundColor: note.color,
          color: '#fff'
        }}
      />
    ))}
  </div>
);

export const ScentProfile: React.FC<ScentProfileProps> = ({ profile }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {profile.name}
        </Typography>

        {profile.description && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {profile.description}
          </Typography>
        )}

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Primary Notes
          </Typography>
          <ScentNoteList notes={profile.primary_notes} />
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Middle Notes
          </Typography>
          <ScentNoteList notes={profile.middle_notes} />
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Base Notes
          </Typography>
          <ScentNoteList notes={profile.base_notes} />
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Intensity
          </Typography>
          <LinearProgress
            variant="determinate"
            value={profile.longevity}
            style={{ backgroundColor: getIntensityColor(profile.intensity) }}
          />
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Mood
          </Typography>
          <div className="flex flex-wrap gap-2">
            {profile.mood.map((mood) => (
              <Chip key={mood} label={mood} />
            ))}
          </div>
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Seasons
          </Typography>
          <div className="flex flex-wrap gap-2">
            {profile.season.map((season) => (
              <Chip key={season} label={season} />
            ))}
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};
