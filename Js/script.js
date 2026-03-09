// ===============================
// REGISTER USER (WITH VALIDATION)
// ===============================

let canvas = null;
let ctx = null;
let drawing = false;

function registerUser() {

    let username = document.getElementById("regUser").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPass").value;
    let confirm = document.getElementById("regConfirm").value;
    let error = document.getElementById("regError");

    let upperCase = /[A-Z]/;
    let lowerCase = /[a-z]/;
    let number = /[0-9]/;
    let specialChar = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/;
    if (!username || !email || !password || !confirm) {
        error.innerText = "Please fill all fields.";
        return;
    }

    // Check if email already registered
    let savedEmail = localStorage.getItem("email");
    if (savedEmail && savedEmail.toLowerCase() === email.toLowerCase()) {
        error.innerText = "Email is already registered.";
        return;
    }


    if (password !== confirm) {
        error.innerText = "Passwords do not match.";
        return;
    }

    if (password.length < 8 ||
    !upperCase.test(password) ||
    !lowerCase.test(password) ||
    !number.test(password) ||
    !specialChar.test(password)) {

    error.innerText = "Password must be at least 8 characters with uppercase, lowercase, number & special character.";
    return;
}

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    error.style.color = "green";
    error.innerText = "Registration Successful!";

    setTimeout(() => {
    window.location.href = "login.html";
    }, 1500);

}

// ===============================
// GLOBAL ENTER KEY HANDLER
// ===============================
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {

        // Hide suggestion boxes if any
        let suggestions = document.querySelectorAll(".suggestion-box");
        suggestions.forEach(box => box.style.display = "none");

        // LOGIN PAGE
        if (document.getElementById("loginEmail") && document.getElementById("loginPass")) {
            loginUser();
        }

        // REGISTER PAGE
        else if (document.getElementById("regUser") && document.getElementById("regEmail")) {
            registerUser();
        }

        // FORGOT PASSWORD PAGE
        else if (document.getElementById("forgotEmail")) {
            checkResetEmail();
        }

        // RESET PASSWORD PAGE
        else if (document.getElementById("newPassword") && document.getElementById("confirmPassword")) {
            saveNewPassword();
        }

        event.preventDefault(); // prevent default form submission
    }
});

// ===============================
// LOGIN USER
// ===============================
function loginUser() {

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPass").value.trim();
    let error = document.getElementById("loginError");

    let savedEmail = localStorage.getItem("email");
    let savedPassword = localStorage.getItem("password");

    // Reset message
    error.style.color = "red";
    error.innerText = "";

    if (email === "" || password === "") {
        error.innerText = "Email and Password are required.";
        return;
    }

    if (!savedEmail || !savedPassword) {
        error.innerText = "No registered account found.";
        return;
    }

    if (email !== savedEmail) {
        error.innerText = "Couldn't Find your Email.";
        return;
    }

    if (password !== savedPassword) {
        error.innerText = "Incorrect password.";
        return;
    }

    // SUCCESS
    error.style.color = "green";
    error.innerText = "Login Successful!";

    localStorage.setItem("loggedIn", "true");
    let emails = JSON.parse(localStorage.getItem("recentEmails")) || [];

if (!emails.includes(email)) {
    emails.push(email);
}

localStorage.setItem("recentEmails", JSON.stringify(emails));




    // Wait so user can see message
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1500);
}

function checkResetEmail() {

    let email = document.getElementById("forgotEmail").value.trim();
    let error = document.getElementById("forgotError");
    let savedEmail = localStorage.getItem("email");

    error.style.color = "red";
    error.innerText = "";

    if (email === "") {
        error.innerText = "Email is required.";
        return;
    }

    if (email !== savedEmail) {
        error.innerText = "Email not found.";
        return;
    }

    error.style.color = "green";
    error.innerText = "Email verified! Redirecting...";

    localStorage.setItem("canReset", "true");

    setTimeout(() => {
    window.location.href = "reset-password.html";
    }, 1500);

}

function saveNewPassword() {

    // Check if allowed to reset
    if (localStorage.getItem("canReset") !== "true") {
        window.location.href = "forgot-password.html";
        return;
    }

    let newPass = document.getElementById("newPassword").value;
    let confirmPass = document.getElementById("confirmPassword").value;
    let error = document.getElementById("resetError");

    let upperCase = /[A-Z]/;
    let lowerCase = /[a-z]/;
    let number = /[0-9]/;
    let specialChar = /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/;

    error.style.color = "red";
    error.innerText = "";

    if (!newPass || !confirmPass) {
        error.innerText = "Please fill both password fields.";
        return;
    }

    if (newPass !== confirmPass) {
        error.innerText = "Passwords do not match.";
        return;
    }

    if (newPass.length < 8 ||
        !upperCase.test(newPass) ||
        !lowerCase.test(newPass) ||
        !number.test(newPass) ||
        !specialChar.test(newPass)) {

        error.innerText = "Password must be 8 characters with uppercase, lowercase, number & special character.";
        return;
    }

    // Save new password
    localStorage.setItem("password", newPass);

    // Remove reset permission
    localStorage.removeItem("canReset");

    error.style.color = "green";
    error.innerText = "Password reset successful!";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}


