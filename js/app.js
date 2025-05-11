const VALUE_OF_REPOS = 5;
const URL = "https://api.github.com/";
const endpoint = "search/repositories";
let repoName = [];

const searchField = document.querySelector(".search-input");
const reposContainer = document.querySelector(".repos-container");
const reposFavor = document.querySelector(".repos-pinned");

let inputValue = searchField.value;

const debounce = (fn, debounceTime) => {
  let timeout;
  function decorator() {
    const fnCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);

    timeout = setTimeout(fnCall, debounceTime);
  }

  return decorator;
};

async function getRepos(value) {
  return Promise.resolve().then(async () => {
    const response = await fetch(`${URL + endpoint}?q=${value}`);
    return await response.json();
  });
}

async function searchHandler(e) {
  if (e.target.value.trim().length === 0) {
    reposContainer.innerHTML = "";
    return;
  }

  inputValue = e.target.value;

  const repos = await getRepos(inputValue);

  const listOfRepos = createListOfRepos(repos.items, VALUE_OF_REPOS);
  reposContainer.innerHTML = "";
  reposContainer.insertAdjacentHTML("beforeend", listOfRepos);
}

function createListOfRepos(arr, count) {
  repoName = [];
  arr.forEach((el) => {
    if (repoName.length >= 0 && repoName.length < count) {
      repoName.push(el);
    }
  });

  const markup = repoName
    .map((item) => {
      return `<li id=${item.id}>${item.full_name}</li>`;
    })
    .join("");

  return markup;
}

function handleAddRepoToFavourities(e) {
  if (e.target.tagName !== "LI") {
    return;
  }

  const repo = repoName.filter((item) => item.id === Number(e.target.id));

  const repoMarkup = repo.map((item) => {
    return `<li class="repo-item" id=${item.id}><p class="repo-name"><span class="repo-title">Name: </span>${item.name}</p>
                        <p class="repo-author"><span class="repo-title">Owner: </span>${item.owner.login}</p>
                        <p class="repo-stars"><span class="repo-title">Stars: </span>${item.stargazers_count}</p>
                        <button class="btn repo-delete" type="button">Delete</button>
                    </li>`;
  });

  reposFavor.insertAdjacentHTML("beforeend", repoMarkup);
  clearValues();
}

function handleDeleteRepo(e) {
  if (e.target.textContent !== "Delete") {
    return;
  }
  e.target.parentNode.remove();
}

function clearValues() {
  searchField.value = "";
  repoName = [];
  reposContainer.innerHTML = "";
}

searchField.addEventListener("input", debounce(searchHandler, 800));
reposContainer.addEventListener("click", handleAddRepoToFavourities);
reposFavor.addEventListener("click", handleDeleteRepo);
