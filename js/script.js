document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navUl = document.querySelector("nav ul");
    if (menuToggle && navUl) {
        menuToggle.addEventListener("click", () => {
            navUl.classList.toggle("show");
        });
    }

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            faqItems.forEach(i => i.classList.remove("open"));
            if (!isOpen) {
                item.classList.add("open");
            }
        });
    });

    // Books JSON Loading & Filtering
    const booksContainer = document.getElementById("booksContainer");
    if (booksContainer) {
        fetch("data/books.json")
            .then(res => res.json())
            .then(books => {
                displayBooks(books);

                const searchInput = document.getElementById("searchInput");
                const categoryFilter = document.getElementById("categoryFilter");
                const noResultsMsg = document.getElementById("noResultsMsg");

                function filterBooks() {
                    const query = searchInput.value.toLowerCase();
                    const category = categoryFilter.value;

                    const filtered = books.filter(book => {
                        const matchesQuery = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
                        const matchesCategory = category === "" || book.category === category;
                        return matchesQuery && matchesCategory;
                    });

                    displayBooks(filtered);
                    if (noResultsMsg) {
                        noResultsMsg.style.display = filtered.length === 0 ? "block" : "none";
                    }
                }

                searchInput.addEventListener("input", filterBooks);
                categoryFilter.addEventListener("change", filterBooks);
            })
            .catch(err => {
                console.error("Error loading books:", err);
                booksContainer.innerHTML = "<p style='text-align:center; color:red;'>Unable to load book catalog at this time.</p>";
            });
    }

    function displayBooks(books) {
        const booksContainer = document.getElementById("booksContainer");
        if (!booksContainer) return;
        booksContainer.innerHTML = books.map(book => `
            <div class="card">
                <div>
                    <span style="font-size: 0.8rem; font-weight: 600; color: var(--soft-green); text-transform: uppercase;">${book.category}</span>
                    <h3 style="margin-top: 0.25rem;">${book.title}</h3>
                    <p style="font-size: 0.9rem; font-style: italic; margin-bottom: 0.75rem;">by ${book.author}</p>
                    <p>${book.description}</p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.85rem; color: #666; border-top: 1px solid var(--border-color); pt-2;">Sample Demonstration Item</div>
            </div>
        `).join("");
    }

    // Events JSON Loading
    const eventsContainer = document.getElementById("eventsContainer");
    if (eventsContainer) {
        fetch("data/events.json")
            .then(res => res.json())
            .then(events => {
                eventsContainer.innerHTML = events.map(ev => `
                    <div class="card">
                        <div>
                            <h3 style="color: var(--primary-teal);">${ev.title}</h3>
                            <p style="font-weight: 600; color: var(--soft-green); font-size: 0.9rem; margin-bottom: 0.5rem;">📅 ${ev.date}</p>
                            <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">📍 ${ev.location}</p>
                            <p>${ev.description}</p>
                        </div>
                    </div>
                `).join("");
            })
            .catch(err => {
                console.error("Error loading events:", err);
                eventsContainer.innerHTML = "<p style='text-align:center; color:red;'>Unable to load events schedule at this time.</p>";
            });
    }

    // Inquiry Form Preview Handling
    const inquiryForm = document.getElementById("inquiryForm");
    const inquiryType = document.getElementById("inquiryType");
    const bookDetailsGroup = document.getElementById("bookDetailsGroup");

    if (inquiryType && bookDetailsGroup) {
        inquiryType.addEventListener("change", () => {
            if (inquiryType.value === "Special Order" || inquiryType.value === "Book Recommendation") {
                bookDetailsGroup.style.display = "block";
            } else {
                bookDetailsGroup.style.display = "none";
            }
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            document.getElementById("prevType").textContent = inquiryType.value;
            document.getElementById("prevName").textContent = document.getElementById("visitorName").value;
            document.getElementById("prevEmail").textContent = document.getElementById("visitorEmail").value;
            
            const bookVal = document.getElementById("bookTitleAuthor").value;
            const prevBookRow = document.getElementById("prevBookRow");
            if (inquiryType.value === "Special Order" || inquiryType.value === "Book Recommendation") {
                prevBookRow.style.display = "block";
                document.getElementById("prevBook").textContent = bookVal || "Not specified";
            } else {
                prevBookRow.style.display = "none";
            }

            document.getElementById("prevMsg").textContent = document.getElementById("visitorMessage").value;
            document.getElementById("previewBox").classList.add("active");
        });
    }
});