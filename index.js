const { Command } = require("commander");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  const contacts = await listContacts();

  switch (action) {
    case "list":
      console.table(contacts);
      break;

    case "get":
      const contact = await getContactById(id);
      if (!contact) {
        throw new Error(`Contact with id "${id}" not found`);
      }
      console.log(contact);
      break;

    case "add":
      const newContact = await addContact(name, email, phone);
      console.log(newContact);
      break;

    case "remove":
      const updatedContacts = await removeContact(id);
      if (updatedContacts.length === contacts.length) {
        throw new Error(`Contact with id "${id}" not found`);
      }
      console.table(updatedContacts);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};

invokeAction(argv);
