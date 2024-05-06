const express = require('express');
const app = express();
const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class SiteController {

    home(req, res) {
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
            res.render('home', { 
                movie: animeData.slice(0,10),
                animebo: animeboData.slice(0,10),
                animele: animeleData.slice(0,10),
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),
                list: animeData.slice(0,16),
                news: blogData

            });
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });


        // res.render('home', {
        //     movie: mapMovies(0, 10),
        //     animebo: animebo.slice(0, 10),
        //     animele: animele.slice(0, 10),
        //     list: mapMovies(0, 16),
        //     infoListData: mapMovies(0, movies.length),
        //     top_bo: animebo.slice(0, 5),
        //     top_le: animele.slice(0, 5),
        //     news: blogs
        // });
    }

    show(req, res) {
        const infoListData = movies.map(move => move);
        res.json(infoListData);
    }

    search(req, res) {
        // const actionMovies = movies.filter(movie =>
        //     movie.InfoList && Array.isArray(movie.InfoList.Season) && movie.InfoList.Season.some(genre => genre.toLowerCase().replace(/\s/g, '-') === "Mùa Xuân - 2023")
        // );
        const actionMovies = movies.filter(movie =>
            movie.InfoList &&
            typeof movie.InfoList.Season === 'string' &&
            processString(movie.InfoList.Season) === "muaxuan-2023"
        );

        function processString(str) {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, "");
        }
        const infoListData = actionMovies.map(movie => movie.title);
        if (actionMovies.length > 0) {
            res.json({ "actionMovies": actionMovies.map(movie => movie.title) });
        } else {
            res.status(404).json({ "error": "Movies not found in the Action genre" });
        }
    }

    logout(req, res, next) {
        delete req.session.user;
        res.redirect('/v1/auth/');
    }
}
module.exports = new SiteController();