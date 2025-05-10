const VALUE_OF_REPOS = 5;
const url = "https://api.github.com/search/repositories?q=";
let repoName = [];

// const searchBTN = document.querySelector(".search-btn");
const searchField = document.querySelector(".search-input");
const reposContainer = document.querySelector(".repos-container");
const reposFavor = document.querySelector(".repos-favourities");

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

// async function getReposHandler(keyword) {
//   if (keyword.trim().length === 0) {
//     reposContainer.innerHTML = "";
//     return;
//   }

//   console.log("searching...");

//   const repos = await getRepos(keyword);
//   console.log(repos);
//   console.log(repos.items);

//   const listOfRepos = createListOfRepos(repos.items, VALUE_OF_REPOS);
//   reposContainer.innerHTML = "";
//   reposContainer.insertAdjacentHTML("beforeend", listOfRepos);
// }

async function getRepos(value) {
  return Promise.resolve().then(async () => {
    const response = await fetch(`${url}${value}`);
    return await response.json();
  });
}

async function searchHandler(e) {
  //   console.log("inputValue: ", inputValue);
  if (e.target.value.trim().length === 0) {
    // console.log("here!");
    // console.log("inputValue in IF: ", inputValue);

    reposContainer.innerHTML = "";
    return;
  }

  inputValue = e.target.value;

  const repos = await getRepos(inputValue);

  //   console.log(repos);

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

  //   console.log(repoName);

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
    return `<li id=${item.id}><p>Name: ${item.name}</p>
                        <p>Owner: ${item.owner.login}</p>
                        <p>Stars: ${item.stargazers_count}</p>
                        <button type='button'>Delete</button>
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

// searchBTN.addEventListener("click", () => getReposHandler(inputValue));
searchField.addEventListener("input", debounce(searchHandler, 1000));
reposContainer.addEventListener("click", handleAddRepoToFavourities);
reposFavor.addEventListener("click", handleDeleteRepo);
