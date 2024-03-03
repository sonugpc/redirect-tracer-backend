const RequestHandler = require("../utills/RequestHandler");
const cheerio = require("cheerio");
const { default: axios } = require("axios");

const requestHandler = new RequestHandler();

class RedirectController {
  static async traceRedirect(req, res) {
    const shortUrl = req.body.shortUrl;
    const redirectUrls = []; // Array to store the URLs in the redirect chain
    let currentUrl = shortUrl; // Start with the short URL
    const maxRedirects = 5; // set max redirects to follow

    try {
      const followRedirects = async (currentUrl, redirectUrls) => {
        if (redirectUrls.length >= maxRedirects) {
          return redirectUrls;
        }

        try {
          const response = await axios.request({
            url: currentUrl,
            method: "GET",
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 309,
          });

          const redirectInfo = {
            statusCode: response.status,
            redirectType: "Direct", // Default to 'Direct', will be updated based on the type of redirect
            url: currentUrl,
          };

          if (response.status === 301 || response.status === 302) {
            currentUrl = response.headers.location; // Update current URL
            redirectInfo.redirectType = "Redirect";
            redirectInfo.followUrl = currentUrl;
            redirectUrls.push(redirectInfo);
            return followRedirects(currentUrl, redirectUrls);
          } else if (response.status === 200) {
            if (response.data.length >= 4000) {
              const redirectInfo = {
                statusCode: response.status,
                redirectType: "Trace Complete",
                url: currentUrl,
                followUrl: currentUrl,
              };
              redirectUrls.push(redirectInfo);
              return redirectUrls; // DOM length is too High
            } else {
              const $ = cheerio.load(response.data);
              const refreshUrl = $("meta[http-equiv='refresh']").attr(
                "content"
              );
              if (refreshUrl) {
                const regex =
                  /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                const newUrl = refreshUrl.match(regex)[0];
                redirectInfo.redirectType = "HTTP-META-REFRESH";
                redirectInfo.followUrl = newUrl;
                redirectUrls.push(redirectInfo);
                return followRedirects(newUrl, redirectUrls);
              }
            }
          }
        } catch (error) {
          let redirectInfo = {};
          // Handle the error within the function
          redirectInfo = {
            statusCode: error.response ? error.response.status : "Unknown",
            message: error.message,
            followUrl: currentUrl,
            redirectType: "URL Trace Error",
            error: true,
          };
          redirectUrls.push(redirectInfo);
        }

        // Continue to the next step in the redirect chain
        return redirectUrls;
      };

      const result = await followRedirects(currentUrl, redirectUrls);

      requestHandler.sendSuccess(
        req,
        res,
        "Successfully Fetched Redirect URL",

        result
      );
    } catch (e) {
      requestHandler.sendError(req, res, e);
    }
  }
}

module.exports = RedirectController;
