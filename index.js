const leftAutocompleteroot = document.querySelector("#left-autocomplete");
const rightAutocompleteroot = document.querySelector("#right-autocomplete");

const autoCompleteConfig = {
  async fetchData(input) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "d85fec79",
        s: input
      }
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
  renderOption(movie) {
    return `
          <img src="${movie.Poster === "N/A" ? "" : movie.Poster}"/>
            ${movie.Title} (${movie.Year})`;
  }
};
autocomplete({
  ...autoCompleteConfig,
  rootElement: leftAutocompleteroot,
  async onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  }
});

autocomplete({
  ...autoCompleteConfig,
  rootElement: rightAutocompleteroot,
  async onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "d85fec79",
      i: movie.imdbID
    }
  });

  if (response.data) {
    summaryElement.innerHTML = movieTemplate(response.data);
  }
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison(leftMovie, rightMovie);
  }
};

const runComparison = () => {
  const leftSideState = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideState = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideState.forEach((leftState, index) => {
    let rightState = rightSideState[index];
    let leftSideValue = parseInt(leftState.dataset.value);
    let rightSideValue = parseInt(rightState.dataset.value);

    if (leftSideValue > rightSideValue) {
      rightState.classList.remove("is-primary");
      rightState.classList.add("is-warning");
    } else {
      leftState.classList.remove("is-primary");
      leftState.classList.add("is-warning");
    }
  });
};

const movieTemplate = movieDetails => {
  //console.dir(movieDetails);
  const boxOfficeCollection =
    movieDetails.BoxOffice &&
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "");

  const awards = movieDetails.Awards.split(" ").reduce((totAwards, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return totAwards;
    } else {
      return (totAwards += value);
    }
  }, 0);

  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

  // console.log(
  //   `boxOfficeCollection : ${boxOfficeCollection} , awards : ${awards} , metaScore : ${metaScore} , imdbRating : ${imdbRating} , imdbVotes : ${imdbVotes}`
  // );

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOfficeCollection} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
