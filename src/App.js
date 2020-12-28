import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ViewListIcon from "@material-ui/icons/ViewList";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./App.css";

const ColorButton = withStyles((theme) => ({
  root: {
    position: "relative",
    borderRadius: "8px",
    marginLeft: "20px",
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

function App() {
  const [listOfEvents, setlistOfEvents] = useState([]);
  const [categories, setcategories] = useState([]);
  const [currentCategory, setcurrentCategory] = useState("");
  const [isGrid, setisGrid] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    fetch("https://allevents.s3.amazonaws.com/tests/categories.json")
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setcategories(response);
        console.log("Inside category events call...");
      });
  }, []);

  const getEvents = (category) => {
    let url = "https://allevents.s3.amazonaws.com/tests/all.json";

    if (category === "all")
      url = "https://allevents.s3.amazonaws.com/tests/all.json";
    else if (category === "music")
      url = "https://allevents.s3.amazonaws.com/tests/music.json";
    else if (category === "business")
      url = "https://allevents.s3.amazonaws.com/tests/business.json";
    else if (category === "sports")
      url = "https://allevents.s3.amazonaws.com/tests/sports.json";
    else url = "https://allevents.s3.amazonaws.com/tests/workshops.json";

    console.log(category);
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        console.log(response.item);

        setlistOfEvents(response.item);
        console.log("Inside getting events call...");
      });
  };
  
  const handleViewGrid = () => {
    setisGrid(true);
  };

  const handleViewList = () => {
    setisGrid(false);
  };

  function ViewEvents(e, index) {
    console.log(isGrid);

    if (!isGrid) {
      return (
        <div key={index} className="listview">
          <List className="MuiList-root makeStyles-root-1 MuiList-padding">
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={e.thumb_url} />
              </ListItemAvatar>
              <ListItemText
                primary={e.eventname_raw}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    ></Typography>
                    {e.venue.full_address}
                    <Button
                      variant="contained"
                      color="primary"
                      href={e.tickets.ticket_url}
                      target="_blank"
                    >
                      Tickets
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      href={e.event_url}
                      target="_blank"
                    >
                      Learn More
                    </Button>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        </div>
      );
    } else {
      return (
        <div
          style={{ width: "18rem", float: "left", display: "table" }}
          key={index}
        >
          <CardDeck>
            <Card>
              <Card.Img variant="top" src={e.thumb_url} />
              <Card.Body>
                <Card.Title>Event: {e.eventname_raw}</Card.Title>
                <Card.Text>Venue Details: {e.venue.full_address}</Card.Text>
                <Button
                  variant="contained"
                  color="primary"
                  href={e.tickets.ticket_url}
                  target="_blank"
                >
                  Tickets
                </Button>
                <Button
                  size="small"
                  color="primary"
                  href={e.event_url}
                  target="_blank"
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="event_categories">
        <ToggleButtonGroup exclusive aria-label="text alignment">
          <ToggleButton
            value="list"
            aria-label="list"
            className="list"
            onClick={handleViewList}
          >
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton
            value="module"
            aria-label="module"
            className="module"
            onClick={handleViewGrid}
          >
            <ViewModuleIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {categories.map((c) => (
          <ColorButton
            style={{ margin: "30px", fontSize: "15px" }}
            key={c.category}
            className="event_buttons"
            color="primary"
            variant="contained"
            target="_blank"
            onClick={() => {
              getEvents(c.category);
              setcurrentCategory(c.category);
            }}
          >
            {c.category}
          </ColorButton>
        ))}
      </div>
      <br />
      <h1 className="current_event">{currentCategory.toUpperCase()} Events </h1>

      {listOfEvents.map((e, index) => (
        <div>{ViewEvents(e, index)}</div>
      ))}
    </div>
  );
}

export default App;
