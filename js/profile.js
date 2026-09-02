
// ======================
// CHECK LOGIN
// ======================

let loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

if (!loggedInUser) {
    window.location.href = "../index.html";
}


// ======================
// CUSTOMER DATA
// ======================

let customers = JSON.parse(
    localStorage.getItem("customers")
) || [];

let bills = JSON.parse(
    localStorage.getItem("bills")
) || [];

let totalRoom = Number(loggedInUser.totalRoom) || 0;


// ======================
// DASHBOARD ELEMENTS
// ======================

const totalRooms = document.querySelector("#totalRooms");
const availableRooms = document.querySelector("#availableRooms");
const checkedIn = document.querySelector("#checkedIn");
const checkedOut = document.querySelector("#checkedOut");

const customerTableBody =
    document.querySelector("#customerTableBody");

const checkInForm =
    document.querySelector("#checkInForm");

const checkOutForm =
    document.querySelector("#checkOutForm");

const logoutBtn =
    document.querySelector("#logoutBtn");


// ======================
// BILL ELEMENTS
// ======================

const billForm =
    document.querySelector("#billForm");

const totalBill =
    document.querySelector("#totalBill");


// ======================
// AUTO ROOM ALLOCATION
// ======================

function getAvailableRoom() {

    for (let i = 1; i <= totalRoom; i++) {

        let roomNo = 100 + i;

        let occupied = customers.find(
            (customer) => {

                return customer.room == roomNo &&
                       customer.status == "Checked In";

            }
        );

        if (!occupied) {

            return roomNo;

        }
    }

    return null;
}


// ======================
// UPDATE DASHBOARD
// ======================

function updateDashboard() {

    let activeCustomers =
        customers.filter(
            (customer) =>
                customer.status == "Checked In"
        ).length;

    let checkoutCustomers =
        customers.filter(
            (customer) =>
                customer.status == "Checked Out"
        ).length;


    totalRooms.innerText =
        totalRoom;

    availableRooms.innerText =
        totalRoom - activeCustomers;

    checkedIn.innerText =
        activeCustomers;

    checkedOut.innerText =
        checkoutCustomers;
}


// ======================
// SHOW CUSTOMERS
// ======================

function showCustomers() {

    customerTableBody.innerHTML = "";


    if (customers.length == 0) {

        customerTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No Customer Found
                </td>

            </tr>

        `;

        return;
    }


    customers.forEach(
        (customer) => {

            customerTableBody.innerHTML += `

                <tr>

                    <td>
                        ${customer.name}
                    </td>

                    <td>
                        ${customer.mobile}
                    </td>

                    <td>
                        ${customer.room}
                    </td>

                    <td>
                        ${customer.checkIn}
                    </td>

                    <td>
                        ${customer.checkOut || "-"}
                    </td>

                    <td>

                        <span class="badge ${
                            customer.status == "Checked In"
                            ? "bg-success"
                            : "bg-danger"
                        }">

                            ${customer.status}

                        </span>

                    </td>

                </tr>

            `;

        }
    );
}


// ======================
// CUSTOMER CHECK-IN
// ======================

checkInForm.onsubmit = function (e) {

    e.preventDefault();


    let name =
        document.querySelector("#customerName")
        .value.trim();


    let mobile =
        document.querySelector("#customerMobile")
        .value.trim();


    let customerId =
        document.querySelector("#customerId")
        .value.trim();


    let gender =
        document.querySelector("#customerGender")
        .value;


    let numberOfGuests =
        document.querySelector("#numberOfGuests")
        .value;


    // Mobile validation

    if (mobile.length != 10) {

        swal(
            "Error!",
            "Please enter a valid 10 digit mobile number.",
            "error"
        );

        return;
    }


    // Find room

    let room =
        getAvailableRoom();


    if (room == null) {

        swal(
            "No Room!",
            "All hotel rooms are occupied.",
            "error"
        );

        return;
    }


    // Create customer

    let customer = {

        id: Date.now(),

        name: name,

        mobile: mobile,

        customerId: customerId,

        gender: gender,

        numberOfGuests: numberOfGuests,

        room: room,

        checkIn:
            new Date().toLocaleDateString(),

        checkOut: "",

        status: "Checked In"

    };


    customers.push(customer);


    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );


    swal(
        "Success!",
        "Customer checked into Room " +
        room +
        " successfully.",
        "success"
    );


    checkInForm.reset();


    showCustomers();

    updateDashboard();

};


// ======================
// CUSTOMER CHECK-OUT
// ======================

checkOutForm.onsubmit =
function (e) {

    e.preventDefault();


    let room =
        document.querySelector("#checkOutRoom")
        .value.trim();


    let customer =
        customers.find(
            (customer) => {

                return customer.room == room &&
                       customer.status == "Checked In";

            }
        );


    if (!customer) {

        swal(
            "Error!",
            "No checked-in customer found in this room.",
            "error"
        );

        return;
    }


    customer.status =
        "Checked Out";


    customer.checkOut =
        new Date().toLocaleDateString();


    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );


    swal(
        "Success!",
        "Customer checked out successfully.",
        "success"
    );


    checkOutForm.reset();


    showCustomers();

    updateDashboard();

};


// ======================
// BILL CALCULATION
// ======================

billForm.onsubmit =
function (e) {

    e.preventDefault();


    let room =
        document.querySelector("#billRoom")
        .value.trim();


    let roomCharge =
        Number(
            document.querySelector("#roomCharge")
            .value
        );


    let numberOfDays =
        Number(
            document.querySelector("#numberOfDays")
            .value
        );


    let foodCharges =
        Number(
            document.querySelector("#foodCharges")
            .value
        ) || 0;


    let tax =
        Number(
            document.querySelector("#tax")
            .value
        ) || 0;


    let paymentStatus =
        document.querySelector("#paymentStatus")
        .value;


    // Find customer

    let customer =
        customers.find(
            (customer) => {

                return customer.room == room;

            }
        );


    if (!customer) {

        swal(
            "Error!",
            "Customer not found for this room.",
            "error"
        );

        return;
    }


    // Room total

    let roomTotal =
        roomCharge * numberOfDays;


    // Sub total

    let subTotal =
        roomTotal + foodCharges;


    // Tax amount

    let taxAmount =
        (subTotal * tax) / 100;


    // Final bill

    let finalBill =
        subTotal + taxAmount;


    // Show total

    totalBill.innerText =
        finalBill.toFixed(2);


    // Save bill

    let bill = {

        id: Date.now(),

        customerId:
            customer.id,

        customerName:
            customer.name,

        room:
            room,

        roomCharge:
            roomCharge,

        numberOfDays:
            numberOfDays,

        foodCharges:
            foodCharges,

        tax:
            tax,

        taxAmount:
            taxAmount,

        total:
            finalBill,

        paymentStatus:
            paymentStatus,

        billDate:
            new Date().toLocaleDateString()

    };


    bills.push(bill);


    localStorage.setItem(
        "bills",
        JSON.stringify(bills)
    );


    swal(
        "Bill Generated!",
        "Total Bill: ₹" +
        finalBill.toFixed(2),
        "success"
    );

};


// ======================
// LOGOUT
// ======================

logoutBtn.onclick =
function () {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "../index.html";

};


// ======================
// INITIAL LOAD
// ======================

showCustomers();

updateDashboard();
