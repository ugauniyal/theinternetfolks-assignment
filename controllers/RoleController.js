
const Role = require('../models/Role');
const snowflake = require("@theinternetfolks/snowflake");


const RoleController = {
  async createRole(req, res) {
    try {
      const { name } = req.body;

      // Validate if the 'name' is provided and meets the minimum length requirement
      if (!name || name.length < 2) {
        return res.status(400).json({ error: 'Name is required and should have a minimum length of 2 characters' });
      }

      // Create role
      const newRole = await Role.create({
        id: snowflake.Snowflake.generate(),
        name,
      });

      return res.status(201).json({ data: newRole });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async getAllRoles(req, res) {
    try {
      const page = req.query.page || 1; // Retrieve page number from query parameter
      const limit = 10; // Number of documents per page
      const offset = (page - 1) * limit;

      // Find all roles with pagination
      const roles = await Role.findAndCountAll({
        limit,
        offset,
      });

      const total = roles.count; // Total number of documents
      const pages = Math.ceil(total / limit); // Total number of pages

      return res.status(200).json({
        meta: {
          total,
          pages,
          page: +page, // Convert page to number
        },
        roles: roles.rows, // Retrieved data for the current page
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
};

module.exports = RoleController;
