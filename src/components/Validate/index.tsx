import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { TextField, Button, MenuItem, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import IHomeProps from '../../containers/Form/types'
import { useForm } from 'react-hook-form'
import { useCreateClaim } from '../../hooks/useCreateClaim'
import Tooltip from '@mui/material/Tooltip'
import { useQueryParams } from '../../hooks'
import Dialog from '@mui/material/Dialog'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Loader from '../Loader'
import DialogContentText from '@mui/material/DialogContentText'
import React, { useEffect, useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import axios from '../../axiosInstance'

const Validate = ({ toggleSnackbar, setSnackbarMessage }: IHomeProps) => {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const queryParams = useQueryParams()
  const [subjectValue, setSubjectValue] = useState('')
  const [claimVerbValue, setClaimVerbValue] = useState('')
  const [statementValue, setStatementValue] = useState('')
  const [objectValue, setObjectValue] = useState('')
  const [amtValue, setAmtValue] = useState('')
  const [effectiveDateValue, setEffectiveDateValue] = useState('')
  const [priceInputValue, setPriceInputValue] = useState('')
  const subject = queryParams.get('subject')

  const toggleExpansion = () => {
    setExpanded(!expanded)
  }

  const handleAspectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value
    setPriceInputValue(selectedValue)
  }

  if (subject) {
    const parts = subject.split('/')
    var number = parts[parts.length - 1] || undefined
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        var res = await axios.get(`/api/claim/${number}`)
        console.log(res.data)
        setSubjectValue(res.data.subject)
        setClaimVerbValue(res.data.claim)
        setStatementValue(res.data.statement)
        setObjectValue(res.data.object)
        setAmtValue(res.data.amt)
        setEffectiveDateValue(res.data.effectiveDate)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [number])

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue
  } = useForm({
    defaultValues: {
      subject: subject as string,
      claim: 'rated',
      statement: '' as string,
      aspect: '' as string,
      howKnown: '' as string,
      effectiveDate: new Date(),
      stars: null as number | null
    }
  })

  const { createClaim } = useCreateClaim()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async ({ subject, claim, statement, aspect, howKnown, effectiveDate, stars }) => {
    if (subject && claim) {
      const starsAsNumber = Number(stars)
      const effectiveDateAsString = effectiveDate.toISOString()

      const payload = {
        subject,
        claim,
        statement,
        aspect,
        howKnown,
        effectiveDate: effectiveDateAsString,
        stars: starsAsNumber
      }

      setLoading(true)

      const { message, isSuccess } = await createClaim(payload) // Change this line

      setLoading(false)
      toggleSnackbar(true)
      setSnackbarMessage(message)
      if (isSuccess) {
        setDialogOpen(true)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setDialogOpen(false)
          navigate('/feed')
        }, 3000)
        reset()
      } else {
        setLoading(false)
        toggleSnackbar(true)
        setSnackbarMessage('Subject and Claims are required fields.')
      }
    }
  })

  const watchEffectiveDate = watch('effectiveDate')

  const inputOptions = {
    aspect: [
      'validate first hand',
      'validate from source',
      'received direct benefit',
      'reject first hand',
      'reject from source'
    ],
    howKnown: [
      'first_hand',
      'second_hand',
      'website',
      'verified_website',
      'verified_login',
      'signed_claim',
      'blockchain',
      'physical_document',
      'integration'
    ]
  }

  return (
    <>
      <Loader open={loading} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
          width: '100%',
          padding: '2rem',
          maxWidth: '830px',
          marginTop: { xs: 15, md: 8 },
          background: '#FFFFFF',
          boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.25)',
          zIndex: 20,
          borderRadius: '10px',
          margin: '0'
        }}
      >
        <Box sx={{}}>
          <Typography
            variant='h4'
            sx={{
              textAlign: 'center',
              fontSize: '20px',
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            {`Welcome!  We value your input, thank you for helping keep it real`}
          </Typography>
        </Box>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'row', borderTop: '3px solid #009688' }}>
          <Box sx={{ width: '50%', borderRight: '3px solid #009688' }}>
            <Typography
              variant='h4'
              sx={{
                textAlign: 'center',
                fontSize: '20px',
                color: 'primary.main',
                fontWeight: 'bold',
                mb: '20px',
                mt: '20px'
              }}
            >
              {`We have a claim that`}
            </Typography>
            <Box
              sx={{
                width: '100%',
                color: 'primary.main',
                fontSize: '20px',
                fontWeight: 'bold',
                '& > *': { margin: '11px 0' }
              }}
            >
              <Typography variant='h5'>{`subject: ${subjectValue}`}</Typography>
              <Typography variant='h5'>{`claim: ${claimVerbValue}`}</Typography>
              {statementValue && (
                <Box sx={{ display: 'flex', margin: '0' }}>
                  <Typography
                    variant='h5'
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: expanded ? 'unset' : 4,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {`statement: ${statementValue}`}
                  </Typography>
                  <Box onClick={toggleExpansion} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'start' }}>
                    {expanded ? (
                      <>
                        <ExpandLessIcon />
                      </>
                    ) : (
                      <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ExpandMoreIcon />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              {objectValue && <Typography variant='h5'>{`object: ${objectValue}`}</Typography>}
              {amtValue && <Typography variant='h5'>{`amt: ${amtValue}`}</Typography>}
              {effectiveDateValue && <Typography variant='h5'>{`effectiveDate: ${effectiveDateValue}`}</Typography>}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '50%', rowGap: 1, m: 1 }}>
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: '20px',
                color: 'primary.main',
                fontWeight: 'bold',
                mt: '10px'
              }}
            >
              Do you know anything about this?
            </Typography>
            <Box sx={{ width: '95%' }}>
              <Tooltip title='What aspect is this rating about?' placement='right' arrow>
                <TextField
                  select
                  label='Choices'
                  {...register('aspect')}
                  margin='dense'
                  variant='outlined'
                  fullWidth
                  defaultValue={'validate first hand'}
                  onChange={handleAspectChange}
                >
                  {inputOptions.aspect.map((aspectText: string, index: number) => (
                    <MenuItem value={aspectText} key={aspectText}>
                      <Box sx={{ width: '100%', height: '100%' }}>{aspectText}</Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
              {priceInputValue === 'received direct benefit' && (
                <FormControl {...register('howKnown')} fullWidth sx={{ mt: 1, width: '100%' }}>
                  <InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-amount'
                    startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                    label='Amount'
                  />
                </FormControl>
              )}
              {priceInputValue === 'validate from source' && (
                <FormControl {...register('howKnown')} fullWidth sx={{ mt: 1, width: '100%' }}>
                  <InputLabel htmlFor='outlined-adornment-amount'>Source</InputLabel>
                  <OutlinedInput id='outlined-adornment-amount' label='Source' />
                </FormControl>
              )}
            </Box>
            <Tooltip title='write more information here ' placement='right' arrow>
              <TextField
                {...register('statement')}
                placeholder={
                  'Type If received benefit and If  you read or heard about it what was your source If other write your relation to the claim'
                }
                sx={{ ml: 1, mr: 1, width: '40ch' }}
                margin='dense'
                variant='outlined'
                fullWidth
                label='explain here'
                key='statement'
                type='text'
                multiline={true}
                rows={4}
                maxRows={6}
              />
            </Tooltip>{' '}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Effective Date'
                value={watchEffectiveDate}
                onChange={(newValue: any) => setValue('effectiveDate', newValue)}
                renderInput={(params: any) => (
                  <TextField {...params} sx={{ ml: 1, mr: 1, width: 600 }} variant='filled' />
                )}
              />
            </LocalizationProvider>
            <input type='hidden' value='first_hand' {...register('howKnown')} />
          </Box>
          <Dialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false)
              if (isFormSubmitted) {
                navigate('/feed')
              }
            }}
          >
            <DialogContentText sx={{ p: '30px' }}>Thank you for your submission!</DialogContentText>
          </Dialog>
        </form>

        <Button
          onClick={onSubmit}
          type='submit'
          variant='contained'
          size='large'
          sx={{
            ml: 1,
            mr: 1,
            width: '50%',
            bgcolor: 'praimary.main',
            margin: '0 auto',
            '&:hover': {
              backgroundColor: '#00695f'
            }
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  )
}

export default Validate
