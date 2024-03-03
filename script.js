// Constants for clarity and easy adjustments
const SMALL_ORDER_THRESHOLD = 10;   // Cart value below which a surcharge applies 
const BASE_DELIVERY_FEE = 2;        // Initial delivery fee
const DISTANCE_FEE_INTERVAL = 500;  // Distance interval for additional fees
const DISTANCE_FEE = 1;             // Fee per extra distance interval
const EXTRA_ITEM_THRESHOLD = 5;     // Number of items to start item surcharges
const EXTRA_ITEM_FEE = 0.5;         // Surcharge per item above the threshold
const BULK_ORDER_THRESHOLD = 12;    // Number of items for bulk order surcharge
const BULK_ORDER_FEE = 1.2;         // Bulk order surcharge amount 
const MAX_DELIVERY_FEE = 15;        // Maximum allowed delivery fee
const FREE_DELIVERY_THRESHOLD = 200; // Cart value for free delivery

// Calculates the base delivery fee (excluding Friday rush)
function calculateBaseDeliveryFee(cartValue, deliveryDistance, numItems) {
  let deliveryFee = 0;

  // Small order surcharge
  if (cartValue < SMALL_ORDER_THRESHOLD) {
    deliveryFee += SMALL_ORDER_THRESHOLD - cartValue;
  }

  // Distance-based fee
  deliveryFee += BASE_DELIVERY_FEE;
  let extraDistance = deliveryDistance - 1000; 
  if (extraDistance > 0) {
    deliveryFee += Math.ceil(extraDistance / DISTANCE_FEE_INTERVAL) * DISTANCE_FEE;
  }

  // Surcharge for extra items
  if (numItems >= EXTRA_ITEM_THRESHOLD) {
    deliveryFee += (numItems - EXTRA_ITEM_THRESHOLD + 1) * EXTRA_ITEM_FEE; 
  }

  // Bulk order surcharge
  if (numItems > BULK_ORDER_THRESHOLD) {
    deliveryFee += BULK_ORDER_FEE;
  }

  // Free delivery 
  if (cartValue >= FREE_DELIVERY_THRESHOLD) {
    deliveryFee = 0;
  }

  // Limit to maximum fee
  return Math.min(deliveryFee, MAX_DELIVERY_FEE); 
}

// Checks if it's Friday rush hour (3 PM - 7 PM) in UTC 
function isFridayRushHourUTC() {
  const utcDate = new Date();
  const dayOfWeek = utcDate.getUTCDay(); 
  const utcHour = utcDate.getUTCHours();
  return dayOfWeek === 5 && utcHour >= 15 && utcHour < 19; 
}

// Checks if it's Friday rush hour (3 PM - 7 PM) in the user's timezone
function isFridayRushHourInLocalTime(date) {
  const dayOfWeek = date.getDay(); 
  const hour = date.getHours();
  return dayOfWeek === 5 && hour >= 15 && hour < 19;
}

// Get references to all input elements
const cartValueInput = document.getElementById("cart-value");
const deliveryDistanceInput = document.getElementById("delivery-distance");
const numItemsInput = document.getElementById("amount-of-items");
const deliveryTimeInput = document.getElementById("delivery-time");
const calculateButton = document.getElementById("calculate-price");
const deliveryPriceDisplay = document.getElementById("delivery-price").querySelector("span");

// Handle the button click event
calculateButton.addEventListener("click", () => {
  // Get values from input fields
  const cartValue = parseFloat(cartValueInput.value);
  const deliveryDistance = parseInt(deliveryDistanceInput.value);
  const numItems = parseInt(numItemsInput.value);
  const deliveryDate = new Date(deliveryTimeInput.value); 

  // Input validation 
  if (isNaN(cartValue) || isNaN(deliveryDistance) || isNaN(numItems) || isNaN(deliveryDate.getTime())) {
    alert("Please enter valid values for all fields.");
    return; 
  }

  // Calculate the base fee
  let baseFee = calculateBaseDeliveryFee(cartValue, deliveryDistance, numItems);

  // Apply Friday rush multiplier if applicable
  if (isFridayRushHourUTC() || isFridayRushHourInLocalTime(deliveryDate)) {
    baseFee *= 1.2; 
    baseFee = Math.min(baseFee, MAX_DELIVERY_FEE); 
  } 

  // Display the result
  deliveryPriceDisplay.textContent = `€${baseFee.toFixed(2)}`;
});
