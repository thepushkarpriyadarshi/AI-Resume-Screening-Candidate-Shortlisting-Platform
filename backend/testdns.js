const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.ipfocjn.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS ERROR:", err);
    } else {
      console.log("SRV RECORDS:");
      console.log(addresses);
    }
  }
);