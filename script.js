
        // Cart and Wishlist State
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        // DOM Elements
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const searchBtnMobile = document.getElementById('searchBtnMobile');
        const searchBtn = document.getElementById('searchBtn');
        const closeSearch = document.getElementById('closeSearch');
        const searchSidebar = document.getElementById('searchSidebar');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const overlay = document.getElementById('overlay');

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            updateBadges();
            setupEventListeners();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Mobile menu toggle
            mobileMenuButton?.addEventListener('click', toggleMobileMenu);
            closeMobileMenu?.addEventListener('click', toggleMobileMenu);
            mobileMenuOverlay?.addEventListener('click', toggleMobileMenu);

            // Search functionality
            searchBtnMobile?.addEventListener('click', toggleSearchSidebar);
            searchBtn?.addEventListener('click', toggleSearchSidebar);
            closeSearch?.addEventListener('click', toggleSearchSidebar);
            overlay?.addEventListener('click', toggleSearchSidebar);

            // Search input with debounce
            if (searchInput) {
                searchInput.addEventListener('input', debounce(handleSearch, 300));
            }
        }

        // Toggle mobile menu
        function toggleMobileMenu() {
            mobileMenu.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        }

        // Toggle search sidebar
        function toggleSearchSidebar() {
            searchSidebar.classList.toggle('open');
            overlay.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
            if (searchSidebar.classList.contains('open')) {
                searchInput.focus();
            }
        }

        // Handle search input
        function handleSearch(e) {
            const query = e.target.value.trim();
            if (query.length > 2) {
                // Simulate search - replace with actual API call
                setTimeout(() => {
                    const mockResults = [
                        { id: 1, name: 'T-Shirt Basic', price: 'RM 49.90' },
                        { id: 2, name: 'Kasut Sukan', price: 'RM 199.90' },
                        { id: 3, name: 'Kamera Digital', price: 'RM 1,299.00' },
                        { id: 4, name: 'Headphone', price: 'RM 159.90' }
                    ];
                    
                    displaySearchResults(mockResults.filter(item => 
                        item.name.toLowerCase().includes(query.toLowerCase())
                    ));
                }, 300);
            } else {
                searchResults.innerHTML = '';
            }
        }

        // Display search results
        function displaySearchResults(results) {
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p class="text-gray-500 text-center py-4">Tiada hasil carian dijumpai</p>';
                return;
            }

            const html = results.map(result => `
                <a href="product${result.id}.html" class="block p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100">
                    <div class="font-medium">${result.name}</div>
                    <div class="text-sm text-gray-600">${result.price}</div>
                </a>
            `).join('');

            searchResults.innerHTML = html;
        }

        // Add to wishlist
        function addToWishlist(productId) {
            const product = getProductById(productId);
            if (!product) return;
            
            const existingIndex = wishlistItems.findIndex(item => item.id === productId);
            
            if (existingIndex > -1) {
                wishlistItems.splice(existingIndex, 1);
            } else {
                wishlistItems.push(product);
            }
            
            // Save to localStorage
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            updateBadges();
            
            // Update heart icon
            const heartIcons = document.querySelectorAll(`[onclick*="addToWishlist(${productId})"] i`);
            heartIcons.forEach(icon => {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('text-red-500');
            });
        }

        // Add to cart
        function addToCart(productId, quantity = 1) {
            const product = getProductById(productId);
            if (!product) return;
            
            const existingItem = cartItems.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ ...product, quantity });
            }
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateBadges();
        }

        // Get product by ID
        function getProductById(id) {
            const products = [
                { id: 1, name: 'T-Shirt Basic', price: 49.90 },
                { id: 2, name: 'Kasut Sukan', price: 199.90 },
                { id: 3, name: 'Kamera Digital', price: 1299.00 },
                { id: 4, name: 'Headphone', price: 159.90 }
            ];
            return products.find(p => p.id === id);
        }

        // Update cart and wishlist badges
        function updateBadges() {
            // Update cart badges
            const cartBadges = document.querySelectorAll('[id$="CartBadge"]');
            cartBadges.forEach(badge => {
                const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
                badge.textContent = count || '';
                badge.classList.toggle('hidden', count === 0);
                if (count > 0) {
                    badge.classList.add('animate-bounce-once');
                    setTimeout(() => {
                        badge.classList.remove('animate-bounce-once');
                    }, 300);
                }
            });

            // Update wishlist badges
            const wishlistBadges = document.querySelectorAll('[id$="WishlistBadge"]');
            wishlistBadges.forEach(badge => {
                const count = wishlistItems.length;
                badge.textContent = count || '';
                badge.classList.toggle('hidden', count === 0);
            });

            // Update heart icons for wishlisted items
            wishlistItems.forEach(item => {
                const heartIcons = document.querySelectorAll(`[onclick*="addToWishlist(${item.id})"] i`);
                heartIcons.forEach(icon => {
                    icon.classList.remove('far');
                    icon.classList.add('fas', 'text-red-500');
                });
            });
        }

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
