const express = require('express');
const router = express.Router();


const UserController = require('./controllers/UserController');
const CommunityController = require('./controllers/CommunityController');
const MemberController = require('./controllers/MemberController');
const RoleController = require('./controllers/RoleController');



// Authentication Routes
router.post('/v1/auth/signup', UserController.signUp);
router.post('/v1/auth/signin', UserController.signIn);
router.get('/v1/auth/me', UserController.getMe);

// Community Routes
router.post('/v1/community', CommunityController.createCommunity);
router.get('/v1/community', CommunityController.getAllCommunities);
router.get('/v1/community/:id/members', CommunityController.getAllMembers);
router.get('/v1/community/me/owner', CommunityController.getMyOwnedCommunity);
router.get('/v1/community/me/member', CommunityController.getMyJoinedCommunity);

// Member Routes
router.post('/v1/member', MemberController.addMember);
router.delete('/v1/member/:id', MemberController.removeMember);

// Role Routes
router.post('/v1/role', RoleController.createRole);
router.get('/v1/role', RoleController.getAllRoles);

module.exports = router;