// ===============================
// LOAD DASHBOARD
// ===============================
function loadDashboard() {

    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }

    let username = localStorage.getItem("username");
    document.getElementById("welcomeUser").innerText =
        "Welcome, " + username;
}


// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}


function togglePassword(inputId, icon) {

    // LOGIN
    if (inputId === "loginPass") {

        let input = document.getElementById("loginPass");
        let iconElement = icon.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            iconElement.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            input.type = "password";
            iconElement.classList.replace("fa-eye", "fa-eye-slash");
        }

        return;
    }

    // REGISTER SYNC
    if (inputId === "regPass" || inputId === "regConfirm") {

        let regPass = document.getElementById("regPass");
        let regConfirm = document.getElementById("regConfirm");

        let regEye = document.getElementById("regEye").querySelector("i");
        let regConfirmEye = document.getElementById("regConfirmEye").querySelector("i");

        if (regPass.type === "password") {

            regPass.type = "text";
            regConfirm.type = "text";

            regEye.classList.replace("fa-eye-slash", "fa-eye");
            regConfirmEye.classList.replace("fa-eye-slash", "fa-eye");

        } else {

            regPass.type = "password";
            regConfirm.type = "password";

            regEye.classList.replace("fa-eye", "fa-eye-slash");
            regConfirmEye.classList.replace("fa-eye", "fa-eye-slash");
        }

        return;
    }

    // 🔥 RESET PASSWORD SYNC (NEW PART)
    if (inputId === "newPassword" || inputId === "confirmPassword") {

        let newPass = document.getElementById("newPassword");
        let confirmPass = document.getElementById("confirmPassword");

        let newEye = document.getElementById("newEye").querySelector("i");
        let confirmEye = document.getElementById("confirmEye").querySelector("i");

        if (newPass.type === "password") {

            newPass.type = "text";
            confirmPass.type = "text";

            newEye.classList.replace("fa-eye-slash", "fa-eye");
            confirmEye.classList.replace("fa-eye-slash", "fa-eye");

        } else {

            newPass.type = "password";
            confirmPass.type = "password";

            newEye.classList.replace("fa-eye", "fa-eye-slash");
            confirmEye.classList.replace("fa-eye", "fa-eye-slash");
        }
    }
}


// SHOW EYE ONLY IF INPUT HAS TEXT
function toggleEyeVisibility(inputId, eyeId) {

    let input = document.getElementById(inputId);
    let eye = document.getElementById(eyeId);

    if (input.value.length > 0) {
        eye.style.display = "block";
    } else {
        eye.style.display = "none";
        input.type = "password"; // reset to hidden if empty
    }
}

function showRecentEmail() {

    let suggestionBox = document.getElementById("emailSuggestion");
    if (!suggestionBox) return;

    let input = document.activeElement;
    if (input.id !== "loginEmail" && input.id !== "forgotEmail") return;

    let emails = JSON.parse(localStorage.getItem("recentEmails")) || [];
    let typed = input.value.trim();

    suggestionBox.innerHTML = "";

    // If empty → show suggestions
    if (typed === "" && emails.length > 0) {

        emails.forEach(email => {

    let item = document.createElement("div");
    item.className = "suggestion-item";

    let text = document.createElement("span");
    text.innerText = email;

    // X BUTTON
    let removeBtn = document.createElement("span");
    removeBtn.innerText = "✖";
    removeBtn.style.float = "right";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.marginLeft = "10px";

    removeBtn.addEventListener("mousedown", function(e){
        e.stopPropagation();
        e.preventDefault();

        let emails = JSON.parse(localStorage.getItem("recentEmails")) || [];
        emails = emails.filter(e => e !== email);
        localStorage.setItem("recentEmails", JSON.stringify(emails));

        item.remove();
    });

    item.appendChild(text);
    item.appendChild(removeBtn);


            item.addEventListener("mousedown", function (e) {
                e.preventDefault();
                input.value = email;
                suggestionBox.style.display = "none";
            });

            suggestionBox.appendChild(item);
        });

        suggestionBox.style.display = "block";
        return;
    }

    // If not empty → hide
    suggestionBox.style.display = "none";
}


