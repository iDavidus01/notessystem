import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://10.217.40.238:10000/get_notes")
      .then((response) => response.json())
      .then((data) => {
        if (data.notes) {
          setNotes(data.notes);
        } else {
          console.error("Brak notatek");
        }
      })
      .catch((error) => console.error("Błąd pobierania notatek:", error));
  }, []);

  const fetchNote = () => {
    fetch(`https://flasknotes-m7sb.onrender.com/get_note/${filename}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setContent(data.content);
        } else {
          alert("File not found!");
        }
      })
      .catch((error) => console.error("Błąd przy ładowaniu notatki:", error));
  };

  const saveNote = () => {
    fetch("http://localhost:5000/save_note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename, content }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetch("http://localhost:5000/get_notes")
          .then((response) => response.json())
          .then((data) => {
            if (data.notes) {
              setNotes(data.notes);
            }
          })
          .catch((error) => console.error("Błąd pobierania notatek:", error));
      })
      .catch((error) => console.error("Błąd przy zapisywaniu notatki:", error));
  };

  return (
    <div className="App">
      <div className="textSpace">
        <p className="fileName">Filename:</p>
        <textarea
          value={`${filename}\n\n${content}`}
          onChange={(e) => {
            const lines = e.target.value.split("\n");
            setFilename(lines[0]);
            setContent(lines.slice(2).join("\n"));
          }}
        />
        <div className="note-list-container">
          <h3>Notes</h3>
          <ul className="note-list">
            {notes.map((note, index) => (
              <li key={index} className="note-item">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={fetchNote}>Load Note</button>
      <button onClick={saveNote}>Save Note</button>
    </div>
  );
}

export default App;
