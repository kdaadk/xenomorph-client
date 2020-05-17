import React, { Component } from "react";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Backdrop from "@material-ui/core/Backdrop";

export class Test extends Component {
  static displayName = Test.name;
  state = {
    openModal: false
  };

  setModalState = value => this.setState({ openModal: value });

  render() {
    const { openModal } = this.state;
    return (
      <div>
        <button onClick={() => this.setModalState(true)}>sections</button>
        {openModal && (
          <TransitionsModal
            openModal={openModal}
            setModalState={this.setModalState}
          />
        )}
      </div>
    );
  }
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(Boolean(props.openModal));

  const handleClose = () => {
    props.setModalState(false);
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">Transition modal</h2>
          <p id="transition-modal-description">
            react-transition-group animates me.
          </p>
        </div>
      </Fade>
    </Modal>
  );
}
