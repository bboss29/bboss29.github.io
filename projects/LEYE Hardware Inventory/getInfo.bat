@echo off
title bboss IT Utility
echo Author: bboss
echo Version: 0.55
::Date: 07-24-2017
echo Purpose: adds current system to inventory; run various diagnostics
echo ### REDACTED ###

set _path=%cd%
set _admin=T
@net session >nul
if not %errorlevel%==0 (
	echo 	----------Warning----------
	echo 	 Admin Privileges Disabled
	echo 	---------------------------
	echo 	  insufficient rights to 
	echo 	     run full utilities
	echo 	---------------------------
	echo 	  right click file to run 
	echo 	  with elevated privileges
	echo 	---------------------------
	set _admin=F
)

echo.
choice /t 5 /d Y /m "Add this system to Inventory?"
if ERRORLEVEL==2 goto verify
::names file
echo.
echo Creating file...

for /f "delims=" %%i in ('hostname') do set _h=%%i
::set _h=%computername% ::computername
set _out=%_h%.txt

if not exist Inventory mkdir Inventory
chdir Inventory

@copy nul "%_out%"

::gets/writes info

echo Saving info to %cd%\%_out%...
wmic /OUTPUT:out.tmp bios get serialnumber, manufacturer /format:list
TYPE out.tmp >>out2.tmp
wmic /OUTPUT:out.tmp computersystem get caption, domain, model /format:list
TYPE out.tmp >>out2.tmp
wmic /OUTPUT:out.tmp os get caption, installdate /format:list
TYPE out.tmp >>out2.tmp
echo Date=%date% >>out2.tmp

For /F "delims=" %%A in (out2.tmp) Do echo %%A >>"%_out%"

del out.tmp
del out2.tmp
echo Done.
echo.

::take notes
choice /t 10 /d N /m "Take Notes?"
if ERRORLEVEL==2 goto verify
set /p _notes="Notes: "
echo Notes=%_notes%>>"%_out%"

:verify
::Verification Utility
cls
if %_admin%==F title bboss IT Utility - Verify (Not Admin) & goto skippass
choice /t 20 /d N /m "Run Verification Utility?"
if ERRORLEVEL==2 goto net
title bboss IT Utility - Verify
cls
echo Checking Admin Account...
net user administrator | find "active"
for /f "delims=" %%i in ('net user administrator ^| find "active" ^| find /c "No"') do set _a=%%i
::if %_a%==1 echo Opening Management Console... & echo (Don't forget to set password) & compmgmt
if %_a%==1 (
	echo Enabling Admin Account...
	net user administrator /active:yes 
	choice /t 10 /d N /m "Set Local Admin Password?"
	if ERRORLEVEL==2 goto skippass
	echo Set Admin Password
	net user administrator *
)
echo.
:skippass
echo Checking if Computer Name is valid...
for /f "delims=" %%i in ('hostname ^| find /c "-"') do set _c=%%i
if %_c%==0 (
	echo. & echo --Invalid Computer Name Detected--
	echo Proper Naming Convention: ### REDACTED ###
	echo where T=Type ex: [L]aptop [D]esktop [A]ll-in-one [T]ablet
	echo Opening System Properties...
	sysdm.cpl
	pause
) else echo %computername% is valid.
echo.

echo Checking if authorized applications are installed...
:: use tasklist to check if certain applications are running. if not, alert and begin installation process
echo.
for /f "delims=" %%i in ('tasklist ^| find /i /c "### [Application] ###"') do set _b=%%i
if %_b%==0 (
	echo ### [Application] ###		FAIL	Opening ### [Website to download application] ###...
	::explorer "### [Website to download application] ###"
) else (
	echo ### [Application] ###		Pass
)
for /f "delims=" %%i in ('net start ^| find /i /c "### [Application] ###"') do set _b=%%i
if %_b%==0 (
	echo ### [Application] ###	FAIL	Opening ### [Website to download application] ###...
	::explorer "### [Website to download application] ###"
) else (
	echo ### [Application] ###	Pass
)
for /f "delims=" %%i in ('net start ^| find /i /c "### [Application] ###"') do set _b=%%i
if %_b%==0 (
	echo ### [Application] ###		FAIL	Opening ### [Website to download application] ###...
	::explorer "### [Website to download application] ###"
) else (
	echo ### [Application] ###		Pass
)
echo.
pause

:net
::Network Utility
:: display relevant network information & perform common operations
cls
choice /t 20 /d N /m "Run Network Utility?"
if ERRORLEVEL==2 goto rep
title bboss IT Utility - Network
cls
for /f "delims=" %%i in ('netsh wlan show interface ^| find /c /i "disconnected"') do set _net=%%i
if not %_net%==0 echo Can't get network info, no wifi & timeout /t 5
if not %_net%==0 goto rep
echo Checking Network Info...
for /f "delims=" %%i in ('netsh wlan show interface ^| find " SSID"') do set _i=%%i
set _i=%_i:    SSID                   : =   WiFi. . . . . . . . . . . . . . . : %
echo %_i%
ipconfig | find "IPv4"
ipconfig | find "Subnet"
ipconfig | find "Gateway"
ipconfig /all | find /i "DHCP Server"
echo.
choice /t 20 /d N /m "Start netscanner?"
if ERRORLEVEL==2 goto rep
chdir %_path%
::start ### [netscanner application] ###
echo Options, IP Address, Detect Local IP Range
timeout /t -1

chdir ..
if exist Other goto rep ::not
chdir Other
choice /t 20 /d N /m "Add ### [WLAN Profile] ###?"
if ERRORLEVEL==2 goto rep
netsh wlan add profile filename="Wireless Network Connection-### [WLAN Profile] ###.xml"
netsh wlan connect name="### [WLAN Profile] ###"


:rep
::Repair Utility
:: run built-in defrag or chkdsk utilities
if %_admin%==F goto EOF
cls
choice /t 20 /d N /m "Open Repair Utility?"
cls
if ERRORLEVEL==2 exit
title bboss IT Utility - Repair
echo Repair utility targets the C: Drive with the following tools:
echo 	Defragmentation - Consolidates fragmented files 
echo 				to improve system performance
echo 	Check Disk 	- Checks the integrity of the drive;
echo					Optionally, repairs disk errors
echo.
echo Summary of Actionable Drive:
wmic diskdrive where index=0 get caption,mediatype,status /format:list | find "a"
wmic os get installdate /value /format:list | find "a"
echo.
echo --Warning: Defragmenting SSDs is NOT recommended-- 
echo.
choice /t 20 /d N /m "Defrag?"
if ERRORLEVEL==2 goto chk
if ERRORLEVEL==1 start "Defragmenting..." /min defrag C: /U /V
:chk
choice /c YNR /t 20 /d N /m "Check Disk? [R]epair runs when computer is restarted"
if ERRORLEVEL==3 chkdsk C: /F
if ERRORLEVEL==2 exit
if ERRORLEVEL==1 start "Checking Disk Integrity" /i /min chkdsk C: