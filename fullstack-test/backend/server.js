const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory data storage
let publishers = [
  {
    publisher: "publisher 1",
    domains: [
      {
        domain: "bla.com",
        desktopAds: 5,
        mobileAds: 3,
      },
      {
        domain: "bla1.com",
        desktopAds: 2,
        mobileAds: 30,
      },
    ],
  },
  {
    publisher: "publisher 2",
    domains: [
      {
        domain: "gar.com",
        desktopAds: 0,
        mobileAds: 4,
      },
      {
        domain: "gar.com",
        desktopAds: 5,
        mobileAds: 3,
      },
    ],
  },
];
let nextExampleId = 1;

// RESTful API Endpoints

// Get all publishers with domains
app.get("/api/publishers", (req, res) => {
  res.json(publishers);
});

// Create a new publisher
app.post("/api/publishers", (req, res) => {
  const publisher = req.body.publisher;
  if (!publisher) {
    return res.status(400).json({ error: "Publisher name is required" });
  }
  const findPublisher = publishers.find((p) => p.publisher === publisher);
  if (findPublisher) {
    res.status(404).send("Publisher already exists");
    return;
  }
  const newPublisher = {
    publisher: publisher,
    domains: [
      {
        domain: "example " + +nextExampleId++ + ".com",
        desktopAds: 0,
        mobileAds: 0,
      },
    ],
  };
  publishers.push(newPublisher);
  res.json(newPublisher);
});

// Create a new domain for a specific publisher
app.post("/api/publishers/:publisherName/domains", (req, res) => {
  const publisherName = req.params.publisherName;
  const publisher = publishers.find((p) => p.publisher === publisherName);
  if (!publisher) {
    res.status(404).send("Publisher not found");
    return;
  }
  const newDomain = {
    domain: "example " + +nextExampleId++ + ".com",
    desktopAds: 0,
    mobileAds: 0,
  };
  publisher.domains.push(newDomain);
  res.json(newDomain);
});

// Update a specific domain
app.put("/api/publishers/:publisherName/domains/:domainName", (req, res) => {
  const { publisherName, domainName } = req.params;
  const { newName, desktopAds, mobileAds } = req.body;

  // Find the publisher by name
  const foundPublisher = publishers.find((p) => p.publisher === publisherName);
  if (!foundPublisher) {
    return res.status(404).send({ error: "Publisher not found" });
  }

  // Find the domain within the publisher's domains
  const foundDomain = foundPublisher.domains.find(
    (d) => d.domain === domainName
  );
  if (!foundDomain) {
    return res.status(404).send({ error: "Domain not found" });
  }

  // Update the domain with new values
  foundDomain.desktopAds =
    desktopAds !== undefined ? desktopAds : foundDomain.desktopAds;
  foundDomain.mobileAds =
    mobileAds !== undefined ? mobileAds : foundDomain.mobileAds;
  foundDomain.domain = newName !== undefined ? newName : foundDomain.domain;
  res.json(foundDomain);
});

// Delete a specific domain
app.delete("/api/publishers/:publisherName/domains/:domainName", (req, res) => {
  const { publisherName, domainName } = req.params;

  // Find the publisher by name
  const foundPublisher = publishers.find((p) => p.publisher === publisherName);
  if (!foundPublisher) {
    return res.status(404).send({ error: "Publisher not found" });
  }

  // Remove the domain from the publisher's domains
  foundPublisher.domains = foundPublisher.domains.filter(
    (d) => d.domain !== domainName
  );

  // If no domains are left, remove the publisher
  if (foundPublisher.domains.length === 0) {
    publishers = publishers.filter((p) => p.publisher !== publisherName);
  }

  res.sendStatus(204);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
