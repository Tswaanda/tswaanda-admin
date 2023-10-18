import React, { useState } from 'react'
import {
  Box,
  useTheme,
} from "@mui/material";

import Canister from './Canister';

// const canistersArray = [
//   {
//     name: 'file_scaling_manager',
//     id: '7t3jl-kyaaa-aaaal-qcamq-cai',
//   },
//   {
//     name: 'file_storage',
//     id: '72ycx-4qaaa-aaaal-qcana-cai',
//   },
//   {
//     name: 'tswaanda_backend',
//     id: '56r5t-tqaaa-aaaal-qb4gq-cai',
//   },
//   {
//     name: 'tswaanda_frontend',
//     id: '5xswp-fyaaa-aaaal-qb4ha-cai',
//   },
//   {
//     name :"marketplace_backend",
//     id: "55ger-liaaa-aaaal-qb33q-cai"
//   },
//   {
//     name: "marketplace_frontend",
//     id: "4qia7-eaaaa-aaaal-qb34a-cai"
//   }
// ]
const canistersArray = [
  {
    name: 'file_scaling_manager',
    id: 'bkyz2-fmaaa-aaaaa-qaaaq-cai',
  },
  {
    name: 'file_storage',
    id: 'be2us-64aaa-aaaaa-qaabq-cai',
  },
  {
    name: 'tswaanda_backend',
    id: 'bw4dl-smaaa-aaaaa-qaacq-cai',
  },
  {
    name: 'frontend',
    id: 'b77ix-eeaaa-aaaaa-qaada-cai',
  }
]

const Canisters = () => {
  const theme = useTheme();
  const [canisters, setCanisters] = useState(canistersArray)
  const [unauthorized, setUnauthorized] = useState(false)
  return (
    <Box m="1rem 0 0 0">
  {unauthorized ? <h2>
    You need to be a canisters controller to view this information
  </h2> :  <>
   {canisters?.map((canister, index) => (
     <Canister key={index} {...{canister, unauthorized, setUnauthorized}}/>
    ))}
   </>}
  </Box>
  )
}

export default Canisters