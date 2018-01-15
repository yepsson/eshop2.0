$(document).ready(function()
{


    Promise.all([
        fetch('./server/categoriesMain.json').then(function(response) { return response.json(); }),
        fetch('./server/categoriesSub.json').then(function(response) { return response.json(); }),
        fetch('./server/products.json').then(function(response) { return response.json(); }),
        fetch('./server/users.json').then(function(response) { return response.json(); })
    ]).then(function (data)
    {
        if (localStorage.serverStatus == null || localStorage.serverStatus != "complete")
        {
            console.log("server setup!");
            var [mainCat, subCat, products, users] = data;
            localStorage.setItem("mainCat", JSON.stringify(mainCat));
            localStorage.setItem("subCat", JSON.stringify(subCat));
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("serverStatus", "complete");
        }
        
        if (sessionStorage.getItem("cart") == null)
        {
           storedCart = [];
            sessionStorage.setItem("cart", JSON.stringify(storedCart));
        }
        status();
        createNavbar();
    });

    function createNavbar()
    {
        var mainCat = JSON.parse(localStorage.getItem("mainCat"));
        var subCat = JSON.parse(localStorage.getItem("subCat"));
        var products = JSON.parse(localStorage.getItem("products"));
        var users = JSON.parse(localStorage.getItem("users"));

                
        var row = $("<div class='row my-4'></div>");
        $(".under > ul").hide();

        for(var i = 0; i < mainCat.length; i++)
        {
            catMenu = $("<a class='mainCat nav-link' href='#' data-id='" + mainCat[i].id + "'>" + mainCat[i].katname + "<span class='caret'></span></a></div>");
            $("#katmenu").append(catMenu);
        }

        $("#katmenu").on("click", "a.mainCat", function(e)
        {
            $("#container").attr("class", "container");
        $("#container").css("background-color", "white");
        $("#container").css("margin-bottom", "5em");
            $("li > a.active").removeClass("active");
            $(this).addClass("active");
            $(".under > ul").empty();
            row.empty();

            for(var j = 0; j < subCat.length; j++)
            {
                if(subCat[j].huvudkategori == $(this).attr("data-id"))
                {
                    $("<li class='nav-item'><a href='#' class='subCat nav-link' data-over-id='" + subCat[j].huvudkategori + "' data-under-id='" + subCat[j].id + "'>" + subCat[j].katname + "</a></li>")
                        .appendTo($(".under > ul"));
                }
            }

            $("#container")
                .empty()
                .append(row)
            ;

            for(var i = 0; i < products.length; i++)
            {
                if(products[i].huvudKat == $(this).attr("data-id"))
                {
                    prodCard = $('<div class="col-sm-3 text-center"><div data-prod-id="' + products[i].id + '" class="card"><img class="card-img-top bild" src="image/products/' + products[i].prodPic + '" alt="card image cap"><div class="card-body"><h4 class="card-title">' + products[i].prodName + '</h4><p class="card-text">' + products[i].prodDesc + '</p><h5 class="card-text">' + products[i].prodPrice + ':-</h5></div><div class="card-footer bg-transparent border"><a class="btn btn-primary btn-lg quickBuy" href="#">Lägg i varukorgen</a><a class="nav-link active productInfo" href="#">Visa mer</a></div></div></div>');
                    row.append(prodCard);
                }
            }

            $(".under").show();
            $(".under > ul").show();

            updateLinks();
        });
        
        $(".under").on("click", "a.subCat", function()
        {
            $("#container").attr("class", "container");
            $("#container").css("background-color", "white");
            $("#container").css("margin-bottom", "5em");
            $("li > a.active").removeClass("active");
            $(this).addClass("active");
            row.empty();
            
            for(var i = 0; i < products.length; i++)
            {
                if(products[i].underKat == $(this).attr("data-under-id") && products[i].huvudKat == $(this).attr("data-over-id"))
                {
                    prodCard = $('<div class="col-sm-3 text-center"><div data-prod-id="' + products[i].id + '" class="card"><img class="card-img-top bild" src="image/products/' + products[i].prodPic + '" alt="card image cap"><div class="card-body"><h4 class="card-title">' + products[i].prodName + '</h4><p class="card-text">' + products[i].prodDesc + '</p><h5 class="card-text">' + products[i].prodPrice + ':-</h5></div><div class="card-footer bg-transparent border"><a class="btn btn-primary btn-lg quickBuy" href="#">Lägg i varukorgen</a><a class="nav-link active productInfo" href="#">Visa mer</a></div></div></div>');
                    row.append(prodCard);
                }
            }
            updateLinks();
        });

        updateLinks();
    }

    function updateLinks()
    {
        var products = JSON.parse(localStorage.getItem("products"));      
        var row = $("<div class='row my-4'></div>");

        $(".quickBuy").on("click", function(e)
        {
            e.preventDefault();
            var storeCart = JSON.parse(sessionStorage.getItem("cart"));
            var prodId;
            if($(this).parents(".card").attr("data-prod-id") == undefined)
            {
                prodId = $(this).attr("data-prod-id");
            }
            else
            {
                prodId = $(this).parents(".card").attr("data-prod-id");
            }
            var found = false;

            for (var i = 0; i < storeCart.length; i++)
            {
                if(storeCart[i].prodId == prodId)
                {
                    storeCart[i].amount += 1;
                    found = true;
                    break;
                }
            }

            if (found == false)
            {
                var cartItem = 
                {
                    "prodId": prodId,
                    "amount": 1
                };
                
                storeCart.push(cartItem);
            }
            sessionStorage.setItem("cart", JSON.stringify(storeCart));
        });

        $(".productInfo").click(function()
        {
            var prodId = $(this).parents(".card").attr("data-prod-id");
            var prodIndx = null;

            for (var i = 0; i < products.length; i++)
            {
                if(products[i].id == prodId)
                {
                    prodIndx = i;
                    break;
                }
            }

            $("#container")
                .empty()
                .append('<div class="row my-4"><div class="col-lg-8"><img class="img-fluid rounded" src="./image/products/' + products[prodIndx].prodPic + '" alt=""></div><div class="col-lg-4"><h1 id="prodName">' + products[prodIndx].prodName + '</h1><p id="prodDesc">' + products[prodIndx].prodDesc + '</p><h3 id="prodPrice">' + products[prodIndx].prodPrice + ' :-</h1><a class="btn btn-primary btn-lg quickBuy" data-prod-id="' + prodId + '" href="#">Lägg i varukorgen</a></div></div>')
            ;

            updateLinks();
        });

        $(".member").click(function(e)
        {
            e.preventDefault();
            $("#container")
                .empty()
                .append("<div class='form'><h1>För att bli medlem, fyll i följande formulär</h1><form><br><input type='text' name='fName' id='nameInp' placeholder='Namn'/><br/><input type='text' name='email' id='mailInp' placeholder='E-mail'/><br/><input type='tel' name='tel' id='telInp'placeholder='Tel-nr'/><br/><br/><label for='post'>Vill du ha nyhetsbrev?:<br/></label><br/>JA:<input type='radio' name='post' value='yes'><br/>NEJ:<input type='radio' name='post' value='no'><br/><br/><input type='password' name='password1' id='password1'placeholder='Välj lösenord'/><br/><input type='password' name='password2' id='password2' placeholder='Repetera lösenord'/><br/><br/><input type='button' value='Skicka in' name='button' id='formButton'/><br/></form></div>")
            ;

            updateLinks();
        });

        $(".placeOrder").click(function(e)
        {
            e.preventDefault();
            
            var orderDB = [];

            if (localStorage.getItem("orders") != null)
            {
                orderDB = JSON.parse(localStorage.getItem("orders"));
            }

            var order =
            {
                "orderid": orderDB.length + 1,
                "userid": (sessionStorage.getItem("loggedUser") != null ? sessionStorage.getItem("loggedUser") : 0),
                "productsList": sessionStorage.getItem("cart")
            };

            orderDB.push(order);

            localStorage.setItem("orders", JSON.stringify(orderDB));
            sessionStorage.setItem("cart", JSON.stringify([]));

            $("#container")
                .empty()
                .append("<h1>Tack för din order!</h1>")
                .append("<p>Orderbekräftelse och ytterligare information kommer till din Email.</p>")
                .append("<p>Ditt order-nr: " + orderDB.pop().orderid + "</p>")
            ;

            updateLinks();
        });

        $("#formButton").click(function()
        {
            var userDB = JSON.parse(localStorage.getItem("users"));
            var newUser = true;

            for(var i = 0; i < userDB.length; i++)
            {
                if(userDB[i].email == $("#mailInp").val())
                {
                    newUser = false;
                    alert("There is already an account registered under this emailadress!");
                }
            }

            if(newUser == true && $("#password1").val() === $("#password2").val())
            {
                var radios = document.getElementsByName("post");
                var radioChoice;
                var tempid = (userDB.length + 1);

                for (var i = 0, length = radios.length; i < length; i++)
                {
                    if (radios[i].checked)
                    {
                        radioChoice = radios[i].value;
                        break;
                    }
                }

                var userInfo =
                {
                    "id": tempid,
                    "email": $("#mailInp").val(),
                    "password": $("#password1").val(),
                    "name": $("#nameInp").val(),
                    "telnum": $("#telInp").val(),
                    "newssub": radioChoice
                };

                userDB.push(userInfo);
                localStorage.setItem("users", JSON.stringify(userDB));
                sessionStorage.setItem("loggedUser", tempid);
                cartView();
            }
            else
            {
                alert("Lösenorden måste vara identiska");
            }
        });

        $("#login").submit(function(e)
        {
            e.preventDefault();

            var loginCompare = null;
            var accountDB = JSON.parse(localStorage.getItem("users"));

            $.each(accountDB, function(i, v)
            {
                if (v.email == $("#eml").val())
                {
                    loginCompare = v;
                    return false;
                }
            });

            if (loginCompare != null && loginCompare.password == $("#pswrd").val())
            {
                sessionStorage.setItem("loggedUser", loginCompare.id);
                cartView();
            }
            else
            {
                alert("Fel mail/password! Försök igen!");
            }
        });
    }

       $(".coockieButton").click(function(){

         sessionStorage.user = "true";
         
         status();

     })


     function status(){

     if (sessionStorage.user == "true"){

         $(".kaka").hide();

     }

     else {

         $(".kaka").show();
     }

 }

    $("#info").click(function()
    {
        $("#container").attr("class", "container");
        $("#container").css("background-color", "white");
        $("#container").css("margin-bottom", "5em");
        $(".under").hide();
        $("#container")
            .empty()
            .append('<div class="container-fluid"><div class="row"><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac.</p></p></div><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac, luctus facilisis elit. Nunc est magna, aliquet vel justo ut, lobortis fermentum nibh. In pellentesque tortor nibh, imperdiet pretium nulla commodo vitae. </p></p></div><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac.</p></div></div>')
            .append('<div class="container-fluid"><div class="row"><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac.</p></p></div><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac, luctus facilisis elit. Nunc est magna, aliquet vel justo ut, lobortis fermentum nibh. In pellentesque tortor nibh, imperdiet pretium nulla commodo vitae. </p></p></div><div class="col-md-4 box"><h3 class="text-center">INFO</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus dolor eget maximus lacinia. Mauris in blandit tellus. Duis pellentesque erat nec turpis scelerisque, a mollis dolor egestas. Vivamus sit amet urna sed dui aliquam pulvinar. Aenean quis sem in diam tristique varius. Nullam diam lectus, luctus sit amet nunc ac.</p></div></div>')
        ;
    });

    $("#contact").click(function()
    {
        $("#container").attr("class", "container");
        $("#container").css("background-color", "white");
        $("#container").css("margin-bottom", "5em");
        $(".under").hide();
        $("#container")
        .empty()
        .append('<div class="well well-sm"><h3><strong>Besök oss</strong></h3></div><div class="row"><div class="col-md-7 map-holder"><iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ2WUtn33zT0YR2uKjp362ry8&key=AIzaSyAlEpssURhMe60k5kkrTzRsf5ROXtZfQqc" allowfullscreen></iframe></div><div class="col-md-5"><h4><strong>Hör av dig till oss</strong></h4><form><div class="form-group"><input type="text" class="form-control" name="" value="" placeholder="Namn"></div><div class="form-group"><input type="email" class="form-control" name="" value="" placeholder="E-mail"></div><div class="form-group"><input type="tel" class="form-control" name="" value="" placeholder="Tele-nr"></div><div class="form-group"><textarea class="form-control" name="" rows="3" placeholder="Meddelande"></textarea></div><button class="btn btn-default" type="submit" name="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i> Skicka in!</button></form></div></div>')
    ;
});

    $(".cart").click(function(e)
    {
        $("#container").attr("class", "container");
        $("#container").css("background-color", "white");
        $("#container").css("margin-bottom", "5em");
        $(".under").hide();
        e.preventDefault();
        cartView();
    });

    function fillCart()
    {
        var cart = JSON.parse(sessionStorage.getItem("cart"));
        var products = JSON.parse(localStorage.getItem("products"));
        var totalPrice = 0;

        for(var i = 0; i < cart.length; i++)
        {
            for(var j = 0; j < products.length; j++)
            {
                if(cart[i].prodId == products[j].id)
                {
                    $cartCard = $('<div class="col-sm-3 text-center"><div class="card" data-prodid="' + cart[i].prodId + '"><img class="card-img-top bild" src="image/products/' + products[j].prodPic + '" alt="card image cap"><div class="card-body"><h4 class="card-title">' + products[j].prodName + '</h4><p class="card-text">' + cart[i].amount + 'st. för ' + (products[j].prodPrice * cart[i].amount) + ' kr</p></div><div class="card-footer bg-transparent border"><a href="#" class="btn btn-primary btn-sm rmv">Ta bort 1.</a> <a href="#" class="btn btn-primary btn-sm rmvall">Ta bort alla.</a></div></div></div>');
                    $(".cartList").append($cartCard);

                    totalPrice += products[j].prodPrice * cart[i].amount;

                    break;
                }
            }
        }
        if(cart.length == 0)
        {
            $("#container").empty();
            $("#container").append("<h2>Varukorg:</h2>");
            $("#container").append("<h5>Din varukorg är tyvärr tom.</h5>");
        }

        totalPrice += 55;
        $(".totPrice").append("<h5>Totalt: " + totalPrice + " kr (Inkl. frakt)</h5>");

        $(".rmv").on("click", function(e)
        {
            e.preventDefault();
            for(var i = 0; i < cart.length; i++)
            {
                if($(this).parents(".card").attr("data-prodid") == cart[i].prodId)
                {
                    cart[i].amount--;

                    if(cart[i].amount == 0)
                    {
                        cart.splice(i, 1);
                    }

                    sessionStorage.setItem("cart", JSON.stringify(cart));
                    cartView();
                }
            }
        });

        $(".rmvall").on("click", function(e)
        {
            e.preventDefault();
            for(var i = 0; i < cart.length; i++)
            {
                if($(this).parents(".card").attr("data-prodid") == cart[i].prodId)
                {
                    cart.splice(i, 1);
                    sessionStorage.setItem("cart", JSON.stringify(cart));
                    cartView();
                }
            }
        });
    }

    function cartView()
    {
        var users = JSON.parse(localStorage.getItem("users"));
        var user;

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].id == sessionStorage.loggedUser)
            {
                user = users[i].email;
            }
        }

        $("#container")
            .empty()
            .append("<h2>Varukorg:</h2>")
            .append("<div id='cartDiv'><h3>Tillhörande '" + user + "'</h3></div>")
            .append("<div class='row cartList'></div>")
            .append("<div class='totPrice'><div>")
        ;

        if(sessionStorage.getItem("loggedUser") == null)
        {
            $("#cartDiv")
                .empty()
                .append("<form id='login'><input class='user' id='eml' type='text' placeholder='Användarnamn'> <input class='pass' id='pswrd' type='password' placeholder='Lösenord'> <br> <br> <button id='login' type='submit'>Logga in</button> eller <button class='member' type='submit'>Bli medlem</button></form>")
            ;
        }
            
        $("#container")
            .append("<a class='btn btn-primary btn-lg placeOrder' href='#'>Slutför köp</a>")
        ;

        fillCart();
        updateLinks();
    }

    $(function() {
        var jumbotron = $('.jumbotron');
        var backgrounds = ['url(./image/startpage/banner1.jpg)', 'url(./image/startpage/banner3.jpg)'];
      var current = 0;
      
      function nextBackground() {
        jumbotron.css(
         'background',
          backgrounds[current = ++current % backgrounds.length]
       );
      
       
       setTimeout(nextBackground, 5000);
       }
       setTimeout(nextBackground, 5000);
       jumbotron.css('background', backgrounds[0]);
       });

       
});