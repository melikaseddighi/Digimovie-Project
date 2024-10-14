class Search {
  constructor() {
    this.search = document.querySelector(".header__search");
    this.filterBtn = document.getElementById("filter-btn");
    this.timeOut = 0;
    this.selectMovie();
    this.handleSearchMethod();
  }

  handleSearchMethod() {
    this.filterBtn.addEventListener("click", this.getValueFilter.bind(this));
    this.search.addEventListener("keyup", this.debounceKeyWord.bind(this));
  }

  debounceKeyWord() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.timeOut = setTimeout(this.keyWordFilter.bind(this), 2000);
  }

  async keyWordFilter() {
    let keyWord = this.search.value;
    if (keyWord === "") {
      this.getValueFilter();
      return;
    }
    App.getMovieList().getSearchData(keyWord, undefined, "word");
  }

  getValueFilter() {
    const movieType = document.getElementById("filter-postType").value;
    const movieCrews = document.getElementById("crews").value;
    const movieActors = document.getElementById("actors").value;
    const minYear = document.getElementById("min-year").value;
    const maxYear = document.getElementById("max-year").value;
    const filterCountry = document.getElementById("filter-country").value;
    const filterAge = document.getElementById("filter-age").value;
    const selectGenre = document.getElementById("select-gener").value;
    const filterQuality = document.getElementById("filter-quality").value;
    const filterNetwork = document.getElementById("filter-network").value;
    const filterSort = document.getElementById("filter-sort").value;
    const minVote = document.getElementById("min-value").value;
    const maxVote = document.getElementById("max-value").value;

    this.advancedFilter(
      movieType,
      movieCrews,
      movieActors,
      minYear,
      maxYear,
      filterCountry,
      filterAge,
      selectGenre,
      filterQuality,
      filterNetwork,
      filterSort,
      minVote,
      maxVote
    );
  }

  async advancedFilter(
    movieType,
    movieCrews,
    movieActors,
    minYear,
    maxYear,
    filterCountry,
    filterAge,
    selectGenre,
    filterQuality,
    filterNetwork,
    filterSort,
    minVote,
    maxVote
  ) {
    const params = [
      {
        name: "include_adult",
        value: filterAge,
      },
      {
        name: "include_video",
        value: movieType,
      },
      {
        name: "sort_by",
        value: filterSort,
      },
      {
        name: "with_genres",
        value: selectGenre,
      },
      {
        name: "with_crew",
        value: movieCrews,
      },
      {
        name: "with_cast",
        value: movieActors,
      },
      {
        name: "with_original_language",
        value: filterCountry,
      },
      {
        name: "with_companies",
        value: filterNetwork,
      },
      {
        name: "vote_average.gte",
        value: minVote,
      },
      {
        name: "vote_average.lte",
        value: maxVote,
      },
      {
        name: "primary_release_date.gte",
        value: `${minYear}-01-01`,
      },
      {
        name: "primary_release_date.lte",
        value: `${maxYear}-12-31`,
      },
    ];

    const newParams = params.map((parameter) => {
      return `${parameter.name}=${parameter.value}`;
    });
    const queryString = newParams.join("&");

    App.getMovieList().getSearchData(queryString, undefined, "search");
  }

  selectMovie() {
    const filterBtn = document.querySelectorAll(".filter__post");
    const filterInput = document.getElementById("filter-postType");
    filterBtn.forEach((span) => {
      span.addEventListener("click", () => {
        filterBtn.forEach((e) => e.classList.remove("active"));
        span.classList.add("active");
        filterInput.value = span.dataset.posttype;
      });
    });
  }
}

class GenreList {
  constructor() {
    this.genreMap = {};
    this.getData();
  }

  async getData() {
    try {
      const { data: response } = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list"
      );
      this.createGenreOptions(response.genres);
      this.genreList(response.genres);
    } catch (error) {
      console.error("error:", error);
    }
  }

  createGenreOptions(genres) {
    const selectGener = document.getElementById("select-gener");
    genres.forEach((genre) => {
      const genreElm = document.createElement("option");
      genreElm.value = genre.id;
      genreElm.innerText = genre.name;
      selectGener.append(genreElm);
    });
  }

  genreList(lists) {
    lists.forEach((genre) => {
      this.genreMap[genre.id] = genre.name;
    });
  }
}

class LanguageList {
  constructor() {
    this.languageMap = {};
    this.getData();
  }

  async getData() {
    try {
      const { data: response } = await axios.get(
        "https://api.themoviedb.org/3/configuration/languages"
      );
      this.createGenreOptions(response);
      this.getLanguageList(response);
    } catch (error) {
      console.error("error:", error);
    }
  }

  createGenreOptions(langs) {
    const selectLanguage = document.getElementById("filter-country");
    langs.forEach((lang) => {
      const langElm = document.createElement("option");
      langElm.value = lang.iso_639_1;
      langElm.innerText = lang.english_name;
      selectLanguage.append(langElm);
    });
  }

  getLanguageList(languages) {
    languages.forEach((lang) => {
      this.languageMap[lang.iso_639_1] = lang.english_name;
    });
  }
}

