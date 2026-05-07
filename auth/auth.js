const API = "https://red-phantom-auth-back-delta.vercel.app/api/auth";

async function signup() {
  if (password.value.length < 8) {
    alert("Password must be at least 8 characters long!");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    age: Number(age.value),
    phone: phone.value,
    role: role.value,
    gender: document.querySelector("input[name='gender']:checked").value,
  };

  try {
    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Signup failed");
      return;
    }

    localStorage.setItem("email", data.email);

    location.href = "verify-email.html";
  } catch (err) {
    alert("Server error");
  }
}

async function verifyEmail() {
  const emailStored = localStorage.getItem("email");

  try {
    const res = await fetch(API + "/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailStored,
        otp: otp.value,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Invalid OTP");
      return;
    }

    localStorage.removeItem("email");

    location.href = "login.html";
  } catch (err) {
    alert("Server error");
  }
}

async function login() {
  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    if (!data.token) {
      alert("Token not found");
      return;
    }

    localStorage.setItem("token", data.token);

    const userName =
      data.user?.userName ||
      `${data.user?.firstName || ""} ${data.user?.lastName || ""}`.trim() ||
      "User";

    localStorage.setItem(
      "user",
      JSON.stringify({
        userName,
        profileImage:
          data.user?.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      })
    );

    location.href = "https://red-phantom-main-mu.vercel.app/";
  } catch (err) {
    alert("Server error");
  }
}
