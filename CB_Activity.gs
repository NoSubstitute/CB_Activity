/**
List Org Unit, Chrome Device Serial Number, OS Version, Most Recent User,Last Sync, Status, MAC, Recent Activity, AUE to Sheet and sort by OU.
Also, in the Sheet in cell J1 I put =NOW() and in J2 I put this to calculate how many days since last sync.

=ARRAYFORMULA(IF(LEN(A2:A);DATEDIF(LEFT(D2:D;10);J1;"D");))

I then colour code that with conditional formatting.
*/
function listCrOS()
{
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devices');
var deviceArray = [["Org Unit Path","Serial Number","Most Recent User","Last Sync", "Recent Activity", "Status","OS Version", "MAC", "AUE"]];
var pageToken, page;
do
{
var response = AdminDirectory.Chromeosdevices.list('my_customer',{ pageToken: pageToken});
var devices = response.chromeosdevices;
if (devices && devices.length > 0) {
for (i = 0; i < devices.length; i++) {
 var device = devices[i];
   if (device.recentUsers && device.recentUsers[0].email) {
   var recentUser = device.recentUsers[0].email} else {var recentUser = ""};
   if (device.activeTimeRanges && device.activeTimeRanges.length > 0) {
     var lastAT = (device.activeTimeRanges.length-1)
     var activeTimes = (device.activeTimeRanges[lastAT].activeTime/60000)
     var activeTime = Math.ceil(activeTimes)
     var activeTimeRanges = device.activeTimeRanges[lastAT].date + " " + activeTime + "min"
   } else {var activeTimeRanges = ""};
   if (device.lastSync) {
     // Format lastSync to only show first 10 characters and replace T with space, to separate date and time.
   var lastSync = device.lastSync.substring(0, 10).replace(/T/g, " ")} else {var lastSync = ""};   
 {
    deviceArray.push([device.orgUnitPath, device.serialNumber, recentUser, lastSync, activeTimeRanges, device.status, device.osVersion, device.macAddress, device.autoUpdateExpiration]); 

 }
}
}
pageToken = response.nextPageToken;
}
while(pageToken);
sheet.getRange(1, 1, deviceArray.length, 9).setValues(deviceArray);
  var range = sheet.getRange("A2:I");
  range.sort(1);
// Set the format of columns E and H to text, so its values aren't considered to be date objects.  
// Single column
var column = sheet.getRange("D2:D");
// Simple text format
column.setNumberFormat("@");
var column = sheet.getRange("E2:E");
// Simple text format
column.setNumberFormat("@");
}
