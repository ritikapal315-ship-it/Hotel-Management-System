
let allUserInfo = [];


// ================= REGISTER =================

let regForm = document.querySelector(".reg-form");

if (regForm) {

    let allInput = regForm.querySelectorAll("input");

    // Get saved users
    if (localStorage.getItem("allUserInfo") != null) {
        allUserInfo = JSON.parse(
            localStorage.getItem("allUserInfo")
        );
    }

    console.log("Saved Users:", allUserInfo);


    regForm.onsubmit = (e) => {

        e.preventDefault();

        // Check email already exists
        let checkEmail = allUserInfo.find((data) => {

            return data.email === allInput[4].value;

        });


        if (checkEmail) {

            swal(
                "Error!",
                "Email already exists!",
                "error"
            );

            return;
        }


        let data = {};


        for (let el of allInput) {

            let key = el.name;

            data[key] = el.value;

        }


        // Add new user
        allUserInfo.push(data);


        // Save users
        localStorage.setItem(
            "allUserInfo",
            JSON.stringify(allUserInfo)
        );


        console.log("New User:", data);
        console.log("All Users:", allUserInfo);


        swal(
            "Good Job!",
            "Registration Success!",
            "success"
        );

    };

}


// ================= LOGIN =================

let loginForm = document.querySelector(".Login-form");


if (loginForm) {

    let loginInput = loginForm.querySelectorAll("input");


    console.log(
        "Login Input NodeList:",
        loginInput
    );


    loginForm.onsubmit = (e) => {

        e.preventDefault();


        let loginBtn =
            loginForm.querySelector("button");


        loginBtn.innerText =
            "Please Wait...";

        loginBtn.disabled = true;


        let email =
            loginInput[0].value;

        let password =
            loginInput[1].value;


        let savedUsers = JSON.parse(
            localStorage.getItem("allUserInfo")
        ) || [];


        // Find user
        let loginUser = savedUsers.find((user) => {

            return user.email === email &&
                   user.password === password;

        });


        setTimeout(() => {


            if (loginUser) {

                console.log(
                    "Login Successful:",
                    loginUser
                );


                // ===============================
                // IMPORTANT CHANGE
                // SAVE LOGGED-IN USER
                // ===============================

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(loginUser)
                );


                swal(
                    "Good Job!",
                    "Login Successful!",
                    "success"
                );


                // Go to Profile / Dashboard
                setTimeout(() => {

                    window.location.href =
                        "Profile/profile.html";

                }, 1500);


            } else {


                console.log(
                    "Invalid Email or Password"
                );


                swal(
                    "Error!",
                    "Invalid Email or Password!",
                    "error"
                );


                loginBtn.innerText =
                    "Login";

                loginBtn.disabled =
                    false;

            }

        }, 1500);

    };

}

