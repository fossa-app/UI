import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { COLOR_SCHEME_KEYS, COLOR_SCHEMES } from 'shared/themes';
import { ThemeMode, ColorSchemeId, Module, SubModule } from 'shared/models';

type ColorSchemeSelectorProps = {
  module: Module;
  subModule: SubModule;
  selectedScheme?: ColorSchemeId;
  mode?: ThemeMode;
  disabled?: boolean;
  onChange: (schemeId: ColorSchemeId) => void;
};

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  module,
  subModule,
  selectedScheme,
  mode = 'dark',
  disabled,
  onChange,
}) => {
  const availableSchemes = Object.entries(COLOR_SCHEMES).filter(([_, scheme]) => scheme[mode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as ColorSchemeId);
  };

  return (
    <RadioGroup value={selectedScheme ?? ''} onChange={handleChange} name="color-scheme-group">
      <Grid container spacing={3}>
        {availableSchemes.map(([schemeId, scheme]) => {
          const colors = scheme[mode]!;

          return (
            <Grid key={schemeId} size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                data-cy={`${module}-${subModule}-color-scheme-radio-${schemeId}`}
                value={schemeId}
                control={<Radio disabled={disabled} />}
                sx={{ width: '100%' }}
                slotProps={{
                  typography: {
                    sx: { width: '100%' },
                  },
                }}
                label={
                  <Box data-cy={`${module}-${subModule}-color-scheme-${schemeId}`} sx={{ cursor: 'pointer' }}>
                    <Typography gutterBottom variant="subtitle1" data-cy={`${module}-${subModule}-color-scheme-label-${schemeId}`}>
                      {scheme.label}
                    </Typography>
                    <Grid container spacing={1}>
                      {COLOR_SCHEME_KEYS.map((key) => (
                        <Grid key={key} size={{ xs: 6 }}>
                          <Box
                            sx={{
                              height: 40,
                              backgroundColor: colors[key],
                              borderRadius: 1,
                              border: '1px solid #ccc',
                            }}
                            title={`${key}: ${colors[key]}`}
                          />
                          <Typography variant="caption" display="block" align="center">
                            {key}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
};

export default ColorSchemeSelector;
