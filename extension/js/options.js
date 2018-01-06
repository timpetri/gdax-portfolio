let keyHolder = new KeyHolder();

function setMessage(color, msg) {
  // TODO: Display a message with the given color for a while.
}

function updateKeys() {
  // Get the keys
  let api = document.getElementById('input_api');
  let secret = document.getElementById('input_secret');
  let passphrase = document.getElementById('input_passphrase');
  keyHolder.saveApiKey(api.textContent);
  keyHolder.saveSecret(secret.textContent);
  keyHolder.savePassphrase(passphrase.textContent);

  // Notify the user if it works!
  let msg = document.getElementById('storage_message').innerText = 'Keys have been updated!'
  msg.style.display = 'block';
  api.textContent = '';
  secret.textContent = '';
  passphrase.textContent = '';
}

function clearKeys() {
  keyHolder.saveApiKey(null);
  keyHolder.saveSecret(null);
  keyHolder.savePassphrase(null);
  // Notify the user if it works!
  let msg = document.getElementById('storage_message').innerText = 'Keys have been removed!'
  msg.style.display = 'block';
  api.textContent = '';
  secret.textContent = '';
  passphrase.textContent = '';
}

document.getElementById('button_update').addEventListener('click', updateKeys);
document.getElementById('button_clear').addEventListener('click', clearKeys);