import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { FaCalendarAlt, FaImage, FaMapMarkerAlt, FaPercentage, FaSchool } from 'react-icons/fa'
import { useState } from 'react'
import AnneeScolaires from './AnneeScolaires'

const Etablissements = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues
  const schoolId = schoolInfo.id

  const [tabIndex, setTabIndex] = useState(0)
  return (
    <Container disableGutters>
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <FaSchool size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              établissement
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
      <Box sx={{ p: 2, margin: 'auto' }}>
        <Paper elevation={1} sx={{ mt: 1, borderRadius: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            sx={{
              color: '#315683ff',
              '& .Mui-selected': {
                color: 'var(--primary)'
              }
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: 'var(--primary)',
                height: '2px' // Optionnel : pour la rendre plus épaisse
              }
            }}
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab icon={<FaSchool />} label="Général" />
            <Tab icon={<FaCalendarAlt />} label="Années Scolaires" />
            <Tab icon={<FaPercentage />} label="Notation & Coeff" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {/* Section 1: Informations Générales */}
            {tabIndex === 0 && (
              <Grid container spacing={3}>
                <Grid
                  size={4}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: '#f0f0f0' }}>
                    <FaImage size={40} color="#ccc" />
                  </Avatar>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<FaImage />}
                    sx={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)',
                      textTransform: 'initial'
                    }}
                  >
                    Modifier le Logo
                    <input type="file" hidden />
                  </Button>
                </Grid>

                <Grid size={8}>
                  <TextField
                    fullWidth
                    label="Nom de l'école"
                    variant="outlined"
                    margin="normal"
                    color="none"
                    defaultValue="Lycée Excellence"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--primary)'
                        }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Adresse"
                    variant="outlined"
                    margin="normal"
                    color="none"
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaMapMarkerAlt color="var(--secondary)" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--primary)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            )}

            {/* Section 2: Années Scolaires */}
            {tabIndex === 1 && <AnneeScolaires school_id={schoolId} />}

            {/* Section 3: Paramètres de Notation */}
            {tabIndex === 2 && (
              <Grid container spacing={3}>
                <Grid size={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'var(--primary)' }}
                  >
                    Barème de notation
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    margin="dense"
                    defaultValue="20"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--primary)'
                        }
                      }
                    }}
                  >
                    <MenuItem value="10">Sur 10</MenuItem>
                    <MenuItem value="20">Sur 20 (Standard)</MenuItem>
                    <MenuItem value="100">Sur 100</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'var(--primary)' }}
                  >
                    Arrondi des moyennes
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    margin="dense"
                    defaultValue="2"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--secondary)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--primary)'
                        }
                      }
                    }}
                  >
                    <MenuItem value="0">Pas d&apos;arrondi</MenuItem>
                    <MenuItem value="1">1 chiffre après la virgule</MenuItem>
                    <MenuItem value="2">2 chiffres après la virgule</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <Divider sx={{ my: 2, borderColor: 'var(--secondary)' }} />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Activer les coefficients par matière"
                  />
                  <FormControlLabel control={<Switch />} label="Afficher le rang sur le bulletin" />
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Etablissements
