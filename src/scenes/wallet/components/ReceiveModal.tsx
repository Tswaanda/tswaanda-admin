import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DialogTitle, DialogContent, Typography, IconButton, Grid, Paper } from '@mui/material';

const ReceiveModal = ({isOpen, onClose}) => {

  const [cryptoAddress, setCryptoAddress] = useState('');

  const generateAddress = () => {
    
    setCryptoAddress('r7en5-65748-d7jph-67pat-iqvta-uskv3-luevt-4rjvo-3o56d-x7q5y-uqe');
};

  useEffect(() => {
    setCryptoAddress('r7en5-tnz2w-d7jph-7392h-uskv3-luevt-4rjvo-3o56d-x7q5y-w56');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(cryptoAddress);
  }   

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm" 
      PaperProps={{
        sx: {
          width: '80%', 
          padding: '10px',
          backgroundColor: '#333333', 
        }
  }}
    >
      <DialogTitle
                sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "green",
                }}
            >
                Receive Funds
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1">{cryptoAddress}</Typography>
                            <IconButton onClick={handleCopy} color="primary">
                                <ContentCopyIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                        <Button variant="contained" onClick={generateAddress} color="primary">
                            Generate Address
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
    </Dialog>
  )
}

export default ReceiveModal