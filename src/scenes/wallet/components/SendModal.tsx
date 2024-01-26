import React,  { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

  const SendModal = ({isOpen, onClose, onSend}) => {

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    onSend(address, amount);
    onClose(); // Close modal after sending
  };

  if (!isOpen) return null;
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
              Send Transaction
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Crypto Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">Cancel</Button>
                <Button onClick={handleSend} variant="contained" color="success">Send</Button>
            </DialogActions>
    </Dialog>
  )
}

export default SendModal