/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { asingMatiereToProf, getListUser, getUserIdUserMatieres } from '../utils/Request'
import PropTypes from 'prop-types'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField
} from '@mui/material'
import { FaRegEdit, FaUser } from 'react-icons/fa'
import { Alert } from '../utils/Alert'

const AsignMatiereToProff = ({ open, handleClose, school_id, id, nomMatieres }) => {
  const [formData, setFormData] = useState({
    matiere_id: id,
    user_id: [],
    school_id
  })

  const { data: users = [] } = useQuery({
    queryKey: ['listUsers'],
    queryFn: () => getListUser({ school_id })
  })

  const { data: usersID = [] } = useQuery({
    queryKey: ['listUsersID', id],
    queryFn: () => getUserIdUserMatieres({ school_id, matiere_id: id })
  })

  const userIdItems = usersID.data ?? []

  useEffect(() => {
    const idsOnly = userIdItems.map((item) => item.user_id)

    setFormData((prev) => ({
      ...prev,
      matiere_id: id,
      user_id: idsOnly
    }))
  }, [userIdItems])

  const usersItems = users.data ?? []

  const selectedUser = useMemo(
    () => usersItems.filter((user) => formData.user_id.includes(user.id)),
    [usersItems, formData.user_id]
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

  const RenderMemberOption = memo(({ props, option }) => (
    <li {...props} key={option.id}>
      {option.username} | {option.firstname} | {option.lastname}
    </li>
  ))

  const RenderTag = memo(({ option, getTagProps, index }) => (
    <Chip
      label={option.firstname + ' ' + option.lastname}
      {...getTagProps({ index })}
      key={option.id}
      size="small"
      variant="outlined"
      sx={{
        borderColor: 'var(--secondary)'
      }}
    />
  ))

  const queryclient = useQueryClient()

  const mutation = useMutation({
    mutationFn: asingMatiereToProf,
    onSuccess: (data) => {
      if (data && data.success == false) {
        Alert('Erreur', data.message, 'error', 'OK', 'var(--primary)')
      } else {
        Alert('Action terminer', data.message, 'success', 'OK', 'var(--primary)')
        handleClose(true)
        queryclient.invalidateQueries({ queryKey: ['Matieres'] })
        queryclient.invalidateQueries({ queryKey: ['listUsersID'] })
      }
    },
    onError: (error) => {
      Alert('Erreur', error.message, 'error', 'OK', 'var(--primary)')
    }
  })

  const formSubmit = (e) => {
    e.preventDefault()
    // Vérification manuelle
    if (!formData.user_id || formData.user_id.length === 0) {
      Alert(
        'Attention',
        'Veuillez sélectionner au moins un enseignant',
        'warning',
        'OK',
        'var(--primary)'
      )
      return // On arrête tout ici
    }

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
      sx={{
        zIndex: 999
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: 'var(--primary)',
          fontWeight: 'bold'
        }}
      >
        Assigné {nomMatieres} a un ou plusieur enseignants
      </DialogTitle>
      <DialogContent
        dividers={true}
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Autocomplete
              multiple
              options={usersItems}
              value={selectedUser}
              getOptionLabel={(option) => option.firstname + ' ' + option.lastname || ''}
              filterOptions={filteredUser}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  user_id: newValue.map((user) => user.id)
                }))
              }}
              renderOption={(props, option) => <RenderMemberOption props={props} option={option} />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <RenderTag
                    key={option.id}
                    option={option}
                    getTagProps={getTagProps}
                    index={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="black"
                  label="Sélection des enseignants"
                  placeholder="Choisir une ou plusieur enseignants"
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
                      <>
                        <InputAdornment position="start">
                          <FaUser color="var(--secondary)" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
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
          startIcon={<FaRegEdit size={15} />}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  )
}
AsignMatiereToProff.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default AsignMatiereToProff
