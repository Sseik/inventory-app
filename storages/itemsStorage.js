import { Pool } from "pg";

// Probably should have just called it Inventory but I wanted to have "Storage" in the name
class ItemsStorage {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.CONNECTION_STRING
    });
  }
}

export default new ItemsStorage();
