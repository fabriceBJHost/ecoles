import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import {
  FaStickyNote,
  FaTachometerAlt,
  FaUserFriends,
  FaUserGraduate,
  FaUserShield
} from 'react-icons/fa'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { DataGrid } from '@mui/x-data-grid'
import { frFR } from '@mui/x-data-grid/locales'
import CustomToolbar from '../components/CustomToolbar'
import { ThemeProvider } from '@mui/material/styles'
import { appTheme } from '../utils/theme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Home = () => {
  const fakerHead = [
    {
      title: 'Total Surveillants',
      description: 12,
      icon: <FaUserShield size={20} color="#f39c12" />
    },
    {
      title: 'Total Enseignants',
      description: 25,
      icon: <FaUserFriends size={20} color="#27ae60" />
    },
    {
      title: 'Total Elèves',
      description: 1039,
      icon: <FaUserGraduate size={20} color="#e74c3c" />
    },
    {
      title: "Moyenne Général de l'école",
      description: 14.67,
      icon: <FaStickyNote size={20} color="#2980b9" />
    }
    // {
    //   title: 'Membres',
    //   description: header.membres?.current,
    //   icon: <FaUserFriends size={20} color="#8e44ad" />, // Violet (communauté, social)
    //   stat: header.membres?.difference
    // },
    // {
    //   title: 'Visiteurs',
    //   description: header.visitors?.current,
    //   icon: <FaBookReader size={20} color="#16a085" />, // Vert-bleu (nouveauté, apprentissage)
    //   stat: header.visitors?.difference
    // },
    // {
    //   title: 'Livres vendus',
    //   description: formatCurrency(header.ventes?.current),
    //   icon: <FaDollarSign size={20} color="#2ecc71" />, // Vert (argent gagné, succès)
    //   stat: header.ventes?.difference
    // },
    // {
    //   title: 'Prêt er retard',
    //   description: formatCurrency(header.pret?.current),
    //   icon: <FaMoneyBill size={20} color="#f1c40f" />, // Jaune-or (argent en attente, valeur)
    //   stat: header.pret?.difference
    // }
  ]
  // 1039
  const retard = [22, 11, 20, 9, 14]
  const absents = [4, 15, 4, 7, 5]

  const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  const data = {
    labels,
    datasets: [
      {
        label: 'retards',
        data: retard, // 🔥 exemple
        borderColor: '#D69E2E',
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        tension: 0.3, // courbes arrondies
        fill: true,
        pointBackgroundColor: '#D69E2E',
        pointRadius: 5
      },
      {
        label: 'absents',
        data: absents, // 🔥 exemple
        borderColor: '#E53E3E',
        backgroundColor: '#e53e3e69',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#E53E3E',
        pointRadius: 5
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#718096'
        }
      },
      title: {
        display: true,
        text: 'Statistiques hebdomadaires des élèves en retards et absents',
        font: { size: 16 },
        color: '#2C5282'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 50 }
      }
    }
  }

  const column = [
    {
      field: 'nom',
      headerName: 'Nom',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'retard',
      headerName: 'Retard',
      headerAlign: 'center',
      align: 'center',
      width: 80,
      sortable: false
    },
    {
      field: 'number',
      headerName: 'Contact des parents',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    }
  ]

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
            <FaTachometerAlt size={27} style={{ fontWeight: 'bold' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Tableau de bord
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'var(--secondary)', marginTop: '15px' }} />
      <Grid container spacing={2} mt={3}>
        {fakerHead.map((item, index) => (
          <Grid size={{ lg: 3, md: 4, sm: 4 }} key={index}>
            <Card
              sx={{
                p: 2,
                borderRadius: '16px',
                boxShadow: 2,
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: '0.2s',
                cursor: 'pointer'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                {/* Left Side: Title */}
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'var(--secondary)', fontWeight: 'bold' }}
                >
                  {item.title}
                </Typography>
                {/* Right Side: Icon */}
                <div>{item.icon}</div>
              </Box>
              {/* Description below */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontWeight: 'bold', fontSize: 20 }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12 }} sx={{ display: 'flex' }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Line data={data} options={options} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xl: 6, lg: 6, md: 12, sm: 12 }} sx={{ display: 'flex' }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <ThemeProvider theme={appTheme}>
                <DataGrid
                  columns={column}
                  rows={[]}
                  showToolbar
                  // loading={pendingRetard}
                  slots={{
                    toolbar: CustomToolbar
                  }}
                  slotProps={{
                    toolbar: {
                      label: 'Elèves en retard plus de 5 fois'
                    }
                  }}
                  disableRowSelectionOnClick
                  localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                  density="compact"
                  // hideFooter={true}
                />
              </ThemeProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home
