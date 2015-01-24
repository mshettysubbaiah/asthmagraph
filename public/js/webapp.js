//$('document').ready(function() {
    var newtoken;
	window.Store = {
		user: null,
		setUser: function(user) {
			this.user = user;
		},
		getuser: function() {
			return this.user;
		},
		getToken: function() {
			return this.user ? this.getUser().token : null;
		},
		removeUser: function() {
			delete this.user;
		}
	};


    console.log(window);
      var newtoken;

	////////////////////////////////////////////////////////////////
	// Auth Token
	////////////////////////////////////////////////////////////////
	$('#signin').on("click", function(e) {
		// alert('checking');
		var email = $('#email').val();
		var password = $('#password').val();

		console.log(email);
		console.log(password);
		
		$.ajax({
			type: "POST",
			cache: false,
			dataType: "json",
            url: "/api/gettoken",
            data: {email:email, password:password, login: true},
            success: function(data){
                // alert(data.data.message);
                // alert(data.data.token);

                Store.setUser({email: email, message: data.data.message, token: data.data.token});
                var user = Store.getuser();
                newtoken = user.token;
                // console.log(newtoken);
                // $.cookie('back_to_url_onPage_referesh', 1);
                // $.cookie('user', email);
                // $.cookie('Token', user.token,{ path: '/' });
                
                // Upon successful login, redirect to /appspage
                // 
                
                // alert("Wait for 30 sec");
                window.location.href = "/graphapp";
            },
            error: function(data) {
            	//alert("Is this the message?");
                // alert(data.statusText);
                // 
                // 
                
                document.getElementById("loginErrorCode").innerHTML = data.info;

                $("#loginErrorCode").fadeIn("slow");
                //window.location.href = "/login_new";
            }
		});
	});

   //  console.log(newtoken);

    ////////////////////////////////////////////////////////////////
    // Register/Signup Token
    ////////////////////////////////////////////////////////////////
    $('#register').on("click", function(e) {
        // alert('checking');
        var username = $('#regusername').val();
        var email = $('#regemail').val();
        var password = $('#regpassword').val();

            console.log(username);
            console.log(email);
            console.log(password);
            
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "/api/registeruser",
            data: {username: username, email:email, password:password, login: true},
            success: function(data){
                Store.setUser({username: username, email: email, message: data.data.message, token: data.data.token});
                console.log("Finished setting user: " + email + ", Token: " + data.data.token);
                // console.log("You're now logged in. Try clicking the 'Test Token' button next.");
                
                // Upon successful login, redirect to /appspage
                window.location.href = "/appspage";
                
            },
            error: function(data) {
                alert("Is this the message?");
                alert(data.statusText);
            }
        });
    });


	/////////////////////////////////////////////////////////////////
    // LOGOUT ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
	$("li#appslogout").click(function(e) {

        /*var token = Store.getToken();
        Store.removeUser();
        if (token) {
            $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: "/logout",
                headers: {
                    token: token
                },
                success: function(data) {
                    console.log(data);
                    if (data.error) {
                        alert("Issue logging out.");
                    } else {
                        alert("You're now logged out.");
                    }
                }
            });
        } else {
            alert("No token");
        }*/


        console.log('Testing Logout');

    });
//})