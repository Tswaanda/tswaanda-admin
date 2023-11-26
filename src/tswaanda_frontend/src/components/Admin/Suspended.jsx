import React, { useEffect, useState } from 'react'
import {
    Box,
    Container,
    Typography,
    useTheme,
    Grid,
    CardActions,
    Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactStaff from './ContactStaff';
import UpdateAccessLevel from './UpdateAccessLevel';
import { useAuth } from '../../hooks/auth';
import { toast } from 'react-toastify';
import { formatDate } from '../../scenes/constants/index';

const Suspended = ({ expanded, handleChange }) => {
    const [suspendedStaff, setSuspendedStaff] = useState([])
    const { backendActor } = useAuth()
    const [updating, setUpdating] = useState(false)

    const theme = useTheme();
    const [showContact, setShowContactForm] = useState(false);
    const [showAccessForm, setShowAccessForm] = useState(false);

    const [openAccessModal, setAccessModal] = useState(false);
    const [openContactModal, setContactModal] = useState(false);

    const [member, setMember] = useState({});

    useEffect(() => {
        getSuspendedStaff()
    }, [])

    const getSuspendedStaff = async () => {
        try {
            let suspended = await backendActor.getSuspendedStaff()
            suspended = suspended.map((member) => {
                return {
                  ...member,
                  created: formatDate(member.created)
                }
              })
            setSuspendedStaff(suspended)
        } catch (error) {
            console.log("Error getting access request", error)
        }
    }

    const handleShowStatusForm = (member) => {
        setMember(member);
        setAccessModal(true)
        setShowAccessForm(!showAccessForm);
        setShowContactForm(false);
    }

    const showContactForm = (member) => {
        setMember(member);
        setShowContactForm(!showContact);
        setContactModal(true)
        setShowAccessForm(false);
    }

    const handleUnsuspend = async (memberToupdate) => {
        try {
            setUpdating(true)
            let updatedStaff = {
                ...memberToupdate,
                created: BigInt(Date.parse(memberToupdate.created)),
                role: [{ 'authorized': null }],
                suspended: false,
            }
            await backendActor.updateStaffMember(updatedStaff)
            await backendActor.assign_role(updatedStaff.principal, [{ 'authorized': null }])
            toast.success(
                `Staff member unsuspended successfully`,
                {
                  autoClose: 5000,
                  position: "top-center",
                  hideProgressBar: true,
                }
              );
            setUpdating(false)
            getSuspendedStaff()
        } catch (error) {
            setUpdating(false)
            console.log(error)
        }
    }

    return (
        <Box m="1rem 0 0 0">

            {suspendedStaff.length > 0 ? <>
                {suspendedStaff?.map((staff) => (
                    <Accordion
                        key={staff.id}
                        expanded={expanded === staff.id}
                        onChange={handleChange(staff.id)}
                        sx={{ backgroundColor: theme.palette.background.alt }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: "25%", flexShrink: 0 }}>
                                <span style={{ fontWeight: "bold" }}>Username</span>: @
                                {staff.fullName}
                            </Typography>
                            <Typography
                                sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                            >
                                <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                                {staff.email}
                            </Typography>

                            <Typography sx={{ color: "text.secondary", width: "25%" }}>
                                <span style={{ fontWeight: "bold" }}>Created at</span>:{" "}
                                {staff.created}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                sx={{
                                    backgroundImage: "none",
                                    backgroundColor: theme.palette.background.alt,
                                    borderRadius: "0.55rem",
                                }}
                            >
                                <Container maxWidth="md" style={{ marginTop: "2rem" }}>
                                    <Grid
                                        container
                                        style={{ display: "flex", alignItems: "center" }}
                                        spacing={4}
                                        m="0 0.1rem 0 0.1rem"
                                    >
                                        <Grid
                                            style={{ display: "flex", alignItems: "center" }}
                                            staff
                                            xs={6}
                                        >
                                            <Typography
                                                style={{ fontSize: "2rem", fontWeight: "bold" }}
                                            >
                                                {staff.fullName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <hr />
                                    <AccordionSummary
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography
                                            sx={{
                                                width: "50%",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                                            {staff.phone}
                                        </Typography>
                                    </AccordionSummary>
                                    <hr />
                                    <CardActions>
                                        <Button
                                            onClick={
                                                () => handleShowStatusForm(staff)
                                            }
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    showAccessForm
                                                        ? "white"
                                                        : undefined,
                                                color:
                                                    showAccessForm
                                                        ? "green"
                                                        : "white",
                                            }}
                                        >
                                            Update Access Level
                                        </Button>
                                        <Button
                                            onClick={
                                                () => showContactForm(staff)
                                            }
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    showContact
                                                        ? "white"
                                                        : undefined,
                                                color:
                                                    showContact
                                                        ? "green"
                                                        : "white",
                                            }}
                                        >
                                            Contact Member
                                        </Button>
                                        <Button
                                            onClick={
                                                () => handleUnsuspend(staff)
                                            }
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                backgroundColor: "#FF5733",
                                                color: "white",
                                            }}
                                        >
                                            {updating ? "Updating..." : "Unsuspend Member"}
                                        </Button>
                                    </CardActions>
                                </Container>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
                <>

                    {showAccessForm && (
                        <UpdateAccessLevel {...{
                            openAccessModal, setAccessModal, setShowAccessForm, theme, member
                        }} />
                    )}
                    {showContact && (
                        <ContactStaff {...{ openContactModal, setContactModal, setShowContactForm, theme, member }} />
                    )}
                </>
            </> :
                <Typography variant="h5" style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginTop: "100px" }}>No data to show for now</Typography>
            }
        </Box >
    )
}

export default Suspended