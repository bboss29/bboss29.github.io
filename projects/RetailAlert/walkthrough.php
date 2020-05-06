<?php
session_start();
$page_title = 'Walkthrough';
include('includes/header.php');

?>

<h1>Walkthrough</h1>
<div style="margin: 25px auto auto auto; width: 30%;min-width: 300px">
    <a href="./401-RESOURCES" class="btn btn-secondary btn-block">Class Resources</a>
</div>

<h3>General Walkthrough</h3>
<div style="margin: 25px auto auto auto; width: 50%;min-width: 300px">
    <p>
        Buttons that look like <a href="#" class="btn btn-secondary">this</a> are for testing purposes and will not be in the final product <br>
        Although logging in to user accounts is fully functional, the Admin Controls page allows the tester to quickly log in to any user account. The Admin Controls page also allows the tester to create new users, view all open requests in the Assistance Queue and view the entire Product Catalog
    </p>
</div>

<h3>Use Case 1 Walkthrough: Customer Management</h3>
<div style="margin: 50px auto auto auto; min-width: 300px">
    <table style="width:80%;margin: auto 10% 50px 10%" class="table table-striped table-hover">
        <thead class="thead-dark">
            <tr style="width: 100% ">
                <th style="width: 10%">Step</th>
                <th style="width: 20%">Role</th>
                <th>Instructions</th>
            </tr>
        </thead>
        <tr>
            <td>1</td>
            <td>--</td>
            <td>Begin by navigating to the Admin Controls page and logging in to the customer1 account</td>
        </tr><tr>
            <td>2</td>
            <td>Customer</td>
            <td>Select a department, input the details of the request and click the big red "I NEED HELP!" button</td>
        </tr><tr>
            <td>3</td>
            <td>Customer</td>
            <td>After submitting the request, navigate back to the Admin Page and log in to the associate1 account. Note that the unclaimed request is visible in the Assistance Queue on the Admin Page</td>
        </tr><tr>
            <td>4</td>
            <td>Associate</td>
            <td>Click on the "Claim" button and return to the Admin Page. Notice that the request is claimed in the Assistance Queue</td>
        </tr><tr>
            <td>5</td>
            <td>Associate</td>
            <td>Go back to associate1's page and click on the "Mark Completed" button. On the Admin Page, notice that the request is removed from the Assistance Queue</td>
        </tr><tr>
            <td>6</td>
            <td>Customer</td>
            <td>From the Admin Page, log back in to customer1's account and notice that they are no longer waiting for an associate</td>
        </tr>
    </table>
</div>

<h3>Use Case 2 Walkthrough: Product Lookup</h3>
<div style="margin: 50px auto 50px auto;min-width: 300px">
    <table style="width:80%;margin: auto 50px auto 10%" class="table table-striped table-hover">
        <thead class="thead-dark">
        <tr style="width: 100% ">
            <th style="width: 10%">Step</th>
            <th style="width: 20%">Role</th>
            <th>Instructions</th>
        </tr>
        </thead>
        <tr>
            <td>1</td>
            <td>--</td>
            <td>Go to the Admin Controls Page and log into customer1's account</td>
        </tr><tr>
            <td>2</td>
            <td>Customer</td>
            <td>From customer1's page, click on the "Search Products" button</td>
        </tr><tr>
            <td>3</td>
            <td>Customer</td>
            <td>Choose "Any Department" and type in "5" for the keyword. The result should be womens shoes, size 11, etc. <br><em>The system returns the row if the keyword is found in the name, sku, or description columns</em></td>
        </tr><tr>
            <td>4</td>
            <td>Customer</td>
            <td>Click the orange "Help" button to send a product-specific request to the Assistance Queue</td>
        </tr><tr>
            <td>5</td>
            <td>Associate</td>
            <td>Navigate to the Admin Page and log in to associate1's account. Notice the new unclaimed product-specific request with the relevant location</td>
        </tr>
    </table>
</div>
<h3>Video</h3>
<div style="margin: 50px auto 50px auto;min-width: 300px; align-items: center">
    <video controls="controls" style="margin: auto 10% auto 10%; width: 80%" src="./401-RESOURCES/walkthrough.mp4"></video>
</div>
