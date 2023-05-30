import * as React from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import { Box, positions } from '@mui/system'
import SchemaIcon from '@mui/icons-material/Schema'
import { useNavigate } from 'react-router-dom'
import IHomeProps from './types'
import mockData from '../../../mocks/mockDate'
import { useEffect, useState } from 'react'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}
type MockClaim = {
  id: number
  nodeUri: string
  name: string
  entType: string
  descrip: string
  image: null
  thumbnail: string
  edgesFrom: {
    id: number
    claimId: number
    startNodeId: number
    endNodeId: number
    label: string
    thumbnail: null
    claim: {
      id: number
      subject: string
      claim: string
      object: string
      amt: null
      aspect: string
      author: null
      claimAddress: null
      confidence: number
      createdAt: string
      curator: null
      dateObserved: null
      digestMultibase: null
      effectiveDate: null
      howKnown: string
      howMeasured: null
      intendedAudience: null
      issuerId: string
      issuerIdType: string
      lastUpdatedAt: string
      proof: null
      respondAt: null
      score: number
      sourceURI: string
      stars: null
      statement: string
      unit: null
    }
    startNode: {
      id: number
      nodeUri: string
      name: string
      entType: string
      descrip: string
      image: null
      thumbnail: string
    }
    endNode: {
      id: number
      nodeUri: string
      name: string
      entType: string
      descrip: string
      image: null
      thumbnail: string
    }
  }[]
  edgesTo: never[]
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const FeedClaim = ({ toggleSnackbar, setSnackbarMessage, setLoading }: IHomeProps) => {
  const navigate = useNavigate()
  const [claims, setClaims] = useState<MockClaim[]>([])

  useEffect(() => {
    setClaims(mockData.nodes)
  }, [])

  const formatClaimText = (node: MockClaim) => {
    return node.edgesFrom.map(edge => {
      const Style = { color: '#009688' } // Define the style object for the subject
      const subject = <span style={Style}>{edge.startNode.nodeUri}</span>
      const claimText = <span style={Style}>{edge.claim.claim}</span>
      const source = <span style={Style}>{edge.endNode.nodeUri}</span>
      return (
        <>
          {subject} claimed {claimText} about {source}
        </>
      )
    })
  }

  const [expanded, setExpanded] = React.useState<number | null>(null)
  const handleExpandClick = (index: number) => {
    if (expanded === index) {
      setExpanded(null)
    } else {
      setExpanded(index)
    }
  }

  return (
    <Box
      sx={{
        position: 'center',
        justifyContent: 'center',
        width: '75%',
        p: '10px',
        background: '#FFFFFF',
        ml: '130',
        mt: '90px',
        boxShadow: 20,
        bgcolor: 'background.paper',
        flexDirection: 'column'
      }}
    >
      {claims.map((claim, index) => (
        <div key={claim.id}>
          <Card
            sx={{
              maxWidth: 'fit',
              height: 'fit',
              m: '20px',
              borderRadius: '20px',
              border: '2px solid #009688',
              display: 'flex'
            }}
          >
            <CardContent>
              <Typography sx={{ padding: '5px 0 0 5px' }}>{formatClaimText(claim)}</Typography>
            </CardContent>

            <Collapse in={expanded === index} timeout='auto' unmountOnExit>
              <CardContent sx={{ display: 'block' }}></CardContent>
            </Collapse>

            <CardActions disableSpacing sx={{ marginLeft: 'auto', marginTop: 'auto', display: 'block' }}>
              <SchemaIcon sx={{ color: 'primary.main', right: 0 }} onClick={() => navigate('/search?query=hi')} />
              <ExpandMore
                expand={expanded === index}
                onClick={() => handleExpandClick(index)}
                aria-expanded={expanded === index}
                aria-label='show more'
                sx={{ marginLeft: 'auto', display: 'block', right: '10px' }}
              >
                <ExpandCircleDownIcon sx={{ color: 'primary.main' }} />
              </ExpandMore>
            </CardActions>
          </Card>
        </div>
      ))}
    </Box>
  )
}

export default FeedClaim
