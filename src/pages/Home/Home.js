import { useEffect, useRef } from "react";
import classes from "./Home.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const rootUrl = "https://nbd-document-segmenter.onrender.com/" || "http://localhost:5000/";

function Home() {
  const fileButtonRef = useRef();
  const emailInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [previousCaptions, setPreviousCaptions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fileChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile) {
      console.log(selectedFile);
      if (selectedFile.type.includes("image")) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const fileData = fileReader.result;
          console.log(fileData);
          setSelectedFilePreview(fileData);
        };
        fileReader.readAsDataURL(selectedFile);
      }
    }
  }, [selectedFile]);

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("doc-user")).email;
    if (email) {
      setIsLoggedIn(true);
    }
    fetch(`${rootUrl}api/getPreviousDocuments/${email}`)
      .then((response) => response.json())
      .then((data) => setPreviousCaptions(data?.reverse()));
  }, [generatedCaption, selectedFilePreview]);

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setSelectedFilePreview(null);
    const email = JSON.parse(localStorage.getItem("doc-user")).email;
    const formData = new FormData();
    formData.append("email", email);
    if (selectedFile.type.includes("image")) {
      formData.append("my-file", selectedFile);
      fetch(`${rootUrl}api/ocr`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          setGeneratedCaption(result.captionResult.text);
          console.log(result);
        })
        .catch((err) => console.log(err));
    } else {
      setGeneratedCaption(
        `file name ${selectedFile.name} is of type ${
          selectedFile.type.split("/")[1]
        }`
      );
      fetch(`${rootUrl}api/addPreviousDocument`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            caption: `file name ${selectedFile.name} is of type ${
                selectedFile.type.split("/")[1]
                }`,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
        }
        )
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        {isLoggedIn && <button className={classes.btnLogout}
            onClick={() => {
                localStorage.removeItem("doc-user");
                setIsLoggedIn(false);
                navigate("/", { replace: true });

            }}
        >logout</button>}
        {selectedFilePreview && (
          <img
            src={`${selectedFilePreview}`}
            alt="preview"
            style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "10rem",
              height: "10rem",
            }}
          />
        )}
        {!generatedCaption ? (
          <form className={classes.form} onSubmit={formSubmitHandler}>
            {/* <label htmlFor="email">your email</label>
            <input type="text" id="email" name="email" ref={emailInputRef} /> */}
            {/* <label htmlFor="file">your file</label> */}
            <input
              type="file"
              id="file"
              name="file"
              ref={fileButtonRef}
              style={{ display: "none" }}
              onChange={fileChangeHandler}
            />
            <button
              type="button"
              onClick={() => {
                fileButtonRef.current.click();
                setSelectedFilePreview(null);
              }}
              className={classes.button}
              style={{ width: "10rem" }}
            >
              click here to choose file
            </button>
            <button
              type="submit"
              className={classes.btn}
              style={{ marginTop: "0.5rem" }}
            >
              submit
            </button>
          </form>
        ) : (
          <div className={classes.form}>
            <span>{generatedCaption}</span>
            <button
              onClick={() => {
                setGeneratedCaption(null);
                setSelectedFilePreview(null);
              }}
              className={classes.btn}
            >
              back
            </button>
          </div>
        )}
      </div>
      <div className={classes.previousFiles}>
        <h2>Previous Files</h2>
        {previousCaptions.length > 0 &&
          previousCaptions.map((caption, index) => (
            <span key={index}>{caption}</span>
          ))}
      </div>
    </div>
  );
}

export default Home;
