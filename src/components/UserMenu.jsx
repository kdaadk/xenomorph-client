import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useStravaAuth } from "../customHooks/useStravaAuth";
import stravaApi from "../shared/strava";
import { authStrava, getStravaActivities } from "../shared/stravaActions";
import { makeStyles } from "@material-ui/core/styles";

export const UserMenu = () => {
  const { anchorEl, handleClick, handleClose } = useAnchorEl();
  let stravaClient = useStravaAuth(stravaApi);
  const classes = useStyles();

  const handleClickAuth = () => {
    authStrava(stravaApi);
    handleClose();
  };

  const handleClickGetLastActivities = () => {
    getStravaActivities(stravaClient).then(() => handleClose());
  };

  return (
    <span className="icon">
      <Button
        className={classes.root}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FaceTwoToneIcon fontSize="large" viewBox="0 0 22 22" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <MenuItem onClick={handleClickAuth}>Auth Strava</MenuItem>
        <MenuItem onClick={handleClickGetLastActivities}>
          Get last activities
        </MenuItem>
        <MenuItem onClick={handleClickAuth}>Choose period</MenuItem>
      </Menu>
    </span>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    float: "left",
    color: "#3f51b5",
    "margin-left": "3.3%"
  }
}));

const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return { anchorEl, handleClick, handleClose };
};
