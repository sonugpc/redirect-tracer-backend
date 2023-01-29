const RequestHandler = require("../utills/RequestHandler");
const cheerio = require("cheerio");
const { default: axios } = require("axios");

const requestHandler = new RequestHandler();

class RedirectController {
  static async traceRedirect(req, res) {
    const shortUrl = req.body.shortUrl;
    let redirectUrls = [shortUrl]; // Array to store the URLs in the redirect chain
    let currentUrl = shortUrl; // Start with the short URL
    const maxRedirects = 5; // set max redirects to follow
    try {
      let followRedirects = async (currentUrl, redirectUrls) => {
        if (redirectUrls.length >= maxRedirects) {
          return redirectUrls;
        }
        const response = await axios.request({
          url: currentUrl,
          method: "GET",
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 309,
        });

        if (response.status === 301 || response.status === 302) {
          currentUrl = response.headers.location; // Update current URL
          redirectUrls.push({
            statusCode: response.status,
            redirectType: "Redirect",
            url: currentUrl,
          }); // Add to redirectUrls array
          return followRedirects(currentUrl, redirectUrls);
        } else if (response.status === 200) {
          if (response.data.length >= 4000) {
            return redirectUrls; // DOM length is too High
          } else {
            const $ = cheerio.load(response.data);
            const refreshUrl = $("meta[http-equiv='refresh']").attr("content");
            if (refreshUrl) {
              let regex =
                /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
              let newUrl = refreshUrl.match(regex)[0];
              redirectUrls.push({
                statusCode: "200",
                redirectType: "HTTP-META-REFRESH",
                url: newUrl,
              });
              return followRedirects(newUrl, redirectUrls);
            }
          }
        }
      };
      requestHandler.sendSuccess(req, res, "Succesfully Fetched Redirect URL", {
        redirectUrls: await followRedirects(currentUrl, redirectUrls),
      });
    } catch (e) {
      requestHandler.sendError(req, res, e);
    }
  }
}
module.exports = RedirectController;