document.addEventListener("click", function(event) {

    let suggestionBox = document.getElementById("emailSuggestion");
    if (!suggestionBox) return;

    let inputs = document.querySelectorAll("#loginEmail, #forgotEmail");

    let clickedInsideInput = false;

    inputs.forEach(input => {
        if (input.contains(event.target)) {
            clickedInsideInput = true;
        }
    });

    if (suggestionBox.contains(event.target) || clickedInsideInput) {
        return;
    }

    suggestionBox.style.display = "none";
});

// ===============================
// SAVE BIODATA
// ===============================
function saveBiodata() {

    // PERSONAL DATA
    localStorage.setItem("vposition", document.getElementById("position").value);
    localStorage.setItem("vdate", document.getElementById("date").value);
    localStorage.setItem("vgender", document.getElementById("gender").value);
    localStorage.setItem("vname", document.getElementById("name").value);
    localStorage.setItem("vtelephone", document.getElementById("telephone").value);
    localStorage.setItem("vcellphone", document.getElementById("cellphone").value);
    localStorage.setItem("vemail", document.getElementById("email").value);
    localStorage.setItem("vbirth", document.getElementById("birth").value);
    localStorage.setItem("vbirthplace", document.getElementById("birthplace").value);
    localStorage.setItem("vcivil", document.getElementById("civil").value);
    localStorage.setItem("vheight", document.getElementById("height").value);
    localStorage.setItem("vweight", document.getElementById("weight").value);
    localStorage.setItem("vcitizenship", document.getElementById("citizenship").value);
    localStorage.setItem("vreligion", document.getElementById("religion").value);
    localStorage.setItem("vspouse", document.getElementById("spouse").value);
    localStorage.setItem("voccupation", document.getElementById("occupation").value);
    localStorage.setItem("vlanguage", document.getElementById("language").value);
    localStorage.setItem("vcity", document.getElementById("city").value);
    localStorage.setItem("vprovince", document.getElementById("province").value);
    
    //CHILDREN
    localStorage.setItem("vchild1", document.getElementById("child1").value);
    localStorage.setItem("vchildBirth1", document.getElementById("childBirth1").value);
    localStorage.setItem("vchild2", document.getElementById("child2").value);
    localStorage.setItem("vchildBirth2", document.getElementById("childBirth2").value);
    localStorage.setItem("vchild3", document.getElementById("child3").value);
    localStorage.setItem("vchildBirth3", document.getElementById("childBirth3").value);

    // PARENTS
    localStorage.setItem("vfather", document.getElementById("father").value);
    localStorage.setItem("vfatherjob", document.getElementById("fatherjob").value);
    localStorage.setItem("vmother", document.getElementById("mother").value);
    localStorage.setItem("vmotherjob", document.getElementById("motherjob").value);

    // EMERGENCY
    localStorage.setItem("vemergency", document.getElementById("emergency").value);
    localStorage.setItem("vemergencyDetails", document.getElementById("emergencyDetails").value);

    //EDUCATIONAL
    localStorage.setItem("velem", document.getElementById("elem").value);
    localStorage.setItem("velemYear", document.getElementById("elemYear").value);
    localStorage.setItem("vhs", document.getElementById("hs").value);
    localStorage.setItem("vhsYear", document.getElementById("hsYear").value);
    localStorage.setItem("vcollege", document.getElementById("college").value);
    localStorage.setItem("vcollegeYear", document.getElementById("collegeYear").value);
    localStorage.setItem("vdegree", document.getElementById("degree").value);
    localStorage.setItem("vskills", document.getElementById("skills").value);

    // EMPLOYMENT
    localStorage.setItem("vcompany1", document.getElementById("company1").value);
    localStorage.setItem("vposition1", document.getElementById("position1").value);
    localStorage.setItem("vfrom1", document.getElementById("from1").value);
    localStorage.setItem("vto1", document.getElementById("to1").value);
    localStorage.setItem("vcompany2", document.getElementById("company2").value);
    localStorage.setItem("vposition2", document.getElementById("position2").value);
    localStorage.setItem("vfrom2", document.getElementById("from2").value);
    localStorage.setItem("vto2", document.getElementById("to2").value);

    // CHARACTER
    localStorage.setItem("vrefname1", document.getElementById("refname1").value);
    localStorage.setItem("vrefcompany1", document.getElementById("refcompany1").value);
    localStorage.setItem("vrefposition1", document.getElementById("refposition1").value);
    localStorage.setItem("vrefcontact1", document.getElementById("refcontact1").value);
    localStorage.setItem("vrefname2", document.getElementById("refname2").value);
    localStorage.setItem("vrefcompany2", document.getElementById("refcompany2").value);
    localStorage.setItem("vrefposition2", document.getElementById("refposition2").value);
    localStorage.setItem("vrefcontact2", document.getElementById("refcontact2").value);

    // GOVERNMENT
    localStorage.setItem("vrescert", document.getElementById("vrescert").value);
    localStorage.setItem("vidcontact", document.getElementById("vidcontact").value);
    localStorage.setItem("vissuedat", document.getElementById("vissuedat").value);
    localStorage.setItem("vissuedon", document.getElementById("vissuedon").value);
    localStorage.setItem("vsss", document.getElementById("vsss").value);
    localStorage.setItem("vtin", document.getElementById("vtin").value);
    localStorage.setItem("vnbi", document.getElementById("vnbi").value);
    localStorage.setItem("vpassport", document.getElementById("vpassport").value);

    // SIGNATURE
    let canvas = document.getElementById("signaturePad");
    localStorage.setItem("vSignature", canvas.toDataURL());

    // PHOTO
    let photo = document.getElementById("photo").files[0];

    if (photo) {
        let reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem("vPhoto", e.target.result);
            window.location.href = "view-biodata.html";
        };
        reader.readAsDataURL(photo);
    } else {
        window.location.href = "view-biodata.html";
    }
}

