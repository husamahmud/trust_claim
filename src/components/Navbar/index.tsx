import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ProfileDropdown from '../profileDropDown/index'
import { IconButton, InputBase, Paper, useMediaQuery } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState, useRef } from 'react'
import Responsive from './Responsive'
import SearchBar from '../../containers/SearchBar'

const Navbar = ({ isAuth }: any) => {
  const navigate = useNavigate()
  const search = useLocation().search
  const ref = useRef<any>(null)
  const query = new URLSearchParams(search).get('query')
  const [searchVal, setSearchVal] = useState<string>(query || '')
  const page = useRef(1)

  const handleSearch = async () => {
    window.localStorage.removeItem('claims')
    if (searchVal.trim() !== '') {
      navigate({
        pathname: '/search',
        search: `?query=${searchVal}`
      })
    }
  }

  const handleSearchKeypress = async (event: any) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const isSmallScreen = useMediaQuery('(max-width:819px)')

  return (
    <>
      <Box>
        <AppBar position='fixed' sx={{ backgroundColor: '#eeeeee', color: '#280606' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant='h5'
              component='div'
              sx={{
                fontWeight: 'bold'
              }}
            >
              Trust Claims
            </Typography>
            {isSmallScreen ? (
              isAuth ? (
                <ProfileDropdown />
              ) : (
                <Responsive />
              )
            ) : (
              <>
                <SearchBar />

                {isAuth && <ProfileDropdown />}
                {!isAuth && (
                  <Box>
                    <Button sx={{ pr: '30px' }} color='inherit' onClick={() => navigate('/login')}>
                      Login
                    </Button>
                    <Button sx={{ pr: '30px' }} color='inherit' onClick={() => navigate('/register')}>
                      Register
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Navbar
