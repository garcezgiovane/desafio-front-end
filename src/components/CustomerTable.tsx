import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useEffect } from "react";
import { api } from "../services/api";
import moment from "moment";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export interface ICustomer {
  id: number;
  fullName: string;
  cpf: string;
  birthDate: moment.Moment;
  addresses: Array<iAddress>;
}

export interface iAddress {
  id: number;
  streetAddress: string;
  houseNumber: string;
}

export default function CustomerTable({
  handleClickOpen,
  handleEditCustomer,
  customers,
  getCustomers,
}: {
  handleClickOpen: () => void;
  handleEditCustomer: (customer: ICustomer) => void;
  customers: ICustomer[];
  getCustomers: () => void;
}) {
  const classes = useStyles();

  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteCustomer(idCustomer: number) {
    await api.delete(`/customers/${idCustomer}`);
    getCustomers();
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nome</StyledTableCell>
            <StyledTableCell align="right">CPF</StyledTableCell>
            <StyledTableCell align="right">Data nascimento</StyledTableCell>
            <StyledTableCell align="right">Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((row: ICustomer, index: number) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.fullName}
              </StyledTableCell>
              <StyledTableCell align="right">{row.cpf}</StyledTableCell>
              <StyledTableCell align="right">
                {moment(row.birthDate).format("DD/MM/YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                <IconButton
                  onClick={() => {
                    handleClickOpen();
                    handleEditCustomer(row);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteCustomer(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
