// Used an keys in local storage
const NAME_KEY = "GDAX_VIEWER_API_KEY";
const NAME_SECRET = "GDAX_VIEWER_SECRET";
const NAME_PASSPHRASE = "GDAX_VIEWER_PASSPHRASE"
const KEY_NAMES = [NAME_KEY, NAME_SECRET, NAME_PASSPHRASE];

class KeyHolder {

  constructor() {
    const keys = {};

    // TODO: Get rid of manual keys
    keys[NAME_KEY] = "SECRET";
    keys[NAME_SECRET] = "SECRET";
    keys[NAME_PASSPHRASE] = "SECRET";

    // attempt to load from local storage
    KEY_NAMES.forEach((name) => {
      chrome.storage.sync.get(name, (item) => {
        if (chrome.runtime.error) {
          console.log('No key found!');
          return;
        }
        keys[`${name}`] = item;
      })
    });
    this.keys = keys;
  }

  save(key_name, value) {
    this.keys[key_name] = value;
    chrome.storage.sync.set({key_name, value}, function() {
      if (!chrome.runtime.error) { 
        console.log('Key saved!');
      }
    })
    return;
  }

  saveKeys(newKeys) {
    this.keys = newKeys;
    chrome.storage.sync.set(newKeys, function() {
      if (!chrome.runtime.error) {
        console.log('Saved all keys!');
      }
    })
  }

  saveApiKey(value) {
    this.keys[`${NAME_KEY}`] = value;
    chrome.storage.sync.set({'GDAX_VIEWER_API_KEY': value}, function() {
      if (!chrome.runtime.error) { 
        console.log('Api key saved!');
      }
    })
    return;
  }

  saveSecret(value) {
    this.keys[`${NAME_SECRET}`] = value;
    chrome.storage.sync.set({'GDAX_VIEWER_SECRET': value}, function() {
      if (!chrome.runtime.error) { 
        console.log('Secret saved!');
      }
    })
    return;
  }

  savePassphrase(value) {
    this.keys[`${NAME_PASSPHRASE}`] = value;
    chrome.storage.sync.set({'GDAX_VIEWER_PASSPHRASE': value}, function() {
      if (!chrome.runtime.error) { 
        console.log('Passphrase saved!');
      }
    })
    return;
  }

  load(key_name) {
    if (!(key_name in this.keys)) {
      console.log('Error, not set yet!');
      return null;
    }
    return this.keys[key_name];
  }

  isEmpty() {
    return this.keys.size();
  }
}