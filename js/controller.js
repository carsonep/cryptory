const tableContainer = document.querySelector(".crypto__table");

const newsContainer = document.querySelector(".news");
let newsContainer2 = document.querySelectorAll(".news__container");
let newsContainer2All = document.querySelector(".news__container");

let row = document.getElementsByClassName(".row__table");

const newShowMore = document.querySelector(".news__show-more");
const hidden = document.querySelectorAll(".hidden");

const trackerContainer = document.querySelector(".crypto__tracker-container");

const searchBar = document.querySelector(".navigation__search-bar");
let int = document.querySelectorAll(".dayChange");

let coinsData = [];
let coinPriceHistory;
let row__Chart;

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after $ ${s} second`));
    }, s * 1000);
  });
};

const loadHistoryAPI = async function loadHistory(c) {
  const res = await fetch(
    `https://api.coinstats.app/public/v1/charts?period=1w&coinId=${c}`
  );
  let history = await res.json();

  try {
    history1 = await history;

    let historyData = history1.chart;

    coinPriceHistory = [];

    historyData.forEach(function (element, j) {
      const priceHistory = element[1];
      coinPriceHistory.push(priceHistory);
    });

    return coinPriceHistory;
  } catch (err) {
    console.log("Error");
  }
};

const insertCoins = function (c) {
  for (let j = 0; j < c.length; j++) {
    const markup = `
    <tr class="row__table">
      <td>${j + 1}</td>
      <td ><img src="${
        c[j].icon
      }" style="width: 2rem; height:2rem; margin-right: 1rem;"/> ${
      c[j].name
    } &#8226;${c[j].symbol}</td>
      <td ${checkNum(c[j].priceChange1d)}>${c[j].priceChange1d}%</td>
      <td>$${new Intl.NumberFormat().format(c[j].price.toFixed(2))}</td>
      <td class="price__InBtc">${c[j].priceBtc.toFixed(8)}</td>
      <td>${new Intl.NumberFormat().format(c[j].volume.toFixed(2))}</td>
      <td class="chart__container" id="container${
        j + 1
      }" style="width: 25%"></td>
    </tr>
  `;

    tableContainer.insertAdjacentHTML("beforeend", markup);
    row = document.querySelectorAll(".row__table");
    int = document.querySelectorAll(".dayChange");

    const globalData = loadHistoryAPI(c[j].id).then((success, err) => {
      if (err) {
        console.error(err);
      }

      new Highcharts.stockChart(`container${j + 1}`, {
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 25,
              },
            },
          ],
        },
        chart: {
          margin: 0,
          backgroundColor: "#1a1a1d",
        },
        series: [
          {
            data: success, // predefined JavaScript array
          },
        ],
        navigation: {
          buttonOptions: {
            enabled: false,
          },
        },
        rangeSelector: {
          enabled: false,
        },
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        tooltip: { enabled: false },
        credits: {
          enabled: false,
        },
        xAxis: {
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: "transparent",

          labels: {
            enabled: false,
          },
          minorTickLength: 0,
          tickLength: 0,
        },

        yAxis: {
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          labels: {
            enabled: false,
          },
          plotLines: [
            {
              value: 0,
              width: 0,
              color: "#aaa",
              zIndex: 10,
            },
          ],

          stackLabels: {
            enabled: true,
          },
        },
      });
    });
  }
};

async function loadCoins() {
  const res = await fetch(
    "https://api.coinstats.app/public/v1/coins?skip=0&limit=40&currency=US"
  );
  let coins = await res.json();

  return coins;
}

document.addEventListener("DOMContentLoaded", async () => {
  let coins = [];

  try {
    coins = await loadCoins();
  } catch (err) {
    console.log("Error");
  }

  coinsData = coins.coins;

  insertCoins(coinsData);
});

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value;
  const markup1 = "";
  const filteredCoins = coinsData.filter((coin) => {
    return coin.id.includes(searchString) || coin.id.includes(searchString);
  });

  if (filteredCoins.length === 0) {
    insertCoins(filteredCoins);
  } else if (filteredCoins.length > 0) {
    row.forEach(function (element, j) {
      element.classList.add("trigger");
      element.style.display = "none";
    });
    insertCoins(filteredCoins);
  }
});

