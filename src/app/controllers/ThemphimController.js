const express = require('express');
const app = express();
const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const Season = require('../models/Season');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class themphimController{

    Danhsach(req, res, next){
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
            let currentPage;
            if(req.query.page === null || req.query.page === undefined){
                currentPage = 1;
            } else {
                currentPage = parseInt(req.query.page); // Chuyển đổi giá trị sang kiểu số
            }
           
            const totalPages = Math.ceil(anime.length / 30);
            const startIndex = (currentPage-1)*30;

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const animeData = mutipleMongooseToObject(anime);
            const blogData = mutipleMongooseToObject(blog);
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());

            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('danhsach/menu', { 
                animeData: animeData.reverse().slice(startIndex,startIndex+30),
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),
                currentPage,
                totalPages,
            });
        })
        .catch(error => next(error));
    }


    create(req,res,next){
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
            res.render('danhsach/themphim', { 
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(error => next(error));
    }
    store(req,res,next){
        Promise.all([
            Anime.find({}),
            Blog.find({}),
        ])
        .then(([animes,blog]) => {
            const formData = req.body;
            formData.id = animes.length;
            formData.InfoList = {};
            formData.InfoList.View = 10;
            const anime = new Anime(formData);
            anime.save()
            .then(savedAnime => {
                res.redirect('/anime/')
            })
            .catch(err => {
                // Xử lý lỗi nếu có
                res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
            });
            // res.json(anime);
        })
        .catch(error => next(error));
        
     
    }
    update(req,res,next){
        Promise.all([
            Anime.find({}),
            Anime.findOne({slug: req.params.slug}),
            Blog.find({}),
        ])
        .then(([animes,anime,blog]) => {
            function processString(str) {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/ô/g, "o")
                    .replace(/đ/g, "d");
            }
            const animele = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-le")
            );
            const animebo = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-bo")
            );

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const movie = mongooseToObject(anime);
            const blogData = mutipleMongooseToObject(blog);
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());
            const { InfoList } = anime;
            let new_tap
            if(anime.InfoList.Episodes.length>3){
                new_tap = mutipleMongooseToObject(anime.InfoList.Episodes.slice(anime.InfoList.Episodes.length-3,anime.InfoList.Episodes.length));
            } else{
                new_tap = mutipleMongooseToObject(anime.InfoList.Episodes);            
            }

            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('danhsach/updatephim', { 
                movie,
                InfoList,
                new_tap,
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(error => next(error));
    }

    putupdate(req, res, next) {
        // Promise.all([
        //     Anime.find({}),
        //     Blog.find({}),
        // ])
        // .then(([anime,blog]) => {
        //     const formData = req.body;
        //     formData.id = 59;
        //     formData.InfoList = {};
        //     const animes = new Anime(formData);
        //     // Chuyển đổi dữ liệu từ Mongoose object sang plain object
        //     // const animeData = mutipleMongooseToObject(anime);
        //     const blogData = mutipleMongooseToObject(blog);
    
        //     formData.InfoList.Episodes = [];
        //     const updateData = {
        //                 "tap":2,
        //                 "slug": "abc"
        //          // Đặt giá trị mới cho trường 'View' trong 'InfoList'
        //     };
    
        //     const episodeData = {
        //         tap: "3",
        //         slug: "def"
        //     };
    
            // Anime.findOneAndUpdate({slug:'khi-nang-tho-yeu-josee-to-tora-to-sakana-tachi'},{ $push: { 'InfoList.Episodes': updateData } }, {new: true})
            // .then(updatedAnime => {
            //     res.json(updatedAnime);
            // })
            // .catch(err => {
            //     res.send(err);
            // });
    
        //     // Render trang và truyền cả hai loại dữ liệu vào
            
        // })
        // .catch(err => {
        //     // Xử lý lỗi nếu có
        //     res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        //     });
        
        Promise.all([
            Anime.find({}),
            Anime.findOne({slug: req.params.slug}),
            Blog.find({}),
        ])
        .then(([animes,anime,blog]) => {
            const formData = req.body;
            formData.Genre = req.body.Genre.split(',').map(genre => genre.trim()).filter(genre => genre !== '');
            formData.Season = req.body.Season.split('-').map(season => season.trim());

            const Datatap ={...req.body};
            Datatap.Episodes = {}
            Datatap.Episodes.tap= req.body.Episodes.split('-').map(genre => genre.trim())[0];
            Datatap.Episodes.slug= req.body.Episodes.split('-').map(genre => genre.trim())[1];

            const updateQuery = {
                $set: {
                    'InfoList.Release_Schedule': formData.Release_Schedule,
                    'InfoList.Status': formData.Status,
                    'InfoList.Genre': formData.Genre,
                    'InfoList.Director': formData.Director,
                    'InfoList.Country': formData.Country,
                    'InfoList.Duration': formData.Duration,
                    'InfoList.Quality': formData.Quality,
                    'InfoList.Rating': formData.Rating,
                    'InfoList.Language': formData.Language,
                    'InfoList.Studio': formData.Studio,
                    'InfoList.Season': formData.Season,
                }
            };
            let x =0;
            if (Datatap.Episodes.tap !== "") {
                updateQuery.$addToSet = { 'InfoList.Episodes': Datatap.Episodes };
            } 
            Anime.findOneAndUpdate(
                { slug: req.params.slug  }, // Điều kiện để xác định anime cần cập nhật
                { 
                    $pull: { 'InfoList.Episodes': { slug: "" } }, // Loại bỏ tập trùng
                },
                { new: true }
            )
            .then(updatedAnime => {
            
            Anime.updateOne(
                { 
                    slug: req.params.slug,
                    'InfoList.Episodes.slug': { $ne: Datatap.Episodes.slug },
                    
                },
                updateQuery,
                { new: true }
            )
            .then(() => res.redirect('/anime/'))
            .catch(error => next(error));

        })
        .catch(err => {
            res.send(err);
        });
            
            
        })
        .catch(error => next(error));
    
    }
}
module.exports = new themphimController();