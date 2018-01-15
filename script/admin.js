$(document).ready(function()
{
    $("#logout").hide();
    status();

    $("#login").submit(function(e)
    {
        e.preventDefault();

        if($("#usrnm").val() == "admin")
        {
            if($("#pswrd").val() == "admin")
            {
                sessionStorage.setItem("adminLog", "true");
                right();
            }
            else
            {
                wrong();
            }
        }
        else
        {
            wrong();
        }
    });

    function right()
    {
        $("#login").hide();
        $("#logout").show();
        $("#main")
            .empty()
            .append("<h1>Välkommen.</h1>")
            .append("<p>Här kan du se över aktuella ordrar och kunder under respektive meny.</p>")
        ;
        $("#orderList").show();
        $("#customerList").show();
        
        $(".logout").click(function()
        {
            sessionStorage.removeItem("adminLog");
            $("#login").show();
            $("#logout").hide();
            startpage();
        });
    }

    function wrong()
    {
        alert("Fel användarnamn eller Lösenord!");
        $("#main")
            .empty()
            .append("<p>Glömt lösenord eller användarnamn?!</p><a href='#'>Klicka här!</a>")
        ;
    }

    function status()
    {
        if (sessionStorage.getItem("adminLog") != null)
        {
            right();
        }
        else
        {
            startpage();
        }
    }

    function startpage()
    {
        $("#orderList").hide();
        $("#customerList").hide();
        $("#main")
            .empty()
            .append("<h2>Admin Sida för Klockmaeztro</h2>")
            .append("<p>För att hantera Klockmaeztro var snäll och logga in</p>")
        ;
    }

    $("#info").click(function()
    {
        $("#main")
            .empty()
            .append("<h2>Admin Sida för xxx</h2>")
            .append("<p>På denna Adminsida kan du se över, lägga till och ta bort ordrar och kunder.</p>")
        ;
    });
    
    $("#orderList").click(function()
    {
        $("#main")
            .empty()
            .append("<h4>Orderlista:</h4>")
            .append("<ul class='stuffList'></ul>")
        ;
        
        var orders = [];


        if(localStorage.getItem("orders") == null)
        {
            $("#main")
                .empty()
                .append("<h1>För stunden finns inga aktuella ordrar</h1>")
            ;
        }
        else
        {
            orders = JSON.parse(localStorage.getItem("orders"));
            products = JSON.parse(localStorage.getItem("products"));

            var $table = $("<table class='table table-bordered'><thead><tr><th scope='col'>Order ID</th><th scope='col'>User ID</th><th scope='col'>Total Products</th></tr></thead><tbody></tbody></table>");

            $.each(orders, function(i, v)
            {
                var orderID = v.orderid;
                var userID = (v.userid != 0 ? v.userid : "Unregistered");
                var orderProducts = JSON.parse(v.productsList);
                var totalProducts = 0;
                
                var $productTable = $("<table class='table table-bordered table-hover'></table>");
                $("<thead></thead>")
                    .append($("<tr></tr>")
                        .append("<th scope='col'>Product ID</th>")
                        .append("<th scope='col'>Product Name</th>")
                        .append("<th scope='col'>Amount</th>")
                    )
                    .appendTo($productTable)
                ;

                var $productTableBody = $("<tbody></tbody>");

                for(var indx = 0; indx < orderProducts.length; indx++)
                {
                    var prodNamn;
                    for(var injx = 0; injx < products.length; injx++)
                    {
                        if(orderProducts[indx].prodId == products[injx].id)
                        {
                            prodNamn = products[injx].prodName;
                        }
                    }
                    
                    $("<tr><td>" + orderProducts[indx].prodId + "</td><td>" + prodNamn + "</td><td>" + orderProducts[indx].amount + "</td></tr>")
                        .appendTo($productTableBody)
                    ;

                    totalProducts += orderProducts[indx].amount;
                }
                
                var $tablerow = $("<tr data-toggle='collapse' data-target='#row" + i + "' class='clickable'><td>" + orderID + "</td><td>" + userID +"</td><td>" + totalProducts + "</td></tr><tr id='row" + i + "' class='collapse'><td colspan='3' id='prodTD'></td></tr>");
                
                $("#prodTD", $tablerow).append($productTable.append($productTableBody));

                $table.append($tablerow);
            });

            $("#main").append($table);
        }
    });

    $("#customerList").click(function()
    {
        var $main = $("#main");
        $main
            .empty()
            .append("<h4>Kundlista:</h4>")
            .append("<table></table>")
        ;

        var users = JSON.parse(localStorage.getItem("users"));
        var $table = $("<table class='table table-bordered table-hover'><thead><tr><th scope='col'>ID</th><th scope='col'>Email</th><th scope='col'>password</th><th scope='col'>Name</th><th scope='col'>Tel. Number</th><th scope='col'>Newsletter?</th></tr></thead><tbody></tbody></table>");
        
        for(var i = 0; i < users.length; i++)
        {
            var $tablerow = $("<tr><td>" + users[i].id + "</td><td>" + users[i].email + "</td><td>" + users[i].password + "</td><td>" + users[i].name + "</td><td>" + users[i].telnum + "</td><td>" + users[i].newssub + "</td></tr>");
            $table.append($tablerow);
        }

        $main.append($table);
    });
});