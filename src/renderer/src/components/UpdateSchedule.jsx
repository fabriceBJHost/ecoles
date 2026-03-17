/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  TextField
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { memo, useEffect, useMemo, useState } from 'react'
import { getMatieres, getSchedule, updateSchedule } from '../utils/Request'
import {
  FaBook,
  FaDyalog,
  FaHourglassEnd,
  FaHourglassStart,
  FaRegEdit,
  FaUser
} from 'react-icons/fa'
import { Alert } from '../utils/Alert'

const UpdateSchedule = ({ open, handleClose, school_id, id }) => {
  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', school_id, id],
    queryFn: () => getSchedule({ school_id, class_id: id })
  })

  const [rows, setRows] = useState([])

  const ListSchedule = schedules.data ?? []

  useEffect(() => {
    if (ListSchedule.length > 0) {
      setRows(ListSchedule)
    }
  }, [ListSchedule])

  const { data: matiere = [] } = useQuery({
    queryKey: ['Matieres', school_id],
    queryFn: () => getMatieres({ school_id })
  })

  const matiereItems = matiere.data ?? []
  const userFiltered = []

  const newObjectMatieres = useMemo(() => {
    const grouped = matiereItems.reduce((acc, item) => {
      const id = item.id
      const users = {
        id: item['Users.id'],
        matiere_id: item.id,
        firstname: item['Users.firstname'],
        lastname: item['Users.lastname']
      }

      if (!acc[id]) {
        // Si la matière n'existe pas encore, on la crée
        acc[id] = {
          id: item.id,
          name: item.name,
          users: users ? [users] : [] // On stocke dans un tableau
        }
      } else {
        // Si elle existe et que le prof n'est pas déjà dans la liste
        if (users && !acc[id].users.includes(users)) {
          acc[id].users.push(users)
        }
      }
      return acc
    }, {})

    const values = Object.values(grouped)
    for (let index = 0; index < values.length; index++) {
      const doubleArray = values[index].users
      for (let index = 0; index < doubleArray.length; index++) {
        userFiltered.push(doubleArray[index])
      }
    }

    return Object.values(grouped).map((matiere) => ({
      id: matiere.id,
      name: matiere.name,
      users: matiere.users
    }))
  }, [matiereItems, userFiltered])

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows]
    updatedRows[index] = { ...updatedRows[index], [field]: value }
    setRows(updatedRows)
  }

  const filteredUser = useMemo(() => {
    return (options, params) => {
      const input = params.inputValue.toLowerCase()
      return options.filter((option) => {
        return (
          option.firstname?.toLowerCase().includes(input) ||
          option.lastname?.toLowerCase().includes(input)
        )
      })
    }
  }, [])

  const filteredMatiere = useMemo(() => {
    return (options, params) => {
      const input = params.inputValue.toLowerCase()
      return options.filter((option) => {
        return option.name?.toLowerCase().includes(input)
      })
    }
  }, [])

  const RenderClassOption = memo(({ props, option }) => (
    <li {...props} key={option.id}>
      {option.name}
    </li>
  ))

  const RenderMemberOption = memo(({ props, option }) => (
    <li {...props} key={option.id}>
      {option.firstname} {option.lastname}
    </li>
  ))

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: (data) => {
      if (data && data.success == false) {
        handleClose(true)
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['schedules'] })
      }
    },
    onError: (error) => {
      handleClose(true)
      Alert('Erreur', error.message, 'error', 'OK', 'var(--primary)')
    }
  })

  const formSubmit = (e) => {
    e.preventDefault()
    console.log(rows)
    mutation.mutate(rows)
  }

  return (
    <Dialog
      open={open}
      component={'form'}
      onSubmit={formSubmit}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: 'var(--primary)',
          fontWeight: 'bold'
        }}
      >
        Modifier les emploi du temps d&apos;une classe
      </DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          p: 2
        }}
      >
        {rows.map((emploi, index) => (
          <Grid key={emploi.id || index} container spacing={2} alignItems="center">
            <Grid size={2}>
              <TextField
                select
                label="Jour"
                size="small"
                fullWidth
                margin="dense"
                color="black"
                name="day"
                required
                type="time"
                value={emploi.day || ''}
                onChange={(e) => handleChange(index, 'day', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaDyalog color="var(--secondary)" />
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
              >
                <MenuItem value={'LUNDI'}>LUNDI</MenuItem>
                <MenuItem value={'MARDI'}>MARDI</MenuItem>
                <MenuItem value={'MERCREDI'}>MERCREDI</MenuItem>
                <MenuItem value={'JEUDI'}>JEUDI</MenuItem>
                <MenuItem value={'VENDREDI'}>VENDREDI</MenuItem>
                <MenuItem value={'SAMEDI'}>SAMEDI</MenuItem>
              </TextField>
            </Grid>
            <Grid size={2}>
              <TextField
                label="Debut du cour"
                size="small"
                fullWidth
                margin="dense"
                color="black"
                name="start_time"
                required
                type="time"
                value={emploi.start_time || ''}
                onChange={(e) => handleChange(index, 'start_time', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaHourglassStart color="var(--secondary)" />
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
            <Grid size={2}>
              <TextField
                label="Fin du cour"
                size="small"
                fullWidth
                margin="dense"
                color="black"
                name="start_time"
                required
                type="time"
                value={emploi.end_time || ''}
                onChange={(e) => handleChange(index, 'end_time', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaHourglassEnd color="var(--secondary)" />
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
            <Grid size={3}>
              <Autocomplete
                options={newObjectMatieres}
                // 1. On récupère l'objet matière correspondant à l'ID stocké dans cette ligne
                value={newObjectMatieres.find((m) => m.id === emploi.subject_id) || null}
                getOptionLabel={(option) => option.name || ''}
                // Si tu as un filtre personnalisé, assure-to qu'il fonctionne avec l'objet
                filterOptions={filteredMatiere}
                onChange={(event, newValue) => {
                  // 2. Utilisation de la logique handleChange pour mettre à jour la ligne spécifique
                  const subjectId = newValue ? newValue.id : ''
                  handleChange(index, 'subject_id', subjectId)
                }}
                renderOption={(props, option) => (
                  <RenderClassOption props={props} option={option} />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner une matière"
                    required
                    size="small"
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'var(--secondary)' },
                        '&:hover fieldset': { borderColor: 'var(--secondary)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--primary)' }
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaBook color="var(--secondary)" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={3}>
              <Autocomplete
                options={
                  emploi.subject_id
                    ? userFiltered.filter((u) => u.matiere_id == emploi.subject_id)
                    : userFiltered
                }
                value={userFiltered.find((u) => u.id === emploi.teacher_id) || null}
                getOptionLabel={(option) => option.firstname + ' ' + option.lastname || ''}
                filterOptions={filteredUser}
                onChange={(event, newValue) => {
                  // 2. Utilisation de la logique handleChange pour mettre à jour la ligne spécifique
                  const teacher_id = newValue ? newValue.id : ''
                  handleChange(index, 'teacher_id', teacher_id)
                }}
                renderOption={(props, option) => (
                  <RenderMemberOption props={props} option={option} />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="black"
                    label="Sélectionner une enseignant(e)"
                    placeholder="Choisir une enseignant(e)"
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
                    margin="dense"
                    required
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaUser color="var(--secondary)" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          type="submit"
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            borderRadius: 2,
            color: 'var(--primary)'
          }}
          size="small"
          startIcon={<FaRegEdit size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateSchedule
