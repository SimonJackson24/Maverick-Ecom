export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEmail() {
  const timestamp = Date.now();
  return `test.user.${timestamp}@example.com`;
}

export function generatePhoneNumber() {
  return `555${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
}

export function generateAddress() {
  const streetNumbers = ['123', '456', '789', '321', '654'];
  const streetNames = ['Main', 'Oak', 'Maple', 'Cedar', 'Pine'];
  const streetTypes = ['St', 'Ave', 'Rd', 'Blvd', 'Ln'];
  const cities = ['Springfield', 'Riverside', 'Georgetown', 'Franklin', 'Clinton'];
  const states = ['CA', 'NY', 'TX', 'FL', 'IL'];

  return {
    street: `${randomItem(streetNumbers)} ${randomItem(streetNames)} ${randomItem(streetTypes)}`,
    city: randomItem(cities),
    state: randomItem(states),
    zipCode: Math.floor(Math.random() * 90000) + 10000,
    country: 'US',
  };
}

export function sleep(min, max) {
  const time = randomNumber(min, max);
  return new Promise(resolve => setTimeout(resolve, time));
}
