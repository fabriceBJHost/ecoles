/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from '../utils/Alert'
import { FaBookBookmark } from 'react-icons/fa6'
import { FaPlusCircle, FaSortNumericUp } from 'react-icons/fa'
import { createMatieres } from '../utils/Request'

const AddMatiere = ({ open, handleClose, school_id }) => {
  const [formData, setFormData] = useState({
    name: '',
    coefficient: '',
    school_id: school_id
  })

  // const { data: users = [] } = useQuery({
  //   queryKey: ['listUsers'],
  //   queryFn: () => getListUser({ school_id })
  // })

  // const usersItems = users.data ?? []

  // const selectedUser = useMemo(
  //   () => usersItems.find((item) => item.id === formData.teacher_id) || null,
  //   [usersItems, formData.teacher_id]
  // )

  // const filteredUser = useMemo(() => {
  //   return (options, params) => {
  //     const input = params.inputValue.toLowerCase()
  //     return options.filter((option) => {
  //       return (
  //         option.username?.toLowerCase().includes(input) ||
  //         option.firstname?.toLowerCase().includes(input) ||
  //         option.lastname?.toLowerCase().includes(input)
  //       )
  //     })
  //   }
  // }, [])

  // const RenderMemberOption = memo(({ props, option }) => (
  //   <li {...props} key={option.id}>
  //     {option.username} | {option.firstname} | {option.lastname}
  //   </li>
  // ))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createMatieres,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['Matieres'] })
        setFormData((prev) => ({
          ...prev,
          name: '',
          coefficient: '',
          school_id: school_id
        }))
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
        Ajouter une nouvelle Matiere
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
              label="Nom"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              name="name"
              required
              placeholder="Nom de la matiere"
              value={formData.name}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBookBookmark color="var(--secondary)" />
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
              label="Coeficient"
              size="small"
              fullWidth
              margin="dense"
              color="black"
              type="number"
              name="coefficient"
              required
              placeholder="Coefficient de la matiere"
              value={formData.coefficient}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSortNumericUp color="var(--secondary)" />
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
          {/* <Grid size={12}>
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
                  label="Sélectionner une enseignant"
                  placeholder="Choisir une enseignant"
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
          </Grid> */}
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
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMatiere
