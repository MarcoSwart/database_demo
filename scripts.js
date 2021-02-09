// Client ID and API key from the Developer Console
var CLIENT_ID = '374215012772-g9f3hhiqfelp662h12qjv20f9vd14dkt.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDhFXX9Rg8G2EBeDUjeFhuPr3Z9AdjaNeI';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive';

var authorizeButton = document.getElementById('authorize_button');
var listFilesButton = document.getElementById('list_files_button');
var listFoldersButton = document.getElementById('list_folders_button');
var listSheetsButton = document.getElementById('list_sheets_button');
var createFolderButton = document.getElementById('create_folder_button');
var folderTextField = document.getElementById('folder_text');
var createSheetButton = document.getElementById('create_sheet_button');
var sheetTextField = document.getElementById('sheet_text');
var addToSpreadsheetButton = document.getElementById('add_to_spreadsheet_button');
var productNameTextField = document.getElementById('product_name_text');
var spreadsheetLabel = document.getElementById('spreadsheet_label');
var spreadsheetSelect = document.getElementById('spreadsheet_select');
var purchasedLabel = document.getElementById('purchased_label');
var purchasedSelect = document.getElementById('purchased_select');
var googleSheetContainer = document.getElementById("google_sheets_column");
var createFolderContainer = document.getElementById("create_folder_container");
var outputContainer = document.getElementById("output_container");
var signoutButton = document.getElementById('signout_button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        listFilesButton.onclick = listFiles;
        listFoldersButton.onclick = listFolders;
        listSheetsButton.onclick = listSheets;
        createFolderButton.onclick = createFolder;
        createSheetButton.onclick = createSpreadSheet;
        addToSpreadsheetButton.onclick = addSpreadSheetData;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        addSheetsToSelect();
        authorizeButton.style.display = 'none';
        listFilesButton.style.display = 'block';
        listFoldersButton.style.display = 'block';
        listSheetsButton.style.display = 'block';
        createFolderButton.style.display = 'block';
        createSheetButton.style.display = 'block';
        folderTextField.style.display = 'block';
        sheetTextField.style.display = 'block';
        signoutButton.style.display = 'block';
        addToSpreadsheetButton.style.display = 'block';
        productNameTextField.style.display = 'block';
        spreadsheetLabel.style.display = 'block';
        spreadsheetSelect.style.display = 'block';
        purchasedLabel.style.display = 'block';
        purchasedSelect.style.display = 'block';
        googleSheetContainer.style.display = 'block';
        createFolderContainer.style.display = 'block';
        outputContainer.style.display = 'block';
    } else {
        document.getElementById('content').innerHTML = "";
        authorizeButton.style.display = 'block';
        listFilesButton.style.display = 'none';
        listFoldersButton.style.display = 'none';
        listSheetsButton.style.display = 'none';
        createFolderButton.style.display = 'none';
        createSheetButton.style.display = 'none';
        signoutButton.style.display = 'none';
        folderTextField.style.display = 'none';
        sheetTextField.style.display = 'none';
        addToSpreadsheetButton.style.display = 'none';
        productNameTextField.style.display = 'none';
        spreadsheetLabel.style.display = 'none';
        spreadsheetSelect.style.display = 'none';
        purchasedLabel.style.display = 'none';
        purchasedSelect.style.display = 'none';
        googleSheetContainer.style.display = 'none';
        createFolderContainer.style.display = 'none';
        outputContainer.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
    document.getElementById('content').innerHTML = "";
    gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files?q=mimeType != 'application/vnd.google-apps.folder'"
    }).then(function (response) {
        appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

function listFolders() {
    document.getElementById('content').innerHTML = "";
    gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files?q=mimeType = 'application/vnd.google-apps.folder'"
    }).then(function (response) {
        appendPre('Folders:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

function listSheets() {
    document.getElementById('content').innerHTML = "";
    gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files?q=mimeType = 'application/vnd.google-apps.spreadsheet'"
    }).then(function (response) {
        appendPre('Sheets:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

function createFolder() {
    document.getElementById('content').innerHTML = "";
    let folderName = folderTextField.value;
    folderTextField.value = "";
    gapi.client.request({
        path: 'https://www.googleapis.com/drive/v3/files',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: {
            name: `${folderName}`,
            mimeType: "application/vnd.google-apps.folder",
        }
    }).then(function (response) {
    });

}

function createSpreadSheet() {
    document.getElementById('content').innerHTML = "";
    let sheetName = sheetTextField.value;
    sheetTextField.value = "";
    gapi.client.request({
        path: 'https://sheets.googleapis.com/v4/spreadsheets',
        method: 'POST',
        body: {
            properties: {
                title: `${sheetName}`,
            }
        }
    }).then(function (response) {
        addSheetsToSelect();
    });

}

function addSheetsToSelect() {
    let sheetSelect = spreadsheetSelect;
    gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files?q=mimeType = 'application/vnd.google-apps.spreadsheet'"
    }).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var option = document.createElement("option");
                var file = files[i];
                option.value = file.id;
                option.text = file.name + ' (' + file.id + ')';
                sheetSelect.add(option, sheetSelect[i + 1]);
            }
        }
    });
}

function addSpreadSheetData() {
    document.getElementById('content').innerHTML = "";
    let spreadsheetId = spreadsheetSelect.value;
    let productName = productNameTextField.value;
    let purchase = purchasedSelect.value;
    productNameTextField.value = "";
    spreadsheetSelect.value = "";
    purchasedSelect.value = "";
    gapi.client.request({
        path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:B1:append?valueInputOption=USER_ENTERED`,
        method: 'POST',
        body: {
            values: [
                [`${productName}`, purchase],
            ],
        }
    }).then(function (response) {

    });

}