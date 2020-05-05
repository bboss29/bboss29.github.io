/*
  Purchasing Project
  Google Apps Script

  Proprietary info redacted

  Abbreviations
    OG = order guide
    PO = purchase order
    WT = walkthrough
    ss = spreadsheet
*/

function capitalize() {  // Capitalize item names on inventory sheet for consistency
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var range = ss.getSheetByName("Inventory").getRange("A2:A");
    var items = range.getDisplayValues();
    for ( var item = 0; item < items.length; item++){
        items[item][0] = items[item][0].toUpperCase();
    }
    range.setValues(items);
}

function markOG() { // sync the order guide sheet with vendor order & vendor delivery dates
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var og = ss.getSheetByName("OG");
    var vendors = makeVendors()[0];
    var ogv = og.getRange("B2:B").getDisplayValues(); // order guide vendors
    var days = ["Thu","Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
    var out = [];
    for (var row = 0; row < ogv.length; row++) {
        var outrow = [];
        for (var d = 0; d < days.length; d++) {
            if (typeof(vendors[ogv[row][0]]) === 'undefined') {
                outrow.push("#c9daf8");
                outrow.push("#c9daf8");
            }
            else if (vendors[ogv[row][0]][days[d]].indexOf("O") !== -1) {
                outrow.push("white");
                outrow.push("white");
            } else {
                outrow.push("gray");
                outrow.push("gray");
            }
        }
        out.push(outrow);
    }
    og.getRange(2, 6, out.length, 14).setBackgrounds(out);
}

function onOpen(e) {  // create ### [Restaurant Name] ### menu and unhide all sheets
    SpreadsheetApp.getUi()
        .createMenu('### [Restaurant Name] ###')
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Update Pricing')
            .addItem('All', 'update_all')
            .addItem('Produce', 'produce')
            .addItem('Inventory', 'INV_pricing')
            .addItem('OG', 'OG_info'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Prep Sheets')
            .addItem('Create', 'writePrep')
            .addItem('Delete', 'deletePrepSheets'))
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Purchase Orders')
            .addItem('Create', 'writePOs')
            .addItem('Delete', 'deletePOs'))
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Printing')
            .addItem('Create All', 'write_all')
            .addItem('Delete All', 'delete_all')
            .addItem('Show Sheets', 'show_sheets')
            .addItem('Hide Sheets', 'hide_sheets'))
        .addSeparator()
        .addItem("Archive", 'archive')
        .addToUi();
    show_sheets();
}

function onEdit(e) { // maintain consistency when names are changed

    if (e.range.getSheet().getName() === "Items" && e.range.getColumn() === 4)
        fixItemName(e);

    if (e.range.getSheet().getName() === "Items" && e.range.getColumn() === 8)
        update_all();

    if (e.range.getSheet().getName() === "Produce" || e.range.getSheet().getName() === "Produce Prices")
        produce();
}

function write_all() {  // create prep sheets and purchase orders and format ss for printing
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.toast('Writing Prep Sheets...');
    writePrep();
    ss.toast('Writing Purchase Orders...');
    writePOs();
    ss.toast('Complete');
    hide_sheets();
}

function delete_all() { // delete prep sheet and purchase orders and format ss for editing
    show_sheets();
    deletePrepSheets();
    deletePOs();
}

function update_all() { // synchronize names and prices across ss
    produce();
    OG_info();
    INV_pricing();
}

function hide_sheets() { // hide editing sheets
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();

    if (sheets.length <= 9)
        return;

    for (var i = 0; i < 7; i++)
        sheets[i].hideSheet();
}

function show_sheets() { // show editing sheets
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    for (var i = 0; i < 7; i++)
        sheets[i].showSheet();
}

function fixItemName(e) { // name consistency items ==> inventory, OG, Produce
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ["Inventory", "OG", "Produce"];
    for ( var s in sheets) {
        var sheet = ss.getSheetByName(sheets[s]);
        var max = sheet.getMaxRows();
        var r = sheet.getRange("A:A").getDisplayValues();
        for (var row = 0; row < max; row++)
            if (r[row][0] === e.oldValue)
                sheet.getRange(row + 1, 1).setValue(e.value)
    }
}

