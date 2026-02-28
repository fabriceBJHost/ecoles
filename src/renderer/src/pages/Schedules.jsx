/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FaPlusCircle, FaSearch } from 'react-icons/fa'
import { MdViewTimeline } from 'react-icons/md'
import { getSchedule, listClasse } from '../utils/Request'
import { useEffect, useState } from 'react'
import CreateShedule from '../components/CreateShedule'

const Schedules = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  let schoolInfo = userInfo.School.dataValues
  const schoolId = schoolInfo.id

  const { data: datas = [] } = useQuery({
    queryKey: ['listClass', schoolId],
    queryFn: () => listClasse({ school_id: schoolId })
  })

  const ListClass = datas.data ?? []

  const [class_id, setClass_id] = useState()
  useEffect(() => {
    if (ListClass.length !== 0) {
      setClass_id(ListClass[0].id)
    }
  }, [ListClass])

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', schoolId, class_id],
    queryFn: () => getSchedule({ school_id: schoolId, class_id })
  })

  const scheduleItem = schedules.data ?? []
  console.log(scheduleItem)

  const [openCreate, setOpenCrete] = useState(false)
  const handleCloseCreate = () => setOpenCrete(false)
  const handleOpenCreate = () => setOpenCrete(true)

  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI']
  const hours = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ]

  // Fonction utilitaire pour calculer la durée (rowSpan)
  const getDuration = (start, end) => {
    const s = parseInt(start.split(':')[0])
    const e = parseInt(end.split(':')[0])
    return e - s
  }

  // Vérifier si un cours existe à cette heure précise
  const getLesson = (day, hour, schedules) => {
    return schedules.find((s) => s.day === day && s.start_time.startsWith(hour))
  }

  // Vérifier si la cellule doit être masquée (car couverte par un rowSpan précédent)
  const isUnderSpan = (day, hour, schedules) => {
    return schedules.some((s) => {
      const sHour = parseInt(s.start_time.split(':')[0])
      const eHour = parseInt(s.end_time.split(':')[0])
      const currentHour = parseInt(hour.split(':')[0])
      return s.day === day && currentHour > sHour && currentHour < eHour
    })
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filterClass = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  // On filtre la liste originale
  const filteredList = ListClass.filter((item) => item.name.toLowerCase().includes(searchTerm))

  return (
    <Container disableGutters sx={{ overflow: 'hidden' }}>
      <CreateShedule handleClose={handleCloseCreate} open={openCreate} school_id={schoolId} />
      <Grid spacing={2} container>
        <Grid size={{ lg: 6, md: 7, sm: 7 }}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ color: 'var(--primary)' }}
          >
            <MdViewTimeline size={29} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Emploi du temps
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ lg: 6, md: 5, sm: 5 }} textAlign={'right'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FaPlusCircle size={16} />}
            sx={{ textTransform: 'capitalize', background: 'var(--primary)', marginRight: '30px' }}
            onClick={handleOpenCreate}
          >
            Nouveau
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
      <Grid container spacing={2} marginTop={3} sx={{ minHeight: '78vh', overflow: 'hidden' }}>
        <Grid
          size={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}
          sx={{ borderRight: 'solid 1px var(--secondary)', paddingRight: 1 }}
        >
          <Grid size={12}>
            <TextField
              size="small"
              type="search"
              placeholder="Classe"
              value={searchTerm}
              onChange={filterClass}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch color="var(--secondary)" />
                    </InputAdornment>
                  )
                }
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
          <Grid
            container
            spacing={2}
            marginTop={1}
            sx={{
              maxHeight: '500px', // Fixez la hauteur maximale de votre choix
              overflowY: 'auto', // Active le scroll vertical si le contenu dépasse
              overflowX: 'hidden', // Évite le scroll horizontal parasite
              paddingRight: '8px', // Espace pour ne pas coller à la barre de scroll
              // Style optionnel pour une barre de scroll plus discrète
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: '10px'
              }
            }}
          >
            {/* Utilisation de la liste filtrée ici */}
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <Grid size={12} key={item.id || index}>
                  <Card
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      boxShadow: 2,
                      '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                      transition: '0.2s',
                      cursor: 'pointer',
                      textAlign: 'center',
                      // Optionnel : Ajouter un style "actif" si c'est la classe sélectionnée
                      border: class_id === item.id ? '2px solid var(--primary)' : 'none'
                    }}
                    onClick={() => setClass_id(item.id)} // Ta fonction change(item.id)
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'var(--secondary)', fontWeight: 'bold' }}
                    >
                      {item.name}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'gray' }}>
                  Aucune classe trouvée.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" bordered>
              <TableHead>
                <TableRow>
                  <TableCell>Heure</TableCell>
                  {days.map((day) => (
                    <TableCell key={day} align="center">
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {hours.map((hour, index) => {
                  // On ne traite pas la dernière heure pour éviter un débordement (ex: 17h-18h)
                  // Sauf si vous voulez que la grille s'arrête exactement là.
                  if (index === hours.length - 1) return null

                  const nextHour = hours[index + 1]
                  const timeRangeLabel = `${hour.split(':')[0]}h - ${nextHour.split(':')[0]}h`

                  return (
                    <TableRow key={hour}>
                      {/* Affichage de la tranche 7h - 8h */}
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                      >
                        {timeRangeLabel}
                      </TableCell>

                      {days.map((day) => {
                        const lesson = getLesson(day, hour, scheduleItem)
                        const hidden = isUnderSpan(day, hour, scheduleItem)

                        if (hidden) return null

                        if (lesson) {
                          const span = getDuration(lesson.start_time, lesson.end_time)
                          return (
                            <TableCell
                              key={day + hour}
                              rowSpan={span}
                              align="center"
                              sx={{
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #90caf9',
                                fontWeight: 'medium'
                              }}
                            >
                              <strong>{lesson['Matiere.name']}</strong> <br />
                              <small>
                                {lesson['User.firstname']} {lesson['User.lastname']}
                              </small>
                            </TableCell>
                          )
                        }

                        return <TableCell key={day + hour} sx={{ border: '1px solid #f0f0f0' }} />
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Schedules