// ===============================
// LOAD BIODATA
// ===============================
function loadBiodata() {

    let ids = [
        "vposition","vdate","vgender","vname","vtelephone","vcellphone",
        "vemail",
        "vbirth","vbirthplace","vcivil","vcitizenship","vheight",
        "vweight","vreligion",
        "vspouse","voccupation","vlanguage","vcity","vprovince","vchild1",
        "vchildBirth1","vchild2","vchildBirth2",
        "vchild3","vchildBirth3",
        "vfather","vfatherjob","vmother","vmotherjob",
        "vemergency","vemergencyDetails",
        "velem","velemYear","vhs","vhsYear",
        "vcollege","vcollegeYear","vdegree","vskills",
        "vcompany1","vposition1","vfrom1","vto1",
        "vcompany2","vposition2","vfrom2","vto2",
        "vrefname1","vrefcompany1","vrefposition1","vrefcontact1",
        "vrefname2","vrefcompany2","vrefposition2","vrefcontact2",
        "vrescert","vidcontact","vissuedat","vissuedon",
        "vsss","vtin","vnbi","vpassport"
    ];

    ids.forEach(id => {
        let value = localStorage.getItem(id);
        if (value) {
            document.getElementById(id).innerText = value;
        }
    });

    // LOAD SIGNATURE
    let signature = localStorage.getItem("vSignature");
    if (signature) {
        document.getElementById("vSignature").src = signature;
    }

    // LOAD PHOTO
    let photo = localStorage.getItem("vPhoto");

    if (photo) {
        document.querySelector(".photo-box").innerHTML = `<img src="${photo}" alt="Photo">`;

    }

}

window.addEventListener("load", function () {

    let canvas = document.getElementById("signaturePad");
    if (!canvas) return;

    let ctx = canvas.getContext("2d");

    let drawing = false;

    // Start Drawing (Mouse)
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    // Start Drawing (Touch)
    canvas.addEventListener("touchstart", startDrawTouch, { passive: false });
    canvas.addEventListener("touchmove", drawTouch, { passive: false });
    canvas.addEventListener("touchend", stopDraw);

    function startDraw(e) {
        drawing = true;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;

        let rect = canvas.getBoundingClientRect();

        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDraw() {
        drawing = false;
        ctx.beginPath();
    }

    // TOUCH FUNCTIONS
    function startDrawTouch(e) {
        e.preventDefault();
        drawing = true;
        ctx.beginPath();
    }

    function drawTouch(e) {
        if (!drawing) return;
        e.preventDefault();

        let rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];

        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    }

});

function clearSignature() {

    let canvas = document.getElementById("signaturePad");

    if (!canvas) return;

    let ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Optional: remove saved signature
    localStorage.removeItem("vSignature");
}

window.addEventListener("load", function () {

    let loginInput = document.getElementById("loginEmail");
    let forgotInput = document.getElementById("forgotEmail");

    if (loginInput) {
        loginInput.addEventListener("input", showRecentEmail);
    }

    if (forgotInput) {
        forgotInput.addEventListener("input", showRecentEmail);
    }

});

function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const container = document.querySelector(".view-page .container");

    const buttons = document.querySelectorAll("button, a");
    buttons.forEach(btn => btn.style.display = "none");

    html2canvas(container, { scale: 2 }).then(canvas => {

        let pdf = new jsPDF("p", "mm", "a4");

        let imgData = canvas.toDataURL("image/png");

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        pdf.save("biodata.pdf");

        buttons.forEach(btn => btn.style.display = "");

    });

}

window.addEventListener("load", function () {

    // Only run on index page
    if (document.body.classList.contains("welcome-page")) {

        setTimeout(function () {

            window.location.replace("login.html");

        }, 2000);

    }

}); 

