// Welcome message
console.log('Welcome to the Community Portal');

// Load event when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Event constructor
    class Event {
        constructor(name, date, seats, category, price) {
            this.name = name;
            this.date = new Date(date);
            this.seats = seats;
            this.category = category;
            this.price = price;
        }

        checkAvailability() {
            return this.seats > 0;
        }
    }

    // Sample events data
    const events = [
        new Event('Summer Festival', '2025-06-15', 100, 'festival', 50),
        new Event('Web Development Workshop', '2025-06-20', 20, 'workshop', 30),
        new Event('Community Sports Day', '2025-07-01', 50, 'sports', 25),
        new Event('Evening Concert', '2025-07-15', 200, 'concert', 40)
    ];

    // Category registration tracker using closure
    function createRegistrationTracker() {
        const registrations = {};
        return function(category) {
            registrations[category] = (registrations[category] || 0) + 1;
            return registrations[category];
        };
    }
    const trackRegistration = createRegistrationTracker();

    // Form elements
    const form = document.getElementById('eventForm');
    const formOutput = document.getElementById('formOutput');
    const eventTypeSelect = document.getElementById('eventType');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const clearPrefsButton = document.getElementById('clearPreferences');
    const locationInfo = document.getElementById('locationInfo');

    // Bootstrap form validation
    function validateForm() {
        form.classList.add('was-validated');
        return form.checkValidity();
    }

    // Handle form submission with Bootstrap validation
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            // Form validation
            const name = form.elements.name.value;
            const email = form.elements.email.value;
            const eventType = form.elements.eventType.value;

            if (!name || !email || !eventType) {
                throw new Error('Please fill in all required fields');
            }

            // Show loading state on button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
            submitBtn.disabled = true;

            // Simulate API call
            const response = await simulateApiCall({
                name,
                email,
                eventType
            });

            if (response.success) {
                formOutput.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Registration successful!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                
                // Track registration
                const count = trackRegistration(eventType);
                console.log(`Total registrations for ${eventType}: ${count}`);

                // Save preference
                localStorage.setItem('preferredEventType', eventType);
                
                // Reset form
                form.classList.remove('was-validated');
                form.reset();
            }

        } catch (error) {
            formOutput.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error: ${error.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
        } finally {
            // Restore button state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Character counter with Bootstrap styling
    messageTextarea.addEventListener('input', function() {
        const maxLength = 500;
        const remaining = maxLength - this.value.length;
        charCount.innerHTML = `
            <small class="text-muted">
                Characters: ${this.value.length}
                <span class="${remaining < 50 ? 'text-danger' : ''}">
                    (${remaining} remaining)
                </span>
            </small>`;
    });

    // Load saved preferences
    const savedEventType = localStorage.getItem('preferredEventType');
    if (savedEventType) {
        eventTypeSelect.value = savedEventType;
    }

    // Clear preferences with Bootstrap toast notification
    clearPrefsButton.addEventListener('click', function() {
        localStorage.clear();
        sessionStorage.clear();
        eventTypeSelect.value = '';
        form.classList.remove('was-validated');
        
        // Show toast notification
        const toastHtml = `
            <div class="toast position-fixed bottom-0 end-0 m-3" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    Preferences have been cleared successfully.
                </div>
            </div>`;
        
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.body.querySelector('.toast:last-child');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    });

    // Phone validation with Bootstrap validation feedback
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (this.value !== '') {
            if (!phonePattern.test(this.value)) {
                this.classList.add('is-invalid');
                if (!this.nextElementSibling?.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Please use format: 123-456-7890';
                    this.parentNode.appendChild(feedback);
                }
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        }
    });

    // Event filter function with callback
    function filterEvents(callback) {
        return events.filter(callback);
    }

    // Example: Filter available events
    const availableEvents = filterEvents(event => event.checkAvailability());
    console.log('Available events:', availableEvents);

    // Simulate API call with Promise
    function simulateApiCall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, data });
                } else {
                    reject(new Error('Registration failed. Please try again.'));
                }
            }, 1000);
        });
    }

    // Handle event type change with Bootstrap badge
    eventTypeSelect.addEventListener('change', function() {
        const selectedEvent = events.find(event => event.category === this.value);
        if (selectedEvent) {
            document.getElementById('eventFee').innerHTML = `
                <span class="badge bg-primary">
                    Event Fee: $${selectedEvent.price}
                </span>`;
        }
    });

    // Image handling with Bootstrap modal
    document.querySelectorAll('.event-image').forEach(img => {
        img.addEventListener('click', function() {
            // Create modal if it doesn't exist
            if (!document.getElementById('imageModal')) {
                const modalHtml = `
                    <div class="modal fade" id="imageModal" tabindex="-1">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-body p-0">
                                    <img src="" class="img-fluid" id="modalImage">
                                </div>
                            </div>
                        </div>
                    </div>`;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
            }
            
            // Update and show modal
            const modalImage = document.getElementById('modalImage');
            modalImage.src = this.src;
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        });
    });

    // Video ready event with Bootstrap alert
    const video = document.getElementById('promoVideo');
    if (video) {
        video.addEventListener('canplay', function() {
            document.getElementById('videoMessage').innerHTML = `
                <div class="alert alert-success" role="alert">
                    <i class="bi bi-play-circle-fill"></i> Video ready to play
                </div>`;
        });
    }

    // Geolocation with Bootstrap spinner and alert
    document.getElementById('findEvents').addEventListener('click', function() {
        if ("geolocation" in navigator) {
            locationInfo.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="spinner-border text-primary me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    Finding your location...
                </div>`;
            locationInfo.classList.remove('d-none');
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    locationInfo.innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <i class="bi bi-geo-alt-fill"></i>
                            Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
                            <div class="mt-2">
                                <small class="text-muted">Searching for events near you...</small>
                            </div>
                        </div>`;
                },
                error => {
                    locationInfo.innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <i class="bi bi-exclamation-triangle-fill"></i>
                            Error: ${error.message}
                        </div>`;
                }
            );
        }
    });
});
