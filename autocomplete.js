const autocomplete = ({
  rootElement,
  fetchData,
  renderOption,
  onOptionSelect
}) => {
  rootElement.innerHTML = `
    <label><b>Search </b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
        <div class="dropdown-content result"></div>
        </div>
    </div>
    `;

  let input = rootElement.querySelector(".input");
  let dropdown = rootElement.querySelector(".dropdown");
  let result = rootElement.querySelector(".result");

  const onInputChange = async event => {
    const response = await fetchData(event.target.value);
    //console.log(movies);
    if (!response.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    dropdown.classList.add("is-active");
    result.innerHTML = "";
    for (let info of response) {
      //console.log(movie);
      let option = document.createElement("a");
      option.classList.add("dropdown-item");
      const custHtml = renderOption(info);
      option.innerHTML = custHtml;
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = info.Title;
        onOptionSelect(info);
      });
      result.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInputChange, 500));
  document.addEventListener("click", event => {
    if (!rootElement.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
