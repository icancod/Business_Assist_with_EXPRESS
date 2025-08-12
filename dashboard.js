document.getElementById("Search").addEventListener("submit", async function(event) {
    event.preventDefault();
    const itemFilter = document.getElementById("itemFilter").value;
    //const categoryFilter = document.getElementById("categoryFilter").value;
    const priceFilter = document.getElementById("priceFilter").value;
    const category = document.getElementById("category").value;

    const params = new URLSearchParams()
    if (itemFilter) params.append("title", itemFilter);
    // if (categoryFilter) params.append("category", categoryFilter);
    if (priceFilter) params.append("price", priceFilter);
    if (category) params.append("category", category);

    // const response = await fetch(`/NODE/dashboard?${params.toString()}`);
    //const url = `/NODE/dashboard?${params.toString()}`;
     const url =`http://localhost:8000/EXPRESS/dashboard?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const resultsContainer = document.getElementById("productContainer");
        resultsContainer.innerHTML = ""; 
        if (data.length === 0) {
            resultsContainer.innerHTML = "<p class='text-center text-gray-500'>No products found.</p>";
        }
        data.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "bg-white shadow-md rounded-lg p-4 mb-4";
            productDiv.innerHTML = `
                <h2 class="text-xl font-semibold">${product.title}</h2>
                <p class="text-gray-600">Price: $${product.price}</p>
                <p class="text-gray-600">Category: ${product.category}</p>
            `;
            resultsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        const resultsContainer = document.getElementById("productContainer");
        resultsContainer.innerHTML = "<p class='text-red-500'>Error fetching data. Please try again later.</p>";
    }
});