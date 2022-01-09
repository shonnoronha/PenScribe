const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');

const router = Router();

router.get('/', blogController.home_get);

router.get('/blogs/create',requireAuth, blogController.blogs_create_get);

router.get('/blogs/detail/:id',requireAuth, blogController.blogs_detail_id_get);

router.delete('/blogs/:id',requireAuth, blogController.blogs_id_delete);

router.post('/blogs',requireAuth, blogController.blogs_post);

router.get('/blogs/detail/update/:id',requireAuth, blogController.blogs_detail_update_id_get);

router.post('/blogs/detail/update/:id',requireAuth, blogController.blogs_detail_update_id_post);

module.exports = router;