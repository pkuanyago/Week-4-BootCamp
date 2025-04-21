const http = require("http");
const url = require("url");

// Initial data
let movies = [
  { id: 1, title: "Poetic Justice", year: 1993 },
  { id: 2, title: "Love And Basketball", year: 2000 },
];

let series = [
  { id: 1, title: "Stranger Things", seasons: 4 },
  { id: 2, title: "Breaking Bad", seasons: 5 },
];

let songs = [
  { id: 1, title: "What They Do", artist: "The Roots" },
  { id: 2, title: "Check The Rhime", artist: "A Tribe Called Quest" },
];

// Helper function to get data by route
function getData(route) {
  if (route === "/movies") return movies;
  if (route === "/series") return series;
  if (route === "/songs") return songs;
  return null;
}

// Helper to update data
function updateArray(route, newData) {
  if (route === "/movies") movies = newData;
  if (route === "/series") series = newData;
  if (route === "/songs") songs = newData;
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = parsedUrl.pathname;
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    res.setHeader("Content-Type", "application/json");

    let dataList = getData(route);
    if (!dataList) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Route not found" }));
      return;
    }

    if (req.method === "GET") {
      res.end(JSON.stringify(dataList));
    } else if (req.method === "POST") {
      const newItem = JSON.parse(body);
      newItem.id = dataList.length + 1;
      dataList.push(newItem);
      updateArray(route, dataList);
      res.end(JSON.stringify(dataList));
    } else if (req.method === "PUT") {
      const updatedItem = JSON.parse(body);
      dataList = dataList.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      updateArray(route, dataList);
      res.end(JSON.stringify(dataList));
    } else if (req.method === "DELETE") {
      const { id } = JSON.parse(body);
      dataList = dataList.filter((item) => item.id !== id);
      updateArray(route, dataList);
      res.end(JSON.stringify(dataList));
    } else {
      res.statusCode = 405;
      res.end(JSON.stringify({ message: "Method not allowed" }));
    }
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
