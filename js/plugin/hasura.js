$(document).ready(function () {
    setTimeout(function () {
        creatGetExcelButton();
    }, 2000); // 10000 milliseconds = 10 seconds
});

function openDashboard() {
    chrome.runtime.sendMessage({ action: 'openPage', data: 'dashboard.html' }, function (response) {
        console.log('Response:', response);
    });
}
function sendDatatoBackground(data) {
    chrome.runtime.sendMessage({ action: 'getExcel', data: data }, function (response) {
        console.log('Response:', response);
    }
    );
}
async function makeSQLQuery(sqlQuery) {
    const pageURL = window.location.href;
    //url = pageURL replace /console/data/sql with /v2/query
    const url = pageURL.replace(/\/console\/data\/sql$/, '');
    const secret = localStorage.getItem('console:adminSecret');
    return fetch(url + "/v2/query", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json",
            "hasura-client-name": "hasura-console",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-hasura-admin-secret": secret
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"type\":\"bulk\",\"source\":\"default\",\"args\":[{\"type\":\"run_sql\",\"args\":{\"source\":\"default\",\"sql\":" + JSON.stringify(sqlQuery) + ",\"cascade\":false,\"read_only\":false}}]}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data;
        })
        .catch(error => console.error('Error fetching URL:', error));

}


function creatGetExcelButton() {

    let runButton = $('button[type="submit"]');
    const sqlQuery = $('.ace_content').text();
    console.log(sqlQuery);

    // Check if runButton is correctly selected
    if (runButton.length) {
        // Copy the button and create a new button as a sibling i.e. get excel
        let getExcelButton = runButton.clone();
        getExcelButton.text('Get Excel');
        // Add a click event listener to the new button
        getExcelButton.on('click', getExcel);
        getExcelButton.insertAfter(runButton);
    } else {
        console.log('Submit button not found');
        setTimeout(creatGetExcelButton, 2000); // 10000 milliseconds = 10 seconds
    }
}

//EVENT

async function getExcel() {
    //  localstiogae rawSql:sql
    //  get the sql from localstorage

    openDashboard();
    const sqlQuery = localStorage.getItem('rawSql:sql');
    console.log(sqlQuery);
    const data = await makeSQLQuery(sqlQuery);
    console.log(data);
    //send data to background.js
    sendDatatoBackground(data);
}
