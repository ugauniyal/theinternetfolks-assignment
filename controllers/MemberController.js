const snowflake = require("@theinternetfolks/snowflake");
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Community = require('../models/Community');
const Role = require('../models/Role');



const NOT_ALLOWED_ACCESS = 'Access denied. You are not authorized to perform this action.';


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

const MemberController = {
  async addMember(req, res) {
    try {
      const { community: communityId, user: userId, role: roleId } = req.body;

      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const role = await Role.findByPk(roleId);

      if (!role || role.name !== 'Community Admin') {
        return res.status(403).json({ error: NOT_ALLOWED_ACCESS });
      }

      const community = await Community.findByPk(communityId);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }

      const newMember = await Member.create({
        id: snowflake.Snowflake.generate(),
        community: communityId,
        user: userId,
        role: roleId,
      });

      return res.status(201).json({ data: newMember });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  async removeMember(req, res) {
    try {
      const { id } = req.params;
  
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const decoded = verifyToken(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const userId = decoded.userId;
  
      // Find the member associated with the specified user ID
      const member = await Member.findOne({
        where: { user: userId }, 
      });
  
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
  

      const userRole = await Role.findByPk(member.role);
  
      if (userRole.name !== 'Community Admin' && userRole.name !== 'Community Moderator') {
        return res.status(403).json({ error: NOT_ALLOWED_ACCESS });
      }
  
      await member.destroy();
  
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
};

module.exports = MemberController;