function deletePrepSheets() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var prep = makePrep();
    var pNames = [];
    for (var i in prep)
        if (pNames.indexOf(prep[i]["Prep"]) === -1)
            pNames.push(prep[i]["Prep"]);
    for (var n in pNames) {
        var name = pNames[n];
        try {
            ss.deleteSheet(ss.getSheetByName(name));
        } catch (e) {

        }
    }
}
// example prep dict object
// SLICED CUCUMBERS={=#N/A, Monday={ORD=2!!, OH=0}, Prep=PANTRY, Unit=Gal, Item=Sliced Cucumbers, Price=#N/A, inv_price=0.0, Shelf Life=3}
function writePrep() { // create prep sheets and write data from makePrep()
    deletePrepSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var date = new Date();
    var today = Utilities.formatDate(date, "GMT-5", "EEEEEEEEEEE, MM/dd/yyyy");
    var t = Utilities.formatDate(date, "GMT-5", "EEEEEEEEEEE");
    ss.getSheetByName('Prep Template').showSheet();

    // create list of prep sheet names
    var pt = ss.getSheetByName('Prep Template');
    var prep = makePrep();
    var pNames = [];
    for (var i in prep)
        if (pNames.indexOf(prep[i]["Prep"]) === -1)
            pNames.push(prep[i]["Prep"]);

    // for loop to iterate through list
    for (var n in pNames) {
        var name = pNames[n];
        // init prep data list
        // check data from prepDict, push to data
        var prepData = [
            [today, "### [Restaurant Name] ###", name + " PREP","",""],
            ["UNIT", "ITEM", "AMT PREP", "TIME PREP", "SIGN OFF"]
        ];

        for (var i in prep) {
            var item = prep[i];
            if (item["Prep"] === name)
                prepData.push([
                    item["Unit"],
                    item["Item"],
                    item[t]["ORD"],
                    "",
                    ""
                ]);
        }
        try {
            var sheet = ss.getSheetByName('Prep Template').copyTo(ss).setName(name);
        } catch (e) { //TODO clean overwrite
            ss.deleteSheet(ss.getSheetByName("Copy of Prep Template"));
            ss.deleteSheet(ss.getSheetByName(name));
            var sheet = ss.getSheetByName('Prep Template').copyTo(ss).setName(name);
        }
        sheet.insertRows(3, prepData.length);
        sheet.getRange(1, 1, prepData.length, 5)
            .setBorder(true,true,true,true,true,true)
            .setValues(prepData);
    }
    ss.getSheetByName('Prep Template').hideSheet();
}


function makePrep() { // read prep data from wt
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ws = ss.getSheetByName("Walkthrough");
    var prepDict = {};
    var cols = ws.getRange("1:1").getNumColumns();
    var r = ws.getRange("A1:T").getDisplayValues();
    var dcheck_inaccurate = false;

    for (var i = 1; i < r.length; i++) {
        var f = r[i];
        if (f[1].length === 0)
            continue;

        var item = f[0].toUpperCase();
        prepDict[item] = {};
        for (var d = 0; d < cols; d++) {
            if (d > 3 && d < 18) {
                if (d % 2 === 0){
                    prepDict[item][r[0][d]] = {
                        "OH":f[d],
                        "ORD":f[d+1]
                    }
                }
            } else {
                prepDict[item][r[0][d]] = f[d];
            }
        }

        var res = parseFloat(prepDict[item]["Thursday"]["OH"].replace("$","")) * parseFloat(prepDict[item]["Price"].replace("$",""));
        prepDict[item]["inv_price"] = isNaN(res) ? 0 : res;
        if (isNaN(res)) {
            if (!((prepDict[item]["Thursday"]["OH"] === "") || (prepDict[item]["Price"] === "")))
                dcheck_inaccurate = true;
        }

    }

    var dcheck = 0.0;
    for (var p in prepDict) {
        dcheck += prepDict[p]["inv_price"];
    }
    var inv_sheet = ss.getSheetByName("Inventory");
    inv_sheet.getRange(inv_sheet.getMaxRows() - 1, inv_sheet.getMaxColumns() - 1, 2).setValues([[dcheck], [dcheck_inaccurate ? "WARNING - Check walkthru price or # ordered!" : "OK!"]]);

    return prepDict;
}

