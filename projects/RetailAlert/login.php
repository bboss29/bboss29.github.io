<?php 
session_start();
$page_title = 'Login';
include('includes/header.php');
if(isset($_SESSION['role'])){
    echo '<script>alert("You are already logged in")</script>';
//    header("Location: index.php");
}
?>

<h1 style="text-align: center;margin-top: 8%">Login</h1>
<div style="margin: auto; width: 30%;min-width: 300px">
    <div class="form-group">
        <form class = "form-horizontal" action="login.php" method="post">
            <!--            <label for="email">Email Address:</label>-->
            <input required class="form-control" type="text" name="username" size="20" maxlength="60" placeholder="Username" style="margin-top: 20px"
                   value=<?php if(isset($_POST['username'])) echo $_POST['username']; ?>>
            <!--            <label for="pass">Password:</label>-->
            <input required class="form-control" type="password" name="pass" size="20" maxlength="20" placeholder="Password">
            <!--            <a>I am a...</a>-->
            <select required class="form-control" name="role" style="margin-top: 10px">
                <option disabled selected value="null"> I am a...</option>
                <option value="customer">Customer</option>
                <option value="associate">Associate</option>
            </select>
            <input type="submit" name="submit" value="Login" style="width: 100%;margin-top: 10px" class="btn btn-primary btn-lg btn-block">
        </form>
    </div>
</div>

<?php
if (isset($_POST["submit"])) {

    $errors = [];
    require('connect.php');

    $username = $_POST['username'];
    $pass = $_POST['pass'];
    if(isset($_POST['role'])){
        $role = $_POST['role'];
    }else{
        $errors[] = 'You forgot to enter role.';
    }
    
    if (empty($username)) {
        $errors[] = 'You forgot to enter your username.';
    } else {
        $e = trim($username);
    }

    if (empty($pass)) {
        $errors[] = 'You forgot to enter your password.';
    } else {
        $p = trim($pass);
    }

    if (empty($errors)){
        $query = "SELECT * FROM users WHERE username='$username' AND password = '$pass' AND role='$role'";
        $result = mysqli_query($db, $query);
        if (mysqli_num_rows($result) == 1){
            while($row = mysqli_fetch_array($result)){
//                session_destroy();
                session_start();
                $_SESSION['username']=$row['username'];
                $_SESSION['user_id']=$row['user_id'];
                $_SESSION['role'] = $row['role'];
            }
            header('Location:profile.php');

        }else{
            echo '<div style="width: 100%;text-align: center;color: red">Incorrect Username and/or Password!</div>';
        }
    }else{
        echo '<p style="color: red;text-align: center " class="error">The following error(s) occurred:<br>';
        foreach ($errors as $msg) {
            echo " - $msg<br>\n";
        }
        echo '</p>';
    }
}

?>
<?php include('includes/footer.html');