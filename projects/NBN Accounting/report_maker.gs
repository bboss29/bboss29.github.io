/*
  Abbreviations
    ss = spreadsheet
    VPS = vacation, personal, sick days
    NSE = non-store expenses (purchasing materials)
*/

function onOpen(e) { // create menu and update calendar when ss is opened
    SpreadsheetApp.getUi()
        .createMenu('NBN')
        .addItem("Send Emails", 'makeReport')
        .addItem("Update Calendar", "update_calendar")
        .addToUi();
    update_calendar();
}

function update_calendar(){ // add requests off to the calendar
    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var v_ss = SpreadsheetApp.openById('### REDACTED ###');
    var data = v_ss.getRange("A2:F").getDisplayValues();
    var cal = CalendarApp.getCalendarById("### REDACTED ###");

    ss.toast("Updating NBN Vacation Calendar...");

    var min_date = new Date();
    var max_date = new Date();
    for (var date in data) {
        var s_date = new Date(data[date][3]);
        var e_date = new Date(data[date][4]);
        if (e_date.getTime() > max_date.getTime())
            max_date = e_date;
        if (s_date.getTime() < min_date.getTime())
            min_date = s_date;
    }
    max_date.setDate(max_date.getDate() + 1);

    var existing = {};
    var existing_events = cal.getEvents(min_date, max_date);
    for (var date in existing_events){
        if (existing[existing_events[date].getAllDayStartDate().getTime()] === undefined)
            existing[existing_events[date].getAllDayStartDate().getTime()] = [existing_events[date].getTitle()];
        else
            existing[existing_events[date].getAllDayStartDate().getTime()].push(existing_events[date].getTitle());
    }

    var count = 0;
    var adminEmails = "### REDACTED ###";
    for (var dat in data) {
        var d = data[dat];

        var color = "";
        switch (d[2]) {
            case "Personal Day":
                color = CalendarApp.EventColor.BLUE;
                break;
            case "Sick Day":
                color = CalendarApp.EventColor.RED;
                break;
            case "Vacation Day":
                color = CalendarApp.EventColor.GREEN;
                break;
            case "Bonus Day":
                color = CalendarApp.EventColor.YELLOW;
                break;
            default:
                color = CalendarApp.EventColor.GRAY;
        }

        if (d[0].length === "") break;
        if (existing[(new Date(d[3])).getTime()] !== undefined)// if event is defined
            if (existing[(new Date(d[3])).getTime()].indexOf(d[1]) !== -1)// check if event title is employee name
                continue; // if true, event already exists and skip creating


        if (d[4].length < 3) {
            cal.createAllDayEvent(
                d[1],
                new Date(d[3]),
                {
                    description:
                    'Request Type: ' + d[2] +
                    '\nRequested on: ' + d[0] +
                    '\nComments:\n' + d[5],
                    guests: d[1] + adminEmails,
                    sendInvites: true
                }
            ).setColor(color);
        } else {
            var end_date = new Date(d[4]);
            cal.createAllDayEvent(
                d[1],
                new Date(d[3]),
                new Date(end_date.setDate(end_date.getDate() + 1)),
                {
                    description:
                    'Request Type: ' + d[2] +
                    '\nRequested on: ' + d[0] +
                    '\nComments:\n' + d[5],
                    guests: d[1] + adminEmails,
                    sendInvites: true
                }
            ).setColor(color);
        }
        count = count + 1;
    }
    ss.toast(count + " new event(s) added", "NBN Vacation Calendar is up to date", 4);
}

function sort(){ // sort by employee name
    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var hd_ss = ss.getSheetByName('hd_data');
    hd_ss.getRange('A:J').sort([3,2]);

    getVPS_NSE();
}

function getVPS_NSE(){ // get last pay period's vps & nse data and generate report
    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var e_ss = SpreadsheetApp.openById('### REDACTED ###');
    var v_ss = SpreadsheetApp.openById('### REDACTED ###');

    var today = new Date();
    var t = today.getTime();

    var e = e_ss.getRange('A:F').getDisplayValues();
    var out_e = [e[0]];

    for (var i in e){
        if (e[i][0] === "") break;

        var d = new Date(e[i][0]);
        var dt = d.getTime();
        if (Math.floor((t - dt)/(24*3600*1000)) < 8){ // EDIT 2/11/2020: changed 7 ==> 8
            out_e.push(e[i]);
        }
    }

    var v = v_ss.getRange('A:F').getDisplayValues();
    var out_v = [v[0]];

    for (var i in v){
        if (v[i][0] === "") break;

        var d = new Date(v[i][0]);
        var requestDate = new Date(v[i][4]);
        var rdt = requestDate.getTime();
        var dt = d.getTime();

        var fromLastWeek = Math.floor((t - dt)/(24*3600*1000)) <= 7;
        var inTheFuture = Math.floor((t - rdt)/(24*3600*1000)) <= 0;

        if (fromLastWeek || inTheFuture){
            out_v.push(v[i]);
        }

    }

    var sheet = ss.getSheetByName("VPS_NSE");
    sheet.clear();
    sheet.getRange(1, 1, out_e.length, 6).setValues(out_e);
    sheet.getRange(3 + out_e.length, 1, out_v.length, 6).setValues(out_v);

    return [out_e, out_v];

}

