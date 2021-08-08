import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
      textAlign: "right",
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

export default function AddCustomerButton({
  handleClickOpen,
}: {
  handleClickOpen: () => void;
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add" onClick={() => handleClickOpen()}>
        <AddIcon />
      </Fab>
    </div>
  );
}
