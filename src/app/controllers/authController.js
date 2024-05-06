const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class authController {

    //[GET] /:slug
    async registerUser(req, res){
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                hoten:'',
                gender:'',
            });

            //Save new user
            const user = await newUser.save();
            req.session.user = user;
                // res.status(200).json(req.session.user);
            res.redirect('/');
        }catch(err){
            res.status(500).json(err);
        }
    }

    login(req, res){
        Promise.all([
            Anime.find({}),
            Blog.find({}),
        ])
        .then(([anime,blog]) => {
            function processString(str) {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/ô/g, "o")
                    .replace(/đ/g, "d");
            }
            const animele = anime.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-le")
            );
            const animebo = anime.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-bo")
            );

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const animeData = mutipleMongooseToObject(anime);
            const blogData = mutipleMongooseToObject(blog);
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());

            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('logins/login',{
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),
                
            });
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });
    }


     loginUsser(req, res){
        // res.json(req.body);
        Promise.all([
            User.findOne({username: req.body.username})
        ])
        .then(async ([user])=>{
            if(!user){
                res.json("Lỗi 01");
            }
            const valibpasswod = await bcrypt.compare(req.body.password,user.password);
            if(!valibpasswod){
                res.json("Lỗi 02");
            }
            if(user && valibpasswod){
                req.session.user = user;
                // res.status(200).json(req.session.user);
                res.redirect('/');
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    }  
    
    isAdmin(req, res, next) {
    // Giả sử thông tin về quyền admin được lưu trong đối tượng user
    if (req.user && req.user.admin === true) {
        // Nếu người dùng có quyền admin, tiếp tục tiến hành
        next();
    } else {
        // Nếu không, trả về mã lỗi hoặc chuyển hướng tùy thuộc vào yêu cầu của bạn
        res.status(403).send('Trang này không tồn tại');
    }
}
}


module.exports = new authController();