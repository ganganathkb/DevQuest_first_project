import { BASE_GENRE_URL, BASE_MOVIE_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  setGenreList();
  setSubmit();
});

var setGenreList = async () => {
  let genres;
  try {
    const response = await fetch(BASE_GENRE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    genres = await response.json();

    if (genres.data && Array.isArray(genres.data)) {
      let genreList = document.getElementById("genreCheckBoxes");

      genres.data.forEach((genre) => {
        let genreRow = document.createElement("div");
        genreRow.className = "form-check";
        genreRow.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${genre.name}" id="flexCheck${genre.id}">
                <label class="form-check-label" for="flexCheck${genre.id}">
                  ${genre.name}
                </label>
                `;
        genreList.appendChild(genreRow);
      });
    } else {
      console.error("Invalid genre data format:", genres);
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

var setSubmit = async () => {
  document.getElementById("movieForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    // Get form values
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const dailyRentalRate = document.getElementById("dailyRentalRate").value;
    const genres = [...document.querySelectorAll('input[name="genre"]:checked')].map(genre => genre.value);
    const imdbRating = document.getElementById("imdbRating").value;
    const posterUrl = document.getElementById("posterUrl").value;
    const bannerUrl = document.getElementById("bannerUrl").value;
    const plot = document.getElementById("plot").value;
    const runtime = document.getElementById("runtime").value;
    const releaseAt = document.getElementById("releaseAt").value;
    const directedBy = document.getElementById("directedBy").value;
    const starring = document.getElementById("starring").value;
  
    // Prepare movie object
    const movieData = {
      title,
      year,
      dailyRentalRate,
      genres,
      imdbRating,
      posterUrl,
      bannerUrl,
      plot,
      runtime,
      releaseAt,
      directedBy,
      starring
    };
  
    // Call the API to add a new movie
    try {
      const response = await fetch('/api/movie/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });
  
      if (response.status === 201) {
        alert('Movie added successfully!');
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(errorData.message);
      } else {
        alert('Error adding movie.');
      }
    } catch (error) {
      alert('An error occurred while adding the movie.');
    }
  });
};
