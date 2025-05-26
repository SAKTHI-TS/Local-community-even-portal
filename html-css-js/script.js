// Welcome message
console.log('Welcome to the Community Portal');

// Load event when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    alert('Welcome to the Local Community Event Portal!');

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

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Form validation
            const name = form.elements.name.value;
            const email = form.elements.email.value;
            const eventType = form.elements.eventType.value;

            if (!name || !email || !eventType) {
                throw new Error('Please fill in all required fields');
            }

            // Simulate API call
            const response = await simulateApiCall({
                name,
                email,
                eventType
            });

            if (response.success) {
                formOutput.textContent = 'Registration successful!';
                formOutput.style.color = 'green';
                
                // Track registration
                const count = trackRegistration(eventType);
                console.log(`Total registrations for ${eventType}: ${count}`);

                // Save preference
                localStorage.setItem('preferredEventType', eventType);
            }

        } catch (error) {
            formOutput.textContent = `Error: ${error.message}`;
            formOutput.style.color = 'red';
        }
    });

    // Character counter
    messageTextarea.addEventListener('keydown', function() {
        charCount.textContent = `Characters: ${this.value.length}`;
    });

    // Load saved preferences
    const savedEventType = localStorage.getItem('preferredEventType');
    if (savedEventType) {
        eventTypeSelect.value = savedEventType;
    }

    // Clear preferences
    clearPrefsButton.addEventListener('click', function() {
        localStorage.clear();
        sessionStorage.clear();
        eventTypeSelect.value = '';
        formOutput.textContent = 'Preferences cleared';
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!phonePattern.test(this.value) && this.value !== '') {
            alert('Please use format: 123-456-7890');
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

    // Handle event type change
    eventTypeSelect.addEventListener('change', function() {
        const selectedEvent = events.find(event => event.category === this.value);
        if (selectedEvent) {
            document.getElementById('eventFee').textContent = 
                `Event Fee: $${selectedEvent.price}`;
        }
    });

    // Image handling
    document.querySelectorAll('.event-image').forEach(img => {
        img.addEventListener('dblclick', function() {
            this.style.transform = this.style.transform === 'scale(1.5)' 
                ? 'scale(1)' 
                : 'scale(1.5)';
        });
    });

    // Video ready event
    const video = document.getElementById('promoVideo');
    if (video) {
        video.addEventListener('canplay', function() {
            document.getElementById('videoMessage').textContent = 
                'Video ready to play';
        });
    }

    // Warn before leaving
    window.addEventListener('beforeunload', function(e) {
        if (form.elements.name.value || form.elements.email.value) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Geolocation
    document.getElementById('findEvents').addEventListener('click', function() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('locationInfo').textContent = 
                        `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                },
                error => {
                    document.getElementById('locationInfo').textContent = 
                        `Error: ${error.message}`;
                }
            );
        }
    });
});
