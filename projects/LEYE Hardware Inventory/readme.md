# Hardware Inventory Project

<img 
    src="https://img.shields.io/badge/development-inactive-red"
    alt="development-inactive">
<img 
    src="https://img.shields.io/badge/status-complete-brightgreen"
    alt="status-complete">
<img 
    src="https://img.shields.io/badge/REDACTED-orange"
    alt="redacted">
    
During my internship as a Help Desk technician in 2017, one of the major projects for the summer was updating our computer hardware inventory. Considering there were hundreds of devices to inventory in many different locations across the Chicagoland area, this project was expected to last the entire summer. The project involved two main tasks: 

>**A) collecting information such as the serial number and operating system (usually found on the physical sticker on the outside of the device) and** 

>**B) storing that information in one central repository.**

Initially, we accomplished tasks A and B via physical inspection and multiple Excel spreadsheets, respectively. However, delays and confusion were caused when the data on the sticker was illegible, inaccurate or inaccessible. The issues were exacerbated by a lack of a singular source of truth resulting from many different spreadsheets that were in conflict or that were incompatible with each other.

Undaunted by the setbacks, I set out to find an alternative solution. I learned that all of the information we were looking for and more was accessible via the command prompt, so I learned batchscript and created the first version of `getInfo.bat`. The initial version of `getInfo.bat`, ideally run from a flash drive, collects and stores the relevant info from the device much more efficiently than physical inspection. This solved task A). In addition to the inventory functionality, the final version of `getInfo.bat` functions as an IT multitool that can perform common and custom operations.

To solve task B), we needed to parse the files created in task A) and place the data in a singular source of truth. We decided that we would use a Google Spreadsheet as the repository, so all that remained was parsing the data and putting it on the Google spreadsheet- the express purpose of `toInventory.py`. `toInventory.py` will parse the inventory files in the given directory and send the data to the spreadsheet, saving a lot of time and minimizing confusion.

With these two solutions, we were able to complete the hardware inventory project considerably earlier than expected.

## Built With

* <a href="https://docs.python.org/3/">python 3</a> - toInventory.py 
    * <a href="https://gspread.readthedocs.io/en/latest/">gspread API</a> - connect to google sheets
* <a href="https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands">batchscript</a> - getInfo.bat


## Operation
`getInfo.bat` creates textfiles representative of inventoried devices and `toInventory.py` parses and uploads the data from those files to a google sheets spreadsheet.

### getInfo
#### Inventory
Prompts the user whether they want this system to be inventoried. If yes, creates and adds file to Inventory directory. Creates Inventory directory if it doesn't already exist. Asks if the user wants to add additional notes.
    
####  Verification Utility
Checks that computer is set up in accordance with company guidelines, such as verifying that the computer name is in the correct format and that the administrator account is enabled. It will also check that certain applications are running using the `tasklist` command.

####  Network Utility
Retrieves and displays relevant networking information using `ipconfig` and `netsh` commands.

####  Repair Utility
Displays relevant disk information using `wmic`. Asks if the user would like to defragment or repair the disk using the `defrag` and `chkdsk` commands, respectively.


### toInventory
####  Parse
Prompts the user for a path to the Inventory. If none is given, it will check the local directory. It will then attempt to add every file in the directory to the inventory with error handling. Because early versions of `getInfo.bat` encoded files in utf-8 and later versions encoded with utf-16, `toInventory.py` will attempt to decode both formats.

####  Upload to Google Sheets
After each file is parsed, it will attempt to add it to a new row in the Google Sheets inventory spreadsheet using `gspread`. This functionality is currently removed. To enable this feature, configure `gspread` and uncomment all of the commented lines of code relating to it.