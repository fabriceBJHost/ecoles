/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  TextField
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { memo, useMemo, useState } from 'react'
import {
  FaBook,
  FaDoorClosed,
  FaDyalog,
  FaHourglassEnd,
  FaHourglassStart,
  FaUser
} from 'react-icons/fa'
import { getListUser, getMatieres, listClasse } from '../utils/Request'

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

  const formSubmit = (e) => {
    e.preventDefault()
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

  const newObjectMatieres = useMemo(() => {
    const grouped = matiereItems.reduce((acc, item) => {
      const id = item.id
      const users = {
        id: item['Users.id'],
        matiere_id: item.id,
        nom: item['Users.firstname'],
        prenom: item['Users.lastname']
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
      userFiltered.push(values[index].users)
    }

    return Object.values(grouped).map((matiere) => ({
      id: matiere.id,
      name: matiere.name,
      users: matiere.users
    }))
  }, [matiereItems, userFiltered])

  console.log(userFiltered)

  const selectedUser = useMemo(
    () => usersItems.find((item) => item.id === formData.teacher_id) || null,
    [usersItems, formData.teacher_id]
  )

  const filteredUser = useMemo(() => {
    return (options, params) => {
      const input = params.inputValue.toLowerCase()
      return options.filter((option) => {
        return (
          option.username?.toLowerCase().includes(input) ||
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
                setFormData((prev) => ({
                  ...prev,
                  subject_id: newValue ? newValue.id : ''
                }))
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
              options={usersItems}
              value={selectedUser}
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
    </Dialog>
  )
}

export default CreateShedule
