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
import { memo, useMemo, useState } from 'react'
import {
  FaBook,
  FaDoorClosed,
  FaDyalog,
  FaHourglassEnd,
  FaHourglassStart,
  FaPlusCircle,
  FaUser
} from 'react-icons/fa'
import { createShedule, getListUser, getMatieres, listClasse } from '../utils/Request'
import { Alert } from '../utils/Alert'

const CreateShedule = ({ open, handleClose, school_id }) => {
  const [formData, setFormData] = useState({
    school_id: school_id,
    class_id: '',
    subject_id: '',
    teacher_id: '',
    day: '',
    start_time: '',
    end_time: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const { data } = useQuery({
    queryKey: ['listClass', school_id],
    queryFn: () => listClasse({ school_id: school_id })
  })

  const { data: users = [] } = useQuery({
    queryKey: ['listUsers', school_id],
    queryFn: () => getListUser({ school_id })
  })

  const { data: matiere = [] } = useQuery({
    queryKey: ['Matieres', school_id],
    queryFn: () => getMatieres({ school_id: school_id })
  })

  const ListClass = data != undefined ? data.data : []
  const usersItems = users.data ?? []
  const matiereItems = matiere.data ?? []
  const userFiltered = []
  const [newUsers, setNewUsers] = useState([])

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

  const findUserByMatieres = (id) => {
    let tmpData = []
    for (let index = 0; index < userFiltered.length; index++) {
      if (userFiltered[index].matiere_id == id) {
        tmpData.push(userFiltered[index])
      }
    }
    setNewUsers(tmpData)
  }

  const selectedUser = useMemo(
    () => newUsers.find((item) => item.id === formData.teacher_id) || null,
    [newUsers, formData.teacher_id]
  )

  const selectedUser2 = useMemo(
    () => usersItems.find((item) => item.id === formData.teacher_id) || null,
    [usersItems, formData.teacher_id]
  )

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

  const selectedMatieres = useMemo(
    () => newObjectMatieres.find((item) => item.id === formData.subject_id) || null,
    [newObjectMatieres, formData.subject_id]
  )

  const filteredMatiere = useMemo(() => {
    return (options, params) => {
      const input = params.inputValue.toLowerCase()
      return options.filter((option) => {
        return option.name?.toLowerCase().includes(input)
      })
    }
  }, [])

  const selectedClass = useMemo(
    () => ListClass.find((item) => item.id === formData.class_id) || null,
    [ListClass, formData.class_id]
  )

  const filteredClass = useMemo(() => {
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
    mutationFn: createShedule,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['schedules'] })
      }
    },
    onError: (error) => {
      Alert('Erreur', error.message, 'error', 'OK', 'var(--primary)')
    }
  })

  const formSubmit = (e) => {
    e.preventDefault()

    mutation.mutate(formData)
  }

  return (
    <Dialog
      open={open}
      component={'form'}
      onSubmit={formSubmit}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: 'var(--primary)',
          fontWeight: 'bold'
        }}
      >
        Crée une emploi du temps
      </DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="Heure du cour"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="start_time"
              required
              type="time"
              value={formData.start_time}
              onChange={handleChange}
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
          <Grid size={6}>
            <TextField
              label="Heure de fin du cour"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="end_time"
              required
              type="time"
              value={formData.end_time}
              onChange={handleChange}
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
          <Grid size={6}>
            <TextField
              label="Jour"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="day"
              type="text"
              required
              placeholder="Jour de la semaine"
              select
              value={formData.day}
              onChange={handleChange}
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
          <Grid size={6}>
            <Autocomplete
              options={ListClass}
              value={selectedClass}
              getOptionLabel={(option) => option.name || ''}
              filterOptions={filteredClass}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  class_id: newValue ? newValue.id : ''
                }))
              }}
              renderOption={(props, option) => <RenderClassOption props={props} option={option} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="black"
                  label="Sélectionner une classe"
                  placeholder="Choisir une classe"
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
                        <FaDoorClosed color="var(--secondary)" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              options={newObjectMatieres}
              value={selectedMatieres}
              getOptionLabel={(option) => option.name}
              filterOptions={filteredMatiere}
              onChange={(event, newValue) => {
                ;(setFormData((prev) => ({
                  ...prev,
                  subject_id: newValue ? newValue.id : ''
                })),
                  findUserByMatieres(newValue.id))
              }}
              renderOption={(props, option) => <RenderClassOption props={props} option={option} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="black"
                  label="Sélectionner une matière"
                  placeholder="Choisir une matière"
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
                        <FaBook color="var(--secondary)" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              options={newUsers.length !== 0 ? newUsers : usersItems}
              value={newUsers.length !== 0 ? selectedUser : selectedUser2}
              getOptionLabel={(option) => option.firstname + ' ' + option.lastname || ''}
              filterOptions={filteredUser}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  teacher_id: newValue ? newValue.id : ''
                }))
              }}
              renderOption={(props, option) => <RenderMemberOption props={props} option={option} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="black"
                  label="Sélectionner une enseignant(e)"
                  placeholder="Choisir une enseignant(e)"
                  helperText="Sélectionner la matiere pour plus de filtre"
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
          startIcon={<FaPlusCircle size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateShedule
