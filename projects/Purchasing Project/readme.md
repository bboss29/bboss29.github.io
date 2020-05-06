# Purchasing Project

<img 
    src="https://img.shields.io/badge/status-testing-yellow"
    alt="status-testing">
<img 
    src="https://img.shields.io/badge/development-inactive-inactive"
    alt="development-indefinite-hiatus">
<img 
    src="https://img.shields.io/badge/REDACTED-orange"
    alt="redacted">
    
The **Purchasing Project** is made up of Google Apps designed to streamline and disambiguate the food purchasing & preparation processes used in restaurants. The two parts of the Purchasing Project are:

* Purchasing Project - a Google Spreadsheet
    * Items
    * Inventory
    * OG
    * Produce Prices
    * Produce
    * Walkthrough
    * Vendors
    * _Prep Template_
    * _PO Template_
* purchasing.gs - a Google Apps Script

The main four processes are divided into these three categories:
* Inventory
    * Inventory Process
* Purchasing
    * Order Guide Process
        * Produce
    * Purchase Order Process
* Prep
    * Prep Process

At regular intervals the restaurant will take inventory, which is when they count all of the items they have on hand. This data is required for the other three processes.

Process | Description
---------|-----------
Inventory | A count of every item on hand
Order Guide | The number of items to order is inferred from the Inventory and other factors
Purchase Order | The documents that are sent to vendors are inferred from the Order Guide and other factors
Prep Sheets | The number of items to prep for the day is inferred from the Inventory and other factors

## Built With

<a href="https://developers.google.com/apps-script">Google Apps</a>

## Operation

Sheet | Operation
-------|--------
Items | Used as a quasi-database that stores metadata for each item (excluding on hand and order numbers)
Inventory | Stores the number of items on hand
OG | Used to decide how much of each item to order
Produce Prices | Used for updating many produce prices in bulk operation
Produce | Used for selecting which produce vendor to order from when multiple options are available
Walkthrough | Stores how many prep items on hand
Vendors | Stores metadata about vendors
_Prep Template_ | Used for formatting Prep Sheets. Usually hidden
_PO Template_ | Used for formatting Purchase Orders. Usually hidden

