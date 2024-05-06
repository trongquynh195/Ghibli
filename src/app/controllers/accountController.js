const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class accountController {
    isAdmin(req, res, next) {
        // Giả sử thông tin về quyền admin được lưu trong đối tượng user
        if (req.user!={}) {
            // Nếu người dùng có quyền admin, tiếp tục tiến hành
            next();
        } else {
            // Nếu không, trả về mã lỗi hoặc chuyển hướng tùy thuộc vào yêu cầu của bạn
            res.status(403).send('Trang này không tồn tại');
        }
    } 
    info(req, res){
        Promise.all([
            Anime.find({}),
            Blog.find({}),
        ])
        .then(([anime,blog,user]) => {
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
            const userData = mongooseToObject(user);

            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('account/info',{
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),
            });
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });
    }
    update(req, res) {
        const formData = req.body;
        const newPassword = formData.password;
        Promise.all([
            Anime.find({}),
            Blog.find({}),
            User.findOne({ username: formData.username }),
        ])
        .then(async ([anime, blog, user]) => {
            // Kiểm tra xem có cần cập nhật mật khẩu không
            if (newPassword && newPassword.length >= 8) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            
            // Cập nhật thông tin người dùng
            user.hoten = formData.hoten;
            user.gender = formData.gender;

            req.session.user = user;
    
            // Lưu trữ và trả về user đã được cập nhật
            return user.save();
        })
        .then(updatedUser => {
            res.redirect('/account/info'); // Trả về user đã được cập nhật
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật thông tin người dùng.' });
        });
    }
    
    
}

module.exports = new accountController();