function produce() { // read pricing from vendors sheet and apply to produce prices sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ps = ss.getSheetByName('Produce');
    var pps = ss.getSheetByName('Produce Prices');

    var pd = {}; // produce dict
    var r = ps.getRange("A1:J").getDisplayValues();
    var cols = ps.getRange("2:2").getNumColumns();
    for (var i = 2; i < r.length; i++) { // init pd with home and vendor names
        var f = r[i][0].toLowerCase();
        if (f.length === 0)
            break;

        pd[f] = {};
        for (var d = 3; d < cols; d++) {
            var col = r[1][d];
            pd[f][col] = {};
            if (d < 6)
                pd[f][col]["Price"] = r[i][d];
            else if (d >= 6)
                pd[f][col]["Name"] = r[i][d];
            else
                pd[f][col] = r[i][d];
        }
    }
    // update pd with pricing info
    var ppr = pps.getRange("A1:Q").getDisplayValues();
    var offsets = { // [description col index offset, price cio, vertical offset]
        "[PRODUCE VENDOR 1]":[2,5,3],
        "[PRODUCE VENDOR 2]":[8,10,3],
        "[PRODUCE VENDOR 3]":[13,15,19]
    };

    var ppd = {};
    for (var off in offsets) {
        var offset = offsets[off];
        ppd[off] = {};
        for (var i = offset[2]; i < ppr.length; i++) {
            var f = ppr[i][offset[0]];
            if (f.length === 0)
                break;
            ppd[off][f] = ppr[i][offset[1]]
        }
    }

    for (var off in offsets) {
        for (var item in pd){
            try {
                if (typeof ppd[off][pd[item][off]["Name"]] === "string")
                    pd[item][off]["Price"] = ppd[off][pd[item][off]["Name"]];
                else
                    pd[item][off]["Price"] = ""
            } catch (e) {

            }
        }
    }

    // write pricing info from pd to sheet. calc min
    var out = [];
    for (var i = 2; i < r.length; i++) {
        var f = r[i][0].toLowerCase();
        if (f.length === 0)
            break;
        out.push([
            "", // cheapest vendor
            "", // min price
            pd[f]["[PRODUCE VENDOR]"]["Price"],
            pd[f]["[PRODUCE VENDOR]"]["Price"],
            pd[f]["[PRODUCE VENDOR]"]["Price"]
        ]);
    }
    ps.getRange(3, 3, out.length, 5).setValues(out);
    selectProduce();
    INV_pricing();
    produceToItemsSheet();
}

function selectProduce() { // choose override, or choose lowest price
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ps = ss.getSheetByName('Produce');
    var r = ps.getRange("E3:G").getDisplayValues();
    var or = ps.getRange("B3:B").getDisplayValues(); //override range
    var out = [];
    var vendors = ["### [PRODUCE VENDOR] ###", "### [PRODUCE VENDOR] ###", "### [PRODUCE VENDOR] ###"];
    for (var row in r){
//    if (r[row][0].length == 0)
//      break;
        if (vendors.indexOf(or[row][0]) !== -1){
            out.push([or[row][0], r[row][vendors.indexOf(or[row][0])]])
        } else {
            var a = r[row].map(function(x){
                if (x.length === 0)
                    return 9999;
                return parseFloat(x.substr(1));
            });
            var res = Math.min.apply(null, a);
            var ven = vendors[a.indexOf(res)];

            if (res === 9999){
                res = "";
                ven = "";
            }
            out.push([ven, res]);
        }
    }
    ps.getRange(3, 3, out.length, 2).setValues(out);
}

// used in writePO(). test to make sure it can be safely deleted
function produceToItems(items) { // toItemsDict. TODO depreciate because produce items are on items sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ps = ss.getSheetByName('Produce');
    var pr = ps.getRange("A3:D").getDisplayValues();
    for (var i in pr) {
        var item = pr[i];
        if (item[0].length === 0)
            break;
        items[item[0].toUpperCase()] = {
            "Name": item[0].toUpperCase(),
            "Vendor":item[2],
            "Price": item[3],
            "Order Guide":"Produce",
            "Pack Size": "",
            "Item ID": ""
        };
    }
    return items;
}

