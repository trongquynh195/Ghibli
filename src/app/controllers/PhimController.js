const express = require('express');
const app = express();
const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const Season = require('../models/Season');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')


class PhimController {
    show(req, res) {

        Promise.all([
            Anime.find({}),
            Anime.findOne({ slug: req.params.slug }),
            Season.find({}),
        ])
        .then(([animes,anime,seasons]) => {
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
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());
            const movie = mongooseToObject(anime);
            const season = (seasons.find(s => s.season_item.find(s => s.slug === req.params.slug)));
            let seasonData;
            if(season){
                seasonData = mutipleMongooseToObject(season.season_item);
            } else{
                seasonData = null;
            }
            

            const { InfoList } = anime;
            const theloai = anime.InfoList.Genre;
            const new_tap = mutipleMongooseToObject(anime.InfoList.Episodes.slice(anime.InfoList.Episodes.length-3,anime.InfoList.Episodes.length));
            
            // res.json(seasonData);
            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('phim/show', { 
                movie,
                InfoList,
                theloai,
                new_tap,
                season: seasonData,
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });
    }


    xemphim(req, res) {

        Promise.all([
            Anime.find({}),
            Anime.findOne({ slug: req.params.slug }),
            Season.find({}),
        ])
        .then(([animes,anime,seasons]) => {
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

            const tap = req.params.tap.split("-")[1];
            const slugs = (anime.InfoList.Episodes.find(m => m.tap.toLowerCase==tap.toLowerCase));
            const slugtap = mongooseToObject(slugs);

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());
            const movie = mongooseToObject(anime);
            const season = (seasons.find(s => s.season_item.find(s => s.slug === req.params.slug)));
            let seasonData;
            if(season){
                seasonData = mutipleMongooseToObject(season.season_item);
            } else{
                seasonData = null;
            }
            

            const { InfoList } = anime;
            const theloai = anime.InfoList.Genre;
            
            // res.json(slugs);
            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('phim/xemphim', { 
                movie,
                InfoList,
                theloai,
                slugtap,
                tap:movie.InfoList.Episodes,
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(err => {
            // Xử lý lỗi nếu có
            res.send(err);// Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });
    }
}

module.exports = new PhimController();