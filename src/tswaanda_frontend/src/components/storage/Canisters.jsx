import React from 'react'
import {
  Box,
  useTheme,
} from "@mui/material";

import Canister from './Canister';

const canistersArray = [
  {
    name: 'file_scaling_manager',
    id: '7t3jl-kyaaa-aaaal-qcamq-cai',
  },
  {
    name: 'file_storage',
    id: '72ycx-4qaaa-aaaal-qcana-cai',
  },
  {
    name: 'tswaanda_backend',
    id: '56r5t-tqaaa-aaaal-qb4gq-cai',
  },
  {
    name: 'tswaanda_frontend',
    id: '5xswp-fyaaa-aaaal-qb4ha-cai',
  },
  {
    name :"marketplace_backend",
    id: "55ger-liaaa-aaaal-qb33q-cai"
  },
  {
    name: "marketplace_frontend",
    id: "4qia7-eaaaa-aaaal-qb34a-cai"
  }
]

const Canisters = () => {
  const theme = useTheme();
  const [canisters, setCanisters] = React.useState(canistersArray)
  return (
    <Box m="1rem 0 0 0">
    {canisters?.map((canister, index) => (
     <Canister key={index} {...{canister}}/>
    ))}
  </Box>
  )
}

export default Canisters