function produceToItemsSheet() { // updates Item sheet with Produce prices + vendor
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ps = ss.getSheetByName('Produce');
    var is = ss.getSheetByName('Items');
    var pdv = ps.getRange("A3:D").getDisplayValues();
    var idv = is.getRange("D2:D").getDisplayValues();
    var p_items = [];
    var items = makeItems();
    for (var i in pdv) {
        var item = pdv[i];
        if (item[0].length === 0)
            break;
        p_items[item[0].toUpperCase()] = {
            "Name": item[0].toUpperCase(),
            "Vendor":item[2],
            "Price": item[3],
            "Order Guide":"Produce",
            "Pack Size": "",
            "Item ID": ""
        };
    }
    var price_out = [];
    var vendor_out = [];
    for (var i in idv) {
        var item = idv[i][0].toUpperCase();
        if (item.length === 0)
            break;
        var pi = p_items[item]; //produce item
        if (typeof pi === 'undefined') {
            vendor_out.push([items[item]["Vendor"]]);
            price_out.push([items[item]["Price"]]);
        } else {
            vendor_out.push([pi["Vendor"]]);
            price_out.push([pi["Price"]]);
        }
    }

    is.getRange(2, 10, vendor_out.length).setValues(vendor_out);
    is.getRange(2, 8, price_out.length).setValues(price_out);
}

function archive() {  // archive ss, then clear ss
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Display a dialog box with a message and "Yes" and "No" buttons.
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Clear and archive?', ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response === ui.Button.NO) {
        ss.toast("Archiving cancelled");
        return;
    }


    var OG = ss.getSheetByName('OG');
    var IS = ss.getSheetByName('Items');
    var WS = ss.getSheetByName('Walkthrough');

    var name = "### [RESTAURANT] ### Walkthru Archive: Week #" + Utilities.formatDate(new Date(), "GMT-5", "ww, MM/dd/yyyy");

//  # CREATE ARCHIVE FILE
    var ssNew = SpreadsheetApp.create(name);
    var file = DriveApp.getFileById(ssNew.getId());
    var folder = DriveApp.getFolderById('### REDACTED ###');

    ss.toast('Archiving...', 'Archive');

    OG.copyTo(ssNew);
    IS.copyTo(ssNew);
    WS.copyTo(ssNew);

    var OGSheet = ssNew.getSheets()[1];
    var ISheet = ssNew.getSheets()[2];
    var WSheet = ssNew.getSheets()[3];

    OGSheet.setName('OG');
    ISheet.setName('Items');
    WSheet.setName('Walkthrough');

    ssNew.deleteSheet(ssNew.getSheets()[0]);
    file.makeCopy(folder).setName(file.getName());
    file.setTrashed(true);

    ss.toast('Done', 'Archive');

    OG.getRange("F2:S").clearContent();
    WS.getRange("E2:R").clearContent();
    ss.getSheetByName("Inventory").getRange("C4:C").clearContent();

    deletePrepSheets();
    deletePOs();
}

function deletePOs() { // deletes PO sheets
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vendors = makeVendors()[0];
    for (var vendor in vendors) {
        var v = vendors[vendor]["Short Name"];
        try {
            ss.deleteSheet(ss.getSheetByName(v));
        } catch (e) {

        }
    }
}

function writePOs() { // create and populate PO sheets
    deletePOs();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vendors = makeVendors()[1];   // 0 --> 1
    var items = OGtoItems(produceToItems(makeItems()));  // comprehensive items dict
    var date = new Date();
    var today = Utilities.formatDate(date, "GMT-5", "E");
    var long_today = Utilities.formatDate(date, "GMT-5", "EEE MMMMMMMMMM d yyyy");
    ss.getSheetByName('POTemplate').showSheet();

    for (var vendor in vendors) {
        var v = vendors[vendor];

        var POdata = [
            [v["Long Name"]+" Purchase Order",,,,,,],
            ["Contact:",v["Representative"],,"Delivery Date:","",,],
            ["","","","","",""],
            ["Ordered By:","","","Phone Number:",v["Phone"],,],
            ["","","","","",""],
            ["Order Date",long_today,,"Customer #:",v["Account #"],,],
            ["","","","","",""],
            ["Quantity","Product Code","Pack Size","Description","Price","Extension"]
        ];

        for (var item in items) {
            var i = items[item];
            if (i["Vendor"] === v["Short Name"] && typeof i["ORD"] !== 'undefined' && i["ORD"][today] !== "" && i["ORD"][today] !== 0){
                var price = i["Price"] !== "" ? "$" + (parseFloat(i["ORD"][today]) * parseFloat(i["Price"].replace("$",""))).toFixed(2) : "";
                POdata.push([
                    i["ORD"][today],
                    i["Item ID"],
                    i["Pack Size"],
                    i["Name"],
                    i["Price"],
                    price
                ])
            }
        }
        if (POdata.length === 8)
            continue;

        try {
            var sheet = ss.getSheetByName('POTemplate').copyTo(ss).setName(v["Short Name"]);
        } catch (e) { //TODO clean overwrite
            ss.deleteSheet(ss.getSheetByName("Copy of POTemplate"));
            ss.deleteSheet(ss.getSheetByName(v["Short Name"]));
            var sheet = ss.getSheetByName('POTemplate').copyTo(ss).setName(v["Short Name"]);
        }

        if (POdata.length > 30)
            sheet.insertRows(30, POdata.length - 30);
        sheet.getRange(2, 1, POdata.length, 6).setValues(POdata);
    }

    ss.getSheetByName('POTemplate').hideSheet()

}