async function loadNews() {
  const res = await fetch(
    // "https://api.coinstats.app/public/v1/news?skip=0&limit=20"
    "https://api.coinstats.app/public/v1/news/trending?skip=0&limit=200"
  );
  const news = await res.json();

  return news;
}

document.addEventListener("DOMContentLoaded", async () => {
  let news = [];

  try {
    news = await loadNews();
  } catch (err) {
    console.log("Error");
  }

  let newsData = news.news;

  newsData.forEach((node, j) => {
    const markup = `
    <div class="news__container">
  <a aria-label="${newsData[j].title}" href="${
      newsData[j].link
    }" target="_blank">
        <div class="news__container-image">
        <img src="${newsData[j].imgURL}" alt="" class="news__container-image">
        </div>
      <div class="news__container-title">
        <span>${newsData[j].title}</span>
      </div>

    </a>
      <div class="news__container-external">
        <span class="news__container-external-time">21m ago</span>
  <a href="${
    newsData[j].link
  }" target="_blank" class="news__container-external-link">${
      newsData[j].sourceLink
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0]
    }</a>
  </div>
  `;

    if (!newsData[j].sourceLink.includes("https://www.reddit.com/r/")) {
      newsContainer.insertAdjacentHTML("beforeend", markup);
    }

    newsContainer2 = document.querySelector(".news__container");
    newsContainer2All = document.querySelector(".news__container");

    if (j > 3) {
      newsContainer2.classList.add("hidden");
      newsContainer2.classList.remove("news__container");
      newsContainer2.id = "remove";
    }
  });

  let elms = document.querySelectorAll("[id = 'remove']");

  function _showMore() {
    newShowMore.value = "Show less";
  }

  function _showLess() {
    newShowMore.value = "Show more";
  }

  newShowMore.addEventListener("click", function () {
    if (newShowMore.value === "Show more") {
      _showMore();
    } else if (newShowMore.value === "Show less") {
      _showLess();
    }
  });

  newShowMore.addEventListener("click", function () {
    for (var i = 0; i < elms.length; i++) {
      // newShowMore.innerHTML = `Show less`;
      elms[i].classList.toggle("hidden");
      elms[i].classList.add("news__container");
    }
  });
});

function changeColor(c) {
  if (c > 0) {
    c.style.color = "green";
  } else {
    c.style.color = "red";
  }
}

async function loadGlobal() {
  const res = await fetch("https://api.coinlore.net/api/global/");
  let global = await res.json();

  return global;
}

document.addEventListener("DOMContentLoaded", async () => {
  let global = [];

  try {
    global = await loadGlobal();
  } catch (err) {
    console.log("Error");
  }

  let globalData = global[0];
  console.log(globalData);

  const globalMarkup = `
  
  <li>
    <div class="crypto__tracker-content">
      <div class="crypto__tracker-title">Market Cap</div>
      <div class="crypto__tracker-value">
        $${new Intl.NumberFormat().format(globalData.total_mcap.toFixed(0))}

        <div class="crypto__tracker-percent" ${checkNum(
          globalData.mcap_change
        )}>${globalData.mcap_change}%</div>
      </div>
    </div>
  </li>
  <li>
    <div class="crypto__tracker-content">
      <div class="crypto__tracker-title">Volume 24H</div>
      <div class="crypto__tracker-value">
        $${new Intl.NumberFormat().format(globalData.total_volume.toFixed(0))}

        <div class="crypto__tracker-percent" ${checkNum(
          Number(globalData.volume_change)
        )}>${globalData.volume_change}%</div>
      </div>
    </div>
  </li>
  <li>
    <div class="crypto__tracker-content">
      <div class="crypto__tracker-title">BTC dominance</div>
      <div class="crypto__tracker-value">
        ${globalData.btc_d}

        <div class="crypto__tracker-percent" ${checkNum(
          globalData.avg_change_percent
        )}>${globalData.avg_change_percent}%</div>
      </div>
    </div>
  </li>

`;

  trackerContainer.insertAdjacentHTML("afterBegin", globalMarkup);
});

const checkNum = (n) => {
  return n > 0 ? "style='color: #34c759;'" : "style='color: #e8372e;'";
};