class MovieList {
  constructor() {
    this.content = document.querySelector(".content");
    this.templateElm = document.getElementById("movie-list-item");
    this.loadingContainer = document.querySelector(".loading-container");
    this.isLoading = false;
    this.currentPage = 1;
    this.totalPages;
    this.isSearching = false;
    this.queryString = "";
    this.genreList = new GenreList();
    this.languageList = new LanguageList();
    this.keyWord = "";
    this.getData();
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.handleScroll);
  }

  async getData(page = 1) {
    try {
      this.isLoading = true;
      this.showLoading();
      const { data: response } = await axios.get(
        ` https://api.themoviedb.org/3/trending/movie/week?page=${page}`
      );
      this.currentPage = page;
      this.totalPages = response.total_pages;
      await this.languageList.getData();
      this.showData(response.results);
      this.hideLoading();
      this.isLoading = false;
    } catch (error) {
      console.error("error:", error);
      this.hideLoading();
      this.isLoading = false;
      this.content.innerHTML = `<div style="color:#f00;background-color:#fff;text-align:center">سایت با مشکل مواجه شد لطفا بعدا تلاش بکنید</div>`;
    }
  }

  async getSearchData(queryString, page = 1, keyWord = "serach") {
    try {
      this.keyWord = keyWord;
      this.isLoading = true;
      this.showLoading();
      let url = "";
      if (keyWord == "search") {
        url = `https://api.themoviedb.org/3/discover/movie?page=${page}&${queryString}`;
      } else if (keyWord == "word") {
        url = `https://api.themoviedb.org/3/search/movie?query=${queryString}&page=${page}`;
      }
      const { data: response } = await axios.get(`${url}`);
      let changeFilter = false;
      if (!this.isSearching) {
        this.content.innerHTML = "";
      }
      if (this.queryString !== queryString) {
        changeFilter = true;
        this.queryString = queryString;
      }
      if (changeFilter) {
        this.content.innerHTML = "";
      }
      this.isSearching = true;
      this.currentPage = page;
      this.totalPages = response.total_pages;
      await this.languageList.getData();
      this.showData(response.results);
      this.hideLoading();
      this.isLoading = false;
    } catch (error) {
      console.error("error:", error);
      this.hideLoading();
      this.isLoading = false;
      this.content.innerHTML = `<div style="color:#f00;background-color:#000;text-align:center">سایت با مشکل مواجه شد لطفا بعدا تلاش بکنید</div>`;
    }
  }

  async handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight >= scrollHeight &&
      !this.isLoading &&
      this.currentPage <= this.totalPages
    ) {
      if (this.isSearching) {
        await this.getSearchData(
          this.queryString,
          this.currentPage + 1,
          this.keyWord
        );
      } else {
        await this.getData(this.currentPage + 1);
      }
    }
  }

  showLoading() {
    this.content.classList.add("loading");
    this.loadingContainer.style.display = "flex";
  }
  hideLoading() {
    this.content.classList.remove("loading");
    this.loadingContainer.style.display = "none";
  }

  showData(movies) {
    movies.forEach((movie) => {
      const movieElm = document.importNode(this.templateElm.content, true);
      movieElm
        .querySelector("#movie-image")
        .setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        );
      movieElm.querySelector("#movie-name").innerText = movie.title;
      movieElm.querySelector("#movie-rate").innerText =
        movie.vote_average.toFixed(2);
      movieElm.querySelector(
        "#movie-vote"
      ).innerText = `${movie.vote_count}K votes`;
      movieElm.querySelector("#movie-create").innerText = movie.release_date;
      movieElm.querySelector("#movie-rate-user").innerText =
        movie.popularity.toFixed(0);
      movieElm.querySelector("#movie-description").innerText = movie.overview;
      const genreNames = movie.genre_ids.map(
        (id) => this.genreList.genreMap[id]
      );
      movieElm.querySelector("#movie-gener").innerText = genreNames.join(", ");
      const languageResult =
        this.languageList.languageMap[movie.original_language];
      movieElm.querySelector("#movie-country").innerText = languageResult;

      this.content.append(movieElm);
    });
  }
}

class ChangeTheme {
  constructor() {
    this.headerCircle = document.querySelector(".header__item-circle");
    this.changeThemeMethod();
    this.getLocalStorage();
  }
  changeThemeMethod() {
    const headerItems = document.querySelectorAll(".header__item");
    headerItems.forEach((item) => {
      item.addEventListener("click", () => {
        const rightValue = item.getAttribute("data-right");
        this.headerCircle.style.right = rightValue;
        document.body.classList.toggle("light-mode");
        localStorage.setItem(
          "theme",
          document.body.classList.contains("light-mode") ? "light" : "dark"
        );
      });
    });
  }

  getLocalStorage() {
    const saveTheme = localStorage.getItem("theme");
    if (saveTheme) {
      document.body.classList.add(saveTheme + "-mode");
      console.log(saveTheme);
      this.headerCircle.style.right = saveTheme === "light" ? "-40px" : "40px";
    }
  }
}

class DigiMoviz {
  constructor() {
    this.movieList = new MovieList();
    this.search = new Search();
    this.changeTheme = new ChangeTheme();
  }
}

class App {
  static init() {
    axios.defaults.headers.common["accept"] = "application/json";
    axios.defaults.headers.common["Authorization"] =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxM2ZkYzRiYWYxNDg0OGJhZWM0YTJlZDhhZmNjNjM3OSIsIm5iZiI6MTcxOTIyMzI1NS42OTIyOTQsInN1YiI6IjY2NmQzNjI3MzFjMWI5ODhlMmM2ZWNiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KtylcLXhbhXLshQeCyWoNqnv-TCaqsy3D9i0VmCZf0I";
    this.digiMoviz = new DigiMoviz();
  }

  static getMovieList() {
    return this.digiMoviz.movieList;
  }
}

App.init();
