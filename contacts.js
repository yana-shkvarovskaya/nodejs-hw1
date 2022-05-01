const path = require("path");
const { v4 } = require("uuid");
const fs = require("fs").promises;

const contactsPath = path.join(__dirname, "/db/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(
    path.join(__dirname, "db", "contacts.json"),
    JSON.stringify(result, null, 2)
  );
  return result;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = { ...{ name, email, phone }, id: v4() };
  if (contacts.find(({ email }) => email === newContact.email)) {
    throw new Error(`Contact with id "${email}" is already in the list`);
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  console.table(contacts);
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
