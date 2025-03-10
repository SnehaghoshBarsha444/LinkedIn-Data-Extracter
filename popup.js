document.getElementById("extract").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            { target: { tabId: tabs[0].id }, files: ["content.js"] },
            () => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "getProfileData" });
            }
        );
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.profileData) {
        let profileData = message.profileData;
        let tableBody = document.getElementById("profile-data");

        let row = `<tr>
            <td>${profileData.name || "-"}</td>
            <td>${profileData.headline || "-"}</td>
            <td>${profileData.location || "-"}</td>
            <td>${profileData.currentJob || "-"}</td>
            <td>${profileData.email || "-"}</td>
        </tr>`;

        tableBody.innerHTML = row;
    }
});

document.getElementById("download").addEventListener("click", () => {
    let rows = document.querySelectorAll("table tr");
    let csvContent = "Name,Headline,Location,Current Job,Email\n";

    rows.forEach(row => {
        let cols = row.querySelectorAll("td");
        if (cols.length > 0) {
            let data = [];
            cols.forEach(col => data.push(`"${col.innerText}"`));
            csvContent += data.join(",") + "\n";
        }
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "LinkedIn_Profile_Data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
