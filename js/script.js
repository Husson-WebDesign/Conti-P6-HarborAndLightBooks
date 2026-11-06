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
            const answerId = button.getAttribute("aria-controls");
            let answer = null;

            if (answerId) {
                answer = document.getElementById(answerId);
            }

            if (!answer) {
                const faqItem = button.closest(".faq-item");

                if (faqItem) {
                    answer = faqItem.querySelector(".faq-answer");
                }
            }

            if (!answer) {
                return;
            }

            const isOpen = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            answer.hidden = isOpen;
        });
    });


    // CONTACT FORM VALIDATION AND PREVIEW
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");
        const inquiryType = document.querySelector("#inquiry-type");

        const nameError = document.querySelector("#name-error");
        const emailError = document.querySelector("#email-error");
        const messageError = document.querySelector("#message-error");
        const inquiryTypeError = document.querySelector("#inquiry-type-error");

        const feedback = document.querySelector("#form-feedback");
        const preview = document.querySelector("#inquiry-preview");
        const previewContent = document.querySelector("#preview-content");

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

        function validateInquiryType() {
            return checkField(
                inquiryType,
                inquiryTypeError,
                inquiryType.value === ""
                    ? "Please select a type of inquiry."
                    : ""
            );
        }

        nameInput.addEventListener("input", validateName);
        emailInput.addEventListener("input", validateEmail);
        messageInput.addEventListener("input", validateMessage);
        inquiryType.addEventListener("change", validateInquiryType);

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            feedback.textContent = "";
            feedback.className = "";

            const nameValid = validateName();
            const emailValid = validateEmail();
            const messageValid = validateMessage();
            const inquiryValid = validateInquiryType();

            if (!nameValid || !emailValid || !messageValid || !inquiryValid) {
                feedback.textContent =
                    "Please correct the errors above before continuing.";
                feedback.className = "error";

                const firstInvalid = contactForm.querySelector(".invalid");

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            previewContent.textContent = "";

            const bookTitle = document.querySelector("#book-title");
            const author = document.querySelector("#author");

            const fields = [
                ["Name", nameInput.value.trim()],
                ["Email", emailInput.value.trim()],
                ["Inquiry Type", inquiryType.value],
                ["Book Title", bookTitle ? bookTitle.value.trim() : ""],
                ["Author", author ? author.value.trim() : ""],
                ["Message", messageInput.value.trim()]
            ];

            fields.forEach(function (field) {
                const paragraph = document.createElement("p");
                const label = document.createElement("strong");

                label.textContent = field[0] + ": ";
                paragraph.appendChild(label);
                paragraph.appendChild(
                    document.createTextNode(field[1] || "Not provided")
                );

                previewContent.appendChild(paragraph);
            });

            preview.hidden = false;

            feedback.textContent =
                "Your inquiry preview is ready. No message has been sent or stored.";
            feedback.className = "success";

            preview.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        contactForm.addEventListener("reset", function () {
            window.setTimeout(function () {
                checkField(nameInput, nameError, "");
                checkField(emailInput, emailError, "");
                checkField(messageInput, messageError, "");
                checkField(inquiryType, inquiryTypeError, "");

                feedback.textContent = "";
                feedback.className = "";

                preview.hidden = true;
                previewContent.textContent = "";
            }, 0);
        });
    }


    // LOAD BOOK DATA
    const bookList = document.querySelector("#book-list");

    if (bookList) {
        const bookSearch = document.querySelector("#book-search");
        const bookCategory = document.querySelector("#book-category");
        const bookStatus = document.querySelector("#book-status");
        const noBooks = document.querySelector("#no-books");
        const resetBooks = document.querySelector("#reset-books");

        let books = [];

        function displayBooks(items) {
            bookList.textContent = "";
            noBooks.hidden = items.length !== 0;

            items.forEach(function (book) {
                const card = document.createElement("article");
                const title = document.createElement("h3");
                const author = document.createElement("p");
                const category = document.createElement("p");
                const description = document.createElement("p");

                card.className = "card";

                title.textContent = book.title;
                author.textContent = "By: " + book.author;
                category.textContent = "Category: " + book.category;
                description.textContent = book.description;

                card.appendChild(title);
                card.appendChild(author);
                card.appendChild(category);
                card.appendChild(description);

                bookList.appendChild(card);
            });

            if (bookStatus) {
                bookStatus.textContent =
                    items.length + " sample item(s) found.";
            }
        }

        function filterBooks() {
            const searchText = bookSearch.value.toLowerCase().trim();
            const selectedCategory = bookCategory.value;

            const filteredBooks = books.filter(function (book) {
                const matchesSearch =
                    book.title.toLowerCase().includes(searchText) ||
                    book.author.toLowerCase().includes(searchText) ||
                    book.description.toLowerCase().includes(searchText) ||
                    book.category.toLowerCase().includes(searchText);

                const matchesCategory =
                    selectedCategory === "all" ||
                    book.category === selectedCategory;

                return matchesSearch && matchesCategory;
            });

            displayBooks(filteredBooks);
        }

        if (bookSearch && bookCategory) {
            bookSearch.addEventListener("input", filterBooks);
            bookCategory.addEventListener("change", filterBooks);
        }

        if (resetBooks) {
            resetBooks.addEventListener("click", function () {
                bookSearch.value = "";
                bookCategory.value = "all";
                filterBooks();
            });
        }

        fetch("data/books.json")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Unable to load books.");
                }

                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error("Invalid book data.");
                }

                books = data;
                filterBooks();
            })
            .catch(function () {
                bookStatus.textContent =
                    "Unable to load the sample collection. Please try again later.";
                bookList.textContent = "";
                noBooks.hidden = true;
            });
    }


    // LOAD EVENT DATA
    const eventList = document.querySelector("#event-list");

    if (eventList) {
        const eventStatus = document.querySelector("#event-status");
        const noEvents = document.querySelector("#no-events");

        fetch("data/events.json")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Unable to load events.");
                }

                return response.json();
            })
            .then(function (events) {
                if (!Array.isArray(events)) {
                    throw new Error("Invalid event data.");
                }

                eventList.textContent = "";
                noEvents.hidden = events.length !== 0;

                events.forEach(function (event) {
                    const card = document.createElement("article");
                    const title = document.createElement("h3");
                    const category = document.createElement("p");
                    const description = document.createElement("p");
                    const date = document.createElement("p");
                    const time = document.createElement("p");

                    card.className = "card";

                    title.textContent = event.title;
                    category.textContent = "Category: " + event.category;
                    description.textContent = event.description;
                    date.textContent = "Date: " + event.date;
                    time.textContent = "Time: " + event.time;

                    card.appendChild(title);
                    card.appendChild(category);
                    card.appendChild(description);
                    card.appendChild(date);
                    card.appendChild(time);

                    eventList.appendChild(card);
                });

                eventStatus.textContent =
                    events.length + " sample event(s) available.";
            })
            .catch(function () {
                eventStatus.textContent =
                    "Unable to load sample events. Please try again later.";
                eventList.textContent = "";
                noEvents.hidden = true;
            });
    }

});
