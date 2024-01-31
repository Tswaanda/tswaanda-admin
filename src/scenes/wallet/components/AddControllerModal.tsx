import React,  { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddControllersModal = ({isOpen, onClose}) => {
  const [controller, setController] = useState('');
  
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
              Add Controller
            </DialogTitle>
            <DialogContent
              
            >
                <TextField
                    autoFocus
                    margin="dense"
                    label="Controller Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={controller}
                    onChange={(e) => setController(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="success">Add Controller</Button>
            </DialogActions>
    </Dialog>
  )
}

export default AddControllersModal