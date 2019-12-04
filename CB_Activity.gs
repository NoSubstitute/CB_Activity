/**
List Org Unit, Chrome Device Serial Number, OS Version, Last Synced User, Last Sync Date, Device Status and MAC Addresses to Sheet and sorts by OU.
Also, in the Sheet in cell H1 I put =NOW() and in H2 I put this to calculate how many days since last sync.

=ARRAYFORMULA(DATEDIF(E2:E;H1;”D”))

I then colour code that with conditional formatting.
*/
function listCrOS()
{
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devices');
var deviceArray = [["Org Unit Path","Serial Number","OS Version","Most Recent User","Last Sync", "Status", "MAC"]];
var pageToken, page;
do
{
var response = AdminDirectory.Chromeosdevices.list('my_customer',{ pageToken: pageToken});
var devices = response.chromeosdevices;
if (devices && devices.length > 0) {
for (i = 0; i < devices.length; i++) {
 var device = devices[i];
 if(device.recentUsers !== undefined)
 {
   deviceArray.push([device.orgUnitPath, device.serialNumber, device.osVersion, device.recentUsers[0].email, new Date(device.lastSync), device.status, device.macAddress]);
 }
}
}
pageToken = response.nextPageToken;
}
while(pageToken);
sheet.getRange(1, 1, deviceArray.length, deviceArray[0].length).setValues(deviceArray);
  var range = sheet.getRange("A2:G");
  range.sort(1);
}
