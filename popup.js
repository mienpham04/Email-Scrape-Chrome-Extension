let scrapeEmails = document.getElementById("scrapeEmails");
let list = document.getElementById("emailList");

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // get emails
  let emails = request.emails;

  // display emails on popup
  if (emails == null || emails.length == 0) {
    // no emails
    let li = document.createElement("li");
    li.innerText = "No emails found";
    list.appendChild(li);
  } else {
    // display emails
    emails.forEach((email) => {
      let li = document.createElement("li");
      li.innerText = email;
      list.appendChild(li);
    });
  }
});

// button's click event listener
scrapeEmails.addEventListener("click", async () => {
  // get current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // execute script to parse emails on page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmailsFromPage,
  });
});

// main function to scrape email
function scrapeEmailsFromPage() {
  // RegEx to parse emails from html code
  const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

  // parse emails from the HTML of the page
  let emails = document.body.innerHTML.match(emailRegEx);

  // Send emails to popup
  chrome.runtime.sendMessage({ emails });
}
