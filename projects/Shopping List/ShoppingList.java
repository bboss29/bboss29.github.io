import java.sql.*;
import java.util.Scanner;

public class ShoppingList {
    enum mState {
        MAIN,
        PLAN,
        SHOP,
        UPDATE_STORES,
        UPDATE_TRIPS,
        UPDATE_RECIPES,
        UPDATE_ITEMS,
        EXIT
    }

    public static void main(String[] args) {
        mState menu = mState.MAIN;
        while (true) {
            switch (menu) {
                case MAIN:  //  display main menu
                    menu = mainMenu();
                    break;
                case PLAN:  //  allow user to add items to current shopping list (current shopping trip)
                    planMenu();
                    menu = mState.MAIN;
                    break;
                case SHOP:  //  displays current shopping list; removes items user has put in cart
                    shopMenu();
                    menu = mState.MAIN;
                    break;
                case UPDATE_STORES:     //  AED stores
                    storesMenu();
                    menu = mState.MAIN;
                    break;
                case UPDATE_TRIPS:      //  AED trips; view trips and total cost
                    tripsMenu();
                    menu = mState.MAIN;
                    break;
                case UPDATE_RECIPES:    //  AED recipes; view current recipes
                    recipesMenu();
                    menu = mState.MAIN;
                    break;
                case UPDATE_ITEMS:      //  AED items
                    itemMenu();
                    menu = mState.MAIN;
                    break;
                case EXIT:
                    System.out.println("Goodbye!");
                    return;
            }
        }
    }

