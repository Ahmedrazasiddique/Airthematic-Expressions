import React, { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Buffer } from "buffer";
import SolvedExpression from "../Utils/Helper";
import * as $ from "jquery";

export default function MainCard(props) {
  const [state, setState] = useState({
    isValid: true,
    fileName: "",
  });
  const [targetNumber, setTargetNumber] = useState("");
  const [isValidState, setIsValidState] = useState(false);
  const [fileData, setFileData] = useState("");
  const [result, setResult] = useState("");
  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    var fileName = e.target.files[0].name;
    debugger;
    const validExtensions = ["csv"];
    var isValid = true;
    for (let img of e.target.files) {
      if (
        $.inArray(
          img.name.substr(img.name.lastIndexOf(".") + 1),
          validExtensions
        ) == -1
      ) {
        e.target.value = "";
        isValid = false;
        setState({
          ...state,
          isValid: false,
          fileName: fileName,
        });
      }

      break;
    }

    if (isValid) {
      /* Get files in array form */
      const files = Array.from(e.target.files);

      /* Map each file to a promise that resolves to an array of image URI's */
      Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", (ev) => {
              resolve({
                fileData: ev.target.result,
                filename: `${file.name}`,
              });
            });
            reader.addEventListener("error", reject);
            reader.readAsDataURL(file);
          });
        })
      ).then(
        (data) => {
          const bs64 = data[0].fileData.replace(/^data:.+;base64,/, "");
          let base64ToString = new Buffer.from(bs64, "base64").toString();
          if (base64ToString.includes(",")) {
            setFileData(base64ToString);
          }
        },
        (error) => {}
      );
      setIsValidState(true);
    }
  }
  return (
    <Card>
      <CardContent>
        <div
          style={{ margin: "auto" }}
          className="flex justify-center sm:justify-start flex-wrap -mx-8"
        >
          <div className="flex flex-col">
            <Button variant="contained" component="label">
              Upload Csv
              <input
                accept=".csv"
                onChange={handleUploadChange}
                type="file"
                style={{ display: "none" }}
              />
            </Button>

            <TextField
              className="py-8 px-12"
              size="small"
              id="outlined-basic"
              label="Target number"
              variant="outlined"
              type={"number"}
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              disabled={isValidState ? false : true}
            />
            <Button
              disabled={isValidState && targetNumber > 0 ? false : true}
              variant="contained"
              onClick={() => {
                setResult(
                  SolvedExpression(
                    fileData.split(",").map(Number),
                    parseInt(targetNumber)
                  )
                );
              }}
            >
              Find Expression
            </Button>
          </div>
          <div className="flex flex-col">
            <Typography variant="h5" component="h2">
              File content: <b style={{ color: "green" }}>{fileData}</b>
            </Typography>
            <Typography variant="h5" component="h3">
              Result: <b style={{ color: "green" }}>{result}</b>
            </Typography>
          </div>
        </div>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