function makeReport() { // generate report from help desk data, add to individual sheets and send emails
    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var hd_ss = ss.getSheetByName('hd_data');
    var hd = hd_ss.getRange('A:J').getDisplayValues();
    hd_ss.getRange('A:J').sort([3,2]);

    var data = {};
    for (var i = 0; i < hd.length; i++)
        if (hd[i][2] !== "")
            data[hd[i][2]] = [];

    for (var i = 0; i < hd.length; i++){
        var row = hd[i];
        if (row[2] === "")
            break;

        var out = {
            "ticket_num":row[0],
            "timestamp":row[1],
            "name":row[2],
            "store_name":row[3],
            "store_num":row[4],
            "hours":row[5],
            "g_expense":row[6],
            "### [material vendor] ###_expense":row[7],
            "overnight":row[8] !== 0 ? "Yes" : "No",
            "comments":row[9]
        };

        data[row[2]].push([
            out["ticket_num"],
            out["timestamp"],
            out["store_num"],
            out["hours"],
            out["g_expense"],
            out["### [material vendor] ###_expense"],
            out["overnight"],
            out["comments"]
        ]);
    }



    for (var name in data){
        var sheet = ss.getSheetByName(name);
        if (sheet == null)
            continue;
        sheet.clear();
        sheet.getRange("A1:H1").setValues([["Ticket #", "Timestamp", "Store #", "Hours", "General Expenses", "### [Material Vendor] ###", "Overnight", "Description"]]);
        sheet.getRange(2, 1, data[name].length, 8).setValues(data[name]);
        sheet.getRange("H:H").setWrap(true);

        var totals = {
            "hours":0.0,
            "expenses":0.0
        };

        for (var i = 0; i < data[name].length; i++){
            totals["hours"] += parseFloat(data[name][i][3]);
            totals["expenses"] += parseFloat(data[name][i][4]);
            totals["expenses"] += parseFloat(data[name][i][5]);
        }

        totals["expenses"] = totals["expenses"].toFixed(2);

        sheet.getRange(data[name].length + 2, 3, 1, 3).setValues([["Totals",totals["hours"],totals["expenses"]]]);
        data[name].push(totals);
    }
    sendEmail(data);

}

function sendEmail(data){ // generate and send email
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Send Emails?', ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response === ui.Button.YES) {
        SpreadsheetApp.getActiveSpreadsheet().toast('Sending Emails...');
    } else {
        return;
    }

    var ss = SpreadsheetApp.openById('### REDACTED ###');
    var emails = { // ### [ dict of employee names and emails] ###
        "### [name] ###":"### [email] ###"
    };

    var adminTable = "";

    for (var name in data){
        var sheet = ss.getSheetByName(name);
        if (sheet == null)
            continue;

        var range = sheet.getRange(1,1,data[name].length + 2,8);

        var table = '<table border="1">';
        for (var i = 0; i < range.getDisplayValues()[0].length; i++){
            table += '<th style="white-space: nowrap">' + range.getDisplayValues()[0][i] + "</th>";
        }

        for (var i = 0; i < data[name].length - 1; i++){
            table += "<tr>";
            for (var j = 0; j < data[name][i].length; j++){
                table += "<td>" + data[name][i][j] + "</td>";
            }
            table += "</tr>";
        }
        table += '<tr><th colspan="2"></th><th>Total</th><th>'
            + data[name][data[name].length - 1]["hours"] + '</th><th colspan= "2">'
            + data[name][data[name].length - 1]["expenses"] + '</th><th colspan= "2"></th>';
        table += "</table>";

        MailApp.sendEmail({
            to:emails[name],
            subject:"Hours & Expense Review",
            htmlBody:"Hello " + name + ",<br>here is your hours/expense report from last week:<br>"+
            "If there is any missing or incorrect information, please let me know<br><br>" + table + "<br><br>Thanks"
        });

        adminTable += "<br><br><h2>" + name + "</h2><br>";
        adminTable += table;

    }

    var vps_nse = getVPS_NSE();
    var data = vps_nse;
    var table = "<br>";
    var heading = ["Non Store Expenses","Vacation, Personal, Sick Days"];

    data[0][0][2] = "What is the expense for?";

    for (var i = 0; i < data.length; i++){
        table += '<h2>'+ heading[i] + '</h2>';
        table += '<table border="1">';
        for (var j = 0; j < data[i].length; j++){
            table += '<tr>';
            for (var k = 0; k < data[i][j].length; k++){
                table += '<td>' + data[i][j][k] + '</td>';
            }
            table += '</tr>';
        }
        table += "</table>";
    }

    adminTable += table;



    MailApp.sendEmail({
        to:"### [nbn manager distribution list] ###",
        subject:"Hours & Expense Review",
        htmlBody:"Hello, here are the Hours and Expenses from the guys for last week: <br><br>" + adminTable + "<br><br>Thanks"
    });

    SpreadsheetApp.getActiveSpreadsheet().toast('Complete');
}