function makeVendors(){ // returns vendor info dict
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vs = ss.getSheetByName("Vendors");
    var vendors = {};
    var cols = vs.getRange("1:1").getNumColumns();
    var r = vs.getRange("A1:Q").getDisplayValues();
    for (var i = 1; i < r.length; i++) {
        var f = r[i];
        if (f[0].length === 0)
            continue;

        vendors[f[0]] = {};
        for (var d = 0; d < cols; d++) {
            vendors[f[0]][r[0][d]] = f[d]
        }
    }

    var t_vendors = [];
    var date = new Date();
    var today = Utilities.formatDate(date, "GMT-5", "E");
    for (var v in vendors){
        if (vendors[v][today].indexOf("O") !== -1){ //vendors[v][today] == "x"
            t_vendors.push(vendors[v]);
        }
    }
    return [vendors, t_vendors];
}


function OGtoItems(items) { // append OG info to items dict
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var og = ss.getSheetByName("OG");
    var r = og.getRange("A1:S").getDisplayValues();
    var dates = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
    for (var i = 1; i < r.length; i++) {
        var f = r[i];
        var n = items[f[0].toUpperCase()];
        if (typeof n !== 'undefined'){
            n["ORD"] = {};
            for (var d = 0; d < dates.length; d++) {
                n["ORD"][dates[d]] = f[6 + d*2]
            }
            n["OH"] = {};
            for (var d = 0; d < dates.length; d++) {
                n["OH"][dates[d]] = f[5 + d*2]
            }
        }
    }
    return items;
}

function OG_info() { // write OG vendor, units & price. Items --> OG
    var items = makeItems();
    var OG = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OG");
    var names = OG.getRange("A2:A").getDisplayValues();
    var out = [];
    for (var name in names) {
        var n = names[name][0].toLowerCase();
        var add = ["","","",""];
        for (var item in items) {
            var i = items[item];
            var i_name = i["Name"].toLowerCase();
            if (n === i_name){
                add = [i["Vendor"], i["Count By"],i["Pack Size"], i["Price"]];
            }
        }
        out.push(add);
    }
    OG.getRange("B2:E").setValues(out);
}

function INV_pricing(){ //TODO Depreciate
    var items = makeItems();
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory");
    var names = ss.getRange("A4:A").getDisplayValues();
    var out = [];
    for (var name in names) {
        var n = names[name][0].toLowerCase();
        var add = [""];
        for (var item in items) {
            var i = items[item];
            var i_name = i["Name"].toLowerCase();
            if (n === i_name){
                add = [i["Price"]];
            }
        }
        out.push(add);
    }
    ss.getRange("D4:D").setValues(out);
}

function makeItems() { // create dictionary object from items sheet
    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var is = ss.getSheetByName("Items");
    var itemsDict = {};
    var cols = is.getRange("1:1").getNumColumns();
    var r = is.getRange("A1:M").getDisplayValues();
    for (var i = 1; i < r.length; i++) {
        var f = r[i];
        if (f[3].length === 0)
            continue;

        itemsDict[f[3].toUpperCase()] = {};
        for (var d = 0; d < cols; d++) {
            itemsDict[f[3].toUpperCase()][r[0][d]] = f[d]
        }
    }
    return itemsDict;
}
