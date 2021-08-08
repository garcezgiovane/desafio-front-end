import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import AddCustomerButton from "../components/AddCustomerButton";
import CustomerTable, { ICustomer } from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    ICustomer | undefined
  >(undefined);

  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleEditCustomer = (customer: ICustomer | undefined) => {
    setSelectedCustomer(customer);
  };

  const handleClose = () => {
    setSelectedCustomer(undefined);
    setOpen(false);
  };

  async function getCustomers() {
    const response = await api.get("/customers");
    console.log(response.data);
    setCustomers(response.data);
  }

  return (
    <Grid container spacing={6} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <Header />
      </Grid>
      <Grid item xs={12} md={12} lg={10}>
        <CustomerTable
          handleClickOpen={handleClickOpen}
          handleEditCustomer={handleEditCustomer}
          customers={customers}
          getCustomers={getCustomers}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={10}>
        <AddCustomerButton handleClickOpen={handleClickOpen} />
      </Grid>
      <Grid item xs={12} md={12} lg={10}>
        <CustomerForm
          open={open}
          handleClose={handleClose}
          selectedCustomer={selectedCustomer}
          getCustomers={getCustomers}
        />
      </Grid>
    </Grid>
  );
}