    private static mState mainMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;
        System.out.println("\nMain Menu" +
                "\nWhat do you want to do? ");
        System.out.println(
                "\n1 | Plan next Shopping Trip" +
                "\n2 | Go to the Store!" +
                "\n3 | Data" +
                        "\n4 | Exit");
        choice = scan.nextLine();
        switch (choice) {
            case "1":
                return mState.PLAN;
            case "2":
                return mState.SHOP;
            case "3":
                System.out.println("Data Menu");
                System.out.println(
                        "\n1 | Recipes" +
                        "\n2 | Stores" +
                        "\n3 | Items" +
                        "\n4 | Trips" +
                                "\n5 | Back to main menu"
                );
                choice = scan.nextLine();
                switch (choice) {
                    case "1":
                        return mState.UPDATE_RECIPES;
                    case "2":
                        return mState.UPDATE_STORES;
                    case "3":
                        return mState.UPDATE_ITEMS;
                    case "4":
                        return mState.UPDATE_TRIPS;
                    default:
                        return mState.MAIN;
                }
            case "4":
                return mState.EXIT;
            default:
                invalidEntry();
                return mState.MAIN;
        }


    }

    private static void planMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;

        while (true) {
            System.out.println(String.format("\nPlan Menu"));
            System.out.println(
                    "\n1 | View Shopping List" +
                    "\n2 | Add Individual Items to Shopping List" +
                    "\n3 | Add Items to Shopping List by Recipe" +
                            "\n4 | Start new Shopping List" +
                            "\n5 | Go to main menu");
            choice = scan.nextLine();
            switch (choice) {
                case "1":
                    // see current shopping list
                    if (getNumRows(sql_select("Select * From ShoppingList")) == 0)
                        System.out.println("The shopping list is empty!");
                    else
                        printRes(sql_select("Select * From ShoppingList"), "Shopping List");
                    break;
                case "2":
                    // add to list individually
                    printRes(sql_select("Select item_id, itemName From Item"), "Items");
                    while (true){
                        System.out.println(
                                "\n[Item#]\t| Add Item to shopping list" +
                                        "\nlist \t| see item name and item#s" +
                                        "\n");
                        choice = scan.nextLine();
                        if (choice.equals("list"))
                            printRes(sql_select("Select item_id, itemName From Item"), "Items");
                        else if (choice.equals(""))
                            break;
                        else {
                            String i = choice;
                            System.out.print("How many?\t");
                            String q = scan.nextLine();

                            try {
                                if (!sql_Update("insert into Ordered (item_id, trip_id, quantity, purchased) " +
                                        "VALUES" + String.format(" (%s, %d, %s, %b)", i, getCurrTrip(), q, false)))
                                    throw new IllegalArgumentException(
                                            "Could not find item #" + i + " in list of items");
                                System.out.println("Item added to shopping list");
                            } catch (IllegalArgumentException e) {
                                invalidEntry();
                                System.out.println(e.getMessage());
                            }
                        }

                        System.out.println();
                    }
                    break;
                case "3":
                    // see recipes
                    printRes(sql_select(
                            "SELECT recipe_id, itemName, quantity " +
                            "FROM Recipe r, Item i " +
                                    "WHERE i.item_id = r.item_id " +
                                    "Order by recipe_id asc;"), "Recipes");
                    while (true) {
                        System.out.println(
                                "\n[Recipe#]\t| Add Recipe Ingredients to Shopping List" +
                                        "\nlist \t\t| see recipe name and ID#s" +
                                        "\n");
                        choice = scan.nextLine();
                        if (choice.equals("list"))
                            printRes(sql_select(
                                "Select recipe_id, itemName from Recipe r, Item i WHERE r.item_id = i.item_id"),
                                    "List");
                        else if (choice.equals(""))
                            break;
                        else {
                            try {
                                if (!sql_Update(
                                        "INSERT INTO Ordered (item_id, trip_id, quantity, purchased)" +
                                                "  SELECT" +
                                                "    item_id," +
                                                "    " + getCurrTrip() + "," +
                                                "    ceiling(quantity)," +
                                                "    FALSE" +
                                                "  FROM Recipe r" +
                                                "  WHERE r.recipe_id = " + choice
                                ))
                                    throw new IllegalArgumentException(
                                            "Could not find" + choice + " in list of recipes");
                                System.out.println("Recipe added to shopping list");
                            } catch (IllegalArgumentException e) {
                                invalidEntry();
                                System.out.println(e.getMessage());
                            }
                        }

                        System.out.println("");
                    }
                    break;
                case "4":
                    printRes(sql_select("SELECT store_id, storeName FROM Store;"), "Stores");
                    System.out.println("What store are you going to? (store#)");
                    choice = scan.nextLine();
                    if(sql_Update("INSERT INTO Trip (store_id, date) VALUES ("+choice+", now());"))
                        System.out.println("Trip added!");
                    else
                        System.out.println("Cannot add trip");
                    break;
                case "5":
                    return;
                default:
                    invalidEntry();
                    return;
            }
        }
        //  show current shopping list
        //  prompt to add items to shopping list individually
        //  or by recipe
    }

    private static void shopMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;

        while (true) {
            ResultSet res = sql_select("select * from ShoppingList");
            if (getNumRows(res) == 0){
                System.out.println("You got everything! Time to check out!");
                break;
            }
            printRes(sql_select("select * from ShoppingList"), "Shopping List");
            System.out.println("Remove which item from shopping list? (item_id)");
            choice = scan.nextLine();
            if (choice.equals(""))
                return;

            try {
                if (!sql_Update(String.format(
                        "UPDATE Ordered SET purchased = TRUE " +
                                "WHERE item_id = %s and trip_id = %d;", choice, getCurrTrip())))
                    throw new Exception("Could not add item to cart");
//                System.out.println("Item removed from shopping list");
            } catch (Exception e) {
                invalidEntry();
                System.out.println(e.getMessage());
            }

        }

        //  display shopping list
        //  prompt user for what items to remove
        //  exit when all are removed or when user 'breaks'

    }

    private static void storesMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;

        while (true) {
            System.out.println("What do you want to do? ");
            System.out.println("1 | Add Store\n2 | View Stores\n3 | Go to main menu");
            choice = scan.nextLine();
            switch (choice) {
                case "1":
                    System.out.println("Name? ");
                    String name = scan.nextLine();
                    System.out.println("Location? ");
                    String location = scan.nextLine();
                    if(sql_Update("INSERT INTO Store (storeName, Location) VALUES ('" +
                            name + "' , '" + location +
                            "');"))
                        System.out.println("Store added!");
                    else
                        System.out.println("Cannot add store");
                    break;
                case "2":
                    printRes(sql_select("SELECT store_id, storeName FROM Store;"), "Stores");
                    break;
                case "3":
                    return;
                default:
                    invalidEntry();
                    break;
            }
        }
    }

    private static void tripsMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;

        while (true) {
            printRes(sql_select("SELECT trip_id, storeName, date, totalCost " +
                    "FROM Trip t, Store s " +
                    "WHERE s.store_id = t.store_id;"), "Trips");
            System.out.println("What do you want to do? ");
            System.out.println("[trip#] | calculate total cost of trip");
            choice = scan.nextLine();
            if (choice.equals(""))
                break;
            try {
                if (!sql_Update("UPDATE Trip SET totalCost = " +
                        "  (SELECT sum(quantity * price) " +
                        "  FROM Item i, Ordered o " +
                        "  WHERE " +
                        "    i.item_id = o.item_id " +
                        "    and trip_id = '" + choice + "' " +
                        "  GROUP BY trip_id) " +
                        "WHERE trip_id = '" + choice + "';"))
                    throw new Exception("Could not add item to cart");
                System.out.println("Success");
            } catch (Exception e) {
                invalidEntry();
                System.out.println(e.getMessage());
            }
        }
    }

    private static void recipesMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;

        while (true) {
            System.out.println("What do you want to do? ");
            System.out.println(
                    "1 | Create New Recipe\n" +
                    "2 | Add to Recipe\n" +
                    "3 | See Recipes\n" +
                    "4 | Go to main menu");
            String item = "";
            String quantity = "";
            String recipe = "";
            choice = scan.nextLine();
            switch (choice) {
                case "1":
                    printRes(sql_select("Select item_id, itemName From Item"), "Items");
                    System.out.println("What is the first ingredient? (item#)");
                    item = scan.nextLine();
                    System.out.println("How many?");
                    quantity = scan.nextLine();
                    try {
                        if (!sql_Update("INSERT INTO Recipe (recipe_id, item_id, quantity)" +
                            "  SELECT coalesce((max(recipe_id) + 1), 1), " +
                                item + ", " + quantity +
                            "  FROM Recipe"))
                            throw new IllegalArgumentException("Could not create new recipe");
                        System.out.println("New recipe created");
                    } catch (IllegalArgumentException e) {
                        invalidEntry();
                        System.out.println(e.getMessage());
                    }
                    break;
                case "2":
                    printRes(sql_select("Select item_id, itemName From Item"), "Items");
                    System.out.println("What is the ingredient? (item#)");
                    item = scan.nextLine();
                    System.out.println("How many?");
                    quantity = scan.nextLine();
                    printRes(sql_select(
                            "SELECT recipe_id, itemName, quantity " +
                                    "FROM Recipe r, Item i " +
                                    "WHERE i.item_id = r.item_id " +
                                    "Order by recipe_id asc;"), "Recipes");
                    System.out.println("What Recipe are you adding to? (recipe#)");
                    recipe = scan.nextLine();
                    try {
                        if (!sql_Update(
                                "INSERT INTO Recipe (recipe_id, item_id, quantity) VALUES (" +
                                         recipe + ", " + item + ", " + quantity + ")"
                        ))
                            throw new IllegalArgumentException("Could not add to recipe");
                        System.out.println("Added to recipe");
                    } catch (IllegalArgumentException e) {
                        invalidEntry();
                        System.out.println(e.getMessage());
                    }
                    break;
                case "3":
                    printRes(sql_select(
                            "SELECT recipe_id, itemName, quantity " +
                                    "FROM Recipe r, Item i " +
                                    "WHERE i.item_id = r.item_id " +
                                    "Order by recipe_id asc;"), "Recipes");
                    break;
                case "4":
                    return;
                default:
                    invalidEntry();
            }
        }
    }

    private static void itemMenu() {
        Scanner scan = new Scanner(System.in);
        String choice = null;
        String[] item = new String[6];

        while (true) {
            System.out.println("What do you want to do? ");
            System.out.println("1 | Add Item\n2 | View Items\n3 | Go to main menu");
            choice = scan.nextLine();
            switch (choice) {
                case "1":
                    System.out.println("What is the item's name?");
                    item[0] = scan.nextLine();
                    System.out.println("How much does it cost?");
                    item[1] = scan.nextLine();
                    System.out.println("Which store is it from? (store#)");
                    item[2] = scan.nextLine();
                    System.out.println("What aisle is it in?");
                    item[3] = scan.nextLine();
                    System.out.println("What department is it in?");
                    item[4] = scan.nextLine();
                    System.out.println("Any notes?");
                    item[5] = scan.nextLine();
                    try {
                        if (!sql_Update("INSERT INTO Item (itemName, price, store_id, aisle, dept, notes) " +
                                String.format("VALUES ('%s', '%s', '%s', '%s', '%s', '%s');",
                                        item[0], item[1], item[2], item[3], item[4], item[5])))
                            throw new IllegalArgumentException("Could not add item");
                        System.out.println("New item added");
                    } catch (IllegalArgumentException e) {
                        System.out.println(e.getMessage());
                        invalidEntry();
                    }
                    break;
                case "2":
                    printRes(sql_select("SELECT itemName, price, s.storeName, aisle, dept, notes " +
                            "from Item i , Store s " +
                            "WHERE i.store_id = s.store_id;"), "Items");
                    break;
                case "3":
                    return;
                default:
                    invalidEntry();
            }
        }
    }

    private static boolean sql_Update(String sql){
        Connection conn = null;
        try {
            conn = DriverManager.getConnection("### REDACTED ###"); // TODO REDACTED

            Scanner scan = new Scanner(System.in);
            Statement stmt = conn.createStatement();
            if (stmt.executeUpdate(sql) == 0)
                return false;
        } catch (SQLException ex) {// handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            return false;
        }

        return true;
    }

    private static ResultSet sql_select(String sql) {
        Connection conn = null;
        ResultSet res = null;
        try {
            conn = DriverManager.getConnection("### REDACTED ###"); // TODO REDACTED

            Scanner scan = new Scanner(System.in);
            Statement stmt = conn.createStatement();
            res = stmt.executeQuery(sql);
        } catch (SQLException ex) {// handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        }
        return res;
    }

    private static void printRes (ResultSet res, String header) {
        try {
            ResultSetMetaData resMD = res.getMetaData();
            int c = resMD.getColumnCount();
            String[] cols = new String[c];
            String border = " ";

            System.out.println();
            for (int i = 0; i < c; i++){
                cols[i] = resMD.getColumnName(i + 1);
                border += "---------------";
            }
            System.out.println(border);

            int offset = border.length() / 2;
            System.out.println(String.format(
                    "|%"+offset+"s %"+(offset - 1)+"s|", header, ""));

            System.out.print("|");
            for (int i = 0; i < cols.length; i++){
                System.out.print(String.format("%-15s", cols[i]));
            }
            System.out.println("|");

            int count = 0;
            while (res.next()) {
                System.out.print("|");
                for (int i = 0; i < c; i++){
                    System.out.print(String.format("%-15s",
                            res.getString(cols[i]) == null ? "" : res.getString(cols[i])
                    ));
                }
                System.out.println("|");
                count++;
            }
            System.out.println(border);
            System.out.println();
        } catch (SQLException ex) {// handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        }
    }

    private static int getNumRows(ResultSet res) {
        int r = 0;
        try {
            res.last();
            r = res.getRow();
        } catch (SQLException ex){
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        }
        return r;
    }

    private static void invalidEntry() {
        System.out.println("Invalid Entry - please choose an input from the list\n");
    }

    private static int getCurrTrip() {
        ResultSet res = sql_select("SELECT max(trip_id) FROM Trip;");
        int num = 0;
        try {
            res.absolute(1);
            num = Integer.parseInt(res.getString(1));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return num;
    }

}
