#Author: bboss #Version: v0.50 #Purpose: Adds inventory textfiles to bottom of Google Sheet
#no longer writes to sheet
#import gspread
#from oauth2client.service_account import ServiceAccountCredentials

import time                             # operation time
import os                               # file/dir manipulation
import re                               # regex to parse text
from collections import defaultdict     # default dict with empty values

p = re.compile(r"(.*)\=(.*)")

list = []
lineList = []
nullist = []
on = []
uCodeFiles = []

added = 0
inventoried = 0
uErr = False

if input("Press Enter to use default directory: ") is not "":
    _path = input("Path to Inventory folder: ")
else:
    _path = os.getcwd()
print("\nAdding inventory files in\n" + _path + "\nto LEYE Computer Hardware Inventory",end="")
os.chdir(_path)
print(".",end="")
#scope = ['https://spreadsheets.google.com/feeds']
#credentials = ServiceAccountCredentials.from_json_keyfile_name(r'### REDACTED ###\project_key.json', scope)
#gc = gspread.authorize(credentials)
#wks = gc.open('LEYE Computer Hardware Inventory').sheet1

print(".",end="")
#rawOn = wks.range('D1:D'+str(wks.row_count)) # fetch list of devices already inventoried
#for i in rawOn:
#    if i.value is not "":
#        on.append(i.value)
print(".\n")

t1 = time.time()

for filename in os.listdir(os.getcwd()):
    try:
        file = filename[:-4].strip()
        if file in on: # check if file is already inventoried
            inventoried += 1
            continue
        if not(filename[-4:] == ".txt"): # check if file is a text file
            raise ValueError("Not a valid text file")
        added += 1
        
        with open(filename,"r",encoding="utf-16") as f: # reads files encoded in utf-16
            str1 = "Adding " + file + " to inventory..."
            r = f.readlines()
            dict = {}
            dict = defaultdict(lambda:"",dict)
            for i in r: # populate dict from file
                if '=' in i:
                    m = p.search(i)
                    dict[m.group(1)] = m.group(2)
            dict['HostName'] = file
            if len(dict) == 0: # if dictionary is empty
                nullist.append(filename)
            else:
                list.append(dict)
            if 'InstallDate' in dict: # convert to conventional format
                t = dict['InstallDate']
                dict['InstallDate'] = t[4:6] + "/" + t[6:8] + "/" + t[0:4]
            if 'LocalDateTime' in dict: # convert to conventional format
                if "/" not in dict['LocalDateTime']:
                    t = dict['LocalDateTime']
                    dict['LocalDateTime'] = t[4:6] + "/" + t[6:8] + "/" + t[0:4]
            else:
                dict['LocalDateTime'] = ""
            # if data wasn't read properly, raise valueerror
            if len(dict['Model'] + dict['Caption']+ dict['InstallDate'] + dict['SerialNumber']) == 0:
                raise ValueError("Data in improper format")
            # otherwise, add dict to successful files
            out = ['','','',dict['HostName'], dict['Model'], dict['Caption'],"",
                  dict['InstallDate'], dict['SerialNumber'], dict['LocalDateTime']
                  , dict['Notes']]
            lineList.append(out)
#            wks.append_row(out)
            str2 = dict['Notes'] ## return info
    except UnicodeError as e: # if file is in utf-8, rerun operation with utf-8 decoder
        uErr = True
        uCodeFiles.append(filename)
        str2 = "UnicodeError FAIL"
    except ValueError as e:
        nullist.append(str(e) + "\t\t" + filename)
        str2 = "ValueError FAIL"

    print('{:<40}{:>40}'.format(str1,str2))

if uErr: # rerun the operation on the subset of utf-8 files with utf-8 decoder
    print("\nUnicodeErrors detected\nRetrying with UTF-8 decoder...\n")
    for filename in uCodeFiles:
        try:
            file = filename[:-4].strip()
            if file in on:
                continue
            with open(filename,"r") as f:
                print("Adding " + file + " to inventory...", end="")
                r = f.readlines()
                dict = {}
                dict = defaultdict(lambda:"",dict)
                for i in r:
                    if '=' in i:
                        m = p.search(i)
                        dict[m.group(1)] = m.group(2)
                dict['HostName'] = file
                if len(dict) == 0:
                    nullist.append(filename)
                else:
                    list.append(dict)
                if 'InstallDate' in dict:
                    t = dict['InstallDate']
                    dict['InstallDate'] = t[4:6] + "/" + t[6:8] + "/" + t[0:4]
                if 'LocalDateTime' in dict:
                    if "/" not in dict['LocalDateTime']:
                        t = dict['LocalDateTime']
                        dict['LocalDateTime'] = t[4:6] + "/" + t[6:8] + "/" + t[0:4]
                else:
                    dict['LocalDateTime'] = ""
                if len(dict['Model'] + dict['Caption']+ dict['InstallDate'] + dict['SerialNumber']) == 0:
                    raise ValueError("Data in improper format")
                out = ['','','',dict['HostName'], dict['Model'], dict['Caption'],"",
                      dict['InstallDate'], dict['SerialNumber'], dict['LocalDateTime']
                      , dict['Notes']]
                lineList.append(out)
 #               wks.append_row(out)
                print("\t Done.")
        except UnicodeError as e:
            nullist.append(str(e) + "\t\t" + filename)
            print("\t FAIL\t UnicodeError")
        except ValueError as e:
            nullist.append(str(e) + "\t\t" + filename)
            print("\t FAIL\t ValueError")
        
t2 = time.time()

print("\n\t\t--Operation Summary--")
print("\nOperation completed in "+str(t2-t1)+" seconds.\n")
print("\t"+str(len(os.listdir(os.getcwd())))+"\tfiles in directory.")
print("\t"+str(added) + "\ttext files.")
print("\t"+str(len(uCodeFiles)) + "\tfiles with UTF-8 encoding.")
print("\t"+str(inventoried) + "\talready inventoried.")
print("\t"+str(len(nullist)) + "\terrors detected.")
if not len(nullist)==0:
    print("\nError\t\t\t\tFile")
    for i in nullist:
        print(i)
