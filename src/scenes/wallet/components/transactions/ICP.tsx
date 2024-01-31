import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatAddress } from "../../utils/utils";
import { transactions } from "../../utils/constants";

const ICP = () => {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{
        marginTop: "10px",
        backgroundColor: theme.palette.background.default,
      }}
      component={Paper}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              Txn Hash
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              Type
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              Amount
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              Timestamp
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              From
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "15px" }}
              align="left"
            >
              To
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.txnHash}>
              <TableCell align="left">
                <a
                  href={`https://dashboard.internetcomputer.org/transaction/${transaction.txnHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{textDecoration: "none", color: "white" }}
                >
                  {formatAddress(transaction.txnHash)}
                </a>
              </TableCell>
              <TableCell align="left"><span style={{fontWeight: "bold"}}>{transaction.amount}</span>{" "}ICP</TableCell>
              <TableCell align="left">{transaction.type}</TableCell>
              <TableCell align="left">{transaction.timestamp}</TableCell>
              <TableCell align="left">{formatAddress(transaction.from)}</TableCell>
              <TableCell align="left">{formatAddress(transaction.to)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ICP;
