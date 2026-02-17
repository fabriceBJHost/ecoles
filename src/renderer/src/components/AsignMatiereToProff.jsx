import { useQuery } from '@tanstack/react-query'
import { getListUser } from '../utils/Request'
import PropTypes from 'prop-types'

const AsignMatiereToProff = ({ open, handleClose, school_id, id }) => {
  const { data: users = [] } = useQuery({
    queryKey: ['listUsers'],
    queryFn: () => getListUser({ school_id })
  })

  return (
    <div>AsignMatiereToProff</div>
  )
}
AsignMatiereToProff.propTypes = {
  open: PropTypes.bool.isRequired,
  school_id: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default AsignMatiereToProff
