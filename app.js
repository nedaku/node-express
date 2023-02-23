const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

app.use(cors());
const getHtml = async () => {
  try {
    return await axios.get("https://www.melon.com/chart/");
  } catch (err) {
    console.log("error");
  }
};

let chart = [];
let time;
const parsing = async () => {
  const html = await getHtml();
  const $ = cheerio.load(html.data);
  const $chartList = $(".lst50");

  time = $(".calendar_prid .hour").text();
  $chartList.each((index, node) => {
    chart.push({
      rank: $(node).find(".rank").text() + "위",
      title: $(node).find(".ellipsis.rank01 span a").text(),
      artist: $(node).find(".ellipsis.rank02 span a").text(),
      img: $(node).find(".image_typeAll > img").attr("src"),
    });
  });
};
parsing();
setInterval(function () {
  var now = new Date();
  if (now.getMinutes() == 0 && now.getSeconds() == 0) {
    parsing();
  }
}, 1000);

const server = express();

server.get("/", (req, res) => {
  res.send(chart);
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log("The server is listening on port 3000");
});
