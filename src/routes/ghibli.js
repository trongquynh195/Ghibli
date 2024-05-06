const sitesRouter = require('./site');
const phimRouter = require('./phim');
const genresRouter = require('./genre');
const blogRouter = require('./blog');
const seasonRouter = require('./season');
const themphimRouter = require('./themphim');
const authRouter = require('./auth');
const userRouter = require('./user');
const accRouter = require('./account');
const searchRouter = require('./search');

const authController = require('../app/controllers/authController');
const accountController = require('../app/controllers/accountController');

function route(app) {
    app.use('/search', searchRouter);
    app.use('/v1/auth',authRouter);
    app.use('/v1/user',userRouter);
    app.use('/anime',authController.isAdmin,themphimRouter);
    app.use('/blog', blogRouter);
    app.use('/season', seasonRouter);
    app.use('/phim', phimRouter);
    app.use('/the-loai', genresRouter);
    app.use('/account',accountController.isAdmin,accRouter);
    app.use('/', sitesRouter);
}

module.exports = route;