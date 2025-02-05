const http = require('http');
const fs = require('fs');

let nextDogId = 1;

let dogAndIds = {};

let getPage = fs.readFileSync('dogs.html', 'utf-8');
let getPage1 = fs.readFileSync('new-dog.html', 'utf-8');
let getPage2 = fs.readFileSync('edit.html', 'utf-8');

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    if (req.method === "GET" && req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");

      if (Object.keys(dogAndIds).length > 0) {
        let newPage = getPage + `<pre>${JSON.stringify(dogAndIds, null, 4)}</pre>`;
        return res.end(newPage);
      }

      return res.end(getPage);
    }

    if (req.method === "GET" && req.url === "/dogs") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");

      return res.end(getPage1);
    }

    let holder = req.url.split('/');
    console.log(holder);

    if (req.method === "GET" && holder.length === 3) {
      if (holder[1] === "dog" && dogAndIds[holder[2]]) {
        let strObj = `<pre>${JSON.stringify(dogAndIds[holder[2]], null, 4)}</pre>`
        return res.end(strObj);
      }
    }

    if (req.method === "GET" && holder.length === 4) {
      if (holder[1] === "dog" && dogAndIds[holder[2]] && holder[3] === "edit") {
        let id = holder[2];

        res.setHeader("COntent-Type", "text/html")
       
        return res.end(`
          <form method="POST" action="/dog/${id}/update">
            <h2>Edit dog to your taste</h2>

            <p>
                <label>Name: <input type="text" name="name" value=${dogAndIds[id].name}></label>
            </p>

            <p>
                <label>Age: <input type="text" name="age" value=${dogAndIds[id].age}></label>
            </p>

            <p>
                <button type="submit">Update</button>
            </p>
          </form>
        `);
      }
    }

    if (req.method === "POST" && req.url === "/dogs") {
      // let htmlpage = fs.readFileSync('dogs.html', 'utf-8');
      // let respage = htmlpage.replace(/#dogtype/g, `<pre>${JSON.stringify(req.body, null, 4)}</pre>`);

      let id = getNewDogId();
      dogAndIds[id] = req.body;
      console.log(dogAndIds)
      res.statusCode = 302;
      res.setHeader("Location", "/");
      
      return res.end();
    }
    
    if (req.method === "POST" && holder.length === 4 && holder[1] === "dog" && dogAndIds[holder[2]] && holder[3] === "update") {
      console.log("Happy posting!!!")
      dogAndIds[holder[2]] = req.body;
      console.log(dogAndIds);

      res.statusCode = 302;

      res.setHeader("Location", "/");
      return res.end("Page Sucessfully edited!!!");
    }



    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));