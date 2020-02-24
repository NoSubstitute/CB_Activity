/**
Lists Org Unit, Chrome Device Serial Number, OS Version, Last Synced User, Last Sync Date, device Status, MAC Adress and AUE to Sheet and sorts by OU.
Also, in the Sheet in cell I1 I put =NOW() and in I2 I put this to calculate how many days since last sync.

=ARRAYFORMULA(IF(LEN(A2:A);DATEDIF(E2:E;I1;"D");))

If you replace new Date(device.lastSync) with only device.lastSync you will get the full text string in the Last sync column, instead of a date object.
Then you need to re-write the formula in I2, to only include the beginning of the date value in the calculation.
This formula will do that. =ARRAYFORMULA(IF(LEN(A2:A);DATEDIF(LEFT(E2:E;10);I1;"D");))

I then colour code that with conditional formatting to differentiate between recently used devices and stale devices.
*/
function listCrOS()
{
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devices');
var deviceArray = [["Org Unit Path","Serial Number","OS Version","Most Recent User","Last Sync", "Status", "MAC", "AUE"]];
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
   deviceArray.push([device.orgUnitPath, device.serialNumber, device.osVersion, device.recentUsers[0].email, new Date(device.lastSync), device.status, device.macAddress, device.autoUpdateExpiration]);
  // If you replace new Date(device.lastSync) with only device.lastSync you will get the full text string in the Last sync column, instead of a date object.
  // Then you need to re-write the formula in I2, to only include the beginning of the date value in the calculation.
  // This formula will do that. =ARRAYFORMULA(IF(LEN(A2:A);DATEDIF(LEFT(E2:E;10);I1;"D");))
 }
}
}
pageToken = response.nextPageToken;
}
while(pageToken);
sheet.getRange(1, 1, deviceArray.length, 8).setValues(deviceArray);
  var range = sheet.getRange("A2:H");
  range.sort(1);
}
