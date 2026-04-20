import { useState } from "react";
import styles from "../part-a/style.css"

// movie data object, different movies have different time.
const movieData = {
    "Titanic": ["8:00", "10:00", "14:00"],
    "Jurassic World": ["14:00", "18:00", "0:00"],
    "Spider-Man": ["10:00", "14:00", "20:00"],
    "Maze Runner": ["12:00", "16:00", "22:00"]
};

//▲ ▼
export default function PureDropdown() {

    // movie list
    const [movieOpen, setMovieOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState("")
    const movieList = Object.keys(movieData);

    // time list
    const [timeOpen, setTimeOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const timeList = selectedMovie ? movieData[selectedMovie] : [];

    const [mobile, setMoblie] = useState("");

    const handleSelectMovie = (item) => {

        setSelectedMovie(item);
        setSelectedTime("");
        setMovieOpen(false);
    }

    const handleSelectTime = (item) => {

        setSelectedTime(item);
        setTimeOpen(false);
    }

    const handleSubmit = () => {

        if (!selectedMovie) {
            alert("Please select a movie!");
            return;
        }
        if (!selectedTime) {
            alert("Please select a showtime!");
            return;
        }

        const mobileRegex = /^\d{8,11}$/;
        if (!mobileRegex.test(mobile)) {
            alert("Please enter a valid mobile number (8-11 digits)!");
            return;
        }

        alert(`Your booking for ${selectedMovie} at ${selectedTime} has been confirmed.
             A confirmation text has been sent to ${mobile}`);

    }

    return (
        <>
            <form onSubmit={handleSubmit} className="form">

                <h3>Book Your Tickets</h3>

                <div className="input-group">
                    <input type="text"
                        placeholder="Select a movie"
                        value={selectedMovie}
                        readOnly />
                    <button type="button" className="btn" onClick={() => setMovieOpen(!movieOpen)}>
                        {movieOpen ? "▲" : "▼"}
                    </button>
                </div>

                {movieOpen && (
                    <ul>
                        {movieList.map((item) => (
                            <li key={item}>
                                <button onClick={() => handleSelectMovie(item)}>{item}</button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="input-group">
                    <input type="text"
                        placeholder="Select a time"
                        value={selectedTime}
                        readOnly />
                    <button type="button" className="btn" onClick={() => setTimeOpen(!timeOpen)}>
                        {timeOpen ? "▲" : "▼"}
                    </button>
                </div>

                {timeOpen && (
                    <ul>
                        {timeList.map((item) => (
                            <li key={item}>
                                <button onClick={() => handleSelectTime(item)}>{item}</button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="input-group">
                    <input type="tel"
                        placeholder="Enter moblie number"
                        value={mobile}
                        onChange={(e) => setMoblie(e.target.value)}
                    />
                </div>

                <button type="submit">Book Tickets</button>
            </form>

        </>
    );
}