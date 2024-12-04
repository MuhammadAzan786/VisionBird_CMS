/* eslint-disable react/prop-types */
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const FileList = ({ imageUrls }) => {
  return (
    <List>
      {imageUrls.map((item, index) => (
        <ListItem
          key={index}
          sx={{
            border: "1px solid #e8ebee",
            borderRadius: "8px",
            overflowWrap: "anywhere",
          }}
          secondaryAction={
            <IconButton edge="end" sx={{ color: "red" }}>
              <Close />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar src={item} alt="asd" sx={{ borderRadius: 2 }} />
          </ListItemAvatar>
          <ListItemText primary={item.display_name} />
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;
