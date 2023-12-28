const Community = require('../models/Community');
const Member = require('../models/Member');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const snowflake = require("@theinternetfolks/snowflake");

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};


const CommunityController = {
  async createCommunity(req, res) {
    try {
      const { name } = req.body;

      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Verify the token
      const decoded = verifyToken(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate slug from name
      const slug = name.toLowerCase().replace(/\s+/g, '-');

      const userId = decoded.userId; // Extracting userId from the decoded token

      // Create community
      const newCommunity = await Community.create({
        id: snowflake.Snowflake.generate(),
        name,
        slug,
        owner: userId, // Set the owner as the user creating the community
      });

      let communityAdminRole = await Role.findOne({ where: { name: 'Community Admin' } });

      // If 'Community Admin' role doesn't exist, create it
      if (!communityAdminRole) {
        communityAdminRole = await Role.create({
          id: snowflake.Snowflake.generate(),
          name: 'Community Admin',
        });
      }
      const newMember = await Member.create({
        id: snowflake.Snowflake.generate(), // Generating member id
        user: userId,
        community: newCommunity.id,
        role: communityAdminRole.id,
      });


      return res.status(201).json({ community: newCommunity });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async getAllCommunities(req, res) {
    try {
      const communities = await Community.findAll();
      return res.status(200).json({ communities });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async getAllMembers(req, res) {
    try {
      const { id } = req.params;

      const members = await Member.findAll({
        where: { community: id },
      });

      return res.status(200).json({ members });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async getMyOwnedCommunity(req, res) {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Verify the token
      const decoded = verifyToken(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const userId = decoded.userId;
  
      const ownedCommunities = await Community.findAll({
        where: { owner: userId },
      });
  
      return res.status(200).json({ ownedCommunities });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async getMyJoinedCommunity(req, res) {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Verify the token
      const decoded = verifyToken(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const userId = decoded.userId;
  
      const page = req.query.page || 1; // Retrieve page number from query parameter
      const limit = 10; // Number of documents per page
      const offset = (page - 1) * limit;
  
      // Find joined communities with pagination and include owner details with limited fields
      const joinedCommunities = await Member.findAndCountAll({
        where: { user: userId },
        include: [
          {
            model: Community,
            as: 'Community', // Using the alias specified in the association
            attributes: [],
            include: [
              {
                model: User,
                as: 'Owner', // Using the alias specified in the association
                attributes: ['id', 'name'], // Only include id and name of the owner
              },
            ],
          },
        ],
        limit,
        offset,
      });
  
      const total = joinedCommunities.count; // Total number of documents
      const pages = Math.ceil(total / limit); // Total number of pages
  
      return res.status(200).json({
        meta: {
          total,
          pages,
          page: +page, // Convert page to number
        },
        joinedCommunities: joinedCommunities.rows, // Retrieved data for the current page
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  }
  
  
};

module.exports = CommunityController;
