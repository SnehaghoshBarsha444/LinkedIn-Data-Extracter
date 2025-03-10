function extractProfileData() {
    let profileData = {};

    function getText(selector) {
        let el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
    }

    profileData.name = getText(".text-heading-xlarge");
    profileData.headline = getText(".text-body-medium.break-words");
    profileData.location = getText(".text-body-small.inline.t-black--light.break-words");
    profileData.currentJob = getText(".pv-text-details__right-panel-item");

    let contactButton = document.querySelector("a[href*='contact-info']");
    if (contactButton) {
        contactButton.click();

        setTimeout(() => {
            let emailElement = document.querySelector("a[href^='mailto:']");
            profileData.email = emailElement ? emailElement.innerText.trim() : "N/A";

            chrome.runtime.sendMessage({ profileData: profileData });
        }, 2000);
    } else {
        chrome.runtime.sendMessage({ profileData: profileData });
    }
}

// Listener to receive message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProfileData") {
        extractProfileData();
    }
});
