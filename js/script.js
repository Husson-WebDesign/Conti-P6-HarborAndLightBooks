
/*
   Harbor Light Books & Stationery
   Phase 3 - Interactive Features
*/

document.addEventListener("DOMContentLoaded", function () {

    // MOBILE MENU
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#main-navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.textContent = isOpen ? "Close Menu" : "Menu";
        });
    }

    // FAQ ACCORDION
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const faqItem = button.closest(".faq-item");

            if (!faqItem) {
                return;
            }

            const answer = faqItem.querySelector(".faq-answer");

            if (!answer) {
                return;
            }

            const isOpen = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            answer.hidden = isOpen;
        });
    });

    // CONTACT FORM VALIDATION
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");

        const nameError = document.querySelector("#name-error");
        const emailError = document.querySelector("#email-error");
        const messageError = document.querySelector("#message-error");
        const feedback = document.querySelector("#form-feedback");

        function checkField(input, errorElement, message) {
            if (!input || !errorElement) {
                return false;
            }

            errorElement.textContent = message;

            if (message) {
                input.classList.add("invalid");
                input.setAttribute("aria-invalid", "true");
                return false;
            }

            input.classList.remove("invalid");
            input.removeAttribute("aria-invalid");
            return true;
        }

        function validateName() {
            return checkField(
                nameInput,
                nameError,
                nameInput.value.trim() === ""
                    ? "Please enter your name."
                    : ""
            );
        }

        function validateEmail() {
            let error = "";

            if (emailInput.value.trim() === "") {
                error = "Please enter your email address.";
            } else if (!emailInput.validity.valid) {
                error = "Please enter a valid email address.";
            }

            return checkField(emailInput, emailError, error);
        }

        function validateMessage() {
            return checkField(
                messageInput,
                messageError,
                messageInput.value.trim() === ""
                    ? "Please enter a message."
                    : ""
            );
        }

        nameInput.addEventListener("input", validateName);
        emailInput.addEventListener("input", validateEmail);
        messageInput.addEventListener("input", validateMessage);

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            feedback.textContent = "";
            feedback.className = "";

            const nameValid = validateName();
            const emailValid = validateEmail();
            const messageValid = validateMessage();

            if (!nameValid || !emailValid || !messageValid) {
                feedback.textContent =
                    "Please correct the errors above before continuing.";
                feedback.className = "error";

                const firstInvalid = contactForm.querySelector(".invalid");

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            feedback.textContent =
                "Thank you! Your form passed validation. This demonstration does not send your message.";
            feedback.className = "success";

            contactForm.reset();

            checkField(nameInput, nameError, "");
            checkField(emailInput, emailError, "");
            checkField(messageInput, messageError, "");
        });
    }

});

