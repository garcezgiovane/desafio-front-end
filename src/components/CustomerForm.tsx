import React, { ChangeEvent, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { api } from "../services/api";
import { ICustomer } from "./CustomerTable";
import { useEffect } from "react";

moment.locale("pt-br");

const useStyles = makeStyles(
  createStyles({
    alignRemoveButton: {
      textAlign: "center",
    },
    disabledButton: {
      display: "none",
    },
    dialogPaper: {
      minHeight: "50vh",
    },
    newAddress: {
      textAlign: "right",
    },
    dialogContent: {
      overflowX: "hidden",
    },
  })
);

export default function CustomerForm({
  open,
  handleClose,
  selectedCustomer,
  getCustomers,
}: {
  open: boolean;
  handleClose: () => void;
  selectedCustomer: ICustomer | undefined;
  getCustomers: () => void;
}) {
  const classes = useStyles();

  const [customerData, setCustomerData] = useState({
    fullName: "",
    cpf: "",
    birthDate: moment(new Date()),
    addresses: [{ streetAddress: "", houseNumber: "" }],
  });

  useEffect(() => {
    if (selectedCustomer !== undefined) {
      setCustomerData(selectedCustomer);
    } else {
      setCustomerData({
        fullName: "",
        cpf: "",
        birthDate: moment(new Date()),
        addresses: [{ streetAddress: "", houseNumber: "" }],
      });
    }
  }, [selectedCustomer, setCustomerData]);

  function clearForm() {
    setCustomerData({
      fullName: "",
      cpf: "",
      birthDate: moment(new Date()),
      addresses: [{ streetAddress: "", houseNumber: "" }],
    });
  }

  function handleAddress(event: string, index: number, e: ChangeEvent) {
    const addresses = [...customerData.addresses];
    addresses[index] = {
      ...addresses[index],
      [e.target.id]: event,
    };
    setCustomerData({ ...customerData, addresses: [...addresses] });
  }

  function addNewAddress() {
    const addresses = [...customerData.addresses];
    addresses.push({ streetAddress: "", houseNumber: "" });
    setCustomerData({ ...customerData, addresses: [...addresses] });
  }

  function removeAddress(index: number) {
    const addresses = [...customerData.addresses];
    addresses.splice(index, 1);
    setCustomerData({ ...customerData, addresses: [...addresses] });
  }

  async function handleCustomer() {
    await api.post("/customers", customerData);
    handleClose();
    clearForm();
    getCustomers();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="lg"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="form-dialog-title">Cadastrar novo cliente</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              variant="outlined"
              margin="dense"
              id="name"
              label="Nome"
              value={customerData.fullName}
              onChange={(e) =>
                setCustomerData({ ...customerData, fullName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              margin="dense"
              id="cpf"
              label="Cpf"
              value={customerData.cpf}
              onChange={(e) =>
                setCustomerData({ ...customerData, cpf: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk
                variant="inline"
                inputVariant="outlined"
                margin="dense"
                format="DD/MM/yyyy"
                id="birthDate"
                label="Data de nascimento"
                value={customerData.birthDate}
                onChange={(date) =>
                  setCustomerData({
                    ...customerData,
                    birthDate: moment(date),
                  })
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h6">Endereços</Typography>
          </Grid>
          <Grid item xs={12} className={classes.newAddress}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              endIcon={<AddIcon />}
              onClick={() => addNewAddress()}
            >
              Novo endereço
            </Button>
          </Grid>
          {customerData.addresses.map((address, index) => (
            <Grid
              container
              spacing={4}
              key={index}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={10} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  id="streetAddress"
                  label="Nome da rua"
                  value={address.streetAddress}
                  onChange={(e) => handleAddress(e.target.value, index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={10} sm={3} md={3} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  id="houseNumber"
                  label="Número"
                  value={address.houseNumber}
                  onChange={(e) => handleAddress(e.target.value, index, e)}
                  fullWidth
                />
              </Grid>
              {index !== 0 ? (
                <Grid
                  item
                  xs={12}
                  sm={1}
                  md={1}
                  lg={1}
                  className={classes.alignRemoveButton}
                >
                  <IconButton onClick={() => removeAddress(index)}>
                    <RemoveCircleOutlineIcon color="secondary" />
                  </IconButton>
                </Grid>
              ) : (
                <Grid item xs={12} sm={1} md={1} lg={1}>
                  <IconButton className={classes.disabledButton}>
                    <RemoveCircleOutlineIcon color="secondary" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
        <Button
          onClick={() => handleCustomer()}
          color="primary"
          variant="outlined"
        >
          Gravar